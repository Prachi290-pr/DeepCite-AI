from backend.ingestion.document_loader import load_papers

loader = DocumentLoader("backend/data/raw_papers")
docs = loader.load_documents()

print("Number of pages loaded:", len(docs))
print(docs[0])