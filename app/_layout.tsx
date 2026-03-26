import { Stack, useGlobalSearchParams, usePathname, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { WebSocketProvider } from '@/context/WebSocketContext';
import React from 'react';
import { COLORS } from '../constants/theme';
import { AuthProvider, useAuth } from '../context/AuthContext';


function RootLayoutNav() {
  const { colors } = useTheme();
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const params = useGlobalSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    const inTabsGroup = segments[0] === '(tabs)';

    if (pathname === '/verify' && params.verificationType === 'deleteAccount') {
      return; // Stop executing! Don't run any of the redirect logic below.
    }

    if (!session && inTabsGroup) {
      router.replace('/login');
    } else if (session && !inTabsGroup) {
      router.replace('/(tabs)');
    }
  }, [session, isLoading, segments, params, pathname]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="verify" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WebSocketProvider>
          <RootLayoutNav />
        </WebSocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}