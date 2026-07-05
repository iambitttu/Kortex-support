import datetime
from sqlalchemy import create_base, Column, String, Integer, Boolean, DateTime, Text, ForeignKey, create_engine
from sqlalchemy.orm import declarative_base, relationship, sessionmaker

Base = declarative_base()

class Organization(Base):
    __tablename__ = "organizations"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    users = relationship("User", back_populates="organization")
    tickets = relationship("Ticket", back_populates="organization")

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name = Column(String)
    role = Column(String, default="Agent")  # Admin, Agent, Supervisor
    org_id = Column(String, ForeignKey("organizations.id"))
    
    organization = relationship("Organization", back_populates="users")

class Customer(Base):
    __tablename__ = "customers"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    company = Column(String)
    plan = Column(String, default="Starter")  # Starter, Growth, Enterprise
    language = Column(String, default="English")
    priority = Column(Boolean, default=False)
    order_number = Column(String, nullable=True)
    order_status = Column(String, nullable=True)
    order_total = Column(String, nullable=True)
    refund_eligible = Column(Boolean, default=False)

class Ticket(Base):
    __tablename__ = "tickets"
    
    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True)
    customer_name = Column(String)
    customer_email = Column(String)
    priority = Column(String, default="Medium")  # Low, Medium, High, Critical
    status = Column(String, default="Open")  # Open, Pending, Waiting, Resolved, Closed
    assigned_agent = Column(String, default="General Support Agent")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    sla_minutes = Column(Integer, default=120)
    sentiment = Column(String, default="Neutral")
    description = Column(Text)
    ai_summary = Column(Text, nullable=True)
    ai_suggested_reply = Column(Text, nullable=True)
    org_id = Column(String, ForeignKey("organizations.id"))
    
    organization = relationship("Organization", back_populates="tickets")

class KnowledgeDoc(Base):
    __tablename__ = "knowledge_docs"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    type = Column(String)  # PDF, DOCX, TXT, CSV, URL
    size = Column(String)
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)
    chunk_count = Column(Integer, default=0)
    status = Column(String, default="Indexed")  # Indexed, Processing
    source = Column(String, default="Upload")

class Workflow(Base):
    __tablename__ = "workflows"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    active = Column(Boolean, default=True)
    nodes_json = Column(Text)  # Serialized list of nodes
    connections_json = Column(Text)  # Serialized connections mapper

# Database Helpers
DATABASE_URL = "sqlite:///./support_platform.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)
