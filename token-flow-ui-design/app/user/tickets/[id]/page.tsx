'use client';

import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { Ticket, User, TimelineEvent } from '@/types';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Send, User as UserIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function TicketDetailPage() {
    const params = useParams();
    // Ensure id is always a string
    const idValue = Array.isArray(params.id) ? params.id[0] : params.id;
    const id = idValue || '';
    const router = useRouter();
    const { toast } = useToast();

    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [reply, setReply] = useState('');
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        const session = localStorage.getItem('token_system_session');
        if (session) {
            setCurrentUser(JSON.parse(session).user);
        }
    }, []);

    useEffect(() => {
        if (id) {
            api.getTicketById(id).then(setTicket);
        }
    }, [id]);

    const handleReply = async () => {
        if (!reply.trim() || !ticket || !currentUser) return;
        setIsSending(true);
        try {
            const updated = await api.addReply(ticket.id, reply, currentUser);
            setTicket(updated);
            setReply('');
            toast({ title: "Reply sent" });
        } catch (e) {
            toast({ variant: "destructive", title: "Failed to send reply" });
        } finally {
            setIsSending(false);
        }
    };

    if (!ticket || !currentUser) return <AppLayout><div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div></AppLayout>;

    return (
        <AppLayout>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Ticket Info & Timeline */}
                <div className="md:col-span-2 space-y-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-mono text-muted-foreground">{ticket.id}</span>
                                <StatusBadge status={ticket.priority} type="priority" />
                            </div>
                            <h1 className="text-2xl font-bold">{ticket.title}</h1>
                        </div>
                        <StatusBadge status={ticket.status} className="text-sm px-3 py-1" />
                    </div>

                    <Card className="shadow-none border-border bg-card">
                        <CardHeader>
                            <CardTitle className="text-base">Description</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-foreground/80 whitespace-pre-wrap">
                            {ticket.description}
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Activity</h3>
                        <div className="space-y-4 pl-4 border-l-2 border-muted">
                            {ticket.timeline.map((event) => (
                                <div key={event.id} className="relative pl-6 pb-2">
                                    <div className="absolute -left-[29px] top-0 bg-background border rounded-full p-1">
                                        <UserIcon className="h-3 w-3 text-muted-foreground" />
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-sm">{event.actor.name}</span>
                                            <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(event.at))} ago</span>
                                        </div>
                                        <p className="text-sm mt-1">{event.message}</p>
                                        {event.type === 'STATUS_CHANGED' && <span className="text-xs text-muted-foreground italic mt-0.5">Changed status</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Card className="shadow-none border-border">
                        <CardContent className="pt-6">
                            <Textarea
                                placeholder="Type your reply here..."
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                className="mb-4"
                            />
                            <div className="flex justify-end">
                                <Button onClick={handleReply} disabled={isSending || !reply.trim()}>
                                    {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    <Send className="mr-2 h-4 w-4" />
                                    Send Reply
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Metadata */}
                <div className="space-y-6">
                    <Card className="shadow-none border-border">
                        <CardHeader>
                            <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Properties</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div>
                                <span className="block text-muted-foreground text-xs">Category</span>
                                <span className="font-medium">{ticket.category}</span>
                            </div>
                            <Separator />
                            <div>
                                <span className="block text-muted-foreground text-xs">Assignee</span>
                                <span className="font-medium">{ticket.assignedTo?.name || 'Unassigned'}</span>
                            </div>
                            <Separator />
                            <div>
                                <span className="block text-muted-foreground text-xs">Created By</span>
                                <span className="font-medium">{ticket.createdBy.name}</span>
                                <div className="text-xs text-muted-foreground">{ticket.createdBy.email}</div>
                                <div className="text-xs text-muted-foreground">{ticket.createdBy.department}</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
