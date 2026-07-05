import sys
import os
from fastapi.testclient import TestClient

# Append directory path to python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    assert "uptime_sla" in response.json()

def test_tickets_endpoint():
    response = client.get("/api/tickets")
    assert response.status_code == 200
    assert len(response.json()) > 0
    assert response.json()[0]["id"] == "TK-301"

def test_knowledge_base_indexing():
    response = client.post("/api/knowledge", json={"url": "https://example.com/docs"})
    assert response.status_code == 200
    assert response.json()["status"] == "indexed"

def test_multi_agent_cors_routing():
    response = client.post("/api/chat", json={"query": "Why does the SDK fail with CORS errors on localhost?"})
    assert response.status_code == 200
    assert response.json()["agent"] == "technical"
    assert "whitelist" in response.json()["response"].lower()

def test_multi_agent_refund_routing():
    response = client.post("/api/chat", json={"query": "I want a refund for damaged order #SH-8841"})
    assert response.status_code == 200
    assert response.json()["agent"] == "refund"
    assert "stripe" in response.json()["response"].lower()
