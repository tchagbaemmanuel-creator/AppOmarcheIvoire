import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { ButtonContainer, ButtonText } from '@/components/Button';
import { Theme } from '@/config/constants';
import { Iconify } from 'react-native-iconify';

interface SellerImageProps {
    pictureUrl: string;
    onChangePhoto: () => void;
    onGoBack: () => void;
}

const BackIcon = () => <Iconify icon="material-symbols:arrow-back-rounded" size={24} color={Theme.colors.black} />;
const CameraIcon = () => <Iconify icon="material-symbols:upload" size={20} color={Theme.colors.black} />;
const DEFAULT_SELLER_IMAGE = "https://placehold.co/600x400/png?text=Vendeur";

const SellerImage: React.FC<SellerImageProps> = ({ pictureUrl, onChangePhoto, onGoBack }) => {

    return (
        <View style={styles.container}>
            <Image source={{ uri: pictureUrl || DEFAULT_SELLER_IMAGE }} style={styles.image} />
            <ButtonContainer style={styles.backButton} onPress={onGoBack}>
                <BackIcon />
            </ButtonContainer>
            {/* <ButtonContainer style={styles.changePhotoButton} onPress={onChangePhoto}>
                <ButtonText color={Theme.colors.black} style={styles.buttonText}>
                    Changer la photo
                </ButtonText>
                <CameraIcon />
            </ButtonContainer> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        height: 240,
        width: '100%',
        backgroundColor: Theme.colors.black,
    },
    image: {
        height: 240,
        width: '100%',
    },
    backButton: {
        width: 40,
        height: 40,
        position: 'absolute',
        top: 56,
        left: 16,
        backgroundColor: 'white',
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center',
    },
    changePhotoButton: {
        width: 'auto',
        position: 'absolute',
        top: 56,
        right: 16,
        gap: 12,
        height: 40,
        paddingHorizontal: 12,
        backgroundColor: 'white',
        borderRadius: 999,
    },
    buttonText: {
        fontFamily: Theme.font.black,
        fontSize: 12,
    },
});

export default SellerImage;