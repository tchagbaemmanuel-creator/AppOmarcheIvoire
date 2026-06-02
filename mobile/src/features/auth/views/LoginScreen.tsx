import { StyleSheet } from "react-native";
import RoleSelector from "../components/RoleSelector";
import LoginForm from "../components/LoginForm";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Image } from "expo-image";

const image = require("../../../../assets/omarche.png");

export default function LoginScreen() {
    return (
        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.container}>
            <RoleSelector />
            <LoginForm />
            <Image
                source={image}
                style={styles.logo}
            />
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 20,
    },
    logo: {
        width: 150,
        height: 50,
        marginBottom: 20
    },
});
