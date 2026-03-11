from ingestion.document_loader import DocumentLoader
from chunking.chunker import Chunker
from indexing.vector_index import VectorIndex
from indexing.bm25_index import BM25Index
from retrieval.hybrid_retriever import HybridRetriever
from retrieval.reranker import CrossEncoderReranker


loader = DocumentLoader("data/raw_papers")
docs = loader.load_documents()

chunker = Chunker()
chunks = chunker.chunk_documents(docs)

vector_index = VectorIndex()
vector_index.build_index(chunks)

bm25 = BM25Index()
bm25.build_index(chunks)

retriever = HybridRetriever(vector_index, bm25)

candidates = retriever.retrieve(
    "How does self attention work in transformers?",
    top_k=20
)

reranker = CrossEncoderReranker()

results = reranker.rerank(
    "How does self attention work in transformers?",
    candidates,
    top_k=5
)

for r in results:
    print(r["source"], r["page"])
    print(r["text"])
    print("----")