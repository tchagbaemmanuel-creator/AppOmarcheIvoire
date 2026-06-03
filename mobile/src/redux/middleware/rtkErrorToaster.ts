import { Middleware } from "@reduxjs/toolkit";
import { showToast } from "../slices/toast.slice";

const errorToastMiddleware: Middleware =
    ({ dispatch }) =>
    (next) =>
    // @ts-ignore
    (action: AnyAction) => {
        try {
            if (action.type.endsWith("/rejected")) {
                let errorMessage = "Une erreur est survenue";
                let errorType: "success" | "warning" | "info" = "warning";

                if (action.payload) {
                    const data = action.payload.data as
                        | { message?: string; code?: number; statusCode?: number }
                        | undefined;
                    const httpStatus =
                        action.payload.status ??
                        data?.code ??
                        data?.statusCode;
                    if (action.payload.status === "FETCH_ERROR") {
                        errorMessage =
                            "Le serveur met du temps à répondre (souvent après une pause). Réessayez dans 30 secondes.";
                        errorType = "warning";
                    } else if (action.payload.status === "PARSING_ERROR") {
                        errorMessage =
                            "Réponse serveur invalide. Vérifiez que l'application utilise la bonne API.";
                        errorType = "warning";
                    } else if (data?.message && typeof httpStatus === "number") {
                        errorMessage = data.message;
                        switch (Math.floor(httpStatus / 100)) {
                            case 4:
                                errorType = "warning";
                                break;
                            case 5:
                                errorType = "warning";
                                break;
                            default:
                                errorType = "info";
                        }
                    } else if (data?.message) {
                        errorMessage = data.message;
                        errorType = "warning";
                    }
                    else if (typeof action.payload === "string") {
                        errorMessage = action.payload;
                        errorType = "warning";
                    }
                    else if (action.payload.error) {
                        errorMessage = action.payload.error;
                        errorType = "warning";
                    }
                } else if (action.error) {
                    errorMessage = action.error.message || "Une erreur est survenue";
                    errorType = "warning";
                }

                if (__DEV__) {
                    console.log(
                        "Error details:",
                        JSON.stringify(action.payload || action.error, null, 2)
                    );
                }

                dispatch(showToast({ message: errorMessage, type: errorType }));
            }
        } catch (error) {
            console.error("Error in errorToastMiddleware:", error);
        }
        return next(action);
    };

export default errorToastMiddleware;
