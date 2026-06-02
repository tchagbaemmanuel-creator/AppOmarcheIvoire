import { Platform } from "react-native";

async function getNotifications() {
	try {
		// Lazy import: évite un crash si le module natif n'est pas dans le binaire.
		const mod = await import("expo-notifications");
		return mod;
	} catch {
		if (__DEV__) {
			console.warn(
				"[notifications] expo-notifications indisponible (module natif manquant)."
			);
		}
		return null;
	}
}

export async function initLocalNotifications() {
	const Notifications = await getNotifications();
	if (!Notifications) return;

	// En foreground, Android n'affiche pas forcément une notification "banner"
	// sans un handler. On force l'affichage d'une alerte.
	Notifications.setNotificationHandler({
		handleNotification: async () => ({
			shouldShowAlert: true,
			shouldPlaySound: true,
			shouldSetBadge: false,
		}),
	});

	if (Platform.OS === "android") {
		await Notifications.setNotificationChannelAsync("default", {
			name: "Notifications",
			importance: Notifications.AndroidImportance.HIGH,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: "#597D56",
		});
	}
}

async function ensurePermissions() {
	const Notifications = await getNotifications();
	if (!Notifications) return false;

	const perms = await Notifications.getPermissionsAsync();
	if (perms.status === "granted") return true;
	const req = await Notifications.requestPermissionsAsync();
	return req.status === "granted";
}

export async function notifyOrderReceived() {
	const Notifications = await getNotifications();
	if (!Notifications) return;

	const ok = await ensurePermissions();
	if (!ok) return;

	await Notifications.scheduleNotificationAsync({
		content: {
			title: "Commande reçue",
			body: "Votre commande a bien été reçue.",
			sound: true,
		},
		trigger: null,
	});
}

