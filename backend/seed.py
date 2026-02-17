from app import app, db
from models import User, Ticket, TimelineEvent
import random

def seed():
    with app.app_context():
        db.drop_all()
        db.create_all()
        
        print("Creating Users...")
        u1 = User(id="u1", name="Alice Employee", email="alice@corp.com", department="Sales", role="user")
        u2 = User(id="u2", name="Bob Engineer", email="bob@corp.com", department="Engineering", role="user")
        a1 = User(id="a1", name="Charlie Admin", email="charlie@corp.com", department="IT Support", role="admin")
        a2 = User(id="a2", name="Diana Admin", email="diana@corp.com", department="IT Support", role="admin")
        
        db.session.add_all([u1, u2, a1, a2])
        db.session.commit()
        
        print("Creating Tickets...")
        categories = ['Laptop', 'Network', 'Software', 'Access', 'Other']
        priorities = ['Low', 'Medium', 'High', 'Critical']
        statuses = ['Open', 'In Progress', 'Waiting for User', 'Resolved', 'Closed']
        
        tickets = []
        for i in range(15):
            creator = u1 if i % 2 == 0 else u2
            t = Ticket(
                id=f"IT-2026-{100+i}",
                title=f"Issue with {random.choice(categories)} - {i}",
                description="This is a generated ticket description. Please help.",
                category=random.choice(categories),
                priority=random.choice(priorities),
                status=random.choice(statuses),
                user_id=creator.id,
                assigned_to_id=a1.id if i % 3 == 0 else None
            )
            
            # Initial event
            evt = TimelineEvent(
                type='CREATED',
                message='Ticket created',
                actor_name=creator.name,
                actor_role=creator.role
            )
            t.timeline_events.append(evt)
            tickets.append(t)
            
        db.session.add_all(tickets)
        db.session.commit()
        print("Database seeded successfully!")

if __name__ == '__main__':
    seed()
