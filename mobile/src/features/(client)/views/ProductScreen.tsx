import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack'
import { useFetchProductByIdQuery } from '../../(client)/redux/productsApi.slice'
import type { ProductDetails } from '../../(client)/redux/productsApi.slice'
import { Theme } from '@/config/constants'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Iconify } from 'react-native-iconify'
import { ButtonContainer, ButtonText } from '@/components/Button'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { useDispatch } from 'react-redux'
import { addItemToCart } from '../../(client)/redux/cart.slice'
import { showToast } from '@/redux/slices/toast.slice'
import { Image } from 'expo-image'
import { MarketStackParamList } from '../routers/MarketStackRouter'
import { ProductCategory } from "../redux/productsApi.slice";

export default function ProductScreen(props: NativeStackScreenProps<MarketStackParamList, 'Product'>) {
    const { data } = useFetchProductByIdQuery(props.route.params.productId)
    const dispatch = useDispatch()
    const [quantity, setQuantity] = React.useState(1)

    const handleOnPress = (data: ProductDetails) => {
        dispatch(addItemToCart({
            marketId: props.route.params.marketId,
            product: data,
            quantity
        }))
        dispatch(showToast({ message: `${quantity} ${data.unit} de ${data.name} ajouté au panier`, type: 'success' }))
        props.navigation.goBack()
    }

    if (!data) return null;


    return (
        <KeyboardAwareScrollView style={{ flex: 1 }}>
            <StatusBar style="light" />
            <BackButton navigation={props.navigation} />
            <Carousel images={data.pictureUrl} />
            <ProductDetailsView data={data} quantity={quantity} setQuantity={setQuantity} />
            <View style={{ paddingHorizontal: 16 }}>
                <ButtonContainer
                    onPress={() => handleOnPress(data)}
                    style={[
                        styles.addToCartButton,
                        !data.isInStock && styles.disabledButton
                    ]}
                    disabled={!data.isInStock}
                >
                    <ButtonText color="white" style={styles.addToCartButtonText}>
                        {data.isInStock ? (
                            <>
                                Mettre {quantity * data.amount}<Text style={{ fontSize: 8 }}>{data.unit.toUpperCase()}
                                </Text> dans le panier
                                <Text style={{ fontFamily: Theme.font.semiBold, fontSize: 14 }}>
                                    {'  '}- {quantity * data.price}<Text style={{ fontSize: 8 }}>CFA</Text>
                                </Text>
                            </>
                        ) : (
                            'Produit non disponible'
                        )}
                    </ButtonText>
                </ButtonContainer>
            </View>
            <View style={{ padding: 16, gap: 4 }}>
                <Text style={styles.descriptionTitle}>Description</Text>
                <Text style={styles.descriptionText}>{data.description}</Text>
            </View>
        </KeyboardAwareScrollView>
    )
}

function BackButton(props: { navigation: NativeStackNavigationProp<MarketStackParamList, 'Product'> }) {
    const insets = useSafeAreaInsets()
    return (
        <ButtonContainer
            onPress={() => props.navigation.goBack()}
            style={{ position: 'absolute', width: 42, height: 42, top: 8 + insets.top, left: 16, zIndex: 1, borderRadius: 999, backgroundColor: 'white' }}>
            <Iconify icon="icon-park-outline:return" size={16} color={Theme.colors.black} />
        </ButtonContainer>
    )
}

function Carousel(props: { images: string[] }) {
    const [activeIndex, setActiveIndex] = React.useState(0)
    const width = Dimensions.get('window').width
    const height = 270
    const handleOnScroll = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x
        const index = Math.floor(contentOffsetX / width)
        setActiveIndex(index)
    }
    return (
        <View style={{ position: 'relative' }}>
            <CarouselIndicator activeIndex={activeIndex} />
            <ScrollView
                horizontal
                pagingEnabled
                contentContainerStyle={{ height: height, position: 'relative' }}
                showsHorizontalScrollIndicator={false}
                onScroll={handleOnScroll}
                style={{ position: 'relative', height: height, width: '100%', backgroundColor: Theme.colors.greenDark }}>
                <View style={{ height: height, width: width, backgroundColor: Theme.colors.greenLight, position: 'relative' }}>
                    <Image contentFit='cover' source={{ uri: props.images[0] }} style={{ height: height, width: width }} />
                </View>
                <View style={{ height: height, width: width, backgroundColor: Theme.colors.green, position: 'relative' }}>
                    <Image contentFit='cover' source={{ uri: props.images[1] }} style={{ height: height, width: width }} />
                </View>
                <View style={{ height: height, width: width, backgroundColor: Theme.colors.greenDark, position: 'relative' }}>
                    <Image contentFit='cover' source={{ uri: props.images[2] }} style={{ height: height, width: width }} />
                </View>
            </ScrollView>
        </View>
    )
}

function CarouselIndicator(props: { activeIndex: number }) {
    return (
        <View style={{ zIndex: 2, position: 'absolute', bottom: 16, right: 16, flexDirection: 'row', gap: 4 }}>
            {[0, 1, 2].map((index) => (
                <View key={index} style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: props.activeIndex === index ? 'white' : 'rgba(0,0,0,.8)' }} />
            ))}
        </View>
    )
}


function ProductDetailsView(props: { data: ProductDetails, quantity: number, setQuantity: React.Dispatch<React.SetStateAction<number>> }) {
    return (
        <View style={styles.productDetailsContainer}>
            <View style={styles.productInfo}>
                <CategoryLabel category={props.data.category} />
                <Text style={styles.productNameStyle}>{props.data.name}</Text>
            </View>
            <View style={{ gap: 8, alignItems: 'flex-end' }}>
                <View style={styles.productPriceContainer}>
                    <Text style={styles.productPrice}>
                        {props.data.price}
                        <Text style={styles.currency}>CFA</Text>
                        <Text style={styles.unit}> / {props.data.amount} {props.data.unit.toUpperCase()}</Text>
                    </Text>
                </View>
                <QuantitySelector unit={props.data.unit} amount={props.data.amount} quantity={props.quantity} setQuantity={props.setQuantity} />
            </View>
        </View>
    )
}

function QuantitySelector(props: { quantity: number, setQuantity: React.Dispatch<React.SetStateAction<number>>, unit: string, amount: number }) {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8, borderRadius: 999, borderWidth: 1, borderColor: "rgba(0,0,0,.1)" }}>
            <ButtonContainer
                onPress={() => props.quantity > 1 && props.setQuantity(props.quantity - 1)}
                style={{ width: 48, height: 28, borderRadius: 999, backgroundColor: Theme.colors.greenLight }}>
                <Iconify icon="fluent:subtract-20-regular" size={16} color={Theme.colors.green} />
            </ButtonContainer>
            <Text style={{ fontFamily: Theme.font.black, color: Theme.colors.black, fontSize: 16, letterSpacing: -.5 }}>
                {props.quantity * props.amount}<Text style={{ fontSize: 10 }}>{props.unit.toUpperCase()}</Text>
            </Text>
            <ButtonContainer
                onPress={() => props.setQuantity(props.quantity + 1)}
                style={{ width: 48, height: 28, borderRadius: 999, backgroundColor: Theme.colors.greenLight }}>
                <Iconify icon="fluent:add-20-regular" size={16} color={Theme.colors.green} />
            </ButtonContainer>
        </View>
    )
}

export function CategoryLabel(props: { category: ProductCategory, textSize?: number, iconSize?: number }) {
    const iconProps = { size: props.iconSize ?? 16, color: Theme.colors.greenDark }
    const categoryIcons: { [key in ProductCategory]: JSX.Element } = {
        [ProductCategory.Fruits]: <Iconify icon="icon-park-twotone:apple-one" {...iconProps} />,
        [ProductCategory.Legumes]: <Iconify icon="icon-park-twotone:tomato" {...iconProps} />,
        [ProductCategory.Viandes]: <Iconify icon="tabler:meat" {...iconProps} />,
        [ProductCategory.Poissons]: <Iconify icon="icon-park-twotone:fish" {...iconProps} />,
        [ProductCategory.Cereales]: <Iconify icon="fluent:food-grains-24-regular" {...iconProps} />,
        [ProductCategory.Tubercules]: <Iconify icon="game-icons:potato" {...iconProps} />,
        [ProductCategory.Mer]: <Iconify icon="hugeicons:shellfish" {...iconProps} />,
        [ProductCategory.Epices]: <Iconify icon="mdi:shaker-outline" {...iconProps} />,
        [ProductCategory.Autres]: <Iconify icon="mdi:food-apple-outline" {...iconProps} />
    }

    return (
        <View style={styles.categoryLabel}>
            <Text style={[styles.categoryText, { fontSize: props.textSize ?? 12 }]}>{props.category}</Text>
            {categoryIcons[props.category]}
        </View>
    )
}


const styles = StyleSheet.create({
    productDetailsContainer: {
        padding: 16,
        paddingBottom: 8,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    productInfo: {
        gap: 4,
    },
    productNameStyle: {
        fontFamily: Theme.font.black,
        color: Theme.colors.black,
        fontSize: 20,
        letterSpacing: -.7,
    },
    categoryLabel: {
        flexDirection: 'row',
        backgroundColor: Theme.colors.greenLight,
        borderRadius: 999,
        gap: 4,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6,
        paddingHorizontal: 8,
    },
    categoryText: {
        color: Theme.colors.greenDark,
        fontFamily: Theme.font.black,
        fontSize: 12,
        letterSpacing: -.5,
    },
    productPriceContainer: {
        gap: 4,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
        borderRadius: 999,
    },
    productPrice: {
        padding: 8,
        paddingHorizontal: 12,
        color: Theme.colors.black,
        fontFamily: Theme.font.black,
        fontSize: 16,
        letterSpacing: -.5,
    },
    currency: {
        fontSize: 8,
    },
    unit: {
        fontSize: 12,
        fontFamily: Theme.font.extraBold,
        opacity: .5
    },
    addToCartButton: {
        backgroundColor: Theme.colors.green,
        borderRadius: 999,
        height: 42,
    },
    disabledButton: {
        backgroundColor: 'gray',
        opacity: 0.5,
    },
    addToCartButtonText: {
        fontFamily: Theme.font.extraBold,
        fontSize: 14,
    },
    descriptionTitle: {
        fontFamily: Theme.font.black,
        color: Theme.colors.black,
        fontSize: 16,
        letterSpacing: -0.5,
    },
    descriptionText: {
        fontFamily: Theme.font.medium,
        letterSpacing: -0.5,
        fontSize: 14,
        opacity: 0.5,
    },
})