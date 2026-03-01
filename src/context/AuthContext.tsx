"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    role: string | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const syncUser = async (user: User) => {
        try {
            const res = await fetch("/api/auth/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    email: user.email,
                    name: user.user_metadata?.full_name || "Khách hàng",
                }),
            });
            if (res.ok) {
                const data = await res.json();
                setRole(data.role);
            }
        } catch (error) {
            console.error("Auth sync failed:", error);
        }
    };

    useEffect(() => {
        const setData = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            if (session?.user) {
                setUser(session.user);
                await syncUser(session.user);
            } else {
                setUser(null);
                setRole(null);
            }
            setLoading(false);
        };

        const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                setUser(session.user);
                await syncUser(session.user);
            } else {
                setUser(null);
                setRole(null);
            }
            setLoading(false);
        });

        setData();

        return () => {
            listener?.subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setRole(null);
        router.push("/");
    };

    return (
        <AuthContext.Provider value={{ user, role, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
