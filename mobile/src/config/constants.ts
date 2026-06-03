export const Theme = {
  colors: {
    greenLight: "#D9ECDB",
    green: "#597D56",
    greenDark: "#4E674C",
    orangeLight: "#FFF4E8",
    orange: "#FF9A24",
    orangeDark: "#FB8802",
    yellowLight: "#fff3cd",
    yellow: "#f0bf1c",
    yellowDark: "#d9a916",
    blueLight: "#d6e4fc",
    blue: "#1d89f0",
    blueDark: "#1a7ad6",
    redLight: "#f8d7da",
    red: "#f06058",
    redDark: "#d8564f",
    blackLight: "#4a4a4a",
    black: "#2f2f2f",
    blackDark: "#1a1a1a",
  },
  font: {
    regular: "Montserrat_400Regular",
    medium: "Montserrat_500Medium",
    semiBold: "Montserrat_600SemiBold",
    bold: "Montserrat_700Bold",
    extraBold: "Montserrat_800ExtraBold",
    black: "Montserrat_900Black",
  },
};

// Android Emulator: 10.0.2.2 pointe vers localhost de la machine hote.
const LOCAL_API_URL = "http://10.0.2.2:3000";
const PROD_API_URL = "https://appomarcheivoire.onrender.com";

// Permet de forcer l'API en dev (ex: http://192.168.1.10:3000 pour un telephone en Wi-Fi).
// Expo expose EXPO_PUBLIC_* a runtime dans process.env.
const API_URL_OVERRIDE = process.env.EXPO_PUBLIC_API_URL;

// Si EXPO_PUBLIC_API_URL est defini (dev/release), il est prioritaire.
// Sinon: fallback emulateur en dev, API distante en release.
const API_URL = API_URL_OVERRIDE || (__DEV__ ? LOCAL_API_URL : PROD_API_URL);

export const ENV = {
  API_URL,
};
