'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { api } from '@/lib/api';
import { Role } from '@/types';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedRole, setSelectedRole] = useState<Role>('user');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const user = await api.login(selectedRole);

            // Mock Session Persistence
            localStorage.setItem('token_system_session', JSON.stringify({
                token: 'mock-jwt-token',
                user: user
            }));

            toast({
                title: "Welcome back",
                description: `Logged in as ${user.name} (${user.role})`,
            });

            router.push(`/${user.role}/dashboard`);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Login failed",
                description: "Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid items-center justify-center bg-secondary/30">
            <div className="w-full max-w-md space-y-4">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">TokenSys Helpdesk</h1>
                    <p className="text-muted-foreground">Sign in to manage your tickets</p>
                </div>

                <Card className="border-border/50 shadow-none">
                    <CardHeader>
                        <CardTitle>Sign In</CardTitle>
                        <CardDescription>Select your role to continue.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="flex gap-4">
                                <Button
                                    type="button"
                                    variant={selectedRole === 'user' ? 'default' : 'outline'}
                                    className="flex-1"
                                    onClick={() => setSelectedRole('user')}
                                >
                                    Employee
                                </Button>
                                <Button
                                    type="button"
                                    variant={selectedRole === 'admin' ? 'default' : 'outline'}
                                    className="flex-1"
                                    onClick={() => setSelectedRole('admin')}
                                >
                                    Admin / IT
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    placeholder={selectedRole === 'user' ? "user@corp.com" : "admin@corp.com"}
                                    disabled
                                    value={selectedRole === 'user' ? "user@employee.com" : "admin@sysadmin.com"}
                                />
                                <p className="text-[10px] text-muted-foreground">Password is disabled for prototype demo.</p>
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Continue to Portal
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="justify-center border-t py-4">
                        <p className="text-xs text-muted-foreground">Restricted Access. Authorized Personnel Only.</p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
