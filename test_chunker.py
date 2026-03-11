from ingestion.document_loader import load_papers
from chunking.chunker import chunk_text_pages

loader = DocumentLoader("data/raw_papers")
chunker = Chunker()

docs = loader.load_documents()
chunks = chunker.chunk_documents(docs)


print("Total chunks:", len(chunks))
print(chunks[0])