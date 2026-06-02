import React from "react";
import { LatLng, MapMarker } from "react-native-maps";

const MapMarkers = ({ destination}: { destination: LatLng }) => {
  return (
    <>
    <MapMarker
      coordinate={{
        longitude: destination.longitude || 0,
        latitude: destination.latitude || 0,
      }}
    />
    </>
  );
}

export default MapMarkers;
