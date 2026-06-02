import { Platform, StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import MarketList from "../../(client)/components/MarketList";
import { useDispatch } from "react-redux";
import * as Location from "expo-location";
import { setLocation, setError } from "@/redux/slices/location.slice";
import { showToast } from "@/redux/slices/toast.slice";
import MapComponent from "../../(client)/components/MapComponent";

/** Abidjan — uniquement secours dev sur émulateur Android sans fix GPS. */
const DEV_FALLBACK_COORDS = { latitude: 5.36, longitude: -4.0083 };

function isLikelyAndroidEmulator(): boolean {
  if (Platform.OS !== "android") return false;
  const model = String(
    (Platform.constants as { Model?: string } | undefined)?.Model ?? ""
  );
  return /sdk_gphone|emulator|Android SDK built for x86|AOSP on Intel/i.test(
    model
  );
}

async function resolveUserCoordinates(): Promise<{
  latitude: number;
  longitude: number;
}> {
  const last = await Location.getLastKnownPositionAsync({
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  if (last) {
    return {
      latitude: last.coords.latitude,
      longitude: last.coords.longitude,
    };
  }

  try {
    const current = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Lowest,
    });
    return {
      latitude: current.coords.latitude,
      longitude: current.coords.longitude,
    };
  } catch (err) {
    if (__DEV__ && isLikelyAndroidEmulator()) {
      console.warn(
        "[MapScreen] Émulateur sans position GPS — secours Abidjan. Envoie un point via ⋯ → Location → Send pour une vraie position."
      );
      return DEV_FALLBACK_COORDS;
    }
    throw err;
  }
}

export default function MapScreen() {
  const dispatch = useDispatch();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          if (!cancelled) {
            dispatch(setError("Accès à la localisation refusé."));
            dispatch(
              showToast({
                message:
                  "Autorise la localisation dans les réglages pour afficher les marchés à proximité.",
                type: "warning",
              })
            );
          }
          return;
        }

        const servicesOn = await Location.hasServicesEnabledAsync();
        if (!servicesOn) {
          if (!cancelled) {
            dispatch(
              setError("Les services de localisation sont désactivés sur cet appareil.")
            );
            dispatch(
              showToast({
                message:
                  "Active la localisation (GPS) dans les réglages de l’appareil ou de l’émulateur.",
                type: "warning",
              })
            );
          }
          return;
        }

        const { latitude, longitude } = await resolveUserCoordinates();
        if (!cancelled) {
          dispatch(setLocation({ latitude, longitude }));
        }
      } catch (e) {
        if (!cancelled) {
          dispatch(
            setError(
              "Impossible d’obtenir la position. Vérifie que la localisation est activée."
            )
          );
          dispatch(
            showToast({
              message:
                "Position indisponible. Sur émulateur : définis un emulated location dans les réglages Android.",
              type: "warning",
            })
          );
        }
        if (__DEV__) {
          console.warn("[MapScreen] Localisation :", e);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <MapComponent />
      <View style={styles.menuView}>
        <MarketList />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuView: {
    height: 270,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
