import MapView, { LatLng } from "react-native-maps";
import * as Location from "expo-location";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const MapButtons = ({ mapRef, destination }: { mapRef: React.RefObject<MapView>, destination?: LatLng }) => {
    const centerOnDestination = () => {
        if (destination && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: destination.latitude,
                longitude: destination.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            });
        }
    };

    const frameDestinationAndLocation = async () => {
        if (!destination || !mapRef.current) return;

        try {
            const { coords } = await Location.getCurrentPositionAsync({});
            const coordinates = [
                { latitude: destination.latitude, longitude: destination.longitude },
                { latitude: coords.latitude, longitude: coords.longitude },
            ];

            mapRef.current.fitToCoordinates(coordinates, {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true,
            });
        } catch (error) {
            console.error('Error getting current location:', error);
        }
    };

    return (
        <View style={styles.mapButtonsContainer}>
            <TouchableOpacity 
                style={[styles.mapButton, !destination && styles.mapButtonDisabled]} 
                onPress={centerOnDestination}
                disabled={!destination}
            >
                <MaterialIcons name="center-focus-strong" size={24} color={destination ? "black" : "#999"} />
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.mapButton, !destination && styles.mapButtonDisabled]} 
                onPress={frameDestinationAndLocation}
                disabled={!destination}
            >
                <MaterialIcons name="fit-screen" size={24} color={destination ? "black" : "#999"} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    mapButtonsContainer: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        gap: 8,
    },
    mapButton: {
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    mapButtonDisabled: {
        backgroundColor: '#f0f0f0',
    },
});

export default MapButtons