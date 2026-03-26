import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    TouchableOpacityProps,
    ViewStyle
} from 'react-native';
import { COLORS } from '../constants/theme';

interface CustomButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'filled' | 'outlined' | 'text';
    containerStyle?: ViewStyle;
    textStyle?: TextStyle;
    isLoading?: boolean;
}

export default function CustomButton({
    title,
    variant = 'filled',
    containerStyle,
    textStyle,
    isLoading = false,
    ...rest
}: CustomButtonProps) {
    const { colors } = useTheme();

    const getButtonStyle = () => {
        switch (variant) {
            case 'outlined': return styles.outlinedButton;
            case 'text': return styles.textButton;
            case 'filled':
            default: return styles.filledButton;
        }
    };

    const getTextStyle = () => {
        switch (variant) {
            case 'outlined': return styles.outlinedButtonText;
            case 'text': return styles.textButtonText;
            case 'filled':
            default: return styles.filledButtonText;
        }
    };

    const spinnerColor = variant === 'filled' ? '#ffffff' : COLORS.primary;

    return (
        <TouchableOpacity
            style={[
                styles.baseButton,
                getButtonStyle(),
                isLoading && { opacity: 0.7 },
                containerStyle
            ]}
            disabled={isLoading || rest.disabled}
            {...rest}
        >
            {isLoading ? (
                <ActivityIndicator size="small" color={spinnerColor} />
            ) : (
                <Text
                    style={[
                        styles.baseText,
                        getTextStyle(),
                        textStyle
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    // --- BASE STYLES ---
    baseButton: {
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginTop: 10,
    },
    baseText: {
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },

    // --- FILLED VARIANT ---
    filledButton: {
        backgroundColor: COLORS.primary,
    },
    filledButtonText: {
        color: '#ffffff',
    },

    // --- OUTLINED VARIANT ---
    outlinedButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    outlinedButtonText: {
        color: COLORS.primary,
    },

    // --- TEXT VARIANT ---
    textButton: {
        backgroundColor: 'transparent',
        paddingVertical: 12,
    },
    textButtonText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: '600',
    },
});