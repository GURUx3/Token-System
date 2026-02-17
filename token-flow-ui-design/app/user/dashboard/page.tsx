'use client';

import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Ticket } from '@/types';
import { TicketTable } from '@/components/TicketTable';
import { User } from '@/types';

export default function UserDashboard() {
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

    const openTickets = tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;
    const resolvedTickets = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;
    const waitingTickets = tickets.filter(t => t.status === 'Waiting for User').length;

    return (
        <AppLayout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                        <p className="text-muted-foreground">Overview of your support requests.</p>
                    </div>
                    <Link href="/user/tickets/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Ticket
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="shadow-none border-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Open Requests</CardTitle>
                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{openTickets}</div>
                            <p className="text-xs text-muted-foreground">Active issues needing attention</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-none border-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Waiting for Response</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{waitingTickets}</div>
                            <p className="text-xs text-muted-foreground">Tickets waiting for your reply</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-none border-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{resolvedTickets}</div>
                            <p className="text-xs text-muted-foreground">Successfully closed tickets</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Recent Activity</h3>
                    {isLoading ? <div>Loading...</div> : <TicketTable tickets={tickets.slice(0, 5)} role="user" />}
                    <div className="flex justify-end">
                        <Link href="/user/tickets">
                            <Button variant="ghost" size="sm">View all tickets &rarr;</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
