# DeepCite-AI

DeepCite-AI is a Retrieval-Augmented Generation (RAG) system designed to answer questions from research papers while providing grounded citations. The system retrieves relevant document sections, ranks them using a cross-encoder model, and generates answers using a large language model based only on the retrieved evidence.

The project demonstrates a modular and production-style RAG pipeline similar to architectures used in modern AI research assistants.

---

## Overview

Large language models often hallucinate when answering questions about specialized topics such as academic research. Retrieval-Augmented Generation addresses this by retrieving relevant documents and using them as context for answer generation.

DeepCite-AI implements a full pipeline that:

* Ingests research papers in PDF format
* Splits documents into semantic chunks
* Builds vector and keyword-based search indexes
* Retrieves relevant document sections
* Reranks results using a cross-encoder model
* Generates grounded answers with citations

---

## System Architecture

The pipeline follows a standard RAG workflow:

User Query
→ Hybrid Retrieval (Vector + BM25)
→ Cross-Encoder Reranking
→ Context Construction
→ LLM Generation
→ Grounded Answer with Citations

---

## Project Structure

```
DeepCite-AI
│
├── api/
│ └── fastapi_server.py # FastAPI backend
│
├── frontend/ # React UI
│ ├── src/
│ │ ├── App.jsx
│ │ └── api/
│ │ └── ragApi.js
│
├── data/
│ └── raw_papers/ # Research PDFs
│
├── ingestion/
│ └── document_loader.py
│
├── chunking/
│ └── text_chunker.py
│
├── indexing/
│ ├── vector_index.py
│ └── bm25_index.py
│
├── retrieval/
│ └── hybrid_retriever.py
│
├── reranking/
│ └── cross_encoder_reranker.py
│
├── generation/
│ └── answer_generator.py
│
├── pipeline/
│ └── rag_pipeline.py
│
├── evaluation/
│ └── metrics.py
│
├── tests/
│
└── README.md
```

---

## Example Query

**Question**

What architecture does the Transformer use?

**Output**

The Transformer follows an encoder-decoder architecture using stacked self-attention layers.
(attention_is_all_you_need.pdf, page 3)

---

## Installation

Clone the repository:

```
git clone https://github.com/yourusername/DeepCite-AI.git
cd DeepCite-AI
```

Install dependencies:

```
pip install -r requirements.txt
```

Set the HuggingFace API token:

```
export HF_TOKEN=your_token_here
```


---

## Running the Backend


uvicorn api.fastapi_server:app --reload --port 8000


API will be available at:


http://localhost:8000

http://localhost:8000/docs


---

## Running the Frontend


cd frontend
npm install
npm run dev


Frontend runs at:


http://localhost:5173


---

## API Endpoint

### POST `/ask`

Request:


{
"query": "Explain attention mechanism"
}


Response:


{
"answer": "...",
"sources": [
{"source": "paper.pdf", "page": 3}
],
"metrics": {
"faithfulness": 0.92,
"answer_relevance": 0.89
}
}


---

## Technologies Used

### Backend
- Python
- FastAPI
- Sentence Transformers
- FAISS
- BM25
- HuggingFace Inference API

### Frontend
- React (Vite)
- JavaScript
- Modern Chat UI Design

### AI/ML Concepts
- Retrieval-Augmented Generation (RAG)
- Semantic Search
- Cross-Encoder Reranking
- LLM Prompt Engineering


---

## Future Improvements

* Multi-query retrieval
* RAG evaluation metrics
* Interactive research paper QA interface
* Web deployment

---

## License

MIT License
