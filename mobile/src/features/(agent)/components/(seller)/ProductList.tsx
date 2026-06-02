import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { Product } from '@/features/(client)/redux/productsApi.slice';
import { Iconify } from 'react-native-iconify';
import { Theme } from '@/config/constants';
import { useNavigation } from '@react-navigation/native';
import { SellerStackNavigation } from '../../routers/SellerStackRouter';

interface ProductListProps {
    products: Product[];
    sellerName: string;
}

const ProductList: React.FC<ProductListProps> = ({ products, sellerName }) => {
    const navigation = useNavigation<SellerStackNavigation>();
    const fallbackImage = "https://placehold.co/600x400/png?text=Produit";

    const handleProductPress = (productId: string) => {
        navigation.navigate('Product', { productId });
    };

    return (
        <View style={styles.container}>
            {products.map((product) => (
                <TouchableOpacity
                    key={product.productId}
                    style={styles.card}
                    onPress={() => handleProductPress(product.productId)}
                >
                    <Image source={{ uri: product.pictureUrl?.[0] || fallbackImage }} style={styles.image} resizeMode='cover' />
                    <View style={styles.overlay}>
                        <Iconify icon="icon-park-twotone:tomato" size={20} color={"white"} />
                        <View>
                            <Text style={styles.sellerName}>Chez {sellerName}</Text>
                            <Text style={styles.productName}>{product.name}</Text>
                        </View>
                    </View>
                    <View style={styles.priceContainer}>
                        <View style={styles.amountContainer}>
                            <Text style={styles.amountText}>{product.amount} à</Text>
                            <Text style={styles.price}>
                                {product.price}<Text style={styles.currency}>CFA</Text>
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginTop: 16,
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        position: 'relative',
        width: '49%',
        height: 100,
        backgroundColor: Theme.colors.blackDark,
        borderRadius: 12,
        marginBottom: 8,
        padding: 12,
        overflow: 'hidden',
    },
    image: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.3,
        zIndex: 0,
    },
    overlay: {
        height: "100%",
        justifyContent: "space-between",
        alignItems: "flex-start",
        zIndex: 1,
    },
    sellerName: {
        marginBottom: -2,
        fontFamily: Theme.font.bold,
        letterSpacing: -0.4,
        fontSize: 10,
        color: "white",
    },
    productName: {
        fontFamily: Theme.font.black,
        fontSize: 14,
        color: "white",
    },
    priceContainer: {
        zIndex: 1,
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    amountContainer: {
        alignItems: "flex-end",
    },
    amountText: {
        fontFamily: Theme.font.bold,
        fontSize: 10,
        color: "white",
    },
    price: {
        marginTop: -4,
        fontFamily: Theme.font.black,
        letterSpacing: -0.2,
        fontSize: 16,
        color: "white",
    },
    currency: {
        fontSize: 10,
    },
});

export default ProductList;