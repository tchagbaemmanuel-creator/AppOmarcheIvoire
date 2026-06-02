import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View, ViewProps } from 'react-native'
import React from 'react'
import { Theme } from '@/config/constants'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

export default function FormInput() {
    return (
        <View>
            <Text>FormInput</Text>
        </View>
    )
}

export function FormInputContainer(props: ViewProps) {
    return (
        <View  {...props} style={[styles.inputContainer, props.style]} />
    )
}

export function FormInputField(props: TextInputProps) {
    return (
        <TextInput {...props} style={[styles.inputField, props.style, { opacity: props.editable === false ? .2 : 1 }]} />
    )
}

export function PasswordInputField(props: Omit<TextInputProps, "secureTextEntry">) {
    const [visible, setVisible] = React.useState(false)

    return (
        <>
            <TextInput
                {...props}
                secureTextEntry={!visible}
                style={[styles.inputField, props.style, { opacity: props.editable === false ? .2 : 1 }]}
            />
            <Pressable
                accessibilityRole="button"
                accessibilityLabel={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                onPress={() => setVisible((v) => !v)}
                hitSlop={10}
                style={{ paddingVertical: 6, paddingHorizontal: 4 }}
            >
                <MaterialCommunityIcons
                    name={visible ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="rgba(0,0,0,0.25)"
                />
            </Pressable>
        </>
    )
}

export function InputError(props: { error: string }) {
    return (
        <View style={styles.inputErrorContainer}>
            <MaterialCommunityIcons name="alert-circle" size={12} color="#f06058" />
            <Text style={styles.inputErrorText}>{props.error}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        height: 46,
        flexDirection: 'row',
        gap: 12,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, .1)',
    },
    inputField: {
        flex: 1,
        fontFamily: Theme.font.bold,
        fontSize: 15,
        letterSpacing: -.5,
    },
    inputErrorContainer: {
        flexDirection: 'row',
        gap: 8,
        // backgroundColor: '#f3e5e4',
        width: '100%',
        borderRadius: 4,
        // padding: 8,
        // borderWidth: 1,
        borderColor: '#f06058',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    inputErrorText: {
        color: '#f06058',
        fontSize: 10,
        fontFamily: Theme.font.bold,
        letterSpacing: -.2,
    }
})