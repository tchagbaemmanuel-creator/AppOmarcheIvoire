import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { ButtonContainer, ButtonText } from './Button';
import { Theme } from '@/config/constants';
import { useDispatch } from 'react-redux';
import { showToast } from '@/redux/slices/toast.slice';

interface QRCodeScannerModalProps {
    isVisible: boolean;
    onClose: () => void;
    onScan: (data: string) => void;
    validationRegex?: RegExp;
}

export default function QRCodeScannerModal({ isVisible, onClose, onScan, validationRegex }: QRCodeScannerModalProps) {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);
    const dispatch = useDispatch()

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        setScanned(true);
        if (validationRegex && !validationRegex.test(data)) {
            dispatch(showToast({ message: 'Code QR invalide', type: 'warning' }))
            onClose();
            setScanned(false);
            return;
        }
        dispatch(showToast({ message: 'Code QR valide', type: 'success' }))
        if (onScan) {
            onScan(data);
        }
        setScanned(false);
        onClose();
    };

    if (hasPermission === null) {
        return <Text>Demande de permission de caméra</Text>;
    }
    if (hasPermission === false) {
        return <Text>Pas de permission de caméra</Text>;
    }

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <CameraView
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr"],
                    }}
                    style={StyleSheet.absoluteFillObject}
                />
                <View style={styles.overlay}>
                    <View style={styles.scanArea} />
                </View>
                <ButtonContainer onPress={onClose} style={styles.closeButton}>
                    <ButtonText color="white">Close</ButtonText>
                </ButtonContainer>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanArea: {
        width: 200,
        height: 200,
        borderWidth: 2,
        borderColor: Theme.colors.green,
        backgroundColor: 'transparent',
    },
    closeButton: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
        paddingHorizontal: 24,
        backgroundColor: Theme.colors.green,
    },
});
