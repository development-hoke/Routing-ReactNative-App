/* eslint-disable import/no-extraneous-dependencies */
import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Container, View, Text } from 'native-base';
import {
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  Keyboard,
} from 'react-native';
import moment from 'moment';
import debounce from 'lodash/debounce';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Autocomplete from 'react-native-autocomplete-input';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import { getDistance } from 'geolib';
// from app
import { CompleteButton } from 'app/src/components/Button';
import { COLOR, LAYOUT, getRightSpotType, SPOT_TYPE } from 'app/src/constants';
import {
  ILocation,
  IGooglePrediection,
  IHPShop,
} from 'app/src/interfaces/app/Map';
import MapView, { Region, LatLng, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useGooglePlace, useSpot, IPostSpot } from 'app/src/hooks';
import { useGlobalState } from 'app/src/Store';
import { useHotPepper } from 'app/src/hooks/useHotPepper';
// import { COLOR } from 'app/src/constants';

interface SpotTypeDropDown {
  label: string;
  value: string;
}

/** スポット作成画面 */
const CreateSpotScreen: React.FC = () => {
  const loginUser = useGlobalState('loginUser');
  const { navigate } = useNavigation();
  const {
    getPlaceDetail,
    getAutoComplete,
    formatPlaceOpeningHours,
    getPlaceOpeningHours,
  } = useGooglePlace();
  const { searchByKeyword } = useHotPepper();

  const { createSpot } = useSpot(loginUser.authorization);

  const [location, setLocation] = useState<ILocation>({
    latitude: 35.658606737323325,
    longitude: 139.69814462256613,
    latitudeDelta: 0.038651027332100796,
    longitudeDelta: 0.02757163010454633,
  });
  const [center, setCenter] = useState<LatLng>({
    latitude: 35.658606737323325,
    longitude: 139.69814462256613,
  });
  const today = new Date();

  const [image, setImage] = useState<ImageInfo | null>(null);
  const [showTimeFrom, setShowTimeFrom] = useState(false);
  const [showTimeTo, setShowTimeTo] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [timeFrom, setTimeFrom] = useState<Date>();
  const [timeTo, setTimeTo] = useState<Date>();
  const [dateLimit, setDateLimit] = useState<Date>();
  const [queryText, setQueryText] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [telephone, setTelephone] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('');
  const [spotType, setSpotType] = useState<SpotTypeDropDown>();
  const [hideList, setHideList] = useState<boolean>(false);
  const [placeId, setPlaceId] = useState<string>('');

  const [suggestions, setSuggestions] = useState<IGooglePrediection[]>([]);
  const [hpSpots, setHpSpots] = useState<IHPShop[]>([]);

  const mapRef = useRef(null);

  const updateLocation = async () => {
    const { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    const curLocation = await Location.getCurrentPositionAsync({});
    if (curLocation) {
      mapRef.current.animateToRegion({
        ...location,
        latitude: curLocation.coords.latitude,
        longitude: curLocation.coords.longitude,
      });
      setCenter({
        latitude: curLocation.coords.latitude,
        longitude: curLocation.coords.longitude,
      });
    }
  };

  useEffect(() => {
    updateLocation();
  }, []);

  const onCompleteButtonPress = async () => {
    if (!image) return;
    const data = {
      name,
      formatted_address: address,
      category: spotType ? spotType.value : '',
      opening_hours: `${
        timeFrom ? moment(timeFrom).format('HH:mm') : '00:00'
      }-${timeTo ? moment(timeTo).format('HH:mm') : '23:59'}`,
      formatted_phone_number: telephone,
      website: url,
      images: [image],
      latitude: center.latitude,
      longitude: center.longitude,
      // undefined on ui
      description: '',
      icon_url: icon,
      spot_type: 'ONEDATE',
      place_id: placeId,
    } as IPostSpot;
    const res = await createSpot(data);
    console.log(res);
    if (res && res.code === 200) {
      navigate('Top');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result);
    }
  };

  const spotTypes = () => {
    const result = SPOT_TYPE.map((item, index) => {
      return {
        label: item.title,
        value: item.id,
      } as SpotTypeDropDown;
    });

    return result;
  };

  // map region changed
  const handleMapMoved = debounce((newRegion: Region) => {
    setCenter(newRegion);
    setLocation(newRegion);
  }, 100);

  function onRegionChange(newRegion: Region) {
    handleMapMoved(newRegion);
  }

  async function onChangeQuery(query: string) {
    setQueryText(query);
    setHideList(false);
    if (query === '') {
      setSuggestions([]);

      return;
    }
    const gSpots = await getAutoComplete(query, center, 1000);
    const gConverts = gSpots.map((gi) => {
      const iCon: IGooglePrediection = {
        ...gi,
        origin: 'GOOGLE',
      };

      return iCon;
    });
    const hpSpots = await searchByKeyword(query, center, 1000);
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
    const org = [...gConverts, ...hConverts];
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
        setPlaceId(details.place_id);
        setName(details.structured_formatting.main_text);
        setAddress(details.structured_formatting.secondary_text);
        setTelephone(detail.formatted_phone_number);
        setUrl(detail.website);
        setIcon(detail.icon);
        const typeIdx = getRightSpotType(detail.types);
        const spottypes = spotTypes();
        setSpotType(spottypes[typeIdx]);
        // move map to new point
        setCenter({
          latitude: detail.geometry.location.lat,
          longitude: detail.geometry.location.lng,
        });
        mapRef.current.animateToRegion({
          ...location,
          latitude: detail.geometry.location.lat,
          longitude: detail.geometry.location.lng,
        });

        const openHours = await getPlaceOpeningHours(detail.place_id);
        if (openHours) {
          const ohStr = formatPlaceOpeningHours(openHours);
          if (ohStr === '24時間営業') {
            setTimeFrom(moment().set({ hour: 0, minute: 0 }).toDate());
            setTimeTo(moment().set({ hour: 23, minute: 59 }).toDate());
          } else {
            const strFromTime = ohStr.split(' - ')[0];
            const strToTime = ohStr.split(' - ')[1];
            setTimeFrom(
              moment()
                .set({
                  hour: Number.parseInt(strFromTime.split(':')[0], 10),
                  minute: Number.parseInt(strFromTime.split(':')[1], 10),
                })
                .toDate(),
            );
            setTimeTo(
              moment()
                .set({
                  hour: Number.parseInt(strToTime.split(':')[0], 10),
                  minute: Number.parseInt(strToTime.split(':')[1], 10),
                })
                .toDate(),
            );
          }
        }
      }
    } else if (details.origin === 'HOTPEPPER') {
      const detail = hpSpots.find((it) => it.id === details.place_id);
      if (detail) {
        setPlaceId(details.place_id);
        setName(details.structured_formatting.main_text);
        setAddress(details.structured_formatting.secondary_text);
        setTelephone('');
        setUrl(detail.urls.pc);
        setIcon(
          'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
        );
        // const typeIdx = getRightSpotType(detail);
        // const spottypes = spotTypes();
        // setSpotType(spottypes[typeIdx]);
        setCenter({
          latitude: detail.geometry.location.lat,
          longitude: detail.geometry.location.lng,
        });
        mapRef.current.animateToRegion({
          ...location,
          latitude: detail.geometry.location.lat,
          longitude: detail.geometry.location.lng,
        });
        setTimeFrom(moment().set({ hour: 0, minute: 0 }).toDate());
        setTimeTo(moment().set({ hour: 23, minute: 59 }).toDate());
      }
    }
    setHideList(true);
  }

  const autoComplete = () => (
    <Autocomplete
      containerStyle={thisStyle.headerContainer}
      inputContainerStyle={thisStyle.headerTextInputContainer}
      data={suggestions}
      onChangeText={(text) => onChangeQuery(text)}
      hideResults={hideList}
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
              height: 45,
            }}
            onPress={() => onChangeQuery('')}
          >
            <FontAwesome5 name="times" size={20} color="grey" />
          </TouchableOpacity>
        </View>
      )}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          style={{ display: 'flex', flexDirection: 'row', width: '80%' }}
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
                <FontAwesome5 name="map-marker-alt" size={20} color="white" />
              </View>
            </View>
            <Text style={{ fontSize: 13, color: 'grey', marginTop: 2 }}>
              {item.distance_meters > 1000
                ? `${(item.distance_meters / 1000).toFixed(1)}km`
                : `${item.distance_meters}m`}
            </Text>
          </View>
          <View style={{ padding: 5 }}>
            <Text style={{ fontSize: 13, marginTop: 5 }}>
              {item.structured_formatting.main_text}
            </Text>
            <Text style={{ fontSize: 13, color: 'grey', marginTop: 3 }}>
              {item.structured_formatting.secondary_text}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );

  return (
    <Container style={{ padding: 10 }}>
      <KeyboardAwareScrollView>
        <ScrollView>
          <View style={thisStyle.imageContainer}>
            <Image source={{ uri: image?.uri }} style={thisStyle.imageStyle} />
            <View
              style={{
                position: 'absolute',
                right: LAYOUT.window.width * 0.1,
                bottom: 20,
              }}
            >
              <TouchableOpacity
                style={thisStyle.spotButton}
                onPress={pickImage}
              >
                <FontAwesome5 name="plus" size={24} color={COLOR.greyColor} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ ...thisStyle.infoContainer, zIndex: 100 }}>
            <TouchableOpacity style={thisStyle.buttonStyle}>
              <Text style={thisStyle.buttonTextStyle}>住所とキーワード</Text>
            </TouchableOpacity>
            <View
              style={{
                width: '70%',
                marginHorizontal: '5%',
                zIndex: 100,
              }}
            >
              {autoComplete()}
            </View>
          </View>
          <View
            style={{
              height: LAYOUT.window.height * 0.3,
              borderColor: COLOR.textTintColor,
              borderWidth: 1,
              borderRadius: 5,
              padding: 1,
              marginTop: 5,
            }}
          >
            <MapView
              initialRegion={location}
              style={{ height: '100%' }}
              onRegionChange={onRegionChange}
              ref={mapRef}
            >
              <Marker
                coordinate={{
                  latitude: center.latitude,
                  longitude: center.longitude,
                }}
              >
                <View>
                  <FontAwesome5 name="map-marker" size={30} color="orange" />
                </View>
              </Marker>
            </MapView>
          </View>
          <View style={thisStyle.infoContainer}>
            <TouchableOpacity style={thisStyle.buttonStyle}>
              <Text style={thisStyle.buttonTextStyle}>名前</Text>
            </TouchableOpacity>
            <TextInput
              placeholder="名前を追加"
              style={thisStyle.textInputStyle}
              value={name}
              onChangeText={(text) => setName(text)}
            />
          </View>
          <View style={thisStyle.infoContainer}>
            <TouchableOpacity style={thisStyle.buttonStyle}>
              <Text style={thisStyle.buttonTextStyle}>カテゴリ</Text>
            </TouchableOpacity>
            <View style={{ marginLeft: 10 }}>
              <RNPickerSelect
                onValueChange={(value) => {
                  const types = spotTypes();
                  const t = types.find((item) => item.value === value);
                  if (t) setSpotType(t);
                  console.log(t);
                }}
                items={spotTypes()}
                placeholder={{
                  label: 'カテゴリを追加',
                  value: null,
                  color: 'grey',
                }}
                value={spotType?.value}
                pickerProps={{
                  accessibilityLabel: spotType?.value,
                }}
              >
                <Text>{spotType ? spotType.label : 'カテゴリを追加'}</Text>
              </RNPickerSelect>
            </View>
          </View>
          <View style={thisStyle.infoContainer}>
            <TouchableOpacity style={thisStyle.buttonStyle}>
              <Text style={thisStyle.buttonTextStyle}>営業時間</Text>
            </TouchableOpacity>
            <Text
              style={thisStyle.textInputStyle}
              onPress={() => setShowTimeFrom(true)}
            >
              {timeFrom ? moment(timeFrom).format('HH:mm') : '??:??'}
            </Text>
            <Text style={thisStyle.textInputStyle}>~</Text>
            <Text
              style={thisStyle.textInputStyle}
              onPress={() => setShowTimeTo(true)}
            >
              {timeTo ? moment(timeTo).format('HH:mm') : '??:??'}
            </Text>
            <Text style={thisStyle.textInputStyle}>期間限定</Text>
            <Text
              style={thisStyle.textInputStyle}
              onPress={() => setShowDate(true)}
            >
              {dateLimit
                ? moment(dateLimit).format('YYYY/MM/DD')
                : '日程を追加'}
            </Text>
          </View>
          <View style={thisStyle.infoContainer}>
            <TouchableOpacity style={thisStyle.buttonStyle}>
              <Text style={thisStyle.buttonTextStyle}>電話番号</Text>
            </TouchableOpacity>
            <TextInput
              placeholder="電話番号を追加"
              style={thisStyle.textInputStyle}
              textContentType="telephoneNumber"
              keyboardType="numbers-and-punctuation"
              value={telephone}
              onChangeText={(text) => setTelephone(text)}
            />
          </View>
          <View style={thisStyle.infoContainer}>
            <TouchableOpacity style={thisStyle.buttonStyle}>
              <Text style={thisStyle.buttonTextStyle}>webサイト</Text>
            </TouchableOpacity>
            <TextInput
              placeholder="webサイトを追加"
              style={thisStyle.textInputStyle}
              textContentType="URL"
              keyboardType="url"
              value={url}
              onChangeText={(text) => setUrl(text)}
            />
          </View>
          <View
            style={{
              alignItems: 'center',
              padding: 15,
            }}
          >
            <CompleteButton title="追加する" onPress={onCompleteButtonPress} />
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
      <DateTimePickerModal
        isVisible={showTimeFrom}
        mode="time"
        onConfirm={(date) => {
          setTimeFrom(date);
          setShowTimeFrom(false);
        }}
        onCancel={() => setShowTimeFrom(false)}
        date={timeFrom}
      />
      <DateTimePickerModal
        isVisible={showTimeTo}
        mode="time"
        onConfirm={(date) => {
          setTimeTo(date);
          setShowTimeTo(false);
        }}
        onCancel={() => setShowTimeTo(false)}
        date={timeTo}
      />
      <DateTimePickerModal
        isVisible={showDate}
        mode="date"
        onConfirm={(date) => {
          setDateLimit(date);
          setShowDate(false);
        }}
        onCancel={() => setShowDate(false)}
        date={dateLimit}
        minimumDate={today}
      />
    </Container>
  );
};

export default CreateSpotScreen;

/** スタイリング */
const thisStyle = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'solid',
    paddingBottom: 10,
    width: '100%',
  },
  imageStyle: {
    borderColor: '#ccc',
    borderStyle: 'solid',
    borderWidth: 1,
    height: 200,
    width: LAYOUT.window.width * 0.8,
  },
  spotButton: {
    alignItems: 'center',
    backgroundColor: COLOR.tintColor,
    borderRadius: LAYOUT.window.width * 0.1,
    display: 'flex',
    height: LAYOUT.window.width * 0.1,
    justifyContent: 'center',
    width: LAYOUT.window.width * 0.1,
  },
  infoContainer: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'solid',
    display: 'flex',
    flexDirection: 'row',
    padding: 5,
  },
  buttonStyle: {
    backgroundColor: 'orange',
    borderRadius: 5,
    width: 75,
  },
  buttonTextStyle: {
    color: 'white',
    fontFamily: 'genju-medium',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textInputStyle: {
    color: 'black',
    fontSize: 14,
    marginLeft: 10,
  },
  headerContainer: {
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
});
