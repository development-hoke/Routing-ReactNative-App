/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Image,
  View,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Slider } from 'react-native-elements';
import MapView, {
  Marker,
  Callout,
  Circle,
  CalloutSubview,
  Region,
  LatLng,
} from 'react-native-maps';

import debounce from 'lodash/debounce';
import Autocomplete from 'react-native-autocomplete-input';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Location from 'expo-location';
// from app
import {
  ILocation,
  IGooglePrediection,
  IPlaceUnity,
  IHPShop,
} from 'app/src/interfaces/app/Map';
import { SmallCompleteButton } from 'app/src/components/Button/SmallCompleteButton';
import { useGooglePlace, useSpot, ICustomSpot } from 'app/src/hooks';
import { COLOR, LAYOUT } from 'app/src/constants';

import { ActionType } from 'app/src/Reducer';
import { useDispatch, useGlobalState } from 'app/src/Store';
import { getDistance, earthRadius } from 'geolib';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { LoadingSpinner } from 'app/src/components/Spinners';
import { useHotPepper } from 'app/src/hooks/useHotPepper';

/** マップからスポット範囲指定画面 */
const SearchMapScreen: React.FC = () => {
  const loginUser = useGlobalState('loginUser');
  const { navigate } = useNavigation();
  const dispatch = useDispatch();
  const {
    getPlacePhoto,
    getPlaceDetail,
    getPlaceOpeningHours,
    formatPlaceOpeningHours,
    getAutoComplete,
  } = useGooglePlace();
  const { searchByKeyword } = useHotPepper();
  const { fetchSpot } = useSpot(loginUser.authorization);

  const [location, setLocation] = useState<ILocation>({
    latitude: 35.658606737323325,
    longitude: 139.69814462256613,
    latitudeDelta: 0.038651027332100796,
    longitudeDelta: 0.02757163010454633,
  });

  const [center, setCenter] = useState<LatLng>({
    latitude: 35.658606737323325,
    longitude: 139.69814462256613,
  } as LatLng);

  const [radius, setRadius] = useState(10);
  const [openHours, setOpenHours] = useState<{ [key: string]: string }>({});
  const [currentOpHour, setCurrentOpHour] = useState('');
  const [spots, setSpots] = useState<IPlaceUnity[]>([]);
  const [places, setPlaces] = useState<IPlaceUnity[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [place, setPlace] = useState<IPlaceUnity | null>(null);
  const [searching, setSearching] = useState(false);
  const [queryText, setQueryText] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMoving, setIsMoving] = useState<boolean>(true);

  const [suggestions, setSuggestions] = useState<IGooglePrediection[]>([]);
  const [hpSpots, setHpSpots] = useState<IHPShop[]>([]);
  const [customSpots, setCustomSpots] = useState<ICustomSpot[]>([]);

  const mapRef = useRef(null);
  const markerRef = useRef<{ [key: string]: Marker | null }>({});
  const createPlan = useGlobalState('createPlan');

  function onCompleteButtonPress() {
    dispatch({
      type: ActionType.SET_CREATE_PLAN,
      payload: {
        ...createPlan,
        spots: [...spots],
        center,
        radius,
      },
    });
    navigate('Flick');
  }

  // map region changed
  const handleMapMoved = debounce((newRegion: Region) => {
    setLocation(newRegion);
    const newCenter = {
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
    } as LatLng;
    setCenter(newCenter);
  }, 100);

  function onRegionChange(newRegion: Region) {
    if (isMoving) handleMapMoved(newRegion);
  }

  // Radius Change event
  function onRadiusScroll(value: number) {
    handleRadiusScroll(value);
  }

  const handleRadiusScroll = debounce((value: number) => {
    setRadius(value);
  }, 100);

  const deg2rad = (angle: number) => (angle / 180) * Math.PI;
  const rad2deg = (angle: number) => (angle / Math.PI) * 180;

  const updateLocation = async () => {
    const { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    const clocation = await Location.getCurrentPositionAsync({});
    setLocation((prev) => {
      return {
        ...prev,
        latitude: clocation.coords.latitude,
        longitude: clocation.coords.longitude,
      };
    });
    setCenter({
      latitude: clocation.coords.latitude,
      longitude: clocation.coords.longitude,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    updateLocation();
  }, []);

  useEffect(() => {
    const radiusInRad = (radius * 2.2 * 100) / earthRadius;
    const lngDelta = rad2deg(
      radiusInRad / Math.cos(deg2rad(location.latitude)),
    );
    const latDelta = rad2deg(radiusInRad);
    setLocation({
      latitude: location.latitude,
      longitude: location.longitude,
      longitudeDelta: lngDelta,
      latitudeDelta: latDelta,
    } as ILocation);
  }, [radius]);

  // Autocomplete
  // const handleQuery = debounce((input: string) => {
  //   getAutoComplete(input, center, radius);
  // }, 50);

  async function onChangeQuery(query: string) {
    setQueryText(query);
    if (query === '') {
      setSuggestions([]);

      return;
    }
    const gSpots = await getAutoComplete(query, center, radius);
    const gConverts = gSpots.map((gi) => {
      const iCon: IGooglePrediection = {
        ...gi,
        origin: 'GOOGLE',
      };

      return iCon;
    });
    // hotpepper
    const hpSpots = await searchByKeyword(query, center, radius * 100);
    setHpSpots(hpSpots);
    const hConverts = hpSpots.map((hs) => {
      const dis = getDistance(
        { latitude: location.latitude, longitude: location.longitude },
        {
          latitude: hs.geometry.location.lat,
          longitude: hs.geometry.location.lng,
        },
      );
      const iCon: IGooglePrediection = {
        description: '',
        distance_meters: dis,
        place_id: hs.id,
        structured_formatting: {
          main_text: hs.name,
          secondary_text: hs.address,
        },
        origin: 'HOTPEPPER',
      };

      return iCon;
    });
    const aSpots = [...gConverts, ...hConverts];
    const oSpots = await fetchSpot(query, center, radius * 100);
    setCustomSpots(oSpots);
    const oConverts = oSpots
      .map((csi) => {
        const dis = getDistance(
          { latitude: location.latitude, longitude: location.longitude },
          {
            latitude: csi.latitude,
            longitude: csi.longitude,
          },
        );
        const iCon: IGooglePrediection = {
          description: '',
          distance_meters: dis,
          place_id: csi.place_id,
          structured_formatting: {
            main_text: csi.spot_name,
            secondary_text: csi.formatted_address,
          },
          origin: 'ONEDATE',
        };

        return iCon;
      })
      .filter(
        (value, index, self) =>
          self.findIndex((se) => se.place_id === value.place_id) === index,
      );
    const filtered = aSpots.filter(
      (pItem) =>
        oConverts.findIndex((aItem) => aItem.place_id === pItem.place_id) < 0,
    );
    const org = [...oConverts, ...filtered];
    const sorted = [];
    while (org.length > 0) {
      let minIdx = 0;
      let minVal = org[0].distance_meters;
      for (let i = 1; i < org.length; i += 1) {
        if (org[i].distance_meters < minVal) {
          minIdx = i;
          minVal = org[i].distance_meters;
        }
      }
      sorted.push(org[minIdx]);
      org.splice(minIdx, 1);
    }
    setSuggestions(sorted.slice(0, 5));
  }

  async function onAutoComplete(details: IGooglePrediection) {
    Keyboard.dismiss();
    if (details.origin === 'GOOGLE') {
      const detail = await getPlaceDetail(details.place_id);
      if (detail) {
        const unity: IPlaceUnity = {
          id: detail.id,
          place_id: detail.place_id,
          // ISpotFull
          name: details.structured_formatting.main_text,
          formatted_address: details.structured_formatting.secondary_text,
          category: detail.types[0],
          opening_hours: '',
          formatted_phone_number: detail.formatted_phone_number,
          website: detail.website,
          images: [detail.photolink],
          latitude: detail.geometry.location.lat,
          longitude: detail.geometry.location.lng,
          spot_type: 'GOOGLE',
          // ISpotFull
          icon: detail.icon,
          user_ratings_total: detail.user_ratings_total,
        };
        setPlace(unity);
      }
    } else if (details.origin === 'ONEDATE') {
      const detail = customSpots.find((it) => it.place_id === details.place_id);
      if (detail) {
        const unity: IPlaceUnity = {
          id: detail.spot_id,
          name: detail.spot_name,
          ...detail,
          icon: detail.icon_url,
          user_ratings_total: 0,
        };
        setPlace(unity);
      }
    } else if (details.origin === 'HOTPEPPER') {
      const detail = hpSpots.find((it) => it.id === details.place_id);
      if (detail) {
        const unity: IPlaceUnity = {
          id: detail.id,
          place_id: detail.place_id,
          name: detail.name,
          formatted_address: detail.address,
          category: detail.genreCode,
          opening_hours: detail.open,
          formatted_phone_number: '',
          website: '',
          images: [detail.photolink],
          latitude: detail.geometry.location.lat,
          longitude: detail.geometry.location.lng,
          spot_type: 'HOTPEPPER',
          icon: detail.icon,
          user_ratings_total: 0,
        };
        setPlace(unity);
      }
    }
    onChangeQuery('');
    setModalVisible(true);
  }

  const autoComplete = () => (
    <Autocomplete
      containerStyle={thisStyle.headerContainer}
      inputContainerStyle={thisStyle.headerTextInputContainer}
      data={suggestions}
      onChangeText={(text) => onChangeQuery(text)}
      keyExtractor={(item, index) => `${item.place_id}-${index}`}
      renderTextInput={(props) => (
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <TextInput
            placeholder="検索"
            style={{
              flex: 1,
              padding: 0,
              paddingBottom: 5,
              paddingTop: 5,
              fontSize: 18,
              color: 'black',
              marginLeft: 5,
              marginRight: 10,
              marginTop: 7,
              marginBottom: 5,
              backgroundColor: 'white',
            }}
            onChangeText={(text) => onChangeQuery(text)}
            value={queryText}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 5,
            }}
            onPress={() => onChangeQuery('')}
          >
            <FontAwesome5 name="times" size={20} color="grey" />
          </TouchableOpacity>
        </View>
      )}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          style={{ display: 'flex', flexDirection: 'row' }}
          onPress={() => onAutoComplete(item)}
        >
          <View style={{ paddingLeft: 10, paddingTop: 7 }}>
            <View
              style={{
                width: 30,
                height: 30,
                backgroundColor: 'darkgrey',
                borderRadius: 15,
                alignItems: 'center',
              }}
            >
              <View style={{ marginTop: 5 }}>
                {item.origin === 'ONEDATE' && (
                  <FontAwesome5 name="map-marker-alt" size={20} color="white" />
                )}
                {item.origin === 'GOOGLE' && (
                  <FontAwesome5 name="google" size={20} color="white" />
                )}
                {item.origin === 'HOTPEPPER' && (
                  <FontAwesome5
                    name="hospital-symbol"
                    size={20}
                    color="white"
                  />
                )}
              </View>
            </View>
            <Text style={{ color: 'grey', marginTop: 2 }}>
              {item.distance_meters > 1000
                ? `${(item.distance_meters / 1000).toFixed(1)}km`
                : `${item.distance_meters}m`}
            </Text>
          </View>
          <View style={{ padding: 5 }}>
            <Text style={{ fontSize: 16, marginTop: 5, width: 300 }}>
              {item.structured_formatting.main_text}
            </Text>
            <Text style={{ color: 'grey', marginTop: 10, width: 300 }}>
              {item.structured_formatting.secondary_text}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );

  const goPlace = () => {
    if (place) {
      setLocation((prev) => {
        return {
          ...prev,
          latitude: place.latitude,
          longitude: place.longitude,
        };
      });
      setCenter({
        latitude: place.latitude,
        longitude: place.longitude,
      } as LatLng);
      setPlaces((prev) => [...prev, place]);
      setIsMoving(false);
    }
    setModalVisible(false);
  };
  const displayRadius = () => {
    if (place) {
      const dis = getDistance(
        { latitude: location.latitude, longitude: location.longitude },
        {
          latitude: place.latitude,
          longitude: place.longitude,
        },
      );
      if (dis < 4000) {
        setPlaces((prev) => [...prev, place]);
        const rad = Math.round(dis / 100);
        if (rad > radius) {
          setRadius(rad);
        }
      }
    }
    setModalVisible(false);
  };

  async function onAddSpot(place: IPlaceUnity) {
    if (spots.indexOf(place) < 0) {
      setSpots((prev) => [...prev, place]);
    }
  }
  async function onSpotPress(place: IPlaceUnity) {
    if (!openHours[place.place_id]) {
      const openHours = await getPlaceOpeningHours(place.place_id);
      if (openHours) {
        setOpenHours((prev) => {
          const obj = prev;
          obj[place.place_id] = formatPlaceOpeningHours(openHours);

          return obj;
        });
        setCurrentOpHour(formatPlaceOpeningHours(openHours));
      }
    } else {
      setCurrentOpHour(openHours[place.place_id]);
    }
  }
  const renderMarker = (place: IPlaceUnity, color: string) => (
    <Marker
      description={place.name}
      coordinate={{
        latitude: place.latitude,
        longitude: place.longitude,
      }}
      pinColor={color}
      key={place.place_id}
      onPress={() => onSpotPress(place)}
      onCalloutPress={() => {
        markerRef.current[place.place_id]?.hideCallout();
      }}
      ref={(_marker) => {
        markerRef.current[place.place_id] = _marker;
      }}
    >
      <View>
        <FontAwesome5 name="map-marker" size={30} color={color} />
        <View style={{ position: 'absolute', top: 5, left: 4 }}>
          <Image
            source={{ uri: place.icon }}
            style={{ width: 15, height: 15 }}
          />
        </View>
      </View>
      <Callout alphaHitTest>
        <View
          style={{
            width: 220,
            height: 110,
            backgroundColor: 'white',
          }}
        >
          <Text style={{ width: 200, flexWrap: 'wrap' }}>{place.name}</Text>
          <View
            style={{
              // display: 'flex',
              flexDirection: 'row',
              marginTop: 5,
              marginRight: 5,
            }}
          >
            <CalloutSubview
              key="Image"
              onPress={() => navigate('SpotDetail', { place, mode: 'normal' })}
            >
              <Image
                source={{ uri: place.images[0] }}
                style={{ width: 120, height: 90 }}
                resizeMode="stretch"
              />
            </CalloutSubview>
            <View style={{ marginLeft: 10, flexDirection: 'column' }}>
              <Text>営業時間</Text>
              <Text style={{ width: 100 }}>{currentOpHour}</Text>

              <CalloutSubview
                key="Add"
                onPress={() => {
                  onAddSpot(place);
                  markerRef.current[place.place_id]?.hideCallout();
                }}
                style={[thisStyle.calloutButton]}
              >
                <Text style={{ color: '#fff' }}>追加</Text>
              </CalloutSubview>
            </View>
          </View>
        </View>
      </Callout>
    </Marker>
  );

  if (isLoading) {
    return LoadingSpinner;
  }

  return (
    <View>
      <MapView
        testID="mapView"
        showsMyLocationButton={false}
        showsPointsOfInterest={false}
        showsCompass={false}
        showsScale={false}
        showsBuildings={false}
        showsTraffic={false}
        showsIndoors={false}
        showsIndoorLevelPicker={false}
        toolbarEnabled={false}
        moveOnMarkerPress={false}
        style={thisStyle.map}
        ref={mapRef}
        initialRegion={location}
        region={location}
        onRegionChange={onRegionChange}
        mapPadding={{ top: 20, left: 0, right: 0, bottom: 40 }}
        onPress={Keyboard.dismiss}
      >
        <Circle
          key="center"
          center={center}
          strokeColor="transparent"
          fillColor="#FFA50040"
          radius={radius * 100}
        />
        {places.map((place) => renderMarker(place, 'orange'))}
        {spots.map((place) => renderMarker(place, 'lightgrey'))}
      </MapView>
      <View
        style={{
          position: 'absolute',
          top: 20,
          width: '90%',
          marginHorizontal: '5%',
          // opacity: searching ? 1 : 0.5,
        }}
      >
        {autoComplete()}
      </View>
      <View style={thisStyle.bottomPanel}>
        <View style={thisStyle.halfView}>
          <View style={{ flex: 1 }}>
            <View style={thisStyle.spotsContainer}>
              <Text style={{ fontSize: 10, marginLeft: 10, marginBottom: 10 }}>
                保存済みスポット
              </Text>
            </View>
            <FlatList
              keyExtractor={(item, index) => `${item.id}-${index}`}
              data={spots}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback
                  onPress={() =>
                    navigate('SpotDetail', { place: item, mode: 'normal' })
                  }
                >
                  <Image
                    source={{ uri: item.images[0] }}
                    style={thisStyle.spotImage}
                    resizeMode="stretch"
                    key={item.place_id}
                  />
                </TouchableWithoutFeedback>
              )}
              horizontal
            />
          </View>
          <View style={{ flex: 1 }}>
            <View
              style={{
                marginLeft: 20,
                marginRight: 20,
                marginTop: 15,
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  left: '25%',
                  top: '30%',
                  height: '20%',
                  borderColor: 'grey',
                  borderWidth: 0.5,
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '10%',
                  height: '40%',
                  borderColor: 'grey',
                  borderWidth: 0.5,
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  left: '75%',
                  top: '-10%',
                  height: '60%',
                  borderColor: 'grey',
                  borderWidth: 0.5,
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  left: '100%',
                  top: '-30%',
                  height: '80%',
                  borderColor: 'grey',
                  borderWidth: 0.5,
                }}
              />
              <Text
                style={{
                  position: 'absolute',
                  left: '20%',
                  top: '50%',
                  fontSize: 8,
                }}
              >
                1km
              </Text>
              <Text
                style={{
                  position: 'absolute',
                  left: '45%',
                  top: '50%',
                  fontSize: 8,
                }}
              >
                2km
              </Text>
              <Text
                style={{
                  position: 'absolute',
                  left: '70%',
                  top: '50%',
                  fontSize: 8,
                }}
              >
                3km
              </Text>
              <Text
                style={{
                  position: 'absolute',
                  left: '95%',
                  top: '50%',
                  fontSize: 8,
                }}
              >
                4km
              </Text>
              <Slider
                value={radius}
                minimumValue={0}
                maximumValue={40}
                thumbStyle={{
                  width: 10,
                  height: 10,
                  backgroundColor: '#FFF',
                  borderRadius: 5,
                  borderColor: 'orange',
                  borderWidth: 2,
                }}
                trackStyle={{ height: 1 }}
                onValueChange={onRadiusScroll}
              />
            </View>

            <View style={{ alignItems: 'center' }}>
              <SmallCompleteButton
                onPress={onCompleteButtonPress}
                title="決定"
              />
            </View>
          </View>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          console.log('Modal has been closed.');
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              alignItems: 'center',
              width: LAYOUT.window.width * 0.55,
              height: LAYOUT.window.width * 0.4,
              backgroundColor: COLOR.backgroundColor,
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Text style={thisStyle.headerTextInput}>
              どのように使用しますか?
            </Text>
            <View style={thisStyle.buttonContainer}>
              <SmallCompleteButton title="円の中心" onPress={goPlace} />
            </View>
            <View style={thisStyle.buttonContainer}>
              <SmallCompleteButton
                title="スポット表示"
                onPress={displayRadius}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

/** スタイリング */
const thisStyle = StyleSheet.create({
  map: {
    height: '100%',
  },
  bottomPanel: {
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    height: 100,
    width: '100%',
  },
  halfView: {
    display: 'flex',
    flexDirection: 'row',
  },
  bottomPanelButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    padding: 5,
  },
  spotsContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
  },
  calloutButton: {
    width: 'auto',
    backgroundColor: COLOR.tintColor,
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    marginRight: 10,
    marginVertical: 10,
    zIndex: 10,
  },
  spotImage: {
    width: 50,
    height: 50,
    marginLeft: 5,
  },
  headerContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  headerTextInputContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 0,
    paddingBottom: 0,
  },
  headerTextInput: {
    marginLeft: 0,
    marginRight: 0,
    marginTop: 2,
    height: 38,
    margin: 'auto',
    // color: '#5d5d5d',
    fontSize: 16,
  },
  headerListView: {
    backgroundColor: '#fff',
    marginHorizontal: 5,
    marginTop: 2,
  },
});

export default SearchMapScreen;
