import os
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from backend.pipeline.rag_pipeline import RAGPipeline
from backend.ingestion.document_loader import DocumentLoader

pipeline = None
UPLOAD_DIR = "backend/data/uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI(title="DeepCite AI - Personal Vault")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str

@app.on_event("startup")
def startup_event():
    global pipeline
    if os.path.exists(UPLOAD_DIR):
        files = [f for f in os.listdir(UPLOAD_DIR) if not f.startswith('.')]
        if files:
            print(f"Loading {len(files)} files from vault")
            reindex_pipeline()
        else:
            print("Vault is empty. System waiting for uploads")

@app.get("/status")
def get_status():
    file_count = 0
    if os.path.exists(UPLOAD_DIR):
        file_count = len([f for f in os.listdir(UPLOAD_DIR) if not f.startswith('.')])
    
    return {
        "ready": pipeline is not None,
        "files": file_count
    }

@app.get("/")
def root():
    return {"message": "DeepCite AI API is running"}

@app.post("/ask")
def ask_question(request: QueryRequest):
    global pipeline
    if pipeline is None:
        raise HTTPException(status_code=400, detail="No documents indexed yet. Upload a PDF and wait a moment for the index to complete.")

    try:
        result = pipeline.ask(request.query)
        return {
            "query": result["query"],
            "answer": result["answer"],
            "sources": result["sources"],
            "metrics": result["metrics"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload")
async def upload_file(file: UploadFile = File(...), background_tasks: BackgroundTasks = None):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    if background_tasks:
        background_tasks.add_task(reindex_pipeline)

    return {
        "message": f"{file.filename} indexed successfully",
        "ready": True
    }

def reindex_pipeline():
    global pipeline
    print("Re-indexing personal vault")
    try:
        loader = DocumentLoader(UPLOAD_DIR)
        documents = loader.load_documents()
        
        if documents:
            pipeline = RAGPipeline()
            pipeline.initialize(documents)
            print(f"Indexing complete: {len(documents)} segments processed")
        else:
            pipeline = None
            print("No text extracted from documents")
    except Exception as e:
        pipeline = None
        print(f"Error during re-indexing: {str(e)}")