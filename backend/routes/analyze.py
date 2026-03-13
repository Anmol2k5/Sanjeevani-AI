from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import Optional

from services.symptom_analyzer import analyze_symptoms, SymptomRequest
from services.image_analyzer import analyze_medical_image
from services.llm_service import fuse_diagnoses
from services.storage_service import upload_clinical_image
from db.supabase_client import supabase

router = APIRouter(prefix="/analyze", tags=["analysis"])

@router.post("/symptoms")
async def analyze_symptoms_route(request: SymptomRequest):
    result = await analyze_symptoms(request)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result

@router.post("/image")
async def analyze_image_route(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    result = await analyze_medical_image(file)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result

@router.post("/combined")
async def analyze_combined_route(
    symptoms: str = Form(...),
    age: int = Form(...),
    gender: str = Form(...),
    patient_name: str = Form("Unknown"),
    worker_id: str = Form("00000000-0000-0000-0000-000000000000"),
    file: Optional[UploadFile] = File(None)
):
    # 1. Analyze symptoms
    symp_req = SymptomRequest(symptoms=symptoms, age=age, gender=gender)
    symp_results = await analyze_symptoms(symp_req)
    
    # 2. Analyze image if provided
    img_results = {
        "findings": "No image uploaded.",
        "conditions": [],
        "confidence": 0
    }
    image_url = None
    if file:
        file_bytes = await file.read()
        # Reset file pointer if needed for analysis service
        # But we'll just pass the bytes if image_analyzer supports it, 
        # or just re-upload it. 
        # Actually our current image_analyzer accepts UploadFile directly.
        # Let's hit the analyzer first, then upload.
        img_results = await analyze_medical_image(file)
        
        # Upload to Supabase Storage
        image_url = await upload_clinical_image(file_bytes, file.filename)
        
    # 3. Use AI Fusion Layer (Phase 5.1)
    combined_results = await fuse_diagnoses(symp_results, img_results)
    
    # 4. Attach original individual analyses for UI transparency
    combined_results["symptom_analysis"] = symp_results
    combined_results["image_analysis"] = img_results
    
    # 5. PERSISTENCE (Phase 8)
    try:
        # 5.1 Find or create patient
        p_res = supabase.table("patients").select("id").eq("name", patient_name).eq("age", age).execute()
        
        if p_res.data:
            patient_id = p_res.data[0]["id"]
        else:
            new_p = supabase.table("patients").insert({
                "name": patient_name,
                "age": age,
                "gender": gender
            }).execute()
            patient_id = new_p.data[0]["id"]
            
        # 5.2 Save Session
        supabase.table("sessions").insert({
            "patient_id": patient_id,
            "symptoms": symptoms,
            "image_url": image_url,
            "diagnosis": combined_results,
            "severity": combined_results.get("severity", "Medium"),
            "worker_id": worker_id
        }).execute()
        
    except Exception as e:
        print(f"Persistence error: {e}")
        # We don't fail the request if persistence fails, but we log it.

    return combined_results
