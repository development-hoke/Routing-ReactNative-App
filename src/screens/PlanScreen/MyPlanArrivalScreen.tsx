import React, { useMemo, useState, useEffect } from 'react';
import { StyleSheet, Image, View, FlatList } from 'react-native';
import { Text, Spinner, Toast } from 'native-base';
import { Button } from 'react-native-elements';
// from app
import { useGlobalState, useDispatch } from 'app/src/Store';
import { LAYOUT, COLOR, SPOT_TYPE } from 'app/src/constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ActionType } from 'app/src/Reducer';
import { PlaceNameElement, ReactionElement } from 'app/src/components/Element';
import { IPlace, IHPShop, IPlaceUnity } from 'app/src/interfaces/app/Map';
import { useHotPepper } from 'app/src/hooks/useHotPepper';
import { useGooglePlace } from 'app/src/hooks';
import { TouchableOpacity } from 'react-native-gesture-handler';

/** マイプラン画面 */
const MyPlanArrivalScreen: React.FC = () => {
  const { navigate, reset } = useNavigation();
  const loginUser = useGlobalState('loginUser');
  const myPlan = useGlobalState('myPlan');
  const myPlanArrival = useGlobalState('myPlanArrival');
  const dispatch = useDispatch();
  const { searchNearbyPlace, getPlacePhoto } = useGooglePlace();
  const { searchNearbyPlaceH } = useHotPepper();
  const route = useRoute();

  const [nearSpots, setNearSpots] = useState<IPlaceUnity[]>([]);
  const [isPlacesLoading, setIsPlacesLoading] = useState<boolean>(true);
  const currentSpot = myPlan.spots[myPlanArrival];

  const param = route.params as { extra: IPlace | IHPShop };

  useEffect(() => {
    setIsPlacesLoading(true);
    loadSpots();
    async function loadSpots() {
      const newSpots: IPlaceUnity[] = [];
      await Promise.all(
        SPOT_TYPE.map(async (type) => {
          let places: IPlaceUnity[] = [];
          if (type.origin === 'GOOGLE') {
            const gPlaces = await searchNearbyPlace(
              {
                latitude: currentSpot.latitude,
                longitude: currentSpot.longitude,
              },
              20,
              type.id,
            );
            places = gPlaces.map((detail) => ({
              id: detail.id,
              place_id: detail.place_id,
              name: detail.name,
              formatted_address: detail.formatted_address,
              category: type.id,
              opening_hours: '',
              formatted_phone_number: detail.formatted_phone_number,
              website: detail.website,
              images: [detail.photolink],
              latitude: detail.geometry.location.lat,
              longitude: detail.geometry.location.lng,
              spot_type: 'GOOGLE',
              icon: detail.icon,
              user_ratings_total: detail.user_ratings_total,
            }));
          } else {
            const hPlaces = await searchNearbyPlaceH(
              {
                latitude: currentSpot.latitude,
                longitude: currentSpot.longitude,
              },
              20,
              type.id,
            );
            places = hPlaces.map((detail) => ({
              id: detail.id,
              place_id: detail.place_id,
              name: detail.name,
              formatted_address: detail.address,
              category: type.id,
              opening_hours: detail.open,
              formatted_phone_number: '',
              website: '',
              images: [detail.photolink],
              latitude: detail.geometry.location.lat,
              longitude: detail.geometry.location.lng,
              spot_type: 'HOTPEPPER',
              icon: detail.icon,
              user_ratings_total: 0,
            }));
          }
          if (places.length > 0) {
            for (let i = 0; i < places.length; i += 1) {
              const item = places[i];
              let exists = false;
              for (let j = 0; j < newSpots.length; j += 1) {
                if (newSpots[j].place_id === item.place_id) {
                  exists = true;
                }
              }
              if (!exists && item.images.length > 0) newSpots.push({ ...item });
            }
          }
        }),
      );
      const randomSpots = [];
      while (newSpots.length > 0) {
        const randomIdx = Math.floor(Math.random() * newSpots.length);
        randomSpots.push(newSpots[randomIdx]);
        newSpots.splice(randomIdx, 1);
      }
      setNearSpots(randomSpots.slice(0, 20));
      setIsPlacesLoading(false);
    }
  }, []);

  const onCompleteButtonPress = () => {
    if (myPlanArrival < myPlan.spots.length - 1) {
      dispatch({
        type: ActionType.SET_EXTRA_SPOT,
        payload: null,
      });
      navigate('Road');
    } else {
      Toast.show({
        text: '今日のプランは終了です。お疲れ様でした。',
        duration: 5000,
      });
      navigate('Top');
    }
  };

  return (
    <View style={thisStyle.container}>
      <View
        style={{
          width: LAYOUT.window.width - 20,
          height: LAYOUT.window.height * 0.4,
        }}
      >
        {!param && currentSpot.images.length > 0 && (
          <Image
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 5,
            }}
            source={{
              uri: currentSpot.images[0],
            }}
          />
        )}
        {param && (
          <Image
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 5,
            }}
            source={{ uri: param.extra.photolink }}
          />
        )}
        {currentSpot.images[0].includes('imgfp.hotp.jp') && (
          <Image
            style={{
              width: 88,
              height: 35,
              position: 'absolute',
            }}
            source={{
              uri: 'http://webservice.recruit.co.jp/banner/hotpepper-m.gif',
            }}
          />
        )}
        <PlaceNameElement
          title={param ? param.extra.name : currentSpot.spot_name}
        />
      </View>
      <ReactionElement user_ratings_total="" />
      {isPlacesLoading ? (
        <Spinner color={COLOR.tintColor} style={{ flex: 1 }} />
      ) : (
        <View
          style={{
            width: LAYOUT.window.width - 20,
            height: (LAYOUT.window.width - 25) / 3 + 30,
          }}
        >
          <View style={thisStyle.nearSpotTitle}>
            <Text>近くの人気スポット</Text>
          </View>
          <FlatList
            data={nearSpots}
            renderItem={(i) => (
              <TouchableOpacity
                style={thisStyle.nearSpotItem}
                onPress={() =>
                  navigate('SpotDetail', { place: i.item, mode: 'guide' })
                }
              >
                <Image
                  style={thisStyle.nearSpotImage}
                  source={{ uri: i.item.images[0] }}
                />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            horizontal
          />
        </View>
      )}
      <View
        style={{
          alignItems: 'center',
          height: LAYOUT.window.height * 0.1,
          justifyContent: 'center',
        }}
      >
        <Button
          buttonStyle={[thisStyle.button, { backgroundColor: COLOR.tintColor }]}
          title="次のスポットへ"
          onPress={onCompleteButtonPress}
        />
      </View>
    </View>
  );
};

/** スタイリング */
const thisStyle = StyleSheet.create({
  container: {
    backgroundColor: COLOR.backgroundColor,
    flex: 1,
    justifyContent: 'flex-start',
    padding: 10,
    paddingTop: 20,
  },
  button: {
    width: LAYOUT.window.width * 0.5,
    height: LAYOUT.window.height * 0.06,
    borderRadius: 10,
    margin: 20,
  },
  mainText: {
    fontFamily: 'genju-medium',
    fontSize: 14,
  },
  buttonTitleStyle: {
    // maxWidth: LAYOUT.window.width * 0.3,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  arrowText: {
    justifyContent: 'center',
    textAlignVertical: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  spotContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  nearSpotTitle: {
    marginBottom: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nearSpotItem: {
    width: (LAYOUT.window.width - 25) / 3,
    height: (LAYOUT.window.width - 25) / 3,
    borderRadius: 5,
    margin: 1,
  },
  nearSpotImage: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
});

export default MyPlanArrivalScreen;
