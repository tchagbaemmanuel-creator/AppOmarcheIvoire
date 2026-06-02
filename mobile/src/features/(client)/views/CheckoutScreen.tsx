import { Text, View } from 'react-native'
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BackButton, HeaderContainer, HeaderSubtitle, HeaderTitle } from '../../../components/ui/Header'
import { ButtonContainer, ButtonText } from '@/components/Button'
import { Theme } from '@/config/constants'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'
import { CartItemType } from '../../(client)/redux/cart.slice'
import { useFetchSellersByMarketIdQuery } from '../../(client)/redux/marketsApi.slice'
import CheckoutForm from '../../(client)/components/CheckoutForm'
import { MarketStackParamList } from '../routers/MarketStackRouter'

export default function CheckoutScreen(props: NativeStackScreenProps<MarketStackParamList, 'Checkout'>) {
    const cart = useSelector((state: RootState) => state.cart[props.route.params.marketId] ?? [])
    return (
        <KeyboardAwareScrollView style={{ flex: 1 }}>
            <Header stackProps={props} />
            <Cart cart={cart} marketId={props.route.params.marketId} />
            <CheckoutForm cart={cart} marketId={props.route.params.marketId} />
        </KeyboardAwareScrollView>
    )
}


function Header(props: { stackProps: NativeStackScreenProps<MarketStackParamList, 'Checkout'> }) {
    const insets = useSafeAreaInsets()
    return (
        <HeaderContainer style={{ paddingBottom: 8, paddingTop: insets.top + 8 }}>
            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                <BackButton navigation={props.stackProps.navigation} />
            </View>

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <HeaderSubtitle>Ma</HeaderSubtitle>
                <HeaderTitle>Commande</HeaderTitle>
            </View>

            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                <ButtonContainer
                    style={{ backgroundColor: Theme.colors.greenLight, height: 42, paddingHorizontal: 12, width: 'auto' }} >
                    <ButtonText color={Theme.colors.greenDark} style={{ fontFamily: Theme.font.black, fontSize: 12 }}>{props.stackProps.route.params.marketName}</ButtonText>
                </ButtonContainer>
            </View>
        </HeaderContainer>
    )
}

function Cart(props: { cart: CartItemType[], marketId: string }) {
    return (
        <View>
            {props.cart.map((item) => (
                <CartItem key={item.product.productId} item={item} marketId={props.marketId} />
            ))}
        </View>
    )
}

function CartItem(props: { item: CartItemType, marketId: string }) {
    const { data: sellers } = useFetchSellersByMarketIdQuery(props.marketId)
    const seller = sellers?.find(seller => seller.sellerId === props.item.product.sellerId) || { firstName: '' }
    return <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}>
        <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ backgroundColor: Theme.colors.greenLight, width: 28, height: 28, borderRadius: 999, alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
                <Text style={{ fontFamily: Theme.font.extraBold, fontSize: 10, letterSpacing: -.2, color: Theme.colors.greenDark }}>
                    x{props.item.quantity}
                </Text>
            </View>
            <View>
                <Text style={{ color: 'rgba(0,0,0,0.3)', fontSize: 8, letterSpacing: 0, fontFamily: Theme.font.extraBold }}>CHEZ {seller.firstName.toUpperCase()}</Text>
                <Text style={{ color: Theme.colors.black, fontSize: 14, letterSpacing: -.5, fontFamily: Theme.font.black }}>{props.item.product.name}</Text>
            </View>
        </View>
        <View>
            <Text style={{ color: 'rgba(0,0,0,0.3)', fontSize: 8, letterSpacing: 0, fontFamily: Theme.font.extraBold }}>PRIX TOTAL</Text>
            <Text style={{ fontFamily: Theme.font.black, color: Theme.colors.greenDark, fontSize: 16, letterSpacing: -.5 }}>
                {props.item.quantity * props.item.product.price}
                <Text style={{ fontSize: 10 }}>CFA</Text>
            </Text>
        </View>
    </View>
}
