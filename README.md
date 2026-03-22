# DeepCite-AI

DeepCite-AI is a Retrieval-Augmented Generation (RAG) system designed to answer questions from research papers while providing grounded citations. The system retrieves relevant document sections, ranks them using a cross-encoder model, and generates answers using a large language model based only on the retrieved evidence.

The project demonstrates a modular and production-style RAG pipeline similar to architectures used in modern AI research assistants.

---

## Overview

DeepCite-AI is a production-ready Retrieval-Augmented Generation (RAG) system that answers questions from research papers with grounded citations. The system features:

### **Current Features**
- **PDF Document Upload**: Secure file upload with background indexing
- **Cross-Encoder Reranking**: Uses cross-encoder model to rank top 5 most relevant chunks
- **Hybrid Search**: Combines vector similarity and BM25 keyword search
- **Enhanced Answer Generation**: Table-free responses with quality assessment and proper citations
- **Modern Web Interface**: React-based chat UI with real-time document processing
- **Comprehensive Testing**: Full test coverage for all components
- **RAG Evaluation**: Built-in metrics for faithfulness, relevance, and precision
- **Production Ready**: Environment-based configuration, error handling, and security

### **Technical Implementation**
- **Backend**: FastAPI with async document processing
- **Frontend**: React + Vite with responsive chat interface
- **AI Models**: HuggingFace API with fallback models
- **Vector Search**: FAISS with sentence transformers
- **Reranking**: Cross-encoder for semantic relevance scoring
- **Chunking**: Intelligent document segmentation

The system demonstrates enterprise-grade RAG implementation with proper error handling, security, and user experience considerations.

---

## System Architecture

### RAG Pipeline Flow

```
User Query
    ↓
PDF Upload → Background Indexing
    ↓
Hybrid Retrieval (Vector + BM25)
    ↓
Cross-Encoder Reranking (Top 5)
    ↓
Context Construction (Reranked Order)
    ↓
LLM Generation (Cited)
    ↓
Quality Assessment + Response
```

### Key Components

1. **Document Processing**
   - PDF ingestion with PyPDF
   - Intelligent chunking with semantic boundaries
   - Background indexing for large documents

2. **Retrieval System**
   - FAISS vector search with sentence transformers
   - BM25 keyword search for exact matches
   - Hybrid scoring with reciprocal rank fusion

3. **Reranking Engine**
   - Cross-encoder model for query-document relevance
   - Returns top 5 most relevant chunks
   - Eliminates irrelevant or noisy content

4. **Answer Generation**
   - Multi-model support with automatic fallback
   - Explicit table removal and formatting
   - Citation validation and quality assessment
   - Context-aware prompt engineering

5. **Evaluation Framework**
   - Faithfulness, relevance, and precision metrics
   - Automated testing and result storage
   - Performance benchmarking

---

## Project Structure

```
DeepCite-AI/
│
├── backend/
│   ├── api/
│   │   └── fastapi_server.py     # FastAPI backend with upload/ask endpoints
│   ├── chunking/
│   │   └── chunker.py             # Document chunking logic
│   ├── data/
│   │   └── uploads/               # Uploaded document storage
│   ├── evaluation/
│   │   ├── evaluate.py            # RAG evaluation metrics
│   │   └── results.json           # Evaluation results storage
│   ├── generation/
│   │   └── answer_generator.py    # Enhanced LLM answer generation
│   ├── indexing/
│   │   ├── vector_index.py        # FAISS vector indexing
│   │   └── bm25_index.py          # BM25 keyword indexing
│   ├── ingestion/
│   │   └── document_loader.py     # PDF document loading
│   ├── pipeline/
│   │   └── rag_pipeline.py        # Main RAG pipeline orchestration
│   ├── retrieval/
│   │   ├── hybrid_retriever.py    # Hybrid search (vector + BM25)
│   │   └── reranker.py            # Cross-encoder reranking
│   ├── tests/                     
│   └── requirements.txt           # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # Main React application
│   │   ├── api/
│   │   │   └── ragApi.js          # Frontend API client
│   │   └── assets/                
│   ├── package.json               
│   └── vite.config.js             
│
├── .gitignore                     
├── LICENSE                        
└── README.md                      
```

---

## Example Usage

### Document Upload
Upload a PDF research paper through the web interface. The system automatically:
- Extracts text content
- Creates semantic chunks
- Builds vector and keyword indexes
- Shows indexing progress

### Query Example

**Question:** What are the main contributions of this paper?

**Generated Answer:**
This paper presents three main contributions to the field of natural language processing:

1. A novel attention mechanism that improves upon traditional approaches by using multi-head attention [Source 1, Page 3]

2. An efficient training procedure that reduces computational requirements by 60% compared to previous methods [Source 1, Page 5]

3. Comprehensive evaluation on multiple benchmark datasets showing state-of-the-art performance [Source 1, Page 7]

---

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- HuggingFace API token

### Backend Setup

```bash
# Clone repository
git clone https://github.com/Prachi290-pr/DeepCite-AI.git
cd DeepCite-AI/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env and add your HF_TOKEN
```

### Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# The frontend will auto-detect the backend URL
```

### Environment Configuration

**Backend (.env):**
```bash
HF_TOKEN=your_huggingface_token_here
```

**Frontend (.env):**
```bash
VITE_API_URL=http://localhost:8000
```


## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # Activate virtual environment
uvicorn api.fastapi_server:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Production Mode

**Backend:**
```bash
cd backend
uvicorn api.fastapi_server:app --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview  # Or deploy the dist/ folder
```



## API Endpoints

### GET `/`
Returns system status and available endpoints.

**Response:**
```json
{
  "status": "healthy",
  "message": "DeepCite-AI RAG system is running",
  "endpoints": {
    "ask": "POST /ask",
    "upload": "POST /upload",
    "status": "GET /status"
  }
}
```

### GET `/status`
Returns current system status including indexing state.
```

### POST `/upload`
Upload PDF documents for indexing.

```

### POST `/ask`
Ask questions about uploaded documents.



## Technologies & Dependencies

### Backend Stack
- **FastAPI**: High-performance async web framework
- **Sentence Transformers**: Text embedding and semantic search
- **FAISS**: Efficient vector similarity search
- **Rank-BM25**: Keyword-based document ranking
- **Cross-Encoder Models**: Query-document relevance scoring
- **PyPDF**: PDF document processing
- **HuggingFace API**: LLM inference with fallback models

### Frontend Stack
- **React 18**: Modern UI framework with hooks
- **Vite**: Fast development build tool
- **Modern CSS**: Responsive design with custom styling
- **Axios**: HTTP client for API communication

### AI/ML Components
- **Embedding Model**: `sentence-transformers/all-MiniLM-L6-v2`
- **Reranking Model**: `cross-encoder/ms-marco-MiniLM-L-6-v2`
- **LLM**: HuggingFace API with Meta-Llama models
- **Fallback Models**: Automatic model switching on failures



## Evaluation Metrics

The system includes comprehensive RAG evaluation:

- **Context Precision**: Measures if retrieved documents are relevant
- **Answer Relevance**: Assesses if answers address the query
- **Faithfulness**: Verifies answers are grounded in source documents

Results are automatically saved to `evaluation/results.json` for analysis.



## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


