import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationProp } from "@react-navigation/native";

import ProfileScreen from "../views/ProfileScreen";
import SellerInfoScreen from "../views/SellerInfoScreen";

export type ProfileStackParamList = {
  ProfileHome: undefined;
  SellerInfo: undefined;
};

export type ProfileStackNavigation = NavigationProp<ProfileStackParamList>;

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStackRouter() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProfileHome" component={ProfileScreen} />
      <Stack.Screen name="SellerInfo" component={SellerInfoScreen} />
    </Stack.Navigator>
  );
}
