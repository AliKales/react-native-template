import CustomButton from '@/components/custom-button';
import CustomTextInput from '@/components/custom-text-input';
import { COLORS } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { ApiError } from '@/types/api';
import api from '@/utils/api';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

export type VerifyPageType = 'email' | 'forgotPassword' | 'deleteAccount'

export default function VerifyScreen() {
    const { email, verificationType } = useLocalSearchParams<{
        email: string,
        verificationType: VerifyPageType
    }>();
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showEmail, setShowEmail] = useState<boolean>(verificationType === 'forgotPassword' ? true : false);
    const [emailState, setEmailState] = useState('');

    const { signIn, signOut } = useAuth();

    const { colors } = useTheme();

    useEffect(() => {
        if (verificationType === 'deleteAccount') {
            setTimeout(() => {
                sendDeleteAccountRequest()
            }, 500);
        }
    }, [])

    async function sendOtpLoginRequest() {
        if (!emailState.trim()) return
        try {
            setIsLoading(true);

            await api.post('/auth/login-otp/request', {
                email: emailState.trim(),
            });

            setShowEmail(false)

            Alert.alert('If this email is registered and verified, a login code has been sent.')
        } catch (error: any) {
            if (error.response) {
                const errorData = error.response.data as ApiError;

                Alert.alert('Error', errorData.message);
            } else {
                console.error(error);
                Alert.alert('Network Error', 'Could not connect to the server.');
            }
        }
        finally {
            setIsLoading(false);
        }
    }

    async function sendDeleteAccountRequest() {
        setIsLoading(true)

        try {
            setIsLoading(true);

            await api.get('/auth/delete-account/request');

            Alert.alert('OTP code sent to your mail')
        } catch (error: any) {
            if (error.response) {
                const errorData = error.response.data as ApiError;

                Alert.alert('Error', errorData.message);
            } else {
                console.error(error);
                Alert.alert('Network Error', 'Could not connect to the server.');
            }
        }
        finally {
            setIsLoading(false);
        }
    }

    const handleVerify = async () => {
        try {
            setIsLoading(true);

            const pathMap: Record<VerifyPageType, string> = {
                deleteAccount: '/auth/delete-account/verify',
                email: '/auth/verify',
                forgotPassword: '/auth/login-otp/verify',
            };

            const apiPath = pathMap[verificationType]

            const response = await api.post(apiPath, {
                email: emailState?.trim() || email,
                otp_code: otp
            });

            if (verificationType === 'deleteAccount') {
                await signOut()
                router.replace("/login")
            } else {
                await signIn(response.data.token)
            }
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
            <Text style={[styles.title, { color: colors.text }]}>{showEmail ? "Enter Email" : "Enter Code"}</Text>
            {
                showEmail ?
                    <View style={{ height: 50 }} />
                    :
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Sent to {emailState || email}
                    </Text>
            }

            {showEmail ? <CustomTextInput
                placeholder="Email"
                value={emailState}
                onChangeText={setEmailState}
                autoCapitalize="none"
                autoFocus
            /> : <CustomTextInput
                style={[styles.otpInput, { color: colors.text }]}
                placeholder="000000"
                keyboardType="numeric"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
                autoFocus
            />}

            <CustomButton
                title={showEmail ? 'Send' : (verificationType === 'deleteAccount' ? 'Delete Account' : 'Verify')}
                onPress={showEmail ? sendOtpLoginRequest : handleVerify}
                isLoading={isLoading}
                containerStyle={{
                    backgroundColor: verificationType === 'deleteAccount' ? 'red' : COLORS.primary,
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 24 },
    title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center' },
    subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 40, marginTop: 10 },
    otpInput: { borderWidth: 1, padding: 20, marginBottom: 24, borderRadius: 12, fontSize: 32, textAlign: 'center', letterSpacing: 10 },
    primaryButton: { backgroundColor: COLORS.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
    primaryButtonText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
});