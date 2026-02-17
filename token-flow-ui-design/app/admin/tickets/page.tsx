'use client';

import { AppLayout } from '@/components/AppLayout';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Ticket } from '@/types';
import { TicketTable } from '@/components/TicketTable';
import { Button } from '@/components/ui/button';
import { Download, SlidersHorizontal } from 'lucide-react';

export default function AdminTicketListPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.getAllTickets().then((data) => {
            setTickets(data);
            setIsLoading(false);
        });
    }, []);

    return (
        <AppLayout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Ticket Queue</h2>
                        <p className="text-muted-foreground">Manage and assign incoming support requests.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Export CSV
                        </Button>
                        <Button variant="outline" size="sm">
                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                            Advanced Filters
                        </Button>
                    </div>
                </div>
                {isLoading ? <div>Loading...</div> : <TicketTable tickets={tickets} role="admin" />}
            </div>
        </AppLayout>
    );
}
