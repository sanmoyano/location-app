import { useNavigation, useRoute } from "@react-navigation/native";
import { getCurrentPositionAsync, requestForegroundPermissionsAsync } from "expo-location";
import { useEffect, useState } from "react";
import { Alert, Button, Text, View } from "react-native";

import colors from "../../utils/colors";
import MapPreview from "../map-preview";
import { styles } from "./styles";

const LocationSelector = ({ onLocation }) => {
  const navigation = useNavigation();
  const route = useRoute();

  const { mapLocation } = route.params || {};
  const [pickedLocation, setPickedLocation] = useState(null);

  const verifyPermissions = async () => {
    const { status } = await requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permisos insuficientes", "Necesitamos permisos para obtener la ubicacion", [
        { text: "Ok" },
      ]);
      return false;
    }

    return true;
  };

  const onHandlerGetLocation = async (isMaps = false) => {
    const isLocationPermission = await verifyPermissions();
    if (!isLocationPermission) return;
    const location = await getCurrentPositionAsync({
      timeout: 5000,
    });

    const { latitude, longitude } = location.coords;

    setPickedLocation({ lat: latitude, lng: longitude });
    onLocation({ lat: latitude, lng: longitude });
    if (isMaps) {
      navigation.navigate("Maps", { coords: { lat: latitude, lng: longitude } });
    }
  };

  useEffect(() => {
    if (mapLocation) {
      setPickedLocation(mapLocation);
      onLocation(mapLocation);
    }
  }, [mapLocation]);

  return (
    <View style={styles.container}>
      <MapPreview location={pickedLocation} style={styles.preview}>
        <Text>No hay ubicacion seleccionada</Text>
      </MapPreview>
      <View style={styles.actions}>
        <Button
          title="Obtener ubicacion"
          onPress={() => onHandlerGetLocation()}
          color={colors.primary}
        />
      </View>
      <View style={styles.actions}>
        <Button
          title="Seleccionar ubicacion"
          onPress={() => onHandlerGetLocation(true)}
          color={colors.primary}
        />
      </View>
    </View>
  );
};

export default LocationSelector;
