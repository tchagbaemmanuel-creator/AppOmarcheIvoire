import { StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ForgotPasswordForm from "../components/ForgotPasswordForm";

export default function ForgotPasswordScreen() {
	return (
		<KeyboardAwareScrollView
			style={{ flex: 1 }}
			contentContainerStyle={styles.container}
		>
			<ForgotPasswordForm />
		</KeyboardAwareScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		justifyContent: "flex-start",
	},
});
