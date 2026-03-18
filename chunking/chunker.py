class Chunker:

    def __init__(self, chunk_size=800, overlap=150):
        self.chunk_size = chunk_size
        self.overlap = overlap

    def chunk_documents(self, documents):

        all_chunks = []

        for doc in documents:

            text = doc["text"]
            start = 0
            chunk_id = 0

            while start < len(text):

                end = start + self.chunk_size

                chunk_text = text[start:end]

                all_chunks.append({
                    "chunk_id": f"{doc['source']}_p{doc['page']}_c{chunk_id}",
                    "text": chunk_text,
                    "source": doc["source"],
                    "page": doc["page"]
                })

                start += self.chunk_size - self.overlap
                chunk_id += 1

        return all_chunks