import { ActivityIndicator, Animated, GestureResponderEvent, StyleSheet, Text, TextProps, TouchableOpacity, TouchableOpacityProps, View, Vibration } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Theme } from '@/config/constants'
import * as Haptics from 'expo-haptics'

export default function Button() {
    return (
        <View>
            <Text>Button</Text>
        </View>
    )
}
export function ButtonContainer(props: TouchableOpacityProps & { holdDuration?: number }) {
    const scaleAnim = React.useRef(new Animated.Value(1)).current
    const progressAnim = useRef(new Animated.Value(0)).current
    const [isHolding, setIsHolding] = useState(false)
    const holdTimer = useRef<number | null>(null)
    const vibrationInterval = useRef<number | null>(null)

    const pressIn = () => {
        if (props.disabled) return
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
        setIsHolding(true)
        Animated.spring(scaleAnim, {
            toValue: .95,
            speed: 300,
            useNativeDriver: true
        }).start()

        if (props.holdDuration) {
            Animated.timing(progressAnim, {
                toValue: 1,
                duration: props.holdDuration,
                useNativeDriver: false
            }).start()

            holdTimer.current = setTimeout(() => {
                if (props.onPress) {
                    props.onPress({} as GestureResponderEvent)
                }
                setIsHolding(false)
            }, props.holdDuration)

            // Start vibration interval
            vibrationInterval.current = setInterval(() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
            }, 1000)
        }
    }

    const pressOut = () => {
        setIsHolding(false)
        if (holdTimer.current) {
            clearTimeout(holdTimer.current)
        }
        if (vibrationInterval.current) {
            clearInterval(vibrationInterval.current)
        }
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true
        }).start()
        progressAnim.setValue(0)
    }

    useEffect(() => {
        return () => {
            if (holdTimer.current) {
                clearTimeout(holdTimer.current)
            }
            if (vibrationInterval.current) {
                clearInterval(vibrationInterval.current)
            }
        }
    }, [])
    const progressBarWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%']
    })

    return (
        <TouchableOpacity
            {...props}
            activeOpacity={0.8}
            onPressIn={pressIn}
            onPressOut={pressOut}
            onPress={(event: GestureResponderEvent) => {
                if (!props.holdDuration && props.onPress) {
                    props.onPress(event)
                }
            }}
            style={[styles.buttonContainer, props.style, { transform: [{ scale: scaleAnim }] }, props.disabled && { opacity: .5 }]}
        >
            {props.holdDuration && isHolding && (
                <Animated.View
                    style={[
                        styles.progressBar,
                        { width: progressBarWidth }
                    ]}
                />
            )}
            {props.children}
        </TouchableOpacity>
    )
}

type ButtonTextProps = TextProps & { color: string, loading?: boolean }

export function ButtonText(props: ButtonTextProps & { secure?: boolean }) {
    if (props.loading) return <ActivityIndicator color={props.color} />

    if (props.secure) {
        return (
            <View style={styles.buttonTextContainer}>
                <Text {...props} style={[styles.buttonText, props.style, { color: props.color }]}>
                    {props.children}
                </Text>
                <Text style={styles.subtitle}>Maintenir le bouton</Text>
            </View>
        )
    }

    return (
        <Text {...props} style={[styles.buttonText, props.style, { color: props.color }]} />
    )
}


const styles = StyleSheet.create({
    buttonWrapper: {
        width: '100%',
        alignItems: 'center',
    },
    buttonContainer: {
        backgroundColor: Theme.colors.green,
        height: 48,
        borderRadius: 999,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
    },
    buttonContent: {
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    buttonText: {
        color: 'white',
        fontFamily: Theme.font.black,
        letterSpacing: -.5,
        fontSize: 16
    },
    progressBar: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    holdText: {
        marginTop: 4,
        fontSize: 8,
        color: 'rgba(255, 255, 255, 0.8)',
        fontFamily: Theme.font.extraBold,
    },
    buttonTextContainer: {
        alignItems: 'center',
    },
    subtitle: {
        fontSize: 8,
        color: "white",
        fontFamily: Theme.font.extraBold,
        textAlign: 'center',
    }
})