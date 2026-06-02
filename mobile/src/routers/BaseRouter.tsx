import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStackRouter, { AuthStackParamList } from '@/features/auth/routers/AuthStackRouter';
import { NavigationProp, NavigatorScreenParams } from '@react-navigation/native';
import MarketStackRouter, { MarketStackParamList } from '@/features/(client)/routers/MarketStackRouter';
import ClientTabRouter from '@/features/(client)/routers/ClientTabRouter';
import AgentTabRouter from '@/features/(agent)/routers/AgentTabRouter';
import ShipperTabRouter from '@/features/(shipper)/routers/ShipperTabRouter';

type RootStackParamList = {
    Auth: NavigatorScreenParams<AuthStackParamList>;
    Client: undefined;
    Agent: undefined;
    Livreur: undefined;
    Market: NavigatorScreenParams<MarketStackParamList>;
    Shipper: undefined;
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}
export type RootStackNavigator = NavigatorScreenParams<RootStackParamList>;
export type RootStackNavigation = NavigationProp<RootStackParamList>;

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function BaseRouter() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="Auth" component={AuthStackRouter} />
            <Stack.Screen name="Client" component={ClientTabRouter} />
            <Stack.Screen name="Agent" component={AgentTabRouter} />
            <Stack.Screen name="Market" component={MarketStackRouter} />
            <Stack.Screen name="Shipper" component={ShipperTabRouter} />
        </Stack.Navigator>
    );
}
