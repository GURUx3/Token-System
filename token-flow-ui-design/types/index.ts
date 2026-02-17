export type Role = 'user' | 'admin';

export type TicketStatus = 'Open' | 'In Progress' | 'Waiting for User' | 'Resolved' | 'Closed';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TicketCategory = 'Laptop' | 'Network' | 'Software' | 'Access' | 'Other';

export interface User {
    userId: string;
    name: string;
    email: string;
    department: string;
    role: Role;
}

export interface Attachment {
    name: string;
    url: string;
}

export type TimelineEventType = 'CREATED' | 'ASSIGNED' | 'STATUS_CHANGED' | 'PUBLIC_REPLY' | 'INTERNAL_NOTE';

export interface TimelineEvent {
    id: string;
    at: string; // ISO string
    type: TimelineEventType;
    message: string;
    actor: {
        role: Role;
        name: string;
    };
}

export interface Ticket {
    id: string; // e.g., IT-2026-000123
    title: string;
    description: string;
    category: TicketCategory;
    priority: TicketPriority;
    status: TicketStatus;
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
    createdBy: User;
    assignedTo: { adminId: string; name: string } | null;
    attachments: Attachment[];
    timeline: TimelineEvent[];
}

export interface AuthSession {
    token: string;
    user: User;
}
