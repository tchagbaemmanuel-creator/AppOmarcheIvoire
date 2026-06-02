import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Theme } from "@/config/constants";
import { Formik } from "formik";
import {
	FormInputContainer,
	InputError,
	PasswordInputField,
} from "../components/FormInput";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ButtonContainer, ButtonText } from "@/components/Button";
import * as Yup from "yup";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
	AuthStackNavigation,
	AuthStackParamList,
} from "../routers/AuthStackRouter";
import { useCompleteForgotPasswordMutation } from "../redux/auth.api";
import { useDispatch } from "react-redux";
import { showToast } from "@/redux/slices/toast.slice";

type Route = RouteProp<AuthStackParamList, "ResetPasswordAfterApproval">;

const Schema = Yup.object().shape({
	password: Yup.string()
		.min(8, "Au moins 8 caractères.")
		.required("Mot de passe requis."),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref("password")], "Les mots de passe doivent correspondre.")
		.required("Confirmation requise."),
});

export default function ResetPasswordAfterApprovalScreen() {
	const navigation = useNavigation<AuthStackNavigation>();
	const dispatch = useDispatch();
	const { params } = useRoute<Route>();
	const { requestId } = params;
	const [complete, { isLoading }] = useCompleteForgotPasswordMutation();

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Nouveau mot de passe</Text>
			<Text style={styles.subtitle}>
				Choisissez un mot de passe sécurisé pour votre compte.
			</Text>

			<Formik
				initialValues={{ password: "", confirmPassword: "" }}
				validationSchema={Schema}
				onSubmit={async (values) => {
					try {
						await complete({
							requestId,
							password: values.password,
						}).unwrap();
						dispatch(
							showToast({
								message: "Mot de passe mis à jour. Vous pouvez vous connecter.",
								type: "success",
							})
						);
						navigation.navigate("Login", { phone: undefined });
					} catch {
						/* RTK middleware */
					}
				}}
			>
				{({
					handleChange,
					handleBlur,
					handleSubmit,
					values,
					errors,
					touched,
					isValid,
				}) => (
					<View style={styles.form}>
						<FormInputContainer>
							<MaterialCommunityIcons
								name="lock"
								size={20}
								color="rgba(0,0,0,0.2)"
							/>
							<PasswordInputField
								placeholder="Nouveau mot de passe"
								onChangeText={handleChange("password")}
								onBlur={handleBlur("password")}
								value={values.password}
							/>
						</FormInputContainer>
						{errors.password && touched.password && (
							<InputError error={errors.password} />
						)}

						<FormInputContainer>
							<MaterialCommunityIcons
								name="lock-check"
								size={20}
								color="rgba(0,0,0,0.2)"
							/>
							<PasswordInputField
								placeholder="Confirmer le mot de passe"
								onChangeText={handleChange("confirmPassword")}
								onBlur={handleBlur("confirmPassword")}
								value={values.confirmPassword}
							/>
						</FormInputContainer>
						{errors.confirmPassword && touched.confirmPassword && (
							<InputError error={errors.confirmPassword} />
						)}

						<ButtonContainer
							onPress={() => handleSubmit()}
							disabled={!isValid || isLoading}
							style={{ marginTop: 16 }}
						>
							<ButtonText color="white" loading={isLoading}>
								Enregistrer
							</ButtonText>
						</ButtonContainer>
					</View>
				)}
			</Formik>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 32,
		gap: 16,
	},
	title: {
		fontSize: 28,
		letterSpacing: -0.5,
		color: Theme.colors.orange,
		fontFamily: Theme.font.black,
	},
	subtitle: {
		fontSize: 14,
		color: Theme.colors.blackLight,
		fontFamily: Theme.font.medium,
		lineHeight: 20,
		marginBottom: 8,
	},
	form: {
		gap: 8,
		width: "100%",
	},
});
