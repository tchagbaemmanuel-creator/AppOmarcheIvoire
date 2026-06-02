import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Theme } from '@/config/constants';

interface UploadingOverlayProps {
    uploading: boolean;
}

const UploadingOverlay: React.FC<UploadingOverlayProps> = ({ uploading }) => {
    if (!uploading) return null;

    return (
        <View style={styles.overlay}>
            <ActivityIndicator size="large" color={Theme.colors.green} />
            <Text style={styles.text}>Uploading...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    text: {
        marginTop: 10,
        color: 'white',
        fontSize: 16,
    },
});

export default UploadingOverlay;