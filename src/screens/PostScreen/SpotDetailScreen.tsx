import React, { useMemo, useState, useEffect } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Text, Spinner } from 'native-base';
import { useRoute, useNavigation } from '@react-navigation/native';
import { IPlace, IHPShop, IPlaceUnity } from 'app/src/interfaces/app/Map';
import {
  COLOR,
  LAYOUT,
  getTypeIndex,
  SPOT_TYPE,
  isGooglePlace,
} from 'app/src/constants';
import { useGooglePlace } from 'app/src/hooks';
import { ReactionElement } from 'app/src/components/Element';
import MapView, { Marker } from 'react-native-maps';
import { FontAwesome5 } from '@expo/vector-icons';
import { Button } from 'react-native-elements';
import { useDispatch } from 'app/src/Store';
import { ActionType } from 'app/src/Reducer';

const SpotDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { formatPlaceOpeningHours, getPlaceDetail } = useGooglePlace();
  const dispatch = useDispatch();

  const param = route.params as {
    // place: IPlace | IHPShop;
    place: IPlaceUnity;
    mode: 'guide' | 'normal';
  };
  const genre = SPOT_TYPE[getTypeIndex(param.place.category)];

  const [place, setPlace] = useState<IPlaceUnity>(param.place);

  return (
    <ScrollView contentContainerStyle={thisStyle.container}>
      <View
        style={{
          height: LAYOUT.window.height * 0.27,
        }}
      >
        <Image
          style={thisStyle.spotImage}
          source={{
            uri: place.images[0],
          }}
        />
      </View>
      <ReactionElement
        user_ratings_total={place.user_ratings_total.toString() || ''}
        title={place.name}
      />
      <View>
        <Text style={{ fontSize: 14 }}>
          {genre && genre.title} {'  '} 営業時間: {place.opening_hours}
          &nbsp;&nbsp;
          {genre && `平均滞在時間  ${genre.elapse}分`}
        </Text>
        <Text style={{ fontSize: 14, marginTop: 5 }}>
          {isGooglePlace(place.place_id) ? place.formatted_address : ''}
        </Text>
      </View>
      <View
        style={{
          height: LAYOUT.window.height * 0.25,
          marginTop: 10,
        }}
      >
        <MapView
          region={{
            latitude: place.latitude,
            longitude: place.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.05,
          }}
          style={{ height: '100%' }}
        >
          <Marker
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            key="target"
            pinColor="red"
          >
            <View>
              <FontAwesome5
                name="map-marker"
                size={30}
                color={COLOR.tintColor}
              />
              {place.icon !== '' && (
                <View style={{ position: 'absolute', top: 5, left: 4 }}>
                  <Image
                    source={{ uri: place.icon }}
                    style={{ width: 15, height: 15 }}
                  />
                </View>
              )}
            </View>
          </Marker>
        </MapView>
      </View>
      <View style={thisStyle.buttonContainer}>
        {param.mode === 'guide' && (
          <Button
            buttonStyle={thisStyle.button}
            title="案内開始"
            onPress={() => {
              dispatch({
                type: ActionType.SET_EXTRA_SPOT,
                payload: place,
              });
              navigation.navigate('Road');
            }}
          />
        )}
        {param.mode === 'normal' && (
          <Button
            buttonStyle={thisStyle.button}
            title="閉じる"
            onPress={() => navigation.goBack()}
          />
        )}
      </View>
    </ScrollView>
  );
};

const thisStyle = StyleSheet.create({
  container: {
    backgroundColor: COLOR.backgroundColor,
    padding: 10,
  },
  spotImage: {
    width: '100%',
    height: '100%',
  },
  button: {
    width: LAYOUT.window.width * 0.5,
    borderRadius: 10,
    margin: 20,
    backgroundColor: COLOR.tintColor,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SpotDetailScreen;
