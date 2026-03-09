def chunk_text_pages(documents, chunk_size=500, overlap=50):
    """
    documents: list of {text, source, page}
    returns: list of chunks with metadata
    """
    all_chunks = []

    for doc in documents:
        text = doc["text"]
        start = 0
        chunk_id = 0

        while start < len(text):
            end = start + chunk_size
            chunk_text = text[start:end]

            all_chunks.append({
                "chunk_id": f"{doc['source']}_p{doc['page']}_c{chunk_id}",
                "text": chunk_text,
                "source": doc["source"],
                "page": doc["page"]
            })

            start += chunk_size - overlap
            chunk_id += 1

    return all_chunks