from backend.ingestion.document_loader import DocumentLoader
from backend.chunking.chunker import Chunker
from backend.indexing.vector_index import VectorIndex
from backend.indexing.bm25_index import BM25Index
from backend.retrieval.hybrid_retriever import HybridRetriever


loader = DocumentLoader("backend/data/raw_papers")
docs = loader.load_documents()

chunker = Chunker()
chunks = chunker.chunk_documents(docs)


vector_index = VectorIndex()
vector_index.build_index(chunks)

bm25 = BM25Index()
bm25.build_index(chunks)


retriever = HybridRetriever(vector_index, bm25)

results = retriever.retrieve(
    "How does self attention work in transformers?",
    top_k=5
)


for r in results:
    print(r["source"], r["page"])
    print(r["text"])
    print("----")