'use client';

import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { User, TicketCategory, TicketPriority } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function NewTicketPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<TicketCategory>('Other');
    const [priority, setPriority] = useState<TicketPriority>('Low');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const session = localStorage.getItem('token_system_session');
            if (!session) throw new Error("Not authenticated");
            const user: User = JSON.parse(session).user;

            await api.createTicket({
                title,
                category,
                priority,
                description
            }, user);

            toast({
                title: "Ticket Created",
                description: "Support team has been notified.",
            });

            router.push('/user/tickets');
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to create ticket.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold tracking-tight">Create New Ticket</h2>
                    <p className="text-muted-foreground">Describe your issue and we'll help you resolve it.</p>
                </div>

                <Card className="shadow-none border-border">
                    <CardHeader>
                        <CardTitle>Ticket Details</CardTitle>
                        <CardDescription>Please provide as much information as possible.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Subject</Label>
                                <Input
                                    id="title"
                                    placeholder="Brief summary of the issue"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select value={category} onValueChange={(v) => setCategory(v as TicketCategory)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Laptop">Laptop / Hardware</SelectItem>
                                            <SelectItem value="Network">Network / VPN</SelectItem>
                                            <SelectItem value="Software">Software / License</SelectItem>
                                            <SelectItem value="Access">Access / Permissions</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Priority</Label>
                                    <Select value={priority} onValueChange={(v) => setPriority(v as TicketPriority)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Low">Low</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="High">High</SelectItem>
                                            <SelectItem value="Critical">Critical</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Detailed explanation of the problem..."
                                    className="min-h-[150px]"
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Submit Ticket
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
