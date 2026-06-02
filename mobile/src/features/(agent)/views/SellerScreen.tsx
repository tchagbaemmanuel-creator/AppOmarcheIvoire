import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SellerStackParamList } from '../routers/SellerStackRouter';
import { Theme } from '@/config/constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ButtonContainer, ButtonText } from '@/components/Button';
import { StatusBar } from 'expo-status-bar';
import { useDispatch } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import {
    useFetchProductsBySellerIdQuery,
    useFetchSellerByIdQuery,
    useUpdateSellerByIdMutation,
} from '../../(client)/redux/sellersApi.slice';
import { showToast } from '@/redux/slices/toast.slice';
import SellerImage from '../components/(seller)/SellerImage';
import SellerDetailsView from '../components/(seller)/SellerDetails';
import ProductList from '../components/(seller)/ProductList';

export type SellerScreenRouteProp = RouteProp<SellerStackParamList, 'Seller'>;
export type SellerScreenNavigationProp = NativeStackNavigationProp<SellerStackParamList, 'Seller'>;

export default function SellerScreen() {
    const route = useRoute<SellerScreenRouteProp>();
    const navigation = useNavigation<SellerScreenNavigationProp>();
    const dispatch = useDispatch();
    const { sellerId } = route.params;

    const { data: sellerProducts, isLoading: isProductsLoading } = useFetchProductsBySellerIdQuery(sellerId);
    const { data: sellerDetails, isLoading: isSellerLoading } = useFetchSellerByIdQuery(sellerId);
    const [updateSellerStatus, { isLoading: isUpdating }] = useUpdateSellerByIdMutation();

    const [uploading, setUploading] = useState(false);

    const handleChangePhoto = async () => {
        if (!sellerDetails) return;

        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Permission to access media library is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!result.canceled && result.assets.length > 0) {
            const selectedAsset = result.assets[0];
            const localUri = selectedAsset.uri;

            try {
                setUploading(true);

                const fileInfo = await FileSystem.getInfoAsync(localUri);
                if (!fileInfo.exists) {
                    throw new Error('File does not exist');
                }

                const formData = new FormData();
                formData.append('file', {
                    uri: localUri,
                    name: `seller_${sellerId}.jpg`,
                    type: 'image/jpeg',
                });

                const uploadResponse = await fetch('https://your-backend.com/api/upload', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (!uploadResponse.ok) {
                    throw new Error('Image upload failed');
                }

                const uploadResult = await uploadResponse.json();
                const newPictureUrl = uploadResult.url;

                await updateSellerStatus({
                    sellerId,
                    data: { ...sellerDetails, pictureUrl: newPictureUrl },
                }).unwrap();

                dispatch(
                    showToast({
                        message: 'Photo mise à jour avec succès.',
                        type: 'success',
                    })
                );
            } catch (error) {
                console.error('Erreur lors du changement de photo:', error);
                dispatch(
                    showToast({
                        message: 'Erreur lors du changement de photo.',
                        type: 'warning',
                    })
                );
            } finally {
                setUploading(false);
            }
        }
    };

    const handleToggleActive = async () => {
        try {
            if (!sellerDetails) return;
            await updateSellerStatus({
                sellerId,
                data: { ...sellerDetails, isActive: !sellerDetails.isActive },
            }).unwrap();

            dispatch(
                showToast({
                    message: sellerDetails.isActive ? 'Boutique fermée avec succès.' : 'Boutique ouverte avec succès.',
                    type: 'success',
                })
            );
        } catch (error) {
            dispatch(
                showToast({
                    message: 'Erreur lors du changement',
                    type: 'warning',
                })
            );

            console.error('Erreur lors de la mise à jour de l\'état actif:', error);
        }
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    if (isProductsLoading || isSellerLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!sellerDetails) return null;
    if (!sellerProducts) return null;

    return (
        <KeyboardAwareScrollView style={styles.container}>
            <StatusBar style="light" />
            <SellerImage
                pictureUrl={sellerDetails.pictureUrl || ""}
                onChangePhoto={handleChangePhoto}
                onGoBack={handleGoBack}
            />
            {/* <UploadingOverlay uploading={uploading} /> */}
            <SellerDetailsView data={sellerDetails} isActive={sellerDetails.isActive} />
            <View style={styles.buttonContainer}>
                <ButtonContainer
                    onPress={() => navigation.navigate('AddProduct', { sellerId })}
                    style={[
                        styles.addButton,
                        {
                            backgroundColor: Theme.colors.black,
                            borderRadius: 999,
                            height: 48,
                            marginBottom: 8,
                        },
                    ]}
                >
                    <ButtonText color="white" style={styles.buttonText}>
                        Ajouter un produit
                    </ButtonText>
                </ButtonContainer>
                <ButtonContainer
                    onPress={handleToggleActive}
                    holdDuration={1000}
                    style={[
                        styles.toggleButton,
                        {
                            backgroundColor: sellerDetails.isActive ? Theme.colors.redDark : Theme.colors.green,
                            borderRadius: 999,
                            height: 48,
                        },
                    ]}
                    disabled={isUpdating || uploading}
                >
                    <ButtonText secure color="white" style={styles.buttonText}>
                        {sellerDetails.isActive ? 'Fermer la boutique' : 'Ouvrir la boutique'}
                    </ButtonText>
                </ButtonContainer>
            </View>
            <ProductList products={sellerProducts} sellerName={sellerDetails.lastName || ""} />
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        paddingHorizontal: 16,
        marginTop: 8,
    },
    toggleButton: {
        borderRadius: 999,
        height: 48,
    },
    addButton: {
        borderRadius: 999,
        height: 48,
    },
    buttonText: {
        fontSize: 14,
    },
});