import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import MapView, { LatLng, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import { OrderDetails } from '../../../(client)/redux/ordersApi.slice';
import MapMarkers from './MapMarkers';
import { getDestination } from '../../helpers/destination';
import * as Location from 'expo-location';
import MapButtons from './MapButtons';

interface MapComponentProps {
    data? : OrderDetails
}


const MapComponent: React.FC<MapComponentProps> = ({
    data
}) => {
    const mapRef = React.useRef<MapView>(null);
    const [destination, setDestination] = React.useState<LatLng>();
    const [location, setLocation] = React.useState<Location.LocationObject | null>(null);

    function requestUserLocationPermission() {
        Location.requestForegroundPermissionsAsync()
            .then((result) => {
                if (result.granted) {
                    getUserLocation();
                } else {
                    console.log('Location permission not granted');
                }
            })
            .catch((error) => {
                console.error('Error requesting location permission:', error);
            });
    }

    function getUserLocation() {
        Location.getCurrentPositionAsync({})
            .then((location) => {
                setLocation(location);
            })
            .catch((error) => {
                console.error('Error getting user location:', error);
            });
    }

    useEffect(() => {
        if(data) {
            setDestination(getDestination(data));
        }
    }, [data]);

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                provider={"google"}
                showsUserLocation={true}
                showsCompass={true}
                showsScale={true}
            >
                {destination && (
                    <>
                        <MapMarkers destination={destination} />
                    </>
                )}
            </MapView>
            <MapButtons mapRef={mapRef} destination={destination} />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    map: {
        flex: 1,
    },
});

export default React.memo(MapComponent);
