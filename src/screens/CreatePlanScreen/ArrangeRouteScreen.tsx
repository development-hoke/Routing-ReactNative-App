import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Container, Text, Switch, Toast } from 'native-base';
import {
  View,
  Image,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useNavigation, StackActions } from '@react-navigation/native';
import { Button } from 'react-native-elements';
import DraggableFlatList from 'react-native-draggable-flatlist';
import Carousel from 'react-native-snap-carousel';
import polyline from '@mapbox/polyline';
import moment from 'moment';
// import axios from 'axios';
// from app
import { LAYOUT, COLOR, SPOT_TYPE, getRightSpotType } from 'app/src/constants';
import MapView, { Marker, Polyline, LatLng, Region } from 'react-native-maps';
import { useDispatch, useGlobalState } from 'app/src/Store';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { useGooglePlace, usePostPlan, IPostPlan } from 'app/src/hooks';
import { IPlaceNode, ActionType } from 'app/src/Reducer';
import { IGoogleDirection } from 'app/src/interfaces/app/Map';
import { FontAwesome5 } from '@expo/vector-icons';
import { ISpotFull, IPlan } from 'app/src/interfaces/api/Plan';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

/** デートスポット順番並べ替え画面 */
const ArrangeRouteScreen: React.FC = () => {
  const navigation = useNavigation();
  const loginUser = useGlobalState('loginUser');
  const { getDirection, getPlacePhoto } = useGooglePlace();
  const { createPost } = usePostPlan(loginUser.authorization);
  const dispatch = useDispatch();

  const createPlan = useGlobalState('createPlan');

  const [spots, setSpots] = useState<IPlaceNode[]>(createPlan.route.spots);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [routes, setRoutes] = useState<{
    [key: string]: IGoogleDirection;
  }>({});
  const [elapseModal, setElapseModal] = useState<boolean>(false);
  const [changedElapse, setChangedElaspe] = useState<string>('');
  const [switch1, setSwitch1] = useState<boolean>(false);
  const [switch2, setSwitch2] = useState<boolean>(false);

  const [elapseTotalModal, setElapseTotalModal] = useState<boolean>(false);
  const [changedTotal, setChangedTotal] = useState<string>('');

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const carousel = useRef();

  useEffect(() => {
    carousel.current.snapToItem(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    spots.forEach((item, index) => {
      if (index >= 1) getPathInfo(index - 1);
    });
  }, [spots]);

  const combinePlaceId = (idx: number) =>
    `${spots[idx].place.place_id}:${spots[idx + 1].place.place_id}`;

  async function getPathInfo(idx: number) {
    const key = combinePlaceId(idx);
    if (!routes[key]) {
      const mode =
        createPlan.transportations.indexOf('car') >= 0 ? 'drive' : 'transit';

      const origin = `${spots[idx].place.latitude},${spots[idx].place.longitude}`;
      const dest = `${spots[idx + 1].place.latitude},${
        spots[idx + 1].place.longitude
      }`;

      const newPath = await getDirection(origin, dest, mode);

      setRoutes((prev) => {
        const newRoutes = { ...prev };
        newRoutes[key] = newPath;

        return newRoutes;
      });
    }
  }

  const renderItem = (item: IPlaceNode) => (
    <TouchableWithoutFeedback
      onPress={() =>
        navigation.navigate('SpotDetail', { place: item.place, mode: 'normal' })
      }
    >
      <View>
        <Image
          style={{
            height: LAYOUT.window.height * 0.22,
            borderRadius: 10,
          }}
          source={{ uri: item.place.images[0] }}
        />
        {item.place.spot_type === 'HOTPEPPER' && (
          <Image
            style={{
              width: 88,
              height: 35,
              position: 'absolute',
              bottom: 0,
              right: 0,
            }}
            source={{
              uri: 'http://webservice.recruit.co.jp/banner/hotpepper-m.gif',
            }}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );

  const routeSeq = useMemo(() => {
    const result = [];
    for (let i = 0; i < spots.length - 1; i += 1) {
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
  }, [spots, routes]);

  const routeMarkLocation = useMemo(() => {
    if (currentIndex <= 0) return null;
    const key = combinePlaceId(currentIndex - 1);
    if (routes[key]) {
      const centerPos = {
        latitude:
          (routes[key].routes[0].bounds.northeast.lat +
            routes[key].routes[0].bounds.southwest.lat) /
          2,
        longitude:
          (routes[key].routes[0].bounds.northeast.lng +
            routes[key].routes[0].bounds.southwest.lng) /
          2,
      } as LatLng;

      return {
        location: centerPos,
        cost: Math.round(routes[key].routes[0].legs[0].duration.value / 60),
        region: {
          latitude: centerPos.latitude,
          longitude: centerPos.longitude,
          latitudeDelta:
            routes[key].routes[0].bounds.northeast.lat -
            routes[key].routes[0].bounds.southwest.lat,
          longitudeDelta:
            routes[key].routes[0].bounds.northeast.lng -
            routes[key].routes[0].bounds.southwest.lng,
        } as Region,
      };
    }

    return null;
  }, [currentIndex]);

  const totalTime = useMemo(() => {
    let res = 0;
    spots.forEach((item, index) => {
      res += item.cost;
      if (index < spots.length - 1) {
        const key = combinePlaceId(index);
        if (routes[key])
          res += Math.round(routes[key].routes[0].legs[0].duration.value / 60);
      }
    });

    return res;
  }, [routes, spots]);

  function updateElapse(idx: number, val: string) {
    const newSpots = [...spots];
    setSpots(
      newSpots.map((item, index) => {
        if (index === idx) {
          const newItem = { ...item };
          newItem.cost = Number.parseInt(val, 10);

          return newItem;
        }

        return item;
      }),
    );
  }

  function updateTotalElapse(val: string) {
    if (val !== '') {
      dispatch({
        type: ActionType.SET_CREATE_PLAN,
        payload: {
          ...createPlan,
          neededTime: Number.parseInt(val, 10),
        },
      });
    }
  }

  function saveData() {
    const spotsForApi: ISpotFull[] = [];
    spots.forEach((item, index) => {
      const obj = {
        spot_name: item.place.name,
        latitude: item.place.latitude,
        longitude: item.place.longitude,
        category: item.place.category,
        order: index + 1,
        need_time: item.cost,
        place_id: item.place.place_id,
        icon_url: item.place.icon,
        images: item.place.images,
        spot_type: item.place.spot_type,
      };
      spotsForApi.push(obj);
    });
    const data: IPostPlan = {
      user_id: loginUser.id,
      title,
      description,
      date: moment(createPlan.dateFrom).format('YYYY-MM-DD'),
      need_time: totalTime,
      transportation: createPlan.transportations,
      spots: spotsForApi,
      status: switch1 ? 'public' : 'private',
      datetime_status: switch2 ? 'public' : 'private',
    };

    return data;
  }

  const onGuide = async () => {
    const result = await createPost(saveData());
    if (result) {
      Toast.show({
        text: 'プランを保存しました。',
        duration: 5000,
      });
      navigation.dangerouslyGetParent()?.reset({
        index: 1,
        routes: [{ name: 'Top' }, { name: 'Road', params: { pId: result.id } }],
      });
    }
  };

  const onSave = async () => {
    const result = await createPost(saveData());
    if (result) {
      Toast.show({
        text: 'プランを保存しました。',
        duration: 5000,
      });
      navigation.dangerouslyGetParent()?.navigate('Top');
    }
  };

  return (
    <KeyboardAwareScrollView>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView style={{ padding: 10 }}>
          <View
            style={{
              height: LAYOUT.window.height * 0.22,
            }}
          >
            <Carousel
              ref={carousel}
              data={spots}
              sliderWidth={LAYOUT.window.width * 0.95}
              itemWidth={LAYOUT.window.width * 0.85}
              renderItem={({ item }: { item: IPlaceNode }) => renderItem(item)}
              layout="stack"
              onSnapToItem={(sliderIndex) => setCurrentIndex(sliderIndex)}
            />
          </View>
          <View>
            <Text style={{ marginTop: 5, textAlign: 'center', fontSize: 12 }}>
              {currentIndex >= 0 && spots[currentIndex].place.name}
            </Text>
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
              initialRegion={{
                latitude: spots[0].place.latitude,
                longitude: spots[0].place.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.05,
              }}
              style={{ height: '100%' }}
              region={routeMarkLocation?.region}
            >
              {spots.map((item, index) => {
                return (
                  <Marker
                    description={item.place.name}
                    coordinate={{
                      latitude: item.place.latitude,
                      longitude: item.place.longitude,
                    }}
                    pinColor={index === currentIndex ? '#00B4AB' : 'orange'}
                    key={item.place.place_id}
                  >
                    <View>
                      <FontAwesome5
                        name="map-marker"
                        size={30}
                        color={COLOR.tintColor}
                      />
                      <View style={{ position: 'absolute', top: 5, left: 4 }}>
                        <Image
                          source={{ uri: item.place.icon }}
                          style={{ width: 15, height: 15 }}
                        />
                      </View>
                    </View>
                  </Marker>
                );
              })}
              {routeSeq.map((item, index) => (
                <Polyline
                  coordinates={item}
                  strokeWidth={5}
                  strokeColor="orange"
                />
              ))}
              {routeMarkLocation && (
                <Marker
                  coordinate={routeMarkLocation.location}
                  pinColor="red"
                  key="describeRoute"
                >
                  <View
                    style={{
                      backgroundColor: 'orange',
                      padding: 2,
                      borderRadius: 3,
                      borderColor: 'white',
                      borderStyle: 'solid',
                      borderWidth: 1,
                    }}
                  >
                    <Text style={{ color: 'white' }}>
                      {routeMarkLocation.cost}分
                    </Text>
                  </View>
                </Marker>
              )}
            </MapView>
          </View>
          <View
            style={{
              height: 65,
              marginTop: 10,
              borderColor: 'grey',
              borderBottomWidth: 1,
            }}
          >
            <DraggableFlatList
              data={spots}
              keyExtractor={(item) => item.place.place_id}
              horizontal
              onDragEnd={({ data }) => setSpots(data)}
              renderItem={({ item, index, drag }) => {
                return (
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        marginLeft: 10,
                        marginRight: 10,
                        padding: 5,
                        borderRadius: 5,
                        backgroundColor:
                          currentIndex === index ? 'orange' : 'transparent',
                      }}
                      onLongPress={drag}
                      onPress={() => {
                        setCurrentIndex(index || 0);
                        setChangedElaspe(
                          currentIndex >= 0
                            ? spots[currentIndex].cost.toString()
                            : '',
                        );
                        if (index === currentIndex) {
                          setElapseModal(true);
                        }
                      }}
                    >
                      <Text
                        style={{
                          color:
                            currentIndex === index
                              ? 'white'
                              : COLOR.textTintColor,
                          fontWeight: 'bold',
                          fontFamily: 'genju-medium',
                          textAlign: 'center',
                          fontSize: 20,
                          width: 100,
                          height: 27,
                        }}
                      >
                        {/* {SPOT_TYPE[getRightSpotType(item.place.types)].title} */}
                        {item.place.name.length > 5
                          ? `${item.place.name.substr(0, 5)}...`
                          : item.place.name}
                      </Text>
                      <Text
                        style={{
                          color:
                            currentIndex === index
                              ? 'white'
                              : COLOR.textTintColor,
                          textAlign: 'center',
                        }}
                      >
                        {item.cost}分
                      </Text>
                    </TouchableOpacity>
                    {(index || 0) < spots.length - 1 && <Text>→</Text>}
                  </View>
                );
              }}
            />
          </View>
          <View
            style={{
              height: 92,
              borderColor: 'grey',
              borderBottomWidth: 1,
            }}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: 5,
              }}
            >
              <TouchableOpacity style={thisStyle.timeButtonStyle}>
                <Text style={thisStyle.timeButtonTextStyle}>当日予定時刻</Text>
              </TouchableOpacity>
              <View style={thisStyle.timeTextWrapper}>
                <Text style={thisStyle.timeTextStyle1}>
                  &nbsp;{moment(createPlan.dateFrom).format('YYYY年MM月DD日')}
                  &nbsp;&nbsp;
                  {`${moment(createPlan.dateFrom).format('H:mm')}~${moment(
                    createPlan.dateFrom,
                  )
                    .add('minutes', createPlan.neededTime)
                    .format('H:mm')}`}
                  &nbsp;&nbsp;
                </Text>
                <TouchableOpacity
                  style={thisStyle.timeMinuteWrapper}
                  onPress={() => setElapseTotalModal(true)}
                >
                  <Text style={thisStyle.timeMinuteStyle}>
                    {`${createPlan.neededTime}分`}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: 10,
              }}
            >
              <TouchableOpacity style={thisStyle.timeButtonStyle}>
                <Text style={thisStyle.timeButtonTextStyle}>
                  プラン所要時間
                </Text>
              </TouchableOpacity>
              <View style={thisStyle.timeTextWrapper}>
                <Text style={thisStyle.timeTextStyle1}>
                  &nbsp;
                  {`${moment(createPlan.dateFrom).format('H:mm')}~${moment(
                    createPlan.dateFrom,
                  )
                    .add('minutes', totalTime)
                    .format('H:mm')}`}
                  &nbsp;&nbsp;
                  <Text style={thisStyle.timeMinuteEmptyStyle}>
                    &nbsp;{`${totalTime}分`}&nbsp;
                  </Text>
                  &nbsp;
                </Text>
              </View>
            </View>
            <TextInput
              placeholder="プラン名を入力"
              style={{ paddingLeft: 2, fontSize: 16, height: 40 }}
              onChangeText={(text) => setTitle(text)}
            />
          </View>
          <View
            style={{ marginTop: 0, borderColor: 'grey', borderBottomWidth: 1 }}
          >
            <TextInput
              placeholder="ポイントを記載"
              style={{ paddingLeft: 2, fontSize: 16, height: 65 }}
              numberOfLines={3}
              multiline
              onChangeText={(text) => setDescription(text)}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              padding: 5,
            }}
          >
            <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
              <Text style={thisStyle.itemTitleText}>
                投稿時日時を非公開にする
              </Text>
              <Switch
                onValueChange={() => setSwitch1(!switch1)}
                value={switch1}
                style={{ marginTop: 5 }}
              />
            </View>
            <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
              <Text style={thisStyle.itemTitleText}>投稿を非公開にする</Text>
              <Switch
                onValueChange={() => setSwitch2(!switch2)}
                value={switch2}
                style={{ marginTop: 5 }}
              />
            </View>
          </View>
          <View style={thisStyle.button1}>
            <Button
              title="プランを保存"
              buttonStyle={thisStyle.footerButton}
              titleStyle={{ fontSize: 15 }}
              onPress={onSave}
              disabled={createPlan.neededTime < totalTime || title === ''}
            />
            <Button
              buttonStyle={thisStyle.footerButton}
              titleStyle={{ fontSize: 13 }}
              title="プランを保存して案内"
              onPress={onGuide}
              disabled={createPlan.neededTime < totalTime || title === ''}
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
      <Modal animationType="slide" transparent visible={elapseModal}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
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
                width: LAYOUT.window.width * 0.35,
                height: 120,
                backgroundColor: COLOR.backgroundColor,
                padding: 10,
                borderRadius: 10,
              }}
            >
              <View
                style={{
                  marginTop: 10,
                  marginBottom: 15,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'baseline',
                }}
              >
                <TextInput
                  placeholder="滞在時間"
                  style={{
                    fontSize: 20,
                  }}
                  defaultValue={
                    currentIndex >= 0 ? spots[currentIndex].cost.toString() : ''
                  }
                  keyboardType="numeric"
                  onChangeText={(text) => setChangedElaspe(text)}
                />
                <Text style={{ fontSize: 15 }}>分</Text>
              </View>
              <View>
                <Button
                  title="OK"
                  buttonStyle={{
                    backgroundColor: 'orange',
                    width: 75,
                    paddingTop: 5,
                    paddingBottom: 5,
                  }}
                  onPress={() => {
                    setElapseModal(false);
                    updateElapse(currentIndex, changedElapse);
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal animationType="slide" transparent visible={elapseTotalModal}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
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
                width: LAYOUT.window.width * 0.35,
                height: 120,
                backgroundColor: COLOR.backgroundColor,
                padding: 10,
                borderRadius: 10,
              }}
            >
              <View
                style={{
                  marginTop: 10,
                  marginBottom: 15,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'baseline',
                }}
              >
                <TextInput
                  placeholder="滞在時間"
                  style={{
                    fontSize: 20,
                  }}
                  defaultValue={createPlan.neededTime.toString()}
                  keyboardType="numeric"
                  onChangeText={(text) => setChangedTotal(text)}
                />
                <Text style={{ fontSize: 15 }}>分</Text>
              </View>
              <View>
                <Button
                  title="OK"
                  buttonStyle={{
                    backgroundColor: 'orange',
                    width: 75,
                    paddingTop: 5,
                    paddingBottom: 5,
                  }}
                  onPress={() => {
                    setElapseTotalModal(false);
                    updateTotalElapse(changedTotal);
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAwareScrollView>
  );
};

/** スタイリング */
const thisStyle = StyleSheet.create({
  button1: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 5,
    padding: 15,
  },
  footerButton: {
    backgroundColor: COLOR.tintColor,
    width: LAYOUT.window.width * 0.4,
    height: 50,
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 10,
  },
  timeButtonStyle: {
    backgroundColor: 'orange',
    width: 90,
    borderRadius: 5,
    marginTop: 3,
  },
  timeButtonTextStyle: {
    color: 'white',
    fontFamily: 'genju-medium',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  timeTextStyle: {
    marginLeft: 8,
    fontFamily: 'genju-medium',
    fontSize: 14,
    color: 'grey',
  },
  timeTextWrapper: {
    position: 'absolute',
    right: 5,
    marginLeft: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  timeTextStyle1: {
    fontFamily: 'genju-medium',
    fontSize: 14,
    color: 'grey',
  },
  timeMinuteStyle: {
    fontFamily: 'genju-medium',
    fontSize: 16,
    color: 'white',
  },
  timeMinuteWrapper: {
    backgroundColor: COLOR.tintColor,
    borderRadius: 5,
    paddingLeft: 5,
    paddingRight: 5,
  },
  timeMinuteEmptyStyle: {
    fontFamily: 'genju-medium',
    fontSize: 16,
    color: 'grey',
  },
  timeTextEmptyStyle: {
    marginLeft: 8,
    fontFamily: 'genju-medium',
    fontSize: 14,
    color: 'white',
  },
  itemTitleText: {
    color: COLOR.textTintColor,
    fontFamily: 'genju-medium',
    fontSize: 11,
    marginRight: 10,
  },
});

export default ArrangeRouteScreen;
