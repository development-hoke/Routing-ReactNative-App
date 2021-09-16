import React from 'react';
import { StyleSheet } from 'react-native';
import MapView from 'react-native-maps';

// from app
import { COLOR } from 'app/src/constants';
import { ILocation } from 'app/src/interfaces/app/Map';
import { ISpot } from 'app/src/interfaces/api/Plan';

interface Props {
  spot: ISpot;
}

/** シンプルなマップコ */
export const SimpleMapView: React.FC<Props> = (props: Props) => {
  const { spot } = props;

  const region: ILocation = {
    latitude: spot.latitude,
    longitude: spot.longitude,
    latitudeDelta: 0.02,
    longitudeDelta: 0.05,
  };

  return <MapView region={region} style={thisStyle.map} />;
};

/** スタイリング */
const thisStyle = StyleSheet.create({
  map: {
    borderColor: COLOR.inactiveColor,
    borderRadius: 10,
    borderWidth: 1,
    height: 200,
    marginHorizontal: 10,
    // marginVertical: 5
  },
});
