import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack'
import { RouteProp } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { ButtonContainer, ButtonText } from '@/components/Button'
import { Theme } from '@/config/constants'
import { StatusBar } from 'expo-status-bar'
import { CartItemType, removeItemFromCart, updateItemQuantity } from '../../(client)/redux/cart.slice'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useFetchSellersByMarketIdQuery } from '../../(client)/redux/marketsApi.slice'
import { Image } from 'expo-image'
import { Iconify } from 'react-native-iconify'
import { getMarketCartTotal } from '../helpers/helpers'
import { BackButton, HeaderSubtitle, HeaderTitle } from '../../../components/ui/Header'
import { MarketStackParamList } from '../routers/MarketStackRouter'

export default function CartScreen(props: NativeStackScreenProps<MarketStackParamList, 'Cart'>) {
    const insets = useSafeAreaInsets()
    const cart = useSelector((state: RootState) => state.cart[props.route.params.marketId])
    return (
        <View style={{ flex: 1, paddingTop: 8 + insets.top, paddingBottom: insets.bottom }}>
            <StatusBar style="light" />
            <Header navigation={props.navigation} route={props.route} />
            {cart?.length > 0 && <>
                <CartList data={cart} marketId={props.route.params.marketId} />
                <Checkout data={cart} props={props} />
            </>}
        </View>
    )
}

function Checkout(props: { data: CartItemType[], props: NativeStackScreenProps<MarketStackParamList, 'Cart'> }) {
    const total = getMarketCartTotal(props.data)
    return <View style={{ width: '100%', height: 'auto', borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', padding: 16 }}>
        <View style={{ justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Text style={{ marginTop: 8, color: 'rgba(0,0,0,0.3)', fontSize: 12, letterSpacing: 0, fontFamily: Theme.font.black }}>TOTAL DU PANIER</Text>
                <Text style={{ fontFamily: Theme.font.black, color: Theme.colors.green, fontSize: 16, letterSpacing: -.5 }}>
                    + {total}
                    <Text style={{ fontSize: 10 }}>CFA</Text>
                </Text>
            </View>
        </View>
        <ButtonContainer
            onPress={() => {
                props.props.navigation.replace('Checkout', { marketId: props.props.route.params.marketId, marketName: props.props.route.params.marketName })
            }}

            style={{ backgroundColor: Theme.colors.orange, padding: 16, borderRadius: 999, marginTop: 16 }}>
            <ButtonText color="white" style={{ fontFamily: Theme.font.black, fontSize: 16 }}>Finaliser ma commande - {total}<Text style={{ fontSize: 8 }}>CFA</Text></ButtonText>
        </ButtonContainer>
    </View>
}

function Header({ route, navigation }: { route: RouteProp<MarketStackParamList, 'Cart'>, navigation: NativeStackNavigationProp<MarketStackParamList, 'Cart'> }) {
    return (
        <View style={[styles.headerContainer]}>
            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                <BackButton navigation={navigation} />
            </View>

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <HeaderSubtitle>Mon</HeaderSubtitle>
                <HeaderTitle>Panier</HeaderTitle>
            </View>

            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                <ButtonContainer
                    style={{ backgroundColor: Theme.colors.greenLight, height: 42, paddingHorizontal: 12, width: 'auto' }} >
                    <ButtonText color={Theme.colors.greenDark} style={{ fontFamily: Theme.font.black, fontSize: 12, overflow: 'scroll' }}>{route.params.marketName}</ButtonText>
                </ButtonContainer>
            </View>
        </View>
    )
}

function CartList(props: { data: CartItemType[], marketId: string }) {
    return (
        <FlatList
            data={props.data}
            renderItem={({ item }) => <CartItem item={item} marketId={props.marketId} />}
            keyExtractor={(item) => item.product.productId}
        />
    )
}

function CartItem(props: { item: CartItemType, marketId: string }) {
    const { data: sellers } = useFetchSellersByMarketIdQuery(props.marketId)
    const cart = useSelector((state: RootState) => state.cart[props.marketId])
    const quantity = cart?.find(item => item.product.productId === props.item.product.productId)?.quantity || 1
    const seller = sellers?.find(seller => seller.sellerId === props.item.product.sellerId)
    const dispatch = useDispatch()

    function setQuantity(quantity: number) {
        dispatch(updateItemQuantity({ marketId: props.marketId, productId: props.item.product.productId, quantity }))
    }

    function removeItem() {
        dispatch(removeItemFromCart({ marketId: props.marketId, productId: props.item.product.productId }))
    }

    if (!seller) return null
    return <View style={styles.cartItem}>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
            <View style={{ position: 'relative', height: 80, width: 80, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <Image source={{ uri: props.item.product.pictureUrl[0] }} contentFit='cover' style={{ flex: 1 }} />
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                {/* <CategoryLabel category={props.item.product.category} textSize={10} iconSize={10} /> */}
                <Text style={{ marginTop: 8, color: 'rgba(0,0,0,0.3)', fontSize: 8, letterSpacing: 0, fontFamily: Theme.font.extraBold }}>CHEZ {seller.firstName.toUpperCase()}</Text>
                <Text style={{ color: Theme.colors.black, fontSize: 14, letterSpacing: -.5, fontFamily: Theme.font.black }}>{props.item.product.name}</Text>
                <View style={{ backgroundColor: Theme.colors.greenLight, width: 28, height: 28, borderRadius: 999, alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
                    <Text style={{ fontFamily: Theme.font.extraBold, fontSize: 10, letterSpacing: -.2, color: Theme.colors.greenDark }}>
                        x{quantity}
                    </Text>
                </View>
            </View>
            <View style={{ alignItems: 'flex-end', flex: 1, }}>
                <ButtonContainer
                    onPress={() => removeItem()}
                    style={{ backgroundColor: 'rgba(255,0,0,0.05)', width: 30, height: 'auto', flexDirection: 'row', marginBottom: 4, borderRadius: 8, padding: 8, paddingHorizontal: 10 }}>
                    <Iconify icon="material-symbols:delete" size={12} color={Theme.colors.red} />
                </ButtonContainer>
                <Text style={{ fontFamily: Theme.font.black, color: Theme.colors.greenDark, fontSize: 14, letterSpacing: -.5 }}>
                    +{quantity * props.item.product.price}
                    <Text style={{ fontSize: 10 }}>CFA</Text>
                </Text>
                <View style={{ marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 8, }}>
                    <ButtonContainer
                        onPress={() => quantity > 1 && setQuantity(quantity - 1)}
                        style={{ width: 32, height: 32, borderRadius: 999, backgroundColor: Theme.colors.greenLight }}>
                        <Iconify icon="fluent:subtract-20-regular" size={14} color={Theme.colors.green} />
                    </ButtonContainer>
                    <Text style={{ fontFamily: Theme.font.black, color: Theme.colors.black, fontSize: 12, letterSpacing: -.5 }}>
                        {quantity * props.item.product.amount}<Text style={{ fontSize: 10 }}>{props.item.product.unit.toUpperCase()}</Text>
                    </Text>
                    <ButtonContainer
                        onPress={() => setQuantity(quantity + 1)}
                        style={{ width: 32, height: 32, borderRadius: 999, backgroundColor: Theme.colors.greenLight }}>
                        <Iconify icon="fluent:add-20-regular" size={14} color={Theme.colors.green} />
                    </ButtonContainer>
                </View>

            </View>
        </View>
        <View>

        </View>
    </View>
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
        marginTop: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    headerTitle: {
        fontFamily: Theme.font.black,
        color: Theme.colors.greenDark,
        letterSpacing: -.5,
        fontSize: 18
    },
    headerSubtitle: {
        fontFamily: Theme.font.bold,
        color: 'gray',
        letterSpacing: -.5,
        fontSize: 10,
        marginBottom: -2
    },
    headerMarketName: {
        fontFamily: Theme.font.bold,
        color: 'gray',
        letterSpacing: -.5,
        fontSize: 14,
        marginRight: 8
    },
    cartItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)'
    },
})