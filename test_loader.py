from ingestion.document_loader import load_papers

docs = load_papers("data/raw_papers")

print("Number of pages loaded:", len(docs))
print(docs[0])