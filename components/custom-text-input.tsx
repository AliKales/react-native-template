import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';


interface CustomTextInputProps extends TextInputProps {
    marginBottom?: number;
    ref?: React.Ref<TextInput>
}

export default function CustomTextInput({
    style,
    marginBottom = 16,
    ref = undefined,
    ...props
}: CustomTextInputProps) {
    const { colors } = useTheme();

    return (
        <TextInput
            style={[
                styles.input,
                {
                    color: colors.text,
                    borderColor: colors.border,
                    backgroundColor: colors.inputBackground,
                    marginBottom: marginBottom,
                },
                style
            ]}
            ref={ref}
            placeholderTextColor={colors.placeholder}
            {...props}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
        width: '100%',
        letterSpacing: 0,
    },
});