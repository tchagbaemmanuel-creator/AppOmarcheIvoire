import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Modal from '../Modal'

export default function Overlay() {
    return (
        <View style={styles.overlayContainer} pointerEvents='box-none'>
            <Modal />
        </View>
    )
}

const styles = StyleSheet.create({
    overlayContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        elevation: 5,
        alignItems: 'center',
        justifyContent: 'center',
    }
})