import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React, { useEffect, useRef } from "react";
import { Theme } from "@/config/constants";
import {
	RouteProp,
	StackActions,
	useNavigation,
	useRoute,
} from "@react-navigation/native";
import {
	AuthStackNavigation,
	AuthStackParamList,
} from "../routers/AuthStackRouter";
import { useForgotPasswordStatusQuery } from "../redux/auth.api";
import { useDispatch } from "react-redux";
import { showToast } from "@/redux/slices/toast.slice";

type Route = RouteProp<AuthStackParamList, "ForgotPasswordWaiting">;

export default function ForgotPasswordWaitingScreen() {
	const navigation = useNavigation<AuthStackNavigation>();
	const dispatch = useDispatch();
	const { params } = useRoute<Route>();
	const { requestId } = params;
	const done = useRef(false);

	const { data, isError } = useForgotPasswordStatusQuery(requestId, {
		pollingInterval: 4000,
	});

	useEffect(() => {
		if (done.current || !data) return;
		if (data.status === "ready") {
			done.current = true;
			navigation.dispatch(
				StackActions.replace("ResetPasswordAfterApproval", { requestId })
			);
			return;
		}
		if (data.status === "expired" || data.status === "completed") {
			done.current = true;
			dispatch(
				showToast({
					message:
						data.status === "completed"
							? "Cette demande a déjà été utilisée."
							: "Cette demande n'est plus valide. Vous pouvez en lancer une nouvelle.",
					type: "warning",
				})
			);
			navigation.navigate("Login", { phone: undefined });
		}
	}, [data, dispatch, navigation, requestId]);

	useEffect(() => {
		if (done.current || !isError) return;
		done.current = true;
		dispatch(
			showToast({
				message: "Impossible de vérifier le statut. Réessayez plus tard.",
				type: "warning",
			})
		);
		navigation.navigate("Login", { phone: undefined });
	}, [dispatch, isError, navigation]);

	return (
		<View style={styles.container}>
			<ActivityIndicator size="large" color={Theme.colors.orange} />
			<Text style={styles.title}>Demande envoyée</Text>
			<Text style={styles.text}>
				Votre demande a été transmise à l&apos;équipe O&apos;Marché. Vous serez
				informé dès qu&apos;un administrateur aura autorisé la réinitialisation.
				{"\n\n"}
				Gardez cet écran ouvert : dès que c&apos;est validé, vous pourrez choisir
				un nouveau mot de passe.
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 32,
		justifyContent: "center",
		gap: 20,
	},
	title: {
		fontSize: 22,
		color: Theme.colors.orange,
		fontFamily: Theme.font.black,
		textAlign: "center",
	},
	text: {
		fontSize: 15,
		lineHeight: 22,
		color: Theme.colors.blackLight,
		fontFamily: Theme.font.medium,
		textAlign: "center",
	},
});
