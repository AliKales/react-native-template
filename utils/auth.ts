import { APP_CONFIG } from '@/constants/theme';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { modifyDate } from './date-utils';

export interface AuthSession {
    access_token: string;
    refresh_token: string;
    refresh_token_expires_at: string;
    access_token_expires_at: string;
    user_id: string;
    email: string
}

function getKey() {
    return `${APP_CONFIG.name} session`.toLocaleLowerCase().replaceAll(" ", "_")
}

const API_URL = 'http://localhost:3000';

export async function saveAuthSession(session: AuthSession) {
    try {
        await SecureStore.setItemAsync(getKey(), JSON.stringify(session));
    } catch (error) {
        console.error('Error saving auth session:', error);
    }
}

export async function getAuthSession(): Promise<AuthSession | null> {
    try {
        const sessionString = await SecureStore.getItemAsync(getKey());
        if (!sessionString) return null
        const session = JSON.parse(sessionString) as AuthSession

        const now = new Date()
        
        const sessionDate = modifyDate(new Date(session.access_token_expires_at), -2, 'minute')

        if (now < sessionDate) {            
            return session
        }

        if (now > new Date(session.refresh_token_expires_at)) {
            router.replace("/login")

            return null;
        }

        const response = await fetch(`${API_URL}/auth/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: session.refresh_token }),
        });

        if (response.ok) {
            const body = await response.json()
            await saveAuthSession(body.token)
            return body as AuthSession
        }

        router.replace("/login")

        return null;
    } catch (error) {
        router.replace("/login")
        console.error(error)

        await clearAuthSession()

        return null;
    }
}

// Clear the session (for logging out)
export async function clearAuthSession() {
    try {
        await SecureStore.deleteItemAsync(getKey());
    } catch (error) {
        console.error('Error clearing auth session:', error);
    }
}