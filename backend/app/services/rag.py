import os
import math
from typing import List, Dict, Any

class VectorDBMock:
    """
    A lightweight in-memory Vector Database simulation.
    Uses basic TF-IDF term overlap or string similarity to compute cosine similarity scores.
    """
    def __init__(self):
        self.index: List[Dict[str, Any]] = []

    def clear(self):
        self.index.clear()

    def add_document(self, doc_id: str, filename: str, content: str):
        # Clean and split into chunks
        chunks = self._chunk_text(content)
        for i, chunk in enumerate(chunks):
            self.index.append({
                "id": f"{doc_id}-chunk-{i}",
                "filename": filename,
                "text": chunk,
                "tokens": set(chunk.lower().split())
            })

    def search(self, query: str, top_k: int = 2) -> List[Dict[str, Any]]:
        if not self.index:
            return []

        query_tokens = set(query.lower().split())
        results = []

        for item in self.index:
            # Jaccard overlap similarity as a proxy for cosine similarity of embeddings
            intersection = query_tokens.intersection(item["tokens"])
            union = query_tokens.union(item["tokens"])
            score = len(intersection) / len(union) if union else 0.0

            results.append({
                "chunk": item["text"],
                "source": item["filename"],
                "score": round(score, 2)
            })

        # Sort by similarity score descending
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:top_k]

    def _chunk_text(self, text: str, size: int = 400, overlap: int = 50) -> List[str]:
        words = text.split()
        chunks = []
        for i in range(0, len(words), size - overlap):
            chunk_words = words[i:i + size]
            chunks.append(" ".join(chunk_words))
            if i + size >= len(words):
                break
        return chunks if chunks else [text]

# Singleton Global Index
rag_index = VectorDBMock()

# Populate with default knowledge base files
rag_index.add_document(
    "KB-101", 
    "API_Integration_Guide.pdf", 
    "To avoid CORS problems, developers should configure allowed domains inside settings. The client instance will reject socket connections from domains that are not whitelisted. In your dashboard, navigate to Settings -> API Keys and list your domain in the Allowed Origins text area. Whitelisting is instant."
)

rag_index.add_document(
    "KB-102", 
    "Billing_and_Refunds_Policy.docx", 
    "Our refund policy specifies that any defective or damaged product orders are eligible for 100% money refund or free replacement within 30 days of the shipping delivery date. Refund requests can be processed automatically by the Refund Agent if WooCommerce and Stripe sync integrations are active."
)

def query_rag(query: str) -> List[Dict[str, Any]]:
    return rag_index.search(query)
