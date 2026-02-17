'use client';

import { AppLayout } from '@/components/AppLayout';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Ticket, User } from '@/types';
import { TicketTable } from '@/components/TicketTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function UserTicketListPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const session = localStorage.getItem('token_system_session');
        if (session) {
            const user: User = JSON.parse(session).user;
            api.getUserTickets(user.userId).then((data) => {
                setTickets(data);
                setIsLoading(false);
            });
        }
    }, []);

    return (
        <AppLayout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">My Tickets</h2>
                        <p className="text-muted-foreground">View and manage your support requests.</p>
                    </div>
                    <Link href="/user/tickets/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Ticket
                        </Button>
                    </Link>
                </div>
                {isLoading ? <div>Loading...</div> : <TicketTable tickets={tickets} role="user" />}
            </div>
        </AppLayout>
    );
}
