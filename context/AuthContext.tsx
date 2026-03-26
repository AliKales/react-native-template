import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthSession, clearAuthSession, getAuthSession, saveAuthSession } from '../utils/auth';

interface AuthContextType {
    session: AuthSession | null;
    isLoading: boolean;
    signIn: (sessionData: AuthSession) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<AuthSession | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadSession = async () => {
            const existingSession = await getAuthSession();
            setSession(existingSession);
            setIsLoading(false);
        };

        loadSession();
    }, []);

    const signIn = async (sessionData: AuthSession) => {
        await saveAuthSession(sessionData);
        setSession(sessionData);
    };

    const signOut = async () => {
        await clearAuthSession();
        setSession(null);
    };

    return (
        <AuthContext.Provider value={{ session, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}