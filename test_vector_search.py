from ingestion.document_loader import load_papers
from chunking.chunker import chunk_text_pages
from indexing.vector_index import VectorIndex

loader = DocumentLoader("data/raw_papers")
chunker = Chunker()
vector_index = VectorIndex()

docs = loader.load_documents()
chunks = chunker.chunk_documents(docs)


vector_index.build_index(chunks)

results = vector_index.search(
    "How does self attention work?",
    top_k=5
)

for r in results:
    print(r["source"], r["page"])
    print(r["text"])
    print("----")