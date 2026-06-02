import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationProp } from '@react-navigation/native';
import SellerScreen from '../views/SellerScreen';
import SellersScreen from '../views/SellersScreen';
import ProductScreen from '../views/ProductScreen';
import AddProductScreen from '../views/AddProductScreen';

export type SellerStackParamList = {
    SellersHome: undefined;
    Seller: { sellerId: string };
    Product: { productId: string };
    AddProduct: { sellerId: string };
};

export type SellerStackNavigation = NavigationProp<SellerStackParamList>;

const Stack = createNativeStackNavigator<SellerStackParamList>();

export default function SellerStackRouter() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="SellersHome" component={SellersScreen} />
            <Stack.Screen name="Seller" component={SellerScreen} />
            <Stack.Screen name="Product" component={ProductScreen} />
            <Stack.Screen name="AddProduct" component={AddProductScreen} />
        </Stack.Navigator>
    );
}