from ingestion.document_loader import load_papers
from chunking.chunker import chunk_text_pages
from indexing.vector_index import VectorIndex

docs = load_papers("data/raw_papers")

chunks = chunk_text_pages(docs)

vector_index = VectorIndex()

vector_index.build_index(chunks)

results = vector_index.search(
    "How does self attention work?",
    top_k=5
)

for r in results:
    print(r["source"], r["page"])
    print(r["text"])
    print("----")