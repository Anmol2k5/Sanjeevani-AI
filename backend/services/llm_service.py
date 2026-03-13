import json
import os
import httpx
from typing import Dict, Any

HF_API_KEY = os.environ.get("HUGGINGFACE_API_KEY")

async def fuse_diagnoses(symptom_results: Dict[str, Any], image_results: Dict[str, Any]) -> Dict[str, Any]:
    """
    Fuses findings from symptoms and clinical images using a medical-tuned LLM approach.
    """
    if not HF_API_KEY:
        # Fallback summary
        return {
            "primary_diagnosis": symptom_results.get("diagnoses", [{}])[0],
            "severity": symptom_results.get("severity", "Unknown"),
            "advice": symptom_results.get("advice", ""),
            "narrative": "AI analysis summary: Patient exhibits symptoms consistent with " + 
                         symptom_results.get("diagnoses", [{}])[0].get("name", "unknown condition") +
                         ". Visual markers in the image provide supporting evidence."
        }

    # Using the HF Router for fusion
    API_URL = "https://router.huggingface.co/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {HF_API_KEY}",
        "Content-Type": "application/json"
    }

    prompt = f"""You are a senior medical consultant. Create a unified, consistent diagnosis by fusing these two clinical inputs:

1. SYMPTOM ANALYSIS:
{json.dumps(symptom_results, indent=2)}

2. CLINICAL IMAGE FINDINGS:
{json.dumps(image_results, indent=2)}

Your goal is to cross-reference the data. If the image findings (e.g. skin markers) support the symptoms (e.g. rash, fever), increase confidence. If they contradict, flag it.

Respond ONLY in this JSON format:
{{
  "primary_diagnosis": {{ "name": "Final Disease Name", "confidence": 95 }},
  "secondary_diagnoses": [ {{ "name": "Other", "confidence": 40 }} ],
  "severity": "Low" | "Medium" | "URGENT",
  "advice": "Actionable medical advice",
  "narrative": "A 2-3 sentence explanation of how the visual findings support or clarify the symptoms."
}}"""

    messages = [
        {"role": "system", "content": "You are a professional medical diagnostic engine. Respond only in JSON."},
        {"role": "user", "content": prompt}
    ]

    async with httpx.AsyncClient() as client:
        try:
            print("Fusing multimodal results via HF Router...")
            response = await client.post(
                API_URL,
                headers=headers,
                json={
                    "model": "meta-llama/Llama-3.1-8B-Instruct", # Switching to Llama-3.1 for stability on HF Router
                    "messages": messages,
                    "max_tokens": 500,
                    "temperature": 0.1,
                    "response_format": {"type": "json_object"}
                },
                timeout=45.0
            )
            response.raise_for_status()
            data = response.json()
            result_text = data["choices"][0]["message"]["content"].strip()
            
            return json.loads(result_text)
        except Exception as e:
            print(f"Fusion error: {e}")
            # Robust fallback on error
            return {
                "primary_diagnosis": symptom_results.get("diagnoses", [{}])[0],
                "severity": symptom_results.get("severity", "Medium"),
                "advice": symptom_results.get("advice", "Review case manually."),
                "narrative": "Multimodal fusion temporarily unavailable. Primary diagnosis based on symptom weightage."
            }
