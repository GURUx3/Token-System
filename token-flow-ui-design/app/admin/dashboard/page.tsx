'use client';

import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, AlertTriangle, CheckSquare, Inbox } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Ticket } from '@/types';
import { TicketTable } from '@/components/TicketTable';

export default function AdminDashboard() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.getAllTickets().then((data) => {
            setTickets(data);
            setIsLoading(false);
        });
    }, []);

    const newTickets = tickets.filter(t => t.status === 'Open').length;
    const unassignedTickets = tickets.filter(t => !t.assignedTo && t.status !== 'Closed' && t.status !== 'Resolved').length;
    const criticalTickets = tickets.filter(t => t.priority === 'Critical' && t.status !== 'Closed').length;

    return (
        <AppLayout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
                        <p className="text-muted-foreground">System-wide overview and ticket management.</p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="shadow-none border-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">New Tickets</CardTitle>
                            <Inbox className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{newTickets}</div>
                            <p className="text-xs text-muted-foreground">Requires triage</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-none border-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Unassigned</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{unassignedTickets}</div>
                            <p className="text-xs text-muted-foreground">Pending assignment</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-none border-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Critical</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-destructive">{criticalTickets}</div>
                            <p className="text-xs text-muted-foreground">High priority issues</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-none border-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Active</CardTitle>
                            <CheckSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{tickets.length}</div>
                            <p className="text-xs text-muted-foreground">Tickets in system</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Ticket Queue Preview</h3>
                    {isLoading ? <div>Loading...</div> : <TicketTable tickets={tickets.slice(0, 10)} role="admin" />}
                    <div className="flex justify-end">
                        <Link href="/admin/tickets">
                            <Button variant="ghost" size="sm">View Full Queue &rarr;</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
