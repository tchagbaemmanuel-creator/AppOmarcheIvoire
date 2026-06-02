import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Theme } from '@/config/constants'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { hideToast, ToastType } from '@/redux/slices/toast.slice'

export default function Modal() {
    const toast = useSelector((state: RootState) => state.toast)
    const positionAnim = React.useRef(new Animated.Value(0)).current
    const dispatch = useDispatch()

    const colorMap: Record<ToastType, string> = {
        success: Theme.colors.green,
        info: Theme.colors.blue,
        warning: Theme.colors.red
    }

    const titleMap: Record<ToastType, string> = {
        success: 'Succès',
        info: 'Information',
        warning: 'Une erreur est survenue'
    }

    const iconMap: Record<ToastType, 'check-circle' | 'info' | 'warning'> = {
        success: 'check-circle',
        info: 'info',
        warning: 'warning'
    }

    React.useEffect(() => {
        if (toast.visible) {
            Animated.spring(positionAnim, {
                toValue: 0,
                useNativeDriver: true
            }).start()

            // Auto-hide after 3 seconds
            const timer = setTimeout(() => {
                dispatch(hideToast())
            }, 3000)

            return () => clearTimeout(timer)
        } else {
            Animated.spring(positionAnim, {
                toValue: 100,
                speed: 200,
                useNativeDriver: true
            }).start()
        }
    }, [toast.visible])

    return (
        <TouchableOpacity
            activeOpacity={0.92}
            onPress={() => {
                dispatch(hideToast())
            }}
            pointerEvents={toast.visible ? 'auto' : 'none'}
            style={[
                styles.modalContainer,
                {
                    borderLeftColor: colorMap[toast.type],
                    transform: [{ translateY: positionAnim }],
                    opacity: toast.visible ? 1 : 0,
                },
            ]}>
            <MaterialIcons name={iconMap[toast.type]} size={20} color={colorMap[toast.type]} />
            <View style={{ gap: 1 }}>
                <Text style={styles.modalTitle}>{titleMap[toast.type]}</Text>
                <Text style={styles.modalSubtitle}>{toast.message}</Text>
            </View>
            <MaterialCommunityIcons name='close' size={20} style={styles.modalCloseIcon} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        position: 'absolute',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        height: 54,
        borderLeftWidth: 4,
        bottom: 40,
        width: '90%',
        alignItems: 'center',
        padding: 12,
        justifyContent: 'flex-start',
        gap: 12,
        zIndex: 1000,
    },
    modalTitle: {
        fontFamily: Theme.font.bold,
        fontSize: 12,
        letterSpacing: -.1
    },
    modalSubtitle: {
        fontFamily: Theme.font.semiBold,
        color: 'rgba(0,0,0,0.5)',
        fontSize: 10,
    },
    modalCloseIcon: {
        position: 'absolute',
        color: 'rgba(0,0,0,0.2)',
        right: 16,
    }
})