import CustomButton from '@/components/custom-button';
import CustomTextInput from '@/components/custom-text-input';
import { useTheme } from '@/context/ThemeContext';
import { ApiError } from '@/types/api';
import api from '@/utils/api';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { VerifyPageType } from './verify';

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { colors } = useTheme();

    const handleRegister = async () => {
        try {
            setIsLoading(true);

            await api.post('/auth/register', {
                email,
                password
            });

            router.push({ pathname: '/verify', params: { email, verificationType: 'email' as VerifyPageType } });

        } catch (error: any) {
            if (error.response) {
                const errorData = error.response.data as ApiError;

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
            <Text style={[styles.title, { color: colors.text }]}>Join Hablo Talk</Text>

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
            />
            <CustomTextInput
                placeholder="Password"
                secureTextEntry
                value={password2}
                onChangeText={setPassword2}
            />

            <CustomButton
                title='Register'
                onPress={handleRegister}
                isLoading={isLoading}
            />

            <CustomButton
                title='Already have an account? Login'
                onPress={() => router.back()}
                variant='text'
                isLoading={isLoading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 24 },
    title: { fontSize: 32, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
    input: { borderWidth: 1, padding: 16, marginBottom: 16, borderRadius: 12, fontSize: 16 },
});