from fastapi import APIRouter, UploadFile, File, Form, Depends
import tempfile, os
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.services.rules_loader import load_rules_from_files

router = APIRouter(prefix="/rules", tags=["rules"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/upload")
async def upload_rules(file: UploadFile = File(...), type: str = Form(...), db: Session = Depends(get_db)):
    """Upload and parse technical or medical rules files"""
    if type not in ["technical", "medical"]:
        raise ValueError("Type must be 'technical' or 'medical'")
    
    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name
    
    try:
        # Store rules configuration
        config_dir = "app/config"
        os.makedirs(config_dir, exist_ok=True)
        rules_config_path = f"{config_dir}/{type}_rules.txt"
        
        with open(rules_config_path, 'w') as f:
            f.write(f"Rules file: {file.filename}\n")
            f.write(f"Upload time: {__import__('datetime').datetime.now()}\n")
            f.write(f"File size: {len(content)} bytes\n")
        
        return {
            "message": f"{type.title()} rules uploaded successfully",
            "filename": file.filename,
            "size": len(content),
            "type": type
        }
    
    except Exception as e:
        raise Exception(f"Failed to process {type} rules: {str(e)}")
    
    finally:
        os.unlink(tmp_path)

@router.get("")
def list_rules():
    return {"rules": load_rules_from_files()}
