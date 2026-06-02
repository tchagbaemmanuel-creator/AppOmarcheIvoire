import { View } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { HeaderContainer, HeaderSubtitle, HeaderTitle } from '@/components/ui/Header'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { Agent } from '@/features/auth/redux/agent.api'
import OrderList from '../components/(orders)/OrderList'

export default function OrdersScreen() {
    const auth = useSelector((state: RootState) => state.auth)
    const marketId = (auth.user as Agent).marketId
    return (
        <View style={{ flex: 1 }}>
            <Header />
            <OrderList marketId={marketId} />
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
