import { View } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { HeaderContainer, HeaderSubtitle, HeaderTitle } from '../../../components/ui/Header'
import OrderList from '../../(client)/components/OrderList'

export default function OrdersScreen() {
    return (
        <View style={{ flex: 1 }}>
            <Header />
            <OrderList />
        </View>
    )
}

function Header() {
    const insets = useSafeAreaInsets()
    return (
        <HeaderContainer style={{ paddingBottom: 10, paddingTop: insets.top + 8 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <HeaderSubtitle>Mes</HeaderSubtitle>
                <HeaderTitle>Commandes</HeaderTitle>
            </View>
        </HeaderContainer>
    )
}
