import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, Image, View, ScrollView } from 'react-native';
import { Text, Toast } from 'native-base';
import { Button } from 'react-native-elements';
import * as Location from 'expo-location';
// from app
import { useGlobalState, useDispatch } from 'app/src/Store';
import { LAYOUT, COLOR, IMAGE } from 'app/src/constants';
import { LoadingSpinner } from 'app/src/components/Spinners';
import { useGooglePlace, useGetPlanDetail } from 'app/src/hooks';
import MapView, { Marker, LatLng, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { ISpotFull } from 'app/src/interfaces/api/Plan';
import { ActionType } from 'app/src/Reducer';
import { IPlace, IHPShop, IGoogleDirection } from 'app/src/interfaces/app/Map';
import polyline from '@mapbox/polyline';

/** マイプラン画面 */
const MyPlanRoadScreen: React.FC = () => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch();
  const loginUser = useGlobalState('loginUser');
  const myPlan = useGlobalState('myPlan');
  const myPlanArrival = useGlobalState('myPlanArrival');
  const extra = useGlobalState('extraSpot');
  const { getDirection } = useGooglePlace();
  const route = useRoute();

  const param = route.params as { pId: string };
  const planID = param ? param.pId : myPlan.plan_id;

  const { isPlanLoading, plan, getPlanDetail } = useGetPlanDetail(
    planID,
    loginUser.id,
    loginUser.authorization,
  );
  const { getDistance, getDirectionByLocation, API_KEY } = useGooglePlace();

  const [duration, setDuration] = useState(0);
  const [distance, setDistance] = useState(0);
  const [location, setLocation] = useState<Location.LocationData>();
  const [routes, setRoutes] = useState<{
    [key: string]: IGoogleDirection;
  }>({});
  const [routeF, setRouteF] = useState<LatLng[]>([]);
  const [nearestPoint, setNearestPoint] = useState<number>(0);
  const [nearestDistance, setNearestDistance] = useState<number>(0);

  const updateLocation = async () => {
    const { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    const curLocation = await Location.getCurrentPositionAsync({});
    if (location) {
      const distance = getDistance(
        curLocation.coords.latitude,
        curLocation.coords.longitude,
        location.coords.latitude,
        location.coords.longitude,
      );
      if (distance > 30) {
        setLocation(curLocation);
      }
    } else {
      setLocation(curLocation);
    }
    // setLocation({
    //   ...curLocation,
    //   coords: {
    //     ...curLocation.coords,
    //     latitude: 35.658606737323325,
    //     longitude: 139.69814462256613,
    //   },
    // });
  };

  useEffect(() => {
    getPlanDetail();
    setInterval(() => updateLocation(), 5000);
  }, []);

  useEffect(() => {
    plan.spots.forEach((item, index) => {
      if (index >= 1) getPathInfo(index - 1);
    });
  }, [plan.spots]);

  const combinePlaceId = (idx: number) =>
    `${plan.spots[idx].place_id}:${plan.spots[idx + 1].place_id}`;

  async function getPathInfo(idx: number) {
    const key = combinePlaceId(idx);
    if (!routes[key]) {
      const mode = plan.transportation[0];

      const origin = `${plan.spots[idx].latitude},${plan.spots[idx].longitude}`;
      const dest = `${plan.spots[idx + 1].latitude},${
        plan.spots[idx + 1].longitude
      }`;

      const newPath = await getDirection(origin, dest, mode);

      setRoutes((prev) => {
        const newRoutes = { ...prev };
        newRoutes[key] = newPath;

        return newRoutes;
      });
    }
  }

  const routeSeq = useMemo(() => {
    const result = [];
    for (let i = 0; i < plan.spots.length - 1; i += 1) {
      const key = combinePlaceId(i);
      if (routes[key]) {
        const array = polyline.decode(
          routes[key].routes[0].overview_polyline.points,
        );
        const coords = array.map(
          (point: number[]) =>
            ({
              latitude: point[0],
              longitude: point[1],
            } as LatLng),
        );
        result.push(coords);
      }
    }

    return result;
  }, [plan.spots, routes]);

  useEffect(() => {
    async function calcFirstRoute() {
      if (!(location && plan && routeSeq)) return;
      if (myPlanArrival < 0) {
        const origin = `${location.coords.latitude},${location.coords.longitude}`;
        const dest = `${plan.spots[0].latitude},${plan.spots[0].longitude}`;
        const mode = plan.transportation[0];
        const firstPath = await getDirection(origin, dest, mode);

        const array = polyline.decode(
          firstPath.routes[0].overview_polyline.points,
        );

        setRouteF(
          array.map(
            (point: number[]) =>
              ({
                latitude: point[0],
                longitude: point[1],
              } as LatLng),
          ),
        );
        setNearestDistance(firstPath.routes[0].legs[0].distance.value);
      } else {
        const origin = `${location.coords.latitude},${location.coords.longitude}`;
        const coords = routeSeq[myPlanArrival];
        let minDistance = getDistance(
          location.coords.latitude,
          location.coords.longitude,
          coords[0].latitude,
          coords[0].longitude,
        );
        let nearestPointIdx = 0;
        coords.forEach((point, idx) => {
          const distance = getDistance(
            location.coords.latitude,
            location.coords.longitude,
            point.latitude,
            point.longitude,
          );
          if (distance < minDistance) {
            minDistance = distance;
            nearestPointIdx = idx;
          }
        });
        const dest = `${coords[nearestPointIdx].latitude},${coords[nearestPointIdx].longitude}`;
        const mode = plan.transportation[0];
        const currentPath = await getDirection(origin, dest, mode);
        const array = polyline.decode(
          currentPath.routes[0].overview_polyline.points,
        );

        setRouteF(
          array.map(
            (point: number[]) =>
              ({
                latitude: point[0],
                longitude: point[1],
              } as LatLng),
          ),
        );
        setNearestPoint(nearestPointIdx);
        setNearestDistance(minDistance);
      }
    }
    calcFirstRoute();
  }, [location, plan, myPlanArrival, routeSeq]);

  useEffect(() => {
    if (param) {
      dispatch({
        type: ActionType.SET_MY_PLAN,
        payload: plan,
      });
    }
  }, [plan]);

  useEffect(() => {
    async function calcCost() {
      const currentSpot =
        myPlanArrival < 0 && location
          ? location.coords
          : plan.spots[myPlanArrival];
      const goalSpot = extra
        ? {
            latitude: extra.geometry.location.lat,
            longitude: extra.geometry.location.lng,
          }
        : plan.spots[Math.min(myPlanArrival + 1, plan.spots.length - 1)];
      const result = await getDirectionByLocation(
        `${currentSpot.latitude},${currentSpot.longitude}`,
        `${goalSpot.latitude},${goalSpot.longitude}`,
        plan.transportation[0] === 'car' ? 'driving' : 'transit',
      );
      setDuration(Math.round(result.routes[0].legs[0].duration.value / 60));
      setDistance(result.routes[0].legs[0].distance.value);
    }
    if (!isPlanLoading) calcCost();
  }, [myPlanArrival, isPlanLoading, location]);

  const angle = useMemo(() => {
    let angleValue = 0;
    if (plan.spots.length > 0 && location) {
      const goalSpot = extra
        ? {
            latitude: extra.geometry.location.lat,
            longitude: extra.geometry.location.lng,
          }
        : plan.spots[Math.min(myPlanArrival + 1, plan.spots.length - 1)];
      const dy = goalSpot.latitude - location.coords.latitude;
      const dx =
        Math.cos((Math.PI / 180) * location.coords.latitude) *
        (goalSpot.longitude - location.coords.longitude);

      angleValue = Math.atan2(dy, dx);
    }

    return angleValue;
  }, [plan, myPlanArrival, location]);

  const formatDirection = (angleValue: number) => {
    if (angleValue >= -Math.PI / 6 && angleValue <= Math.PI / 6) {
      return '東へ淮む';
    }
    if (angleValue >= Math.PI / 3 && angleValue <= (Math.PI * 2) / 3) {
      return '北へ淮む';
    }
    if (angleValue >= (Math.PI * 5) / 6 || angleValue <= (-Math.PI * 5) / 6) {
      return '西へ淮む';
    }
    if (angleValue >= (-Math.PI * 2) / 3 && angleValue <= -Math.PI / 3) {
      return '南へ淮む';
    }
    if (angleValue >= Math.PI / 6 && angleValue <= Math.PI / 3) {
      return '東北へ淮む';
    }
    if (angleValue >= (Math.PI * 2) / 3 && angleValue <= (Math.PI * 5) / 6) {
      return '西北へ淮む';
    }
    if (angleValue <= -Math.PI / 6 && angleValue >= -Math.PI / 3) {
      return '東南へ淮む';
    }
    if (angleValue <= (-Math.PI * 5) / 6 && angleValue >= (-Math.PI * 2) / 3) {
      return '西南へ淮む';
    }

    return '';
  };

  const renderPath = (index: number) =>
    index < plan.spots.length - 1 ? (
      <MapViewDirections
        origin={{
          latitude: plan.spots[index].latitude,
          longitude: plan.spots[index].longitude,
        }}
        destination={{
          latitude: plan.spots[index + 1].latitude,
          longitude: plan.spots[index + 1].longitude,
        }}
        apikey={`${API_KEY}`}
        strokeWidth={3}
        strokeColor={index < myPlanArrival ? 'orange' : '#aaa'}
      />
    ) : null;

  const renderExtraPath = (place: IPlace | IHPShop) =>
    extra ? (
      <MapViewDirections
        origin={{
          latitude: plan.spots[myPlanArrival].latitude,
          longitude: plan.spots[myPlanArrival].longitude,
        }}
        destination={{
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
        }}
        apikey={`${API_KEY}`}
        strokeWidth={3}
        strokeColor="#888"
      />
    ) : null;

  const renderMarker = (place: ISpotFull, index: number) => {
    return (
      <Marker
        coordinate={{
          latitude: place.latitude,
          longitude: place.longitude,
        }}
        key={index}
      >
        <View>
          <FontAwesome5
            name="map-marker"
            size={index === myPlanArrival ? 35 : 30}
            color={COLOR.tintColor}
          />
          {place.icon_url && (
            <View
              style={{
                position: 'absolute',
                top: index === myPlanArrival ? 8 : 5,
                left: index === myPlanArrival ? 5.5 : 4,
              }}
            >
              <Image
                source={{ uri: place.icon_url }}
                style={{ width: 15, height: 15 }}
              />
            </View>
          )}
        </View>
      </Marker>
    );
  };

  const renderExtra = (place: IPlace | IHPShop) => {
    return (
      <Marker
        coordinate={{
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
        }}
      >
        <View>
          <FontAwesome5 name="map-marker" size={30} color="coral" />
          {place.icon && (
            <View style={{ position: 'absolute', top: 5, left: 4 }}>
              <Image
                source={{ uri: place.icon }}
                style={{ width: 15, height: 15 }}
              />
            </View>
          )}
        </View>
      </Marker>
    );
  };

  const renderMyLocation = (location: Location.LocationData) => {
    return (
      <Marker
        coordinate={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }}
        key="MyLocation"
      >
        <View>
          <FontAwesome5 name="male" size={35} color="blue" />
        </View>
      </Marker>
    );
  };

  const renderRoute = (points: LatLng[], index: number) => {
    if (index !== myPlanArrival) {
      return (
        <Polyline
          coordinates={points}
          strokeWidth={5}
          strokeColor={index < myPlanArrival ? '#aaa' : '#FEBC71'}
        />
      );
    }
    const arrived = points.filter((item, index) => index <= nearestPoint);
    const notArrived = points.filter((item, index) => index >= nearestPoint);

    return (
      <>
        <Polyline coordinates={arrived} strokeWidth={5} strokeColor="#aaa" />
        <Polyline
          coordinates={notArrived}
          strokeWidth={5}
          strokeColor="orange"
        />
      </>
    );
  };

  const nextSpot = () => {
    if (!extra) {
      dispatch({
        type: ActionType.SET_MY_PLAN_ARRIVAL,
        payload: Math.min(myPlanArrival + 1, plan.spots.length - 1),
      });
      navigate('Arrival');
    } else {
      navigate('Arrival', { extra });
    }
    Toast.show({
      text: 'スポットに到着しました。',
      duration: 5000,
    });
  };

  if (isPlanLoading) {
    return LoadingSpinner;
  }

  const formatDistance = () =>
    distance > 1000 ? `${(distance / 1000).toFixed(1)}km` : `${distance}m`;

  const formatDuration = () =>
    duration > 60
      ? `${Math.floor(duration / 60)}時間${duration % 60}分`
      : `${duration}分`;

  return (
    <ScrollView contentContainerStyle={thisStyle.container}>
      <View
        style={{
          // height: LAYOUT.window.height * 0.6,
          borderColor: COLOR.textTintColor,
          borderWidth: 1,
          borderRadius: 5,
          padding: 1,
          flex: 1,
        }}
      >
        <MapView
          initialRegion={{
            latitude: plan.spots[0].latitude,
            longitude: plan.spots[0].longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
          }}
          style={{ height: '100%' }}
          showsUserLocation
        >
          {routeSeq.map((item, index) => renderRoute(item, index))}
          {plan.spots.map((item, index) => renderMarker(item, index))}
          {extra && renderExtra(extra)}
          {extra && renderExtraPath(extra)}
          {/* {location && renderMyLocation(location)} */}
          {nearestDistance > 30 && (
            <Polyline
              coordinates={routeF}
              strokeWidth={5}
              strokeColor="green"
            />
          )}
        </MapView>
      </View>
      <View style={thisStyle.button1}>
        <Button
          title={
            myPlanArrival < 0 ? '出発位置' : plan.spots[myPlanArrival].spot_name
          }
          buttonStyle={thisStyle.button}
          titleStyle={thisStyle.buttonTitleStyle}
        />
        <View style={thisStyle.arrowH}>
          <Image source={IMAGE.guideArrow} style={thisStyle.arrowHImg} />
        </View>
        <Button
          buttonStyle={thisStyle.button}
          title={
            extra
              ? extra.name
              : (myPlanArrival < plan.spots.length - 1 &&
                  plan.spots[myPlanArrival + 1].spot_name) ||
                '案内完了'
          }
          titleStyle={thisStyle.buttonTitleStyle}
        />
      </View>
      <View style={thisStyle.emptySpace}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: LAYOUT.window.width * 0.3,
          }}
        >
          <Text style={thisStyle.itemTitleText}>次の地点まであと</Text>
          <Text style={thisStyle.itemTitleText}>
            {formatDistance()} {formatDuration()}
          </Text>
        </View>
        <View
          style={{
            width: LAYOUT.window.width * 0.45,
            padding: 10,
            alignItems: 'center',
            justifyContent: 'flex-end',
            flexDirection: 'row',
          }}
        >
          <View
            style={{
              transform: [{ rotate: `${-angle + Math.PI / 2}rad` }],
            }}
          >
            <FontAwesome5
              name="arrow-up"
              size={20}
              color={COLOR.textTintColor}
            />
          </View>
          <Text style={thisStyle.text2}>{formatDirection(angle)}</Text>
        </View>
        <Button
          onPress={nextSpot}
          buttonStyle={[
            thisStyle.button,
            { width: LAYOUT.window.width * 0.15 },
          ]}
          title="到着"
          titleStyle={thisStyle.buttonTitleStyle}
        />
      </View>
    </ScrollView>
  );
};

/** スタイリング */
const thisStyle = StyleSheet.create({
  container: {
    backgroundColor: COLOR.backgroundColor,
    flex: 1,
    justifyContent: 'flex-start',
    padding: 10,
  },
  footerIcon1: {
    backgroundColor: 'white',
    width: LAYOUT.window.width * 0.1,
    height: LAYOUT.window.width * 0.1,
    padding: 10,
    borderRadius: LAYOUT.window.width * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: LAYOUT.window.height * 0.6,
    left: LAYOUT.window.width * 0.8,
  },
  arrowH: {
    flexDirection: 'column',
    width: LAYOUT.window.width * 0.3,
    alignItems: 'center',
  },
  arrowHImg: {
    height: 30,
    width: '90%',
  },
  button1: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
    // marginBottom: 5,
    // padding: 15,
  },
  text2: {
    color: COLOR.textTintColor,
    fontSize: 14,
  },
  button: {
    backgroundColor: COLOR.tintColor,
    width: LAYOUT.window.width * 0.3,
    borderRadius: 10,
  },
  columnTitle: {
    backgroundColor: COLOR.tintColor,
    borderRadius: 10,
    padding: 5,
    height: LAYOUT.window.height * 0.03,
    width: LAYOUT.window.width * 0.25,
    alignItems: 'center',
  },
  columnTitleText: {
    color: 'white',
    fontFamily: 'genju-medium',
    fontSize: 12,
  },
  emptySpace: {
    marginTop: 5,
    marginBottom: 5,
    flexDirection: 'row',
    paddingLeft: 10,
  },
  itemTitleText: {
    color: COLOR.textTintColor,
    fontFamily: 'genju-medium',
    fontSize: 12,
    marginRight: 10,
  },
  buttonTitleStyle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default MyPlanRoadScreen;
