// RegisterScreen.tsx
import { StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RegisterForm from "../components/RegisterForm";

export default function RegisterScreen() {
    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container} style={{ flex: 1 }}>
            <RegisterForm />
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
});