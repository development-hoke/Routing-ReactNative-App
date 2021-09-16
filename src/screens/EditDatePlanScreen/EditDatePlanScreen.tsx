import React, { useRef, useState, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  ActionSheetIOS,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Container,
  Content,
  Text,
  Left,
  Body,
  Switch,
  View,
  Right,
  Form,
  Label,
  Item,
  Input,
} from 'native-base';

// from app
import { COLOR, LAYOUT } from 'app/src/constants';
import { CompleteButton } from 'app/src/components/Button';
import { appTextStyle } from 'app/src/styles';
import { DateTimePickerLabel } from 'app/src/components/Form';
import { useUpdatePost } from 'app/src/hooks/useUpdatePost';
import Carousel from 'react-native-snap-carousel';
import { IPlanFull, ISpotFull } from 'app/src/interfaces/api/Plan';
import MapView, { Marker, Polyline, LatLng, Region } from 'react-native-maps';
import { FontAwesome5 } from '@expo/vector-icons';
import { IGoogleDirection } from 'app/src/interfaces/app/Map';
import { useGooglePlace } from 'app/src/hooks';
import polyline from '@mapbox/polyline';
import DraggableFlatList from 'react-native-draggable-flatlist';
import moment from 'moment';
import { Button } from 'react-native-elements';

/** 投稿編集画面 */
const EditDatePlanScreen: React.FC = () => {
  const { params } = useRoute();
  const { goBack } = useNavigation();
  const carousel = useRef();
  const { getDirection } = useGooglePlace();

  const [plan, updatePlan] = useState<IPlanFull>(params.plan);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [routes, setRoutes] = useState<{
    [key: string]: IGoogleDirection;
  }>({});
  const [spots, setSpots] = useState<ISpotFull[]>(params.plan.spots);
  const [changedElapse, setChangedElaspe] = useState<string>('');
  const [elapseModal, setElapseModal] = useState<boolean>(false);
  const [switch1, setSwitch1] = useState<boolean>(false);
  const [switch2, setSwitch2] = useState<boolean>(false);

  useEffect(() => {
    carousel.current.snapToItem(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    spots.forEach((item, index) => {
      if (index >= 1) getPathInfo(index - 1);
    });
  }, [spots]);

  const combinePlaceId = (idx: number) =>
    `${spots[idx].place_id}:${spots[idx + 1].place_id}`;

  async function getPathInfo(idx: number) {
    const key = combinePlaceId(idx);
    if (!routes[key]) {
      const mode =
        plan.transportation.indexOf('car') >= 0 ? 'drive' : 'transit';

      const newPath = await getDirection(
        `${spots[idx].latitude},${spots[idx].longitude}`,
        `${spots[idx + 1].latitude},${spots[idx + 1].longitude}`,
        mode,
      );

      setRoutes((prev) => {
        const newRoutes = { ...prev };
        newRoutes[key] = newPath;

        return newRoutes;
      });
    }
  }

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
      res += item.need_time;
      if (index < spots.length - 1) {
        const key = combinePlaceId(index);
        if (routes[key])
          res += Math.round(routes[key].routes[0].legs[0].duration.value / 60);
      }
    });

    return res;
  }, [routes, spots]);

  const renderItem = (item: ISpotFull) => (
    <View>
      <Image
        style={{
          height: LAYOUT.window.height * 0.22,
          borderRadius: 10,
        }}
        source={{
          uri: item.images[0],
        }}
      />
    </View>
  );

  function updateElapse(idx: number, val: string) {
    const newSpots = [...spots];
    setSpots(
      newSpots.map((item, index) => {
        if (index === idx) {
          const newItem = { ...item };
          newItem.need_time = Number.parseInt(val, 10);

          return newItem;
        }

        return item;
      }),
    );
  }

  function formatHM(elapse: number) {
    if (elapse < 60) {
      return `${elapse}分`;
    }
    const hr = Math.floor(elapse / 60);
    const mn = elapse - hr * 60;

    return `${hr}時間${mn}分`;
  }

  return (
    <Container style={{ padding: 10 }}>
      <ScrollView>
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
            renderItem={({ item }: { item: ISpotFull }) => renderItem(item)}
            layout="stack"
            onSnapToItem={(sliderIndex) => setCurrentIndex(sliderIndex)}
          />
        </View>
        <View>
          <Text style={{ marginTop: 5, textAlign: 'center', fontSize: 12 }}>
            {currentIndex >= 0 && spots[currentIndex].spot_name}
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
              latitude: spots[0].latitude,
              longitude: spots[0].longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.05,
            }}
            style={{ height: '100%' }}
            region={routeMarkLocation?.region}
          >
            {spots.map((item, index) => {
              return (
                <Marker
                  description={item.spot_name}
                  coordinate={{
                    latitude: item.latitude,
                    longitude: item.longitude,
                  }}
                  pinColor={index === currentIndex ? '#00B4AB' : 'orange'}
                  key={item.place_id}
                >
                  <View>
                    <FontAwesome5
                      name="map-marker"
                      size={30}
                      color={COLOR.tintColor}
                    />
                    <View style={{ position: 'absolute', top: 5, left: 4 }}>
                      <Image
                        source={{ uri: item.icon_url }}
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
            keyExtractor={(item) => item.place_id}
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
                          ? spots[currentIndex].need_time.toString()
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
                      }}
                    >
                      {item.spot_name}
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
                      {item.need_time}分
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
            height: 80,
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
              <Text style={thisStyle.timeButtonTextStyle}>プラン所要時間</Text>
            </TouchableOpacity>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text style={thisStyle.timeTextEmptyStyle}>
                {moment(plan.date).format('YYYY年MM月DD日')}
              </Text>
              <Text style={thisStyle.timeTextStyle}>
                {`${moment(plan.date).format('H:mm')}~${moment(plan.date)
                  .add('minutes', totalTime)
                  .format('H:mm')}`}
              </Text>
              <Text style={thisStyle.timeTextStyle}>{formatHM(totalTime)}</Text>
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
              <Text style={thisStyle.timeButtonTextStyle}>当日予定時刻</Text>
            </TouchableOpacity>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text style={thisStyle.timeTextStyle}>
                {moment(plan.date).format('YYYY年MM月DD日')}
              </Text>
              <Text style={thisStyle.timeTextStyle}>
                {`${moment(plan.date).format('H:mm')}~${moment(plan.date)
                  .add('minute', plan.need_time)
                  .format('H:mm')}`}
              </Text>
              <Text style={thisStyle.timeTextStyle}>
                {formatHM(plan.need_time)}
              </Text>
            </View>
          </View>
          <TextInput
            placeholder="プラン名変更"
            style={{ paddingLeft: 20, fontSize: 15 }}
            value={plan.title}
          />
        </View>
        <View
          style={{ marginTop: 5, borderColor: 'grey', borderBottomWidth: 1 }}
        >
          <TextInput
            placeholder="ポイントを書く"
            style={{ paddingLeft: 20, fontSize: 12, height: 45 }}
            numberOfLines={3}
            multiline
            value={plan.description}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            padding: 10,
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
            title="保存"
            buttonStyle={thisStyle.footerButton}
            // onPress={onGotoHome}
          />
        </View>
      </ScrollView>
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
                    currentIndex >= 0
                      ? spots[currentIndex].need_time.toString()
                      : ''
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
    </Container>
  );
};

/** スタイリング */
const thisStyle = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    alignItems: 'center',
  },
  descriptionText: {
    color: COLOR.textTintColor,
    fontFamily: 'genju-light',
    fontSize: 10,
  },
  label: {
    marginLeft: 0,
    paddingTop: 15,
    paddingBottom: 15,
    ...appTextStyle.defaultText,
  },
  timeButtonStyle: {
    backgroundColor: 'orange',
    width: 90,
    borderRadius: 5,
  },
  timeButtonTextStyle: {
    color: 'white',
    fontFamily: 'genju-medium',
    fontWeight: 'bold',
    fontSize: 11,
    textAlign: 'center',
  },
  timeTextStyle: {
    marginLeft: 8,
    fontFamily: 'genju-medium',
    fontSize: 14,
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
  button1: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 5,
    padding: 15,
  },
  footerButton: {
    backgroundColor: COLOR.tintColor,
    width: LAYOUT.window.width * 0.35,
    borderRadius: 10,
    marginLeft: 30,
    marginRight: 30,
    fontSize: 10,
  },
});

export default EditDatePlanScreen;
