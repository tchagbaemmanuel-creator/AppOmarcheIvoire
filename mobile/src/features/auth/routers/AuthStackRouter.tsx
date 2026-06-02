// In App.js in a new project

import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../views/LoginScreen';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import RegisterScreen from '../views/RegisterScreen';
import ForgotPasswordScreen from '../views/ForgotPasswordScreen';
import ForgotPasswordWaitingScreen from '../views/ForgotPasswordWaitingScreen';
import ResetPasswordAfterApprovalScreen from '../views/ResetPasswordAfterApprovalScreen';

type LoginParams = {
    phone: string | undefined;
};

export type LoginScreenRouteProp = RouteProp<AuthStackParamList, 'Login'>;

export type AuthStackParamList = {
    Login: LoginParams;
    Register: undefined;
    ForgotPassword: undefined;
    ForgotPasswordWaiting: { requestId: string };
    ResetPasswordAfterApproval: { requestId: string };
};


export type AuthStackNavigation = NavigationProp<AuthStackParamList>;

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStackRouter() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
                options={{
                    headerShown: true,
                    title: 'Mot de passe oublié',
                    headerBackTitleVisible: false,
                }}
            />
            <Stack.Screen
                name="ForgotPasswordWaiting"
                component={ForgotPasswordWaitingScreen}
                options={{
                    headerShown: true,
                    title: 'En attente',
                    headerBackTitleVisible: false,
                }}
            />
            <Stack.Screen
                name="ResetPasswordAfterApproval"
                component={ResetPasswordAfterApprovalScreen}
                options={{
                    headerShown: true,
                    title: 'Nouveau mot de passe',
                    headerBackTitleVisible: false,
                }}
            />

        </Stack.Navigator>
    );
}
