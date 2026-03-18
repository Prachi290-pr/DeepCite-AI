from fastapi import FastAPI, UploadFile, File 
import os
import shutil
from pydantic import BaseModel

from pipeline.rag_pipeline import RAGPipeline
from ingestion.document_loader import DocumentLoader

from fastapi.middleware.cors import CORSMiddleware


UPLOAD_DIR = "data/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# Create FastAPI app
app = FastAPI(title="DeepCite AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize pipeline
pipeline = RAGPipeline()

print("Loading documents...")
loader = DocumentLoader("data/raw_papers")
docs = loader.load_documents()

print("Building indexes...")
pipeline.initialize(docs)

print("DeepCite AI ready!")

# Request schema
class QueryRequest(BaseModel):
    query: str


# Root endpoint
@app.get("/")
def root():
    return {"message": "DeepCite AI API is running"}


# Ask endpoint
@app.post("/ask")
def ask_question(request: QueryRequest):

    result = pipeline.ask(request.query)

    return {
        "query": result["query"],
        "answer": result["answer"],
        "sources": result["sources"],
        "metrics": result["metrics"]
    }


# Upload endpoint
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "message": "File uploaded successfully",
        "filename": file.filename
    }