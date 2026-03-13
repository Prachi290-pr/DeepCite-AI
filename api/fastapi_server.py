from fastapi import FastAPI
from pydantic import BaseModel

from pipeline.rag_pipeline import RAGPipeline
from ingestion.document_loader import DocumentLoader

# Create FastAPI app
app = FastAPI(title="DeepCite AI")

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