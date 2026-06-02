import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBar from '@/components/ui/TabBar';
import { Iconify } from 'react-native-iconify';
import { Theme } from '@/config/constants';
import { Text, View } from 'react-native';
import ShippingScreen from '../views/ShippingScreen';

export type ShipperTabParamList = {
    Shipping: undefined;
    Settings: undefined;
};

function EmptyScreen() {
    return <View>
        <Text>Empty</Text>
    </View>
}

const Tab = createBottomTabNavigator<ShipperTabParamList>()

function TabIcon({ label, isFocused }: { label: string, isFocused: boolean }) {
    const size = 24;
    if (label === 'Shipping') return <Iconify icon="material-symbols:map" color={isFocused ? Theme.colors.green : 'rgba(0,0,0,.2)'} size={size} />
    else if (label === 'Settings') return <Iconify icon="pajamas:profile" color={isFocused ? Theme.colors.green : 'rgba(0,0,0,.2)'} size={size} />
    return <Iconify icon="pajamas:profile" color={isFocused ? Theme.colors.green : 'rgba(0,0,0,.2)'} size={size} />
}

export default function ShipperTabRouter() {
    return (
        <Tab.Navigator
            tabBar={props => <TabBar tabIconComponent={TabIcon} {...props} />}
            screenOptions={
                { headerShown: false }
            }>
            <Tab.Screen name="Shipping" component={ShippingScreen} />
            {/* <Tab.Screen name="Settings" component={EmptyScreen} /> */}
        </Tab.Navigator>
    );
}
