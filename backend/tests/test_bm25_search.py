from backend.ingestion.document_loader import DocumentLoader
from backend.chunking.chunker import Chunker
from backend.indexing.bm25_index import BM25Index

loader = DocumentLoader("backend/data/raw_papers")
docs = loader.load_documents()

chunker = Chunker()
chunks = chunker.chunk_documents(docs)

bm25 = BM25Index()
bm25.build_index(chunks)

results = bm25.search(
    "self attention mechanism",
    top_k=5
)

for r in results:
    print(r["source"], r["page"])
    print(r["text"])
    print("----")