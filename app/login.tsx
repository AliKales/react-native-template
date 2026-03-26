import CustomButton from '@/components/custom-button';
import CustomTextInput from '@/components/custom-text-input';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { ApiError, ApiErrorCode } from '@/types/api';
import api from '@/utils/api';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { VerifyPageType } from './verify';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { signIn } = useAuth();

    const { colors } = useTheme();

    const handleLogin = async () => {
        try {
            setIsLoading(true);

            const response = await api.post('/auth/login', {
                email,
                password
            });

            await signIn(response.data.token)
        } catch (error: any) {
            if (error.response) {
                const errorData = error.response.data as ApiError;

                if (errorData.code === ApiErrorCode.EMAIL_NOT_VERIFIED) {
                    router.push({ pathname: '/verify', params: { email, verificationType: 'email' as VerifyPageType } });
                    return;
                }

                Alert.alert('Error', errorData.message);
            } else {
                console.error(error);
                Alert.alert('Network Error', 'Could not connect to the server.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>

            <CustomTextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />
            <CustomTextInput
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                marginBottom={0}
            />

            <CustomButton
                title='Forgot password?'
                variant='text'
                containerStyle={{
                    width: "auto",
                    alignSelf: "flex-end"
                }}
                onPress={() => router.push({ pathname: '/verify', params: { email: '', verificationType: 'forgotPassword' as VerifyPageType } })}
            />

            <CustomButton
                title='Login'
                onPress={handleLogin}
                isLoading={isLoading}
                containerStyle={{
                    marginTop: 20,
                }}
            />

            <CustomButton
                title='Create an Account'
                onPress={() => router.push('/register')}
                variant='outlined'
                isLoading={isLoading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 24 },
    title: { fontSize: 32, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
});