from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, User, Ticket, TimelineEvent
import os
import random
from datetime import datetime

app = Flask(__name__)
# Allow CORS for localhost:3000 (Next.js)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///token_system.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    role = data.get('role')
    # Simplified Login: Return the first user with that role
    # In production, this would verify password
    user = User.query.filter_by(role=role).first()
    if user:
        return jsonify(user.to_dict())
    return jsonify({"error": "No user found for this role"}), 401

@app.route('/api/tickets', methods=['GET'])
def get_tickets():
    user_id = request.args.get('userId')
    if user_id:
        tickets = Ticket.query.filter_by(user_id=user_id).order_by(Ticket.created_at.desc()).all()
    else:
        tickets = Ticket.query.order_by(Ticket.created_at.desc()).all()
    return jsonify([t.to_dict() for t in tickets])

@app.route('/api/tickets/<ticket_id>', methods=['GET'])
def get_ticket(ticket_id):
    ticket = Ticket.query.get(ticket_id)
    if ticket:
        return jsonify(ticket.to_dict())
    return jsonify({"error": "Ticket not found"}), 404

@app.route('/api/tickets', methods=['POST'])
def create_ticket():
    data = request.json
    user_data = data.get('user') # Expecting full user object or at least ID from frontend
    
    if not user_data:
        return jsonify({"error": "User info required"}), 400

    new_id = f"IT-2026-{random.randint(1000, 9999)}"
    
    ticket = Ticket(
        id=new_id,
        title=data['title'],
        description=data['description'],
        category=data['category'],
        priority=data['priority'],
        status='Open',
        user_id=user_data['userId']
    )
    
    # Create initial event
    event = TimelineEvent(
        type='CREATED',
        message='Ticket created',
        actor_name=user_data['name'],
        actor_role=user_data['role']
    )
    
    ticket.timeline_events.append(event)
    
    db.session.add(ticket)
    db.session.commit()
    
    return jsonify(ticket.to_dict()), 201

@app.route('/api/tickets/<ticket_id>/status', methods=['PATCH'])
def update_status(ticket_id):
    data = request.json
    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify({"error": "Ticket not found"}), 404
        
    old_status = ticket.status
    new_status = data['status']
    admin_name = data.get('adminName', 'System')
    
    ticket.status = new_status
    
    event = TimelineEvent(
        type='STATUS_CHANGED',
        message=f'Status changed from {old_status} to {new_status}',
        actor_name=admin_name,
        actor_role='admin'
    )
    ticket.timeline_events.append(event)
    
    db.session.commit()
    return jsonify(ticket.to_dict())

@app.route('/api/tickets/<ticket_id>/assign', methods=['PATCH'])
def assign_ticket(ticket_id):
    data = request.json
    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify({"error": "Ticket not found"}), 404
        
    admin_id = data['adminId']
    admin_name = data['adminName']
    
    ticket.assigned_to_id = admin_id
    
    event = TimelineEvent(
        type='ASSIGNED',
        message=f'Assigned to {admin_name}',
        actor_name=admin_name, # Admin assigning themselves
        actor_role='admin'
    )
    ticket.timeline_events.append(event)
    
    db.session.commit()
    return jsonify(ticket.to_dict())

@app.route('/api/tickets/<ticket_id>/reply', methods=['POST'])
def add_reply(ticket_id):
    data = request.json
    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify({"error": "Ticket not found"}), 404
        
    is_internal = data.get('isInternal', False)
    user = data.get('user')
    
    event_type = 'INTERNAL_NOTE' if is_internal else 'PUBLIC_REPLY'
    
    event = TimelineEvent(
        type=event_type,
        message=data['message'],
        actor_name=user['name'],
        actor_role=user['role']
    )
    ticket.timeline_events.append(event)
    
    db.session.commit()
    return jsonify(ticket.to_dict())

if __name__ == '__main__':
    with app.app_context():
        # Auto-create DB if not exists (simplistic migration)
        db.create_all()
    app.run(debug=True, port=5000)
