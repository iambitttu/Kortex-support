from typing import TypedDict, List, Dict, Any, Literal
from langgraph.graph import StateGraph, END

# Define Agent State Schema
class AgentState(TypedDict):
    messages: List[Dict[str, str]]
    next_agent: Literal["general", "billing", "technical", "refund", "tracking", "end"]
    active_agent: str
    response: str
    citations: List[str]

# 1. Supervisor Node
def supervisor_agent(state: AgentState) -> Dict[str, Any]:
    last_message = state["messages"][-1]["content"].lower()
    
    # Simulating supervisor classification logic
    if any(keyword in last_message for keyword in ["cors", "api", "sdk", "error", "integration"]):
        next_agent = "technical"
    elif any(keyword in last_message for keyword in ["refund", "cancel", "return", "chargeback"]):
        next_agent = "refund"
    elif any(keyword in last_message for keyword in ["billing", "charge", "invoice", "price", "credit"]):
        next_agent = "billing"
    elif any(keyword in last_message for keyword in ["track", "order", "shipment", "delivery", "where is"]):
        next_agent = "tracking"
    else:
        next_agent = "general"
        
    return {"next_agent": next_agent, "active_agent": next_agent}

# 2. Technical Specialist Node
def technical_support_agent(state: AgentState) -> Dict[str, Any]:
    return {
        "response": "Hello! I'm the Technical Support Expert. Regarding your SDK CORS error, you need to whitelist the hostname in your Settings dashboard under 'Allowed Origins'. Let me know if that resolves the issue.",
        "citations": ["API_Integration_Guide.pdf (Page 14: Origin Authorization)"],
        "next_agent": "end"
    }

# 3. Billing Agent Node
def billing_agent(state: AgentState) -> Dict[str, Any]:
    return {
        "response": "Hello, I'm the Billing Agent. I've reviewed your account history and found a seat overrun error on June 30th. I will process a credit adjust of $150 to your stripe card now.",
        "citations": ["Billing_and_Refunds_Policy.docx (Section 1: Plans and Seats)"],
        "next_agent": "end"
    }

# 4. Refund Agent Node
def refund_agent(state: AgentState) -> Dict[str, Any]:
    return {
        "response": "Hello, I'm the Refund Assistant. Based on order #SH-8841 being damaged and within the 30-day window, you are fully eligible. I have created a refund request on Stripe for $89.00.",
        "citations": ["Billing_and_Refunds_Policy.docx (Section 3: Damaged Goods)"],
        "next_agent": "end"
    }

# 5. Order Tracking Agent Node
def order_tracking_agent(state: AgentState) -> Dict[str, Any]:
    return {
        "response": "Hi, I'm the Tracking Specialist. Order #SH-4592 is currently In Transit. Carrier: UPS. Tracking ID: UPS-TRK-74929471. Estimated delivery is July 7, 2026.",
        "citations": ["Shopify_Sync_Docs.pdf (Page 4: Carrier Trackers)"],
        "next_agent": "end"
    }

# 6. General Support Node
def general_support_agent(state: AgentState) -> Dict[str, Any]:
    return {
        "response": "Hello! I am your Support Agent. How can I help you sync CRM contacts or setup custom workflows today?",
        "citations": ["FAQ_Database.txt (Section 1: General Help)"],
        "next_agent": "end"
    }

# Build LangGraph StateGraph Routing Map
builder = StateGraph(AgentState)

# Add Nodes
builder.add_node("supervisor", supervisor_agent)
builder.add_node("technical", technical_support_agent)
builder.add_node("billing", billing_agent)
builder.add_node("refund", refund_agent)
builder.add_node("tracking", order_tracking_agent)
builder.add_node("general", general_support_agent)

# Set Entry Point
builder.set_entry_point("supervisor")

# Configure Router Conditional Edges
def route_next(state: AgentState) -> str:
    return state["next_agent"]

builder.add_conditional_edges(
    "supervisor",
    route_next,
    {
        "technical": "technical",
        "billing": "billing",
        "refund": "refund",
        "tracking": "tracking",
        "general": "general"
    }
)

# Connect Specialist nodes to End
builder.add_edge("technical", END)
builder.add_edge("billing", END)
builder.add_edge("refund", END)
builder.add_edge("tracking", END)
builder.add_edge("general", END)

# Compile Graph
multi_agent_graph = builder.compile()

def orchestrate_agents(user_query: str) -> Dict[str, Any]:
    """
    Invokes the compiled LangGraph state workflow.
    """
    initial_state = {
        "messages": [{"role": "user", "content": user_query}],
        "next_agent": "general",
        "active_agent": "general",
        "response": "",
        "citations": []
    }
    
    result = multi_agent_graph.invoke(initial_state)
    return {
        "agent": result.get("active_agent", "general"),
        "response": result.get("response", ""),
        "citations": result.get("citations", [])
    }
