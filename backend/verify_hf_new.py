import httpx
import os
from dotenv import load_dotenv

load_dotenv(".env")

async def check_token():
    key = os.getenv("HUGGINGFACE_API_KEY")
    print(f"Testing Key: {key[:10]}...")
    
    # Try Router API
    url = "https://router.huggingface.co/v1/chat/completions"
    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    payload = {
        "model": "mistralai/Mistral-7B-Instruct-v0.2",
        "messages": [{"role": "user", "content": "Say hello"}],
        "max_tokens": 10
    }
    
    async with httpx.AsyncClient() as client:
        try:
            print(f"Testing Router API: {url}")
            resp = await client.post(url, headers=headers, json=payload, timeout=10)
            print(f"Router Status: {resp.status_code}")
            print(f"Router Response: {resp.text}")
            
            # Try Direct Model API as fallback
            direct_url = "https://api-inference.huggingface.co/models/BioMistral/BioMistral-7B"
            print(f"\nTesting Direct Model API: {direct_url}")
            resp2 = await client.post(direct_url, headers=headers, json={"inputs": "Patient has fever and cough."}, timeout=10)
            print(f"Direct Status: {resp2.status_code}")
            print(f"Direct Response: {resp2.text}")
            
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(check_token())
