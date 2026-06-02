import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import React from 'react'
import { Theme } from '@/config/constants'

interface MenuContainerProps extends TouchableOpacityProps {
    children: React.ReactNode
}
export function MenuContainer({ children, ...props }: MenuContainerProps) {
    return (
        <TouchableOpacity style={styles.container} {...props}>
            {children}
        </TouchableOpacity>
    )
}

export function MenuText({ children }: { children: React.ReactNode }) {
    return (
        <Text style={styles.text}>
            {children}
        </Text>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    text: {
        fontSize: 14,
        letterSpacing: -0.5,
        fontFamily: Theme.font.bold,
        color: Theme.colors.black
    }
})

