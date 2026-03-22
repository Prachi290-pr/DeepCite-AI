from backend.ingestion.document_loader import load_papers
from backend.chunking.chunker import chunk_text_pages

loader = DocumentLoader("backend/data/raw_papers")
chunker = Chunker()

docs = loader.load_documents()
chunks = chunker.chunk_documents(docs)


print("Total chunks:", len(chunks))
print(chunks[0])