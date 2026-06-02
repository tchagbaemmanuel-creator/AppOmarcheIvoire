import { useFonts, Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold, Montserrat_800ExtraBold, Montserrat_900Black } from "@expo-google-fonts/montserrat"
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import BaseRouter from '@/routers/BaseRouter';
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import Overlay from "@/components/ui/Overlay";
import React from "react";
import { initLocalNotifications } from "@/utils/notifications";

const MyTheme = {
    ...DefaultTheme
    ,
    colors: {
        ...DefaultTheme.colors,
        background: 'white'
    },
};

export default function App() {
    let [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Montserrat_500Medium,
        Montserrat_600SemiBold,
        Montserrat_700Bold,
        Montserrat_800ExtraBold,
        Montserrat_900Black
    });

    React.useEffect(() => {
        void initLocalNotifications();
    }, []);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <Provider store={store}>
            <NavigationContainer theme={MyTheme}>
                <Overlay />
                <BaseRouter />
            </NavigationContainer>
        </Provider>
    );
}
