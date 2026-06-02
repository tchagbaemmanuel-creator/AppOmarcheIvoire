import { StyleSheet, Text, TextInput, TextInputProps, TextProps, View, ViewProps } from 'react-native'
import React from 'react'
import { Theme } from '@/config/constants'

export default function InputGroup(props: ViewProps) {
    return (
        <View {...props} style={[styles.inputGroupContainer, props.style]} />
    )
}

export function InputField(props: TextInputProps) {
    return (
        <TextInput {...props} style={[styles.inputField, props.style]} />
    )
}


const styles = StyleSheet.create({
    inputGroupContainer: {
        borderRadius: 999,
        width: '100%',
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'flex-start',
        paddingHorizontal: 16,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, .05)'
    },
    inputField: {
        fontFamily: Theme.font.black,
        fontSize: 14,
        letterSpacing: -.5,
        color: Theme.colors.black,
        height: '100%',
        width: '100%',
    }
})