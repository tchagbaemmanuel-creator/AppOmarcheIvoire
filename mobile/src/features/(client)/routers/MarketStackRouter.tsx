import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationProp } from '@react-navigation/native';
import SellersScreen from '../views/SellersScreen';
import ProductScreen from '../views/ProductScreen';
import CartScreen from '../views/CartScreen';
import CheckoutScreen from '../views/CheckoutScreen';

export type MarketStackParamList = {
    Product: { marketId: string, productId: string };
    Sellers: { marketId: string, name: string };
    Seller: undefined;
    Cart: { marketId: string, marketName: string };
    Checkout: { marketId: string, marketName: string };
    Delivery: undefined;
};

export type MarketStackNavigation = NavigationProp<MarketStackParamList>;

const Stack = createNativeStackNavigator<MarketStackParamList>();

export default function MarketStackRouter() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="Sellers" component={SellersScreen} />
            <Stack.Screen name="Product" component={ProductScreen} />
            <Stack.Screen name="Cart" component={CartScreen} options={{ presentation: "formSheet" }} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} options={{
            }} />
        </Stack.Navigator>
    );
}