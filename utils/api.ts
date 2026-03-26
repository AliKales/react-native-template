import axios from 'axios';
import { clearAuthSession, getAuthSession } from './auth';
import { router } from 'expo-router';

export const API_URL = 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        // This runs before EVERY request made with this 'api' instance.
        const session = await getAuthSession();

        if (session && session.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        // Any status code that lies within the range of 2xx triggers this function.
        // Just pass the successful response down to the component.
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401) {
            const isAuthRoute = originalRequest.url?.startsWith('/auth');

            if (!isAuthRoute) {
                console.log('401 Unauthorized detected on protected route. Logging out.');

                await clearAuthSession();

                router.replace('/login');
            }
        }

        return Promise.reject(error);
    }
);

export default api;