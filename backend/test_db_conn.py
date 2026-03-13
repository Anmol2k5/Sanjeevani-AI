import os
import httpx
from dotenv import load_dotenv

load_dotenv(".env")

async def test_conn():
    url = os.getenv("SUPABASE_URL")
    print(f"Testing connectivity to: {url}")
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{url}/rest/v1/", params={"apikey": os.getenv("SUPABASE_SERVICE_KEY")}, timeout=10)
            print(f"Status: {resp.status_code}")
            print(f"Response: {resp.text[:200]}")
    except Exception as e:
        print(f"Connection error: {e}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(test_conn())
