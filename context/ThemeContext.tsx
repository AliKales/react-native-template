import { COLORS } from '@/constants/theme';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

export type ThemePreference = 'system' | 'light' | 'dark';
type ActiveTheme = 'light' | 'dark';

interface ThemeContextType {
    themePreference: ThemePreference;
    activeTheme: ActiveTheme;
    setTheme: (theme: ThemePreference) => Promise<void>;
    colors: typeof COLORS.light;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const systemColorScheme = useSystemColorScheme();

    const [themePreference, setThemePreference] = useState<ThemePreference>('system');
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await SecureStore.getItemAsync('hablo_theme');
                if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
                    setThemePreference(savedTheme);
                }
            } catch (error) {
                console.error('Failed to load theme:', error);
            } finally {
                setIsReady(true);
            }
        };
        loadTheme();
    }, []);

    const setTheme = async (newTheme: ThemePreference) => {
        setThemePreference(newTheme);
        await SecureStore.setItemAsync('hablo_theme', newTheme);
    };

    const activeTheme: ActiveTheme =
        themePreference === 'system'
            ? (systemColorScheme === 'dark' ? 'dark' : 'light')
            : themePreference;

    const isDark = activeTheme === 'dark';
    const colors = isDark ? COLORS.dark : COLORS.light;

    if (!isReady) return null;

    return (
        <ThemeContext.Provider value={{ themePreference, activeTheme, setTheme, colors, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
}