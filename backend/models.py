from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    department = db.Column(db.String(100))
    role = db.Column(db.String(20)) # 'user' or 'admin'

    def to_dict(self):
        return {
            "userId": self.id,
            "name": self.name,
            "email": self.email,
            "department": self.department,
            "role": self.role
        }

class Ticket(db.Model):
    id = db.Column(db.String(50), primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50))
    priority = db.Column(db.String(20))
    status = db.Column(db.String(20), default='Open')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign Keys
    user_id = db.Column(db.String(50), db.ForeignKey('user.id'), nullable=False)
    assigned_to_id = db.Column(db.String(50), db.ForeignKey('user.id'), nullable=True)

    # Relationships
    created_by = db.relationship('User', foreign_keys=[user_id], backref='created_tickets')
    assigned_to = db.relationship('User', foreign_keys=[assigned_to_id], backref='assigned_tickets')
    timeline_events = db.relationship('TimelineEvent', backref='ticket', cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "category": self.category,
            "priority": self.priority,
            "status": self.status,
            "createdAt": self.created_at.isoformat(),
            "updatedAt": self.updated_at.isoformat(),
            "createdBy": self.created_by.to_dict(),
            "assignedTo": self.assigned_to.to_dict() if self.assigned_to else None,
            "attachments": [], # Placeholder for now
            "timeline": [e.to_dict() for e in self.timeline_events]
        }

class TimelineEvent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ticket_id = db.Column(db.String(50), db.ForeignKey('ticket.id'), nullable=False)
    type = db.Column(db.String(50)) # CREATED, ASSIGNED, STATUS_CHANGED, PUBLIC_REPLY, INTERNAL_NOTE
    message = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Actor info (denormalized for simplicity or linked to User)
    actor_name = db.Column(db.String(100))
    actor_role = db.Column(db.String(20))

    def to_dict(self):
        return {
            "id": str(self.id),
            "at": self.created_at.isoformat(),
            "type": self.type,
            "message": self.message,
            "actor": {
                "name": self.actor_name,
                "role": self.actor_role
            }
        }
