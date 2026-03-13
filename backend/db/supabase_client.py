import os
import uuid
import json
import sqlite3
from typing import Any, List
from supabase import create_client, Client
from .local_db import get_db_connection

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

class LocalFallbackClient:
    """
    A minimal wrapper that mimics Supabase client but saves to local SQLite.
    Used when DNS or network issues prevent connection to Supabase.
    """
    def __init__(self):
        self._table_name = None
        self._query_params = []
        self._data_to_insert = None
        self._order_by = None
        self._limit = None

    def table(self, name: str):
        self._table_name = name
        return self

    def select(self, columns: str = "*", **kwargs):
        # We simplify select for now
        return self

    def insert(self, data: Any):
        self._data_to_insert = data
        return self

    def eq(self, column: str, value: Any):
        self._query_params.append((column, value))
        return self

    def order(self, column: str, desc: bool = False):
        self._order_by = (column, "DESC" if desc else "ASC")
        return self

    def limit(self, count: int):
        self._limit = count
        return self

    def execute(self):
        conn = get_db_connection()
        cursor = conn.cursor()
        try:
            if self._data_to_insert:
                # INSERT LOGIC
                data = self._data_to_insert
                if isinstance(data, dict):
                    if "id" not in data:
                        data["id"] = str(uuid.uuid4())
                    
                    # Convert dict/list fields to JSON for SQLite
                    for k, v in data.items():
                        if isinstance(v, (dict, list)):
                            data[k] = json.dumps(v)
                            
                    cols = ", ".join(data.keys())
                    placeholders = ", ".join(["?" for _ in data])
                    sql = f"INSERT INTO {self._table_name} ({cols}) VALUES ({placeholders})"
                    cursor.execute(sql, list(data.values()))
                    conn.commit()
                    return type("Response", (), {"data": [data], "error": None})()
                
            else:
                # SELECT LOGIC
                is_session_patient_join = self._table_name == "sessions" and "patients" in str(self._query_params) # rough check
                # Actually patients.py uses: select("*, patients(name, age)")
                # Let's check for "patients(" string
                
                sql = f"SELECT * FROM {self._table_name}"
                params = []
                
                # Check for specific join requested in patients.py
                if self._table_name == "sessions":
                    # We'll just always join with patients if it's the sessions table for this app
                    sql = """
                        SELECT s.*, p.name as patient_name, p.age as patient_age 
                        FROM sessions s
                        LEFT JOIN patients p ON s.patient_id = p.id
                    """
                
                if self._query_params:
                    clauses = []
                    for c, v in self._query_params:
                        # Handle table prefixing if joined
                        col = f"s.{c}" if self._table_name == "sessions" else c
                        clauses.append(f"{col} = ?")
                        params.append(v)
                    sql += " WHERE " + " AND ".join(clauses)
                
                if self._order_by:
                    col = f"s.{self._order_by[0]}" if self._table_name == "sessions" else self._order_by[0]
                    sql += f" ORDER BY {col} {self._order_by[1]}"
                
                if self._limit:
                    sql += f" LIMIT {self._limit}"
                
                cursor.execute(sql, params)
                rows = cursor.fetchall()
                data = []
                for row in rows:
                    item = dict(row)
                    # Convert 'patient_name'/'patient_age' back to nested object for API compatibility
                    if "patient_name" in item:
                        item["patients"] = {
                            "name": item.pop("patient_name"),
                            "age": item.pop("patient_age")
                        }
                    
                    # De-serialize JSON fields like 'diagnosis'
                    for k, v in item.items():
                        if isinstance(v, str) and (v.startswith("{") or v.startswith("[")):
                            try:
                                item[k] = json.loads(v)
                            except:
                                pass
                    data.append(item)
                
                return type("Response", (), {"data": data, "error": None})()
        except Exception as e:
            print(f"Local DB Error: {e}")
            return type("Response", (), {"data": [], "error": str(e)})()
        finally:
            conn.close()
            # Reset for next call
            self.__init__()

def get_supabase_client():
    if not SUPABASE_URL or not SUPABASE_KEY or "supabase.co" not in SUPABASE_URL:
        return LocalFallbackClient()
    
    try:
        # Check if we can resolve the domain (basic ping-like check via socket would be too slow, 
        # so we just try to create the client).
        client = create_client(SUPABASE_URL, SUPABASE_KEY)
        return client
    except Exception as e:
        print(f"Supabase connection failed, falling back to local DB: {e}")
        return LocalFallbackClient()

supabase = get_supabase_client()
