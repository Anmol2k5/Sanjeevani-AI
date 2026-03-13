import json
import os
import httpx
from pydantic import BaseModel

HF_API_KEY = os.environ.get("HUGGINGFACE_API_KEY")

class SymptomRequest(BaseModel):
    symptoms: str
    age: int
    gender: str

# In Phase 1, we simulate the 773-disease dataset model by hitting a lightweight instruct model 
# to act as our clinical symptom-to-disease classifier.
async def analyze_symptoms(request: SymptomRequest):
    if not HF_API_KEY:
        # Fallback for development without API key
        return {
            "diagnoses": [
                {"name": "Viral Fever", "confidence": 85},
                {"name": "Common Cold", "confidence": 60},
            ],
            "severity": "Low",
            "advice": "Rest and hydration. Monitor for 48 hours."
        }

    # Using the new HuggingFace Router API (OpenAI compatible)
    API_URL = "https://router.huggingface.co/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {HF_API_KEY}",
        "Content-Type": "application/json"
    }

    messages = [
        {"role": "system", "content": "You are an AI medical assistant for rural healthcare workers. Respond only in valid JSON."},
        {"role": "user", "content": f"Analyze these symptoms and provide the top 3 most likely diagnoses.\nPatient details: Age {request.age}, Gender {request.gender}\nSymptoms reported: {request.symptoms}\n\nRespond EXACTLY in this JSON format:\n{{\n  \"diagnoses\": [\n    {{\"name\": \"Disease 1\", \"confidence\": 90}},\n    {{\"name\": \"Disease 2\", \"confidence\": 50}}\n  ],\n  \"severity\": \"Low\" | \"Medium\" | \"URGENT\",\n  \"advice\": \"Short actionable advice\"\n}}"}
    ]

    async with httpx.AsyncClient() as client:
        try:
            print(f"Calling HF Router: {API_URL}")
            response = await client.post(
                API_URL, 
                headers=headers, 
                json={
                    "model": "meta-llama/Llama-3.1-8B-Instruct",
                    "messages": messages,
                    "max_tokens": 500,
                    "temperature": 0.1,
                    "response_format": {"type": "json_object"}
                },
                timeout=45.0
            )
            
            if response.status_code == 503:
                print("HF Router/Model is loading...")
                return {
                    "diagnoses": [{"name": "AI Model Loading", "confidence": 0}],
                    "severity": "Unknown",
                    "advice": "The AI model is currently spinning up. Please try again in 30 seconds."
                }
            
            response.raise_for_status()
            data = response.json()
            
            result_text = data["choices"][0]["message"]["content"].strip()
            print(f"Raw router response: {result_text}")
            
            return json.loads(result_text)
        except Exception as e:
            print(f"Error calling HF API: {str(e)}")
            if hasattr(e, 'response'):
                print(f"Response body: {e.response.text}")
            return {
                "error": str(e),
                "diagnoses": [{"name": "Analysis Failed", "confidence": 0}],
                "severity": "Unknown",
                "advice": "Please consult a doctor directly. Diagnostic service is temporarily down."
            }
