import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBar from '@/components/ui/TabBar';
import { Iconify } from 'react-native-iconify';
import { Theme } from '@/config/constants';
import OrdersScreen from '../views/OrdersScreen';
import SellerStackRouter from './SellerStackRouter';
import ProfileStackRouter from './ProfileStackRouter';

export type AgentTabParamList = {
    Orders: undefined;
    Sellers: undefined;
    Settings: undefined;
};

const Tab = createBottomTabNavigator<AgentTabParamList>()

function TabIcon({ label, isFocused }: { label: string, isFocused: boolean }) {
    const size = 24;
    if (label === 'Orders') return <Iconify icon="material-symbols:receipt" color={isFocused ? Theme.colors.green : 'rgba(0,0,0,.2)'} size={size} />
    if (label === 'Sellers') return <Iconify icon="mdi:shop-outline" color={isFocused ? Theme.colors.green : 'rgba(0,0,0,.2)'} size={size + 8} />
    else return <Iconify icon="pajamas:profile" color={isFocused ? Theme.colors.green : 'rgba(0,0,0,.2)'} size={size} />
}

export default function AgentTabRouter() {
    return (
        <Tab.Navigator
            tabBar={props => <TabBar tabIconComponent={TabIcon} {...props} />}
            screenOptions={
                { headerShown: false }
            }>
            <Tab.Screen name="Orders" component={OrdersScreen} />
            <Tab.Screen name="Sellers" component={SellerStackRouter} />
            <Tab.Screen name="Settings" component={ProfileStackRouter} />
        </Tab.Navigator>
    );
}