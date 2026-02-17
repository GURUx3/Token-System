import { Ticket, User, TicketStatus, TicketPriority, TicketCategory, TimelineEvent, Role, TimelineEventType } from '@/types';

const API_BASE = 'http://127.0.0.1:5000/api';

async function fetchJson(endpoint: string, options: RequestInit = {}) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!res.ok) {
        throw new Error(`API Error: ${res.statusText}`);
    }

    return res.json();
}

export const api = {
    login: async (role: Role): Promise<User> => {
        return fetchJson('/login', {
            method: 'POST',
            body: JSON.stringify({ role }),
        });
    },

    getAllTickets: async (): Promise<Ticket[]> => {
        return fetchJson('/tickets');
    },

    getUserTickets: async (userId: string): Promise<Ticket[]> => {
        return fetchJson(`/tickets?userId=${userId}`);
    },

    getTicketById: async (id: string): Promise<Ticket | null> => {
        return fetchJson(`/tickets/${id}`);
    },

    createTicket: async (payload: Pick<Ticket, 'title' | 'category' | 'priority' | 'description'>, user: User): Promise<Ticket> => {
        return fetchJson('/tickets', {
            method: 'POST',
            body: JSON.stringify({
                ...payload,
                user: user // Sending full user context for prototype
            }),
        });
    },

    adminAssign: async (ticketId: string, adminId: string, adminName: string): Promise<Ticket> => {
        return fetchJson(`/tickets/${ticketId}/assign`, {
            method: 'PATCH',
            body: JSON.stringify({ adminId, adminName }),
        });
    },

    adminChangeStatus: async (ticketId: string, status: TicketStatus, adminName: string): Promise<Ticket> => {
        return fetchJson(`/tickets/${ticketId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status, adminName }),
        });
    },

    addReply: async (ticketId: string, message: string, user: User, isInternal: boolean = false): Promise<Ticket> => {
        return fetchJson(`/tickets/${ticketId}/reply`, {
            method: 'POST',
            body: JSON.stringify({ message, user, isInternal }),
        });
    }
};
