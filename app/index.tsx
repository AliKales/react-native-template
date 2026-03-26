import CustomButton from '@/components/custom-button';
import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { APP_CONFIG, COLORS } from '../constants/theme';

export default function LandingScreen() {
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>

            <View style={styles.centerContent}>
                <Animated.Text
                    entering={FadeInDown.duration(800).springify()}
                    style={[styles.welcomeText, { color: colors.text }]}>
                    Welcome To
                </Animated.Text>
                <Animated.Text
                    entering={FadeInDown.delay(300).duration(800).springify()}
                    style={styles.appNameText}>
                    {APP_CONFIG.name}
                </Animated.Text>
            </View>

            <Animated.View entering={FadeInUp.delay(600).duration(800).springify()}>
                <CustomButton
                    title='Start'
                    onPress={() => router.push('/login')}
                />
            </Animated.View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingBottom: 40, // Keeps the button off the very bottom edge
        paddingTop: 60,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 40,
    },
    appNameText: {
        color: COLORS.primary,
        fontSize: 42,
        fontWeight: 'bold',
    },
});