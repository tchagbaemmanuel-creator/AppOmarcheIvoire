import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { Theme } from "@/config/constants";
import { Formik } from "formik";
import { FormInputContainer, InputError, FormInputField } from "./FormInput";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ButtonContainer, ButtonText } from "@/components/Button";
import * as Yup from "yup";
import { useForgotPasswordMutation } from "../redux/auth.api";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useNavigation } from "@react-navigation/native";
import { AuthStackNavigation } from "../routers/AuthStackRouter";
import { showToast } from "@/redux/slices/toast.slice";

function mapAuthRoleToApi(
	role: "Client" | "Agent" | "Livreur"
): "Client" | "Agent" | "Shipper" {
	if (role === "Livreur") return "Shipper";
	return role;
}

export default function ForgotPasswordForm() {
	const navigation = useNavigation<AuthStackNavigation>();
	const dispatch = useDispatch();
	const role = useSelector((state: RootState) => state.auth.role);
	const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Mot de passe oublié</Text>
			<Text style={styles.subtitle}>
				Indiquez le numéro de téléphone de votre compte. Nous vous indiquerons la
				suite à suivre.
			</Text>

			<Formik
				initialValues={{ phone: "" }}
				onSubmit={async (values) => {
					try {
						const { message, requestId } = await forgotPassword({
							phone: values.phone,
							role: mapAuthRoleToApi(role),
						}).unwrap();
						if (requestId) {
							dispatch(showToast({ message, type: "success" }));
							navigation.navigate("ForgotPasswordWaiting", {
								requestId,
							});
						} else {
							dispatch(showToast({ message, type: "success" }));
							navigation.goBack();
						}
					} catch {
						/* erreur gérée par le middleware RTK */
					}
				}}
				validationSchema={ForgotSchema}
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
								name="phone"
								size={20}
								color="rgba(0,0,0,0.2)"
							/>
							<FormInputField
								placeholder="Numéro de téléphone"
								onChangeText={handleChange("phone")}
								onBlur={handleBlur("phone")}
								value={values.phone}
								keyboardType="phone-pad"
							/>
						</FormInputContainer>
						{errors.phone && touched.phone && (
							<InputError error={errors.phone} />
						)}

						<View style={styles.buttonGroup}>
							<ButtonContainer
								onPress={() => handleSubmit()}
								disabled={!isValid || isLoading}
							>
								<ButtonText color="white" loading={isLoading}>
									Continuer
								</ButtonText>
							</ButtonContainer>
							<Pressable
								onPress={() => navigation.goBack()}
								style={styles.cancelWrap}
							>
								<Text style={styles.cancelText}>Retour à la connexion</Text>
							</Pressable>
						</View>
					</View>
				)}
			</Formik>
		</View>
	);
}

const ForgotSchema = Yup.object().shape({
	phone: Yup.string()
		.required("Le numéro de téléphone est requis")
		.matches(
			/^[0-9]+$/,
			"Le numéro de téléphone doit contenir uniquement des chiffres"
		),
});

const styles = StyleSheet.create({
	container: {
		width: "100%",
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
	},
	form: {
		gap: 8,
		width: "100%",
	},
	buttonGroup: {
		width: "100%",
		marginTop: 16,
		gap: 12,
	},
	cancelWrap: {
		alignSelf: "center",
		paddingVertical: 8,
	},
	cancelText: {
		color: Theme.colors.green,
		fontFamily: Theme.font.semiBold,
		fontSize: 15,
	},
});
