import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SellerStackParamList } from '../routers/SellerStackRouter';
import { Theme } from '@/config/constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ButtonContainer, ButtonText } from '@/components/Button';
import { StatusBar } from 'expo-status-bar';
import { useDispatch } from 'react-redux';
import {
    ProductCategory,
    ProductUnit,
    useDeleteProductMutation,
    useFetchProductByIdQuery,
    useUpdateProductMutation
} from '../../(client)/redux/productsApi.slice';
import { showToast } from '@/redux/slices/toast.slice';
import { Iconify } from 'react-native-iconify';
import { Image } from 'expo-image';
import InputGroup, { InputField } from '@/components/Input';

type ProductScreenRouteProp = RouteProp<SellerStackParamList, 'Product'>;
type ProductScreenNavigationProp = NativeStackNavigationProp<SellerStackParamList, 'Product'>;
const PRODUCT_UNITS: ProductUnit[] = [
    ProductUnit.KG,
    ProductUnit.DEMI_KG,
    ProductUnit.LITRE,
    ProductUnit.TAS,
    ProductUnit.SAC,
    ProductUnit.BOITE,
    ProductUnit.MORCEAUX,
    ProductUnit.UNIT,
    ProductUnit.AUTRE,
];
const PRODUCT_CATEGORIES: ProductCategory[] = [
    ProductCategory.Legumes,
    ProductCategory.Fruits,
    ProductCategory.Viandes,
    ProductCategory.Poissons,
    ProductCategory.Cereales,
    ProductCategory.Tubercules,
    ProductCategory.Mer,
    ProductCategory.Epices,
    ProductCategory.Autres,
];

export default function ProductScreen() {
    const route = useRoute<ProductScreenRouteProp>();
    const navigation = useNavigation<ProductScreenNavigationProp>();
    const dispatch = useDispatch();
    const { productId } = route.params;

    const { data: productDetails, isLoading } = useFetchProductByIdQuery(productId);
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [pictureUrl, setPictureUrl] = useState('');
    const [unit, setUnit] = useState<ProductUnit>(ProductUnit.KG);
    const [category, setCategory] = useState<ProductCategory>(ProductCategory.Legumes);

    useEffect(() => {
        if (!productDetails) return;
        setName(productDetails.name ?? '');
        setPrice(String(productDetails.price ?? ''));
        setAmount(String(productDetails.amount ?? ''));
        setDescription(productDetails.description ?? '');
        setPictureUrl(productDetails.pictureUrl?.[0] ?? '');
        setUnit(productDetails.unit ?? ProductUnit.KG);
        setCategory(productDetails.category ?? ProductCategory.Legumes);
    }, [productDetails]);

    const parsedPrice = useMemo(() => Number(price), [price]);
    const parsedAmount = useMemo(() => Number(amount), [amount]);

    const handleToggleStock = async () => {
        if (!productDetails) return;

        try {
            await updateProduct({
                productId,
                body: { isInStock: !productDetails.isInStock },
            }).unwrap();
            dispatch(
                showToast({
                    message: productDetails.isInStock ? 'Produit marqué en rupture de stock.' : 'Produit marqué comme disponible.',
                    type: 'success',
                })
            );
        } catch (error) {
            dispatch(
                showToast({
                    message: 'Erreur lors de la mise à jour du stock.',
                    type: 'warning',
                })
            );
            console.error('Erreur lors de la mise à jour du stock:', error);
        }
    };

    const handleSaveChanges = async () => {
        if (!productDetails) return;
        if (!name.trim()) {
            dispatch(
                showToast({
                    message: 'Le nom du produit est requis.',
                    type: 'warning',
                })
            );
            return;
        }
        if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
            dispatch(
                showToast({
                    message: 'Le prix doit etre un nombre positif.',
                    type: 'warning',
                })
            );
            return;
        }
        if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
            dispatch(
                showToast({
                    message: 'La quantite doit etre un nombre positif.',
                    type: 'warning',
                })
            );
            return;
        }

        try {
            await updateProduct({
                productId,
                body: {
                    name: name.trim(),
                    description: description.trim() || undefined,
                    price: parsedPrice,
                    amount: parsedAmount,
                    pictureUrl: [pictureUrl.trim() || (productDetails.pictureUrl?.[0] ?? '')],
                    unit,
                    category,
                },
            }).unwrap();

            dispatch(
                showToast({
                    message: 'Produit mis a jour avec succes.',
                    type: 'success',
                })
            );
            setIsEditing(false);
        } catch (error) {
            dispatch(
                showToast({
                    message: 'Erreur lors de la mise a jour du produit.',
                    type: 'warning',
                })
            );
            console.error('Erreur lors de la mise a jour du produit:', error);
        }
    };

    const handleDeleteProduct = async () => {
        if (!productDetails) return;
        try {
            await deleteProduct(productId).unwrap();
            dispatch(
                showToast({
                    message: 'Produit supprime avec succes.',
                    type: 'success',
                })
            );
            navigation.goBack();
        } catch (error) {
            dispatch(
                showToast({
                    message: 'Erreur lors de la suppression du produit.',
                    type: 'warning',
                })
            );
        }
    };

    if (isLoading || !productDetails) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <KeyboardAwareScrollView style={styles.container}>
            <StatusBar style="light" />
            <BackButton navigation={navigation} />
            <Carousel images={productDetails.pictureUrl} activeIndex={activeImageIndex} setActiveIndex={setActiveImageIndex} />
            <ProductDetailsView data={productDetails} />
            {isEditing && (
                <View style={styles.editForm}>
                    <InputGroup style={styles.inputGroup}>
                        <InputField
                            value={name}
                            onChangeText={setName}
                            placeholder="Nom du produit"
                            placeholderTextColor="rgba(0,0,0,0.35)"
                        />
                    </InputGroup>
                    <InputGroup style={styles.inputGroup}>
                        <InputField
                            value={price}
                            onChangeText={setPrice}
                            keyboardType="numeric"
                            placeholder="Prix (CFA)"
                            placeholderTextColor="rgba(0,0,0,0.35)"
                        />
                    </InputGroup>
                    <InputGroup style={styles.inputGroup}>
                        <InputField
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                            placeholder="Quantite"
                            placeholderTextColor="rgba(0,0,0,0.35)"
                        />
                    </InputGroup>
                    <InputGroup style={styles.inputGroup}>
                        <InputField
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Description"
                            placeholderTextColor="rgba(0,0,0,0.35)"
                        />
                    </InputGroup>
                    <InputGroup style={styles.inputGroup}>
                        <InputField
                            value={pictureUrl}
                            onChangeText={setPictureUrl}
                            placeholder="URL image"
                            autoCapitalize="none"
                            placeholderTextColor="rgba(0,0,0,0.35)"
                        />
                    </InputGroup>
                    <View style={styles.chipsContainer}>
                        {PRODUCT_UNITS.map((item) => (
                            <ButtonContainer
                                key={item}
                                style={[
                                    styles.chipButton,
                                    unit === item && styles.chipButtonActive,
                                ]}
                                onPress={() => setUnit(item)}
                            >
                                <ButtonText color={unit === item ? 'white' : Theme.colors.black}>
                                    {item}
                                </ButtonText>
                            </ButtonContainer>
                        ))}
                    </View>
                    <View style={styles.chipsContainer}>
                        {PRODUCT_CATEGORIES.map((item) => (
                            <ButtonContainer
                                key={item}
                                style={[
                                    styles.chipButton,
                                    category === item && styles.chipButtonActive,
                                ]}
                                onPress={() => setCategory(item)}
                            >
                                <ButtonText color={category === item ? 'white' : Theme.colors.black}>
                                    {item}
                                </ButtonText>
                            </ButtonContainer>
                        ))}
                    </View>
                </View>
            )}
            <View style={styles.buttonContainer}>
                <ButtonContainer
                    onPress={isEditing ? handleSaveChanges : () => setIsEditing(true)}
                    style={[
                        styles.toggleButton,
                        { backgroundColor: Theme.colors.black, marginBottom: 8 },
                    ]}
                    disabled={isUpdating || isDeleting}
                >
                    <ButtonText color="white" style={styles.buttonText}>
                        {isEditing ? 'Enregistrer les modifications' : 'Modifier produit et prix'}
                    </ButtonText>
                </ButtonContainer>
                <ButtonContainer
                    onPress={handleToggleStock}
                    holdDuration={2000}
                    style={[
                        styles.toggleButton,
                        {
                            backgroundColor: productDetails.isInStock ? Theme.colors.redDark : Theme.colors.green,
                        },
                    ]}
                    disabled={isUpdating || isDeleting}
                >
                    <ButtonText secure color="white" style={styles.buttonText}>
                        {productDetails.isInStock ? 'Marquer en rupture de stock' : 'Marquer produit disponible'}
                    </ButtonText>
                </ButtonContainer>
                <ButtonContainer
                    onPress={handleDeleteProduct}
                    holdDuration={1200}
                    style={[styles.toggleButton, { backgroundColor: Theme.colors.redDark, marginTop: 8 }]}
                    disabled={isUpdating || isDeleting}
                >
                    <ButtonText secure color="white" style={styles.buttonText} loading={isDeleting}>
                        Supprimer ce produit
                    </ButtonText>
                </ButtonContainer>
            </View>
            <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionTitle}>Description</Text>
                <Text style={styles.descriptionText}>{productDetails.description}</Text>
            </View>
        </KeyboardAwareScrollView>
    );
}

function BackButton({ navigation }: { navigation: ProductScreenNavigationProp }) {
    return (
        <ButtonContainer
            style={styles.backButton}
            onPress={() => navigation.goBack()}
        >
            <Iconify icon="material-symbols:arrow-back-rounded" size={24} color={Theme.colors.black} />
        </ButtonContainer>
    );
}

function Carousel({ images, activeIndex, setActiveIndex }: { images: string[], activeIndex: number, setActiveIndex: (index: number) => void }) {
    const width = Dimensions.get('window').width;
    const height = 270;

    const handleScroll = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / width);
        setActiveIndex(index);
    };

    return (
        <View style={{ position: 'relative' }}>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerStyle={{ flex: 1, height: height, width: width, backgroundColor: Theme.colors.greenDark }}
                style={{ height: height, width: width, backgroundColor: Theme.colors.greenDark }}
            >
                {images.map((image, index) => (
                    <View key={index} style={{ height: '100%', width: '100%', backgroundColor: Theme.colors.greenLight }}>
                        <Image source={{ uri: image }} style={{ height: '100%', width: '100%' }} contentFit="cover" />
                    </View>
                ))}
            </ScrollView>
            <CarouselIndicator totalImages={images.length} activeIndex={activeIndex} />
        </View>
    );
}

function CarouselIndicator({ totalImages, activeIndex }: { totalImages: number, activeIndex: number }) {
    return (
        <View style={styles.indicatorContainer}>
            {Array.from({ length: totalImages }).map((_, index) => (
                <View
                    key={index}
                    style={[
                        styles.indicator,
                        { backgroundColor: activeIndex === index ? 'white' : 'rgba(255,255,255,0.5)' }
                    ]}
                />
            ))}
        </View>
    );
}

function InStockIcon() {
    return (
        <Iconify
            icon="mdi:check-circle"
            size={16}
            color={Theme.colors.greenDark}
        />
    );
}

function OutOfStockIcon() {
    return (
        <Iconify
            icon="mdi:close-circle"
            size={16}
            color={Theme.colors.redDark}
        />
    );
}

function StatusChip({ isInStock }: { isInStock: boolean }) {
    return (
        <View style={[
            styles.statusChip,
            { backgroundColor: isInStock ? Theme.colors.greenLight : Theme.colors.redLight }
        ]}>
            <Text style={[
                styles.statusText,
                { color: isInStock ? Theme.colors.greenDark : Theme.colors.redDark }
            ]}>
                {isInStock ? 'En stock' : 'Rupture de stock'}
            </Text>
            {isInStock ? <InStockIcon /> : <OutOfStockIcon />}
        </View>
    );
}

function ProductDetailsView({ data }: { data: any }) {
    return (
        <View style={styles.productDetailsContainer}>
            <StatusChip isInStock={data.isInStock} />
            <View style={styles.info}>
                <Text style={styles.name}>{data.name}</Text>
                <View style={styles.productInfo}>
                    <Text style={styles.amountText}>{data.amount} {data.unit}</Text>
                    <Text style={styles.priceText}>{data.price} CFA</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 56,
        left: 16,
        zIndex: 10,
        width: 40,
        height: 40,
        backgroundColor: 'white',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    indicatorContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 16,
        alignSelf: 'center',
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    productDetailsContainer: {
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    info: {
        marginTop: 16,
        alignItems: 'center',
    },
    name: {
        fontFamily: Theme.font.black,
        color: Theme.colors.black,
        fontSize: 24,
        letterSpacing: -0.7,
    },
    productInfo: {
        marginTop: 4,
        alignItems: 'center',
    },
    amountText: {
        fontFamily: Theme.font.bold,
        color: Theme.colors.black,
        fontSize: 12,
        letterSpacing: -0.2,
    },
    priceText: {
        fontFamily: Theme.font.semiBold,
        color: Theme.colors.black,
        fontSize: 12,
        opacity: 0.7,
        letterSpacing: -0.2,
    },
    statusChip: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 999,
        paddingVertical: 10,
        gap: 4,
        paddingHorizontal: 14,
    },
    statusText: {
        fontSize: 14,
        fontFamily: Theme.font.black,
        letterSpacing: -0.5,
        marginLeft: 4,
    },
    productName: {
        fontFamily: Theme.font.black,
        color: Theme.colors.black,
        fontSize: 20,
        letterSpacing: -0.7,
    },
    productUnit: {
        fontFamily: Theme.font.medium,
        color: Theme.colors.black,
        fontSize: 14,
        opacity: 0.7,
    },
    priceContainer: {
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
        borderRadius: 8,
        padding: 8,
    },
    price: {
        color: Theme.colors.black,
        fontFamily: Theme.font.black,
        fontSize: 16,
        letterSpacing: -0.5,
    },
    currency: {
        fontSize: 10,
    },
    buttonContainer: {
        paddingHorizontal: 16,
        marginTop: 8,
    },
    toggleButton: {
        height: 48,
    },
    buttonText: {
        fontSize: 14,
        fontFamily: Theme.font.black,
    },
    editForm: {
        paddingHorizontal: 16,
        marginTop: 10,
        gap: 8,
    },
    inputGroup: {
        height: 48,
        borderRadius: 12,
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chipButton: {
        height: 34,
        width: 'auto',
        borderRadius: 999,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.12)',
        backgroundColor: 'white',
        paddingHorizontal: 12,
    },
    chipButtonActive: {
        backgroundColor: Theme.colors.black,
    },
    descriptionContainer: {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        marginTop: 8,
    },
    descriptionTitle: {
        fontFamily: Theme.font.black,
        color: Theme.colors.black,
        fontSize: 16,
        letterSpacing: -0.5,
    },
    descriptionText: {
        fontFamily: Theme.font.medium,
        color: Theme.colors.black,
        fontSize: 14,
        opacity: 0.7,
        lineHeight: 20,
    },
});