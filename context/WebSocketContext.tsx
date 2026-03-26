import { API_URL } from '@/utils/api';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface WebSocketContextType {
    isConnected: boolean;
    lastMessage: any | null;
    sendMessage: (payload: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) throw new Error('useWebSocket must be used within a WebSocketProvider');
    return context;
};

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
    const { session } = useAuth();

    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<any | null>(null);

    useEffect(() => {
        if (!session?.access_token) {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            return;
        }

        socketRef.current = io(API_URL, {
            transports: ['websocket'], 
            auth: {
                token: session.access_token
            }
        });

        socketRef.current.on('connect', () => {
            setIsConnected(true);
        });

        socketRef.current.on('disconnect', () => {
            setIsConnected(false);
        });


        socketRef.current.on('message', (data) => {
            setLastMessage(data);
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [session?.access_token]);

    const sendMessage = (payload: any) => {
        if (socketRef.current && socketRef.current.connected) {
            socketRef.current.emit("message", payload);
        } else {
            console.warn('Cannot send message, Socket is not connected');
        }
    };

    return (
        <WebSocketContext.Provider value={{ isConnected, lastMessage, sendMessage }}>
            {children}
        </WebSocketContext.Provider>
    );
}