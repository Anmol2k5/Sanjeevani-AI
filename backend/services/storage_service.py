import os
import uuid
from typing import Optional
from db.supabase_client import supabase

async def upload_clinical_image(file_data: bytes, filename: str) -> Optional[str]:
    """
    Uploads a clinical image to Supabase storage and returns the public URL.
    """
    try:
        # Generate a unique filename to prevent collisions
        ext = filename.split(".")[-1] if "." in filename else "jpg"
        unique_name = f"{uuid.uuid4()}.{ext}"
        
        # Upload to 'clinical-images' bucket
        # Note: bucket must exist or be created in Supabase console
        bucket_name = "clinical-images"
        
        # Binary upload
        path = f"uploads/{unique_name}"
        res = supabase.storage.from_(bucket_name).upload(
            path=path,
            file=file_data,
            file_options={"content-type": f"image/{ext}"}
        )
        
        # Get public URL
        url_res = supabase.storage.from_(bucket_name).get_public_url(path)
        return url_res
    except Exception as e:
        print(f"Storage upload error: {e}")
        return None
