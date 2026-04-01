import axios from 'axios';
import { clearAuthSession, getAuthSession, refreshAuthSession } from './auth';
import { router } from 'expo-router';
import { ApiError } from '@/types/api';

export const API_URL = 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

//we add custom values to axios requests
declare module 'axios' {
    export interface AxiosRequestConfig {
        skipAuth?: boolean;
        skipErrorHandling?: boolean;
    }

    export interface InternalAxiosRequestConfig {
        skipAuth?: boolean;
        skipErrorHandling?: boolean;
    }
}

api.interceptors.request.use(
    async (config) => {
        if (config.skipAuth) {
            return config;
        }

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

        return response;
    },
    async (error) => {
        const originalRequest = error.config

        if (originalRequest.skipErrorHandling) {
            return Promise.reject(error);
        }

        const errorData = error.response?.data as ApiError | null | undefined

        if (errorData && errorData.status === 401) {
            const isAuthRoute = originalRequest.url?.startsWith('/auth');

            if (!originalRequest._retry && !isAuthRoute) {
                originalRequest._retry = true

                const newSession = await refreshAuthSession()

                if (!newSession) {
                    console.log('401 Unauthorized detected on protected route. Logging out after trying to refresh.');
                    router.replace('/login');
                } else {
                    console.log("Rerunning the api request after refreshing the session successfully");

                    originalRequest.headers.Authorization = `Bearer ${newSession.access_token}`;
                    return api(originalRequest);
                }
            }
            else if (!isAuthRoute) {
                console.log('401 Unauthorized detected on protected route. Logging out.');

                await clearAuthSession();

                router.replace('/login');
            }
        }

        return Promise.reject(error);
    }
);


export default api;