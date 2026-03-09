from ingestion.document_loader import load_papers
from chunking.chunker import chunk_text_pages

docs = load_papers("data/raw_papers")
chunks = chunk_text_pages(docs)

print("Total chunks:", len(chunks))
print(chunks[0])