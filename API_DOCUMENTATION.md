# Kortex Support - REST API Documentation

This document lists the REST API endpoints available in the **Kortex Support** backend. The backend is built using FastAPI and runs on port 8000 by default.

---

## 1. Platform Health
Check the current status and metrics of the support system.

* **Endpoint**: `/api/health`
* **Method**: `GET`
* **Response (200 OK)**:
  ```json
  {
    "status": "healthy",
    "uptime_sla": "99.99%",
    "router_latency_ms": 42,
    "vector_index_status": "synced"
  }
  ```

---

## 2. Multi-Agent Chat Console
Submit a customer query to the Supervisor AI. The Supervisor analyzes the query intent using semantic models and routes it to the designated specialist (Technical, Billing, Refund, Tracking, or General support).

* **Endpoint**: `/api/chat`
* **Method**: `POST`
* **Request Body**:
  ```json
  {
    "query": "I need help whitelisting my CORS domain on the Web SDK."
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "agent": "technical",
    "response": "Hello! I'm the Technical Support Expert. Regarding your SDK CORS error, you need to whitelist the hostname in your Settings dashboard under 'Allowed Origins'. Let me know if that resolves the issue.",
    "citations": [
      "API_Integration_Guide.pdf (Page 14: Origin Authorization)"
    ]
  }
  ```
* **Status Codes**:
  - `200 OK`: Successful routing and response generation.
  - `500 Internal Server Error`: LangGraph state machine or LLM execution failure.

---

## 3. Helpdesk Ticketing System
Retrieve current active support tickets or ingest a new ticket.

### Get Tickets
* **Endpoint**: `/api/tickets`
* **Method**: `GET`
* **Response (200 OK)**:
  ```json
  [
    {
      "id": "TK-301",
      "title": "Web SDK throwing CORS exception on production environment",
      "customerName": "John Miller",
      "customerEmail": "john@cyberdyne.com",
      "priority": "Critical",
      "status": "Open",
      "assignedAgent": "Technical Support Agent",
      "slaMinutes": 15,
      "description": "We integrated the chat widget into our react platform today...",
      "aiSummary": "Customer experiencing production-blocking CORS issues on Web SDK load.",
      "internalNotes": [
        "SLA breach threat. Agent Sarah assigned. CORS issue suspected."
      ]
    }
  ]
  ```

### Create Ticket
* **Endpoint**: `/api/tickets`
* **Method**: `POST`
* **Request Body**:
  ```json
  {
    "title": "Stripe refund failed for #SH-8841",
    "description": "I initiated an automated refund but the Stripe webhook timed out.",
    "customer_name": "Marcus Wright",
    "customer_email": "marcus@projectangel.org",
    "priority": "High"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "id": "TK-302",
    "title": "Stripe refund failed for #SH-8841",
    "customerName": "Marcus Wright",
    "customerEmail": "marcus@projectangel.org",
    "priority": "High",
    "status": "Open",
    "assignedAgent": "Supervisor Agent",
    "slaMinutes": 120,
    "description": "I initiated an automated refund but the Stripe webhook timed out.",
    "internalNotes": []
  }
  ```

### Add Internal Note
* **Endpoint**: `/api/tickets/{ticket_id}/notes`
* **Method**: `POST`
* **Request Body**:
  ```json
  {
    "note": "Spoke to customer. Re-triggering the Stripe API call."
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "notes": [
      "Original note",
      "Spoke to customer. Re-triggering the Stripe API call."
    ]
  }
  ```

---

## 4. Knowledge Base & RAG Index
Get indexed documents or append sitemaps/URLs to the RAG Vector Database.

### Get Document Logs
* **Endpoint**: `/api/knowledge`
* **Method**: `GET`
* **Response (200 OK)**:
  ```json
  [
    {"id": "KB-101", "name": "API_Integration_Guide.pdf", "type": "PDF", "status": "Indexed"},
    {"id": "KB-102", "name": "Billing_and_Refunds_Policy.docx", "type": "DOCX", "status": "Indexed"}
  ]
  ```

### Index Sitemap URL
* **Endpoint**: `/api/knowledge`
* **Method**: `POST`
* **Request Body**:
  ```json
  {
    "url": "https://docs.acmesupport.com/sitemap.xml"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "status": "indexed",
    "url": "https://docs.acmesupport.com/sitemap.xml"
  }
  ```
