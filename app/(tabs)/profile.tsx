import CustomButton from '@/components/custom-button';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/theme';
import { VerifyPageType } from '../verify';

export default function ProfileScreen() {
    const { colors } = useTheme();
    const { signOut, session } = useAuth();

    const handleLogout = async () => {
        await signOut()
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your account? This action cannot be undone.",
            [
                {
                    text: "No",
                    style: "cancel"
                },
                {
                    text: "Yes, Delete",
                    onPress: () => {
                        router.push({ pathname: '/verify', params: { email: session?.email, verificationType: 'deleteAccount' as VerifyPageType } });
                    },
                    style: "destructive"
                }
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>

            <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>U</Text>
            </View>

            <Text style={[styles.name, { color: colors.text }]}>User Profile</Text>

            <CustomButton
                title="Log Out"
                variant="text"
                onPress={handleLogout}
                containerStyle={{ marginTop: 40 }}
            />

            <CustomButton
                title='Delete Account'
                onPress={handleDeleteAccount}
                containerStyle={{
                    backgroundColor: 'red',
                    marginTop: 'auto'
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', padding: 24, paddingTop: 60 },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarText: { fontSize: 40, color: '#fff', fontWeight: 'bold' },
    name: { fontSize: 24, fontWeight: 'bold' },
});