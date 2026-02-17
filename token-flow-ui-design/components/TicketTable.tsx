'use client';

import { Ticket, TicketStatus, TicketPriority } from "@/types";
import { format } from "date-fns";
import { StatusBadge } from "./StatusBadge";
import { ArrowUpDown, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface TicketTableProps {
    tickets: Ticket[];
    role: 'user' | 'admin';
}

export function TicketTable({ tickets, role }: TicketTableProps) {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<TicketStatus | "All">("All");

    const filteredTickets = tickets.filter((ticket) => {
        const matchesSearch =
            ticket.title.toLowerCase().includes(search.toLowerCase()) ||
            ticket.id.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "All" || ticket.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleRowClick = (id: string) => {
        router.push(`/${role}/tickets/${id}`);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search tickets..."
                        className="pl-9 bg-background"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                    {(['All', 'Open', 'In Progress', 'Resolved'] as const).map((status) => (
                        <Button
                            key={status}
                            variant={statusFilter === status ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setStatusFilter(status)}
                            className="whitespace-nowrap"
                        >
                            {status}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead className="w-[120px]">Status</TableHead>
                            <TableHead className="w-[100px]">Priority</TableHead>
                            <TableHead className="w-[150px]">Created</TableHead>
                            {role === 'admin' && <TableHead className="w-[150px]">User</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTickets.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={role === 'admin' ? 6 : 5} className="h-24 text-center">
                                    No tickets found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredTickets.map((ticket) => (
                                <TableRow
                                    key={ticket.id}
                                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                                    onClick={() => handleRowClick(ticket.id)}
                                >
                                    <TableCell className="font-mono text-xs text-muted-foreground">{ticket.id}</TableCell>
                                    <TableCell>
                                        <div className="font-medium text-sm">{ticket.title}</div>
                                        <div className="text-xs text-muted-foreground md:hidden">{format(new Date(ticket.createdAt), "MMM d, yyyy")}</div>
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={ticket.status} />
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={ticket.priority} type="priority" />
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {format(new Date(ticket.createdAt), "MMM d, yyyy")}
                                    </TableCell>
                                    {role === 'admin' && (
                                        <TableCell className="text-xs">
                                            <div className="flex flex-col">
                                                <span>{ticket.createdBy.name}</span>
                                                <span className="text-muted-foreground">{ticket.createdBy.department}</span>
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
