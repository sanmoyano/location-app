import { useEffect } from "react";
import { FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { PlaceItem } from "../../components";
import { getPlace } from "../../store/place.slice";
import { styles } from "./styles";

const PlaceList = ({ navigation }) => {
  const dispatch = useDispatch();
  const places = useSelector((state) => state.place.places);

  const onHandlerSelect = (id) => {
    navigation.navigate("PlaceDetail", { placeId: id });
  };

  useEffect(() => {
    dispatch(getPlace());
  }, [dispatch]);

  const renderItem = ({ item }) => <PlaceItem {...item} onSelect={onHandlerSelect} />;
  const keyExtractor = (item) => item.id;
  return (
    <FlatList
      data={places}
      style={styles.container}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
    />
  );
};

export default PlaceList;
