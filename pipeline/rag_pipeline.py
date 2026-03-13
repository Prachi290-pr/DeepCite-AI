from retrieval.hybrid_retriever import HybridRetriever
from indexing.vector_index import VectorIndex
from indexing.bm25_index import BM25Index
from retrieval.reranker import Reranker
from generation.answer_generator import AnswerGenerator
from evaluation.evaluate import RAGEvaluator
from chunking.chunker import Chunker

class RAGPipeline:
    def __init__(self):
        self.vector_store = VectorIndex()
        self.bm25_retriever = BM25Index()
        self.retriever = HybridRetriever(
            vector_index=self.vector_store,
            bm25_index=self.bm25_retriever
        )
        self.reranker = Reranker()
        self.generator = AnswerGenerator()
        self.evaluator = RAGEvaluator()

    def initialize(self, docs):
        chunker = Chunker()
        chunks = chunker.chunk_documents(docs)
        self.vector_store.build_index(chunks)
        self.bm25_retriever.build_index(chunks)

    def ask(self, query):
        retrieved_docs = self.retriever.retrieve(query)
        reranked_docs = self.reranker.rerank(query, retrieved_docs)
        answer = self.generator.generate_answer(query, reranked_docs)

        scores = {
            "context_precision": self.evaluator.context_precision(query, reranked_docs),
            "answer_relevance": self.evaluator.answer_relevance(query, answer),
            "faithfulness": self.evaluator.faithfulness(answer, reranked_docs)
        }

        self.evaluator.save_results(query, answer, reranked_docs, scores)

        return {
            "query": query,
            "answer": answer,
            "sources": reranked_docs,
            "metrics": scores
        }