'use client';

import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/api';
import { Ticket, User, TimelineEvent, TicketStatus } from '@/types';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Send, User as UserIcon, Loader2, Lock, Shield } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminTicketDetailPage() {
    const params = useParams();
    const idValue = Array.isArray(params.id) ? params.id[0] : params.id;
    const id = idValue || '';
    const router = useRouter();
    const { toast } = useToast();

    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [reply, setReply] = useState('');
    const [note, setNote] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [activeTab, setActiveTab] = useState('reply');

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

    const handleStatusChange = async (newStatus: TicketStatus) => {
        if (!ticket || !currentUser) return;
        try {
            const updated = await api.adminChangeStatus(ticket.id, newStatus, currentUser.name);
            setTicket(updated);
            toast({ title: "Status updated" });
        } catch (e) {
            toast({ variant: "destructive", title: "Update failed" });
        }
    };

    const handleAssign = async () => {
        if (!ticket || !currentUser) return;
        // Mock assigning to self for prototype
        try {
            const updated = await api.adminAssign(ticket.id, currentUser.userId, currentUser.name);
            setTicket(updated);
            toast({ title: "Ticket assigned to you" });
        } catch (e) {
            toast({ variant: "destructive", title: "Assignment failed" });
        }
    };

    const handleSend = async (isInternal: boolean) => {
        const text = isInternal ? note : reply;
        if (!text.trim() || !ticket || !currentUser) return;

        setIsSending(true);
        try {
            const updated = await api.addReply(ticket.id, text, currentUser, isInternal);
            setTicket(updated);
            if (isInternal) setNote(''); else setReply('');
            toast({ title: isInternal ? "Internal note added" : "Reply sent" });
        } catch (e) {
            toast({ variant: "destructive", title: "Failed to send" });
        } finally {
            setIsSending(false);
        }
    };

    if (!ticket || !currentUser) return <AppLayout><div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div></AppLayout>;

    return (
        <AppLayout>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-mono text-muted-foreground">{ticket.id}</span>
                                <StatusBadge status={ticket.priority} type="priority" />
                            </div>
                            <h1 className="text-2xl font-bold">{ticket.title}</h1>
                        </div>
                        <Select value={ticket.status} onValueChange={(v) => handleStatusChange(v as TicketStatus)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Open">Open</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Waiting for User">Waiting for User</SelectItem>
                                <SelectItem value="Resolved">Resolved</SelectItem>
                                <SelectItem value="Closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Card className="shadow-none border-border">
                        <CardHeader>
                            <CardTitle className="text-muted-foreground uppercase tracking-wider text-xs">Original Request</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                            {ticket.description}
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Activity Timeline</h3>
                        <div className="space-y-6 pl-4 border-l-2 border-muted">
                            {ticket.timeline.map((event) => (
                                <div key={event.id} className="relative pl-6">
                                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border bg-background flex items-center justify-center ${event.type === 'INTERNAL_NOTE' ? 'border-amber-500 text-amber-500' : 'border-muted-foreground'}`}>
                                        {event.type === 'INTERNAL_NOTE' ? <Lock className="h-2 w-2" /> : <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />}
                                    </div>
                                    <div className={`p-3 rounded-lg border text-sm ${event.type === 'INTERNAL_NOTE' ? 'bg-amber-50/50 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900' : 'bg-card'}`}>
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">{event.actor.name}</span>
                                                {event.type === 'INTERNAL_NOTE' && <span className="text-[10px] font-bold text-amber-600 border border-amber-200 bg-amber-50 px-1 rounded uppercase">Internal Note</span>}
                                            </div>
                                            <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(event.at))} ago</span>
                                        </div>
                                        <p className="text-foreground/90">{event.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Card className="shadow-none border-border">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <div className="px-6 pt-6">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="reply">Public Reply</TabsTrigger>
                                    <TabsTrigger value="note" className="text-amber-600 data-[state=active]:text-amber-700">Internal Note</TabsTrigger>
                                </TabsList>
                            </div>
                            <CardContent className="pt-4">
                                <TabsContent value="reply" className="mt-0 space-y-4">
                                    <Textarea
                                        placeholder="Type a public reply to the customer..."
                                        value={reply}
                                        onChange={(e) => setReply(e.target.value)}
                                        className="min-h-[100px]"
                                    />
                                    <div className="flex justify-end">
                                        <Button onClick={() => handleSend(false)} disabled={isSending || !reply.trim()}>
                                            {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Send Reply
                                        </Button>
                                    </div>
                                </TabsContent>
                                <TabsContent value="note" className="mt-0 space-y-4">
                                    <div className="bg-amber-50/50 p-3 text-xs text-amber-700 border border-amber-100 rounded mb-2 flex items-center gap-2">
                                        <Lock className="h-3 w-3" />
                                        Visible only to other admins.
                                    </div>
                                    <Textarea
                                        placeholder="Add an internal note..."
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        className="min-h-[100px] border-amber-200 focus-visible:ring-amber-500/20"
                                    />
                                    <div className="flex justify-end">
                                        <Button onClick={() => handleSend(true)} disabled={isSending || !note.trim()} variant="secondary" className="bg-amber-100 text-amber-900 hover:bg-amber-200">
                                            {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Add Internal Note
                                        </Button>
                                    </div>
                                </TabsContent>
                            </CardContent>
                        </Tabs>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="shadow-none border-border">
                        <CardHeader>
                            <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Admin Controls</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <span className="text-sm font-medium">Assignee</span>
                                {ticket.assignedTo ? (
                                    <div className="flex items-center gap-2 p-2 border rounded bg-secondary/50">
                                        <Shield className="h-4 w-4 text-primary" />
                                        <span className="text-sm">{ticket.assignedTo.name}</span>
                                    </div>
                                ) : (
                                    <Button variant="outline" className="w-full justify-start" onClick={handleAssign}>
                                        <PlusIcon className="mr-2 h-4 w-4" />
                                        Assign to Me
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-none border-border">
                        <CardHeader>
                            <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">User Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {ticket.createdBy.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-medium">{ticket.createdBy.name}</div>
                                    <div className="text-xs text-muted-foreground">{ticket.createdBy.email}</div>
                                </div>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <span className="text-muted-foreground block">Department</span>
                                    <span>{ticket.createdBy.department}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">Role</span>
                                    <span className="capitalize">{ticket.createdBy.role}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout >
    );
}

function PlusIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}
