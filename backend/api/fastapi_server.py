from fastapi import FastAPI, UploadFile, File 
import os
import shutil
from pydantic import BaseModel

from backend.pipeline.rag_pipeline import RAGPipeline
from backend.ingestion.document_loader import DocumentLoader

from fastapi.middleware.cors import CORSMiddleware

pipeline = None
loader = None

UPLOAD_DIR = "backend/data/uploads"
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
loader = DocumentLoader("backend/data/raw_papers")
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

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Rebuild pipeline
    reindex_pipeline()

    return {
        "message": f"{file.filename} uploaded & indexed successfully"
    }


@app.on_event("startup")
def startup_event():
    global pipeline, loader

    loader = DocumentLoader("data/uploads")  # 👈 ONLY uploads now
    documents = loader.load_documents()

    pipeline = RAGPipeline(documents)

    print("✅ RAG system initialized with uploaded docs")

def reindex_pipeline():
    global pipeline, loader

    print("🔄 Re-indexing...")

    documents = loader.load_documents()
    pipeline = RAGPipeline(documents)

    print("✅ Re-indexing complete")