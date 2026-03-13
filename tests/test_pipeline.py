from pipeline.rag_pipeline import RAGPipeline
from ingestion.document_loader import DocumentLoader

# 1. Create the pipeline object (This only sets up the empty machines)
pipeline = RAGPipeline()

# 2. Load the actual PDFs from your folder
loader = DocumentLoader("data/raw_papers")
docs = loader.load_documents()

# 3. INITIALIZE (This builds the FAISS map so it's no longer 'None')
pipeline.initialize(docs)

# 4. NOW you can ask the question
query = "What architecture does the Transformer use?"
result = pipeline.ask(query)

print("\nANSWER\n")
print(result["answer"])