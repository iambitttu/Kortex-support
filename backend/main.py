import uvicorn
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from app.services.agents import orchestrate_agents
from app.services.rag import query_rag, rag_index

app = FastAPI(title="Kortex Support AI API", version="1.0.0")

# Setup CORS Middlewares
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class QueryRequest(BaseModel):
    query: str

class ChatResponse(BaseModel):
    agent: str
    response: str
    citations: List[str]

class TicketRequest(BaseModel):
    title: str
    description: str
    customer_name: str
    customer_email: str
    priority: str

class NoteRequest(BaseModel):
    note: str

# Mock Database Store (Syncs with the Frontend mock profiles)
tickets_db = [
    {
        "id": "TK-301",
        "title": "Web SDK throwing CORS exception on production environment",
        "customerName": "John Miller",
        "customerEmail": "john@cyberdyne.com",
        "priority": "Critical",
        "status": "Open",
        "assignedAgent": "Technical Support Agent",
        "slaMinutes": 15,
        "description": "We integrated the chat widget into our react platform today. When users hit the trigger script, a CORS exception blocks the socket handoff. Need immediate help.",
        "aiSummary": "Customer experiencing production-blocking CORS issues on Web SDK load.",
        "internalNotes": ["SLA breach threat. Agent Sarah assigned. CORS issue suspected."]
    }
]

customers_db = [
    {
        "id": "CUST-1001",
        "name": "John Miller",
        "email": "john@cyberdyne.com",
        "company": "Cyberdyne Systems",
        "plan": "Enterprise",
        "orderNumber": "#SH-4592",
        "orderStatus": "In Transit",
        "orderTotal": "$1,299.00",
        "refundEligible": True
    }
]

# Endpoints
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "uptime_sla": "99.99%",
        "router_latency_ms": 42,
        "vector_index_status": "synced"
    }

@app.post("/api/chat", response_model=ChatResponse)
def handle_chat_query(payload: QueryRequest):
    try:
        result = orchestrate_agents(payload.query)
        return ChatResponse(
            agent=result["agent"],
            response=result["response"],
            citations=result["citations"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Agent workflow error: {str(e)}"
        )

@app.get("/api/tickets")
def get_tickets():
    return tickets_db

@app.post("/api/tickets")
def create_ticket(ticket: TicketRequest):
    new_id = f"TK-{len(tickets_db) + 301}"
    new_ticket = {
        "id": new_id,
        "title": ticket.title,
        "customerName": ticket.customer_name,
        "customerEmail": ticket.customer_email,
        "priority": ticket.priority,
        "status": "Open",
        "assignedAgent": "Supervisor Agent",
        "slaMinutes": 120,
        "description": ticket.description,
        "internalNotes": []
    }
    tickets_db.append(new_ticket)
    return new_ticket

@app.post("/api/tickets/{ticket_id}/notes")
def add_ticket_note(ticket_id: str, payload: NoteRequest):
    for t in tickets_db:
        if t["id"] == ticket_id:
            t["internalNotes"].append(payload.note)
            return {"status": "success", "notes": t["internalNotes"]}
    raise HTTPException(status_code=404, detail="Ticket not found")

@app.get("/api/customers")
def get_customers():
    return customers_db

@app.get("/api/knowledge")
def get_knowledge_docs():
    return [
        {"id": "KB-101", "name": "API_Integration_Guide.pdf", "type": "PDF", "status": "Indexed"},
        {"id": "KB-102", "name": "Billing_and_Refunds_Policy.docx", "type": "DOCX", "status": "Indexed"}
    ]

@app.post("/api/knowledge")
def add_knowledge_url(payload: Dict[str, str]):
    url = payload.get("url")
    if not url:
        raise HTTPException(status_code=400, detail="URL is required")
    
    rag_index.add_document(
        doc_id=f"KB-{len(rag_index.index) + 1}",
        filename=url,
        content=f"This is crawled documentation content scraped from site URL: {url}. Whitelisting settings and billing info is located here."
    )
    return {"status": "indexed", "url": url}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
