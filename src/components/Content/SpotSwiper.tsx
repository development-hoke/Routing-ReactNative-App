import React, { useCallback, useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Image, StyleSheet, Alert } from 'react-native';
import {
  DeckSwiper,
  Card,
  CardItem,
  Content,
  Text,
  Left,
  Body,
  Right,
  Button,
  Footer,
} from 'native-base';
import {
  FontAwesome,
  FontAwesome5,
  Entypo,
  Ionicons,
} from '@expo/vector-icons';
// from app
import { IMAGE } from 'app/src/constants';
import { ICandidateSpot } from 'app/src/interfaces/app/Spot';
import { LAYOUT, COLOR } from 'app/src/constants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useGooglePlace } from 'app/src/hooks';
import { ActionType } from 'app/src/Reducer';
import { useDispatch, useGlobalState } from 'app/src/Store';

interface Props {
  spots: Array;
}
/** デートスポットスワイパー */
export const SpotSwiper: React.FC<Props> = (props: Props) => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch();

  const {
    searchNearbyPlace,
    getPlacePhoto,
    getPlaceDetail,
    getPlaceOpeningHours,
    places,
    setPlaces,
    API_KEY,
  } = useGooglePlace();

  const onCompleteButtonPress = () => {
    let total = [];
    realSpots.filter((item) => total.push(item));
    if (
      total.filter((item) => item.heart == true).length +
        total.filter((item) => item.like == true).length >
      20
    ) {
      alert('Too Much');
      return;
    } else {
      dispatch({
        type: ActionType.SET_CREATE_REAL_SPOTS,
        payload: {
          total,
        },
      });
      navigate('Select');
    }
  };

  const { spots } = props;

  const [deletedSpots, setDeletedSpots] = useState<ICandidateSpot>([]);
  const [realSpots, setRealSpots] = useState<ICandidateSpot>(spots);
  const [openinghour, setOpeninghour] = useState('');

  useEffect(() => {
    console.log(spots, 1111111111111111111);
    for (let i = 0; i < realSpots.length; i++) {
      getOpenHours(realSpots[i].id).then((data) => {
        setRealSpots((prev) => {
          let arr = prev;
          arr.filter(
            (item) => item.id == realSpots[i].id,
          )[0].openinghour = data;
          return arr;
        });
      });
    }
  }, [realSpots]);

  const formatOpHour = (value: string) =>
    `${value.slice(0, 2)}:${value.slice(2, 4)}`;
  async function getOpenHours(id) {
    const openHours = await getPlaceOpeningHours(id);
    return formatPlaceOpeningHours(openHours);
  }
  function formatPlaceOpeningHours(opHour) {
    if (opHour.periods) {
      const dayHour = opHour.periods[0];
      if (dayHour && dayHour.close) {
        return `${formatOpHour(dayHour.open.time)}-${formatOpHour(
          dayHour.close.time,
        )}`;
      }
      return '24時間営業';
    }

    return '';
  }

  const setSpotRestore = () => {
    // if (deletedSpots.length) {
    //   let resoteId = deletedSpots[0].id;
    //   if (selectedSpot) {
    //     setRealSpots((prev) => [...prev, selectedSpot]);
    //   }
    //   setSelectedSpot(deletedSpots[0]);
    //   setDeletedSpots((prev) => prev.filter((item) => item.id !== resoteId));
    // }
  };
  const setSpotDelete = () => {
    // setDeletedSpots((prev) => [...prev, selectedSpot]);
    // if (realSpots.length) {
    //   let deleteId = realSpots[0].id;
    //   setRealSpots((prev) =>
    //     prev.filter((item) => item.id !== deleteId),
    //   );
    //   setSelectedSpot(realSpots[0]);
    // }
    // else {
    //   setSelectedSpot({});
    // }
  };
  const setSpotSelect = () => {
    // setSelectedSpot((prev) => {
    //   return {
    //     ...prev,
    //     heart: true,
    //     like: false
    //   };
    // });
  };
  const setSpotLike = () => {
    // setSelectedSpot((prev) => {
    //   return {
    //     ...prev,
    //     heart: false,
    //     like: true
    //   };
    // });
  };

  const PlannerLike = (
    <Body style={thisStyle.bodylike}>
      <Button style={thisStyle.likebutton} transparent>
        <FontAwesome5 name="heart" size={24} color={COLOR.greyColor} />
      </Button>
      <Button style={thisStyle.likebutton} transparent>
        <Entypo name="star-outlined" size={24} color={COLOR.greyColor} />
      </Button>
      <Button style={thisStyle.likebutton} transparent>
        <FontAwesome name="comment-o" size={24} color={COLOR.greyColor} />
      </Button>
    </Body>
  );
  return (
    <Content style={thisStyle.swiper}>
      <View>
        <DeckSwiper
          dataSource={realSpots}
          renderItem={(item: any) => (
            <View
              style={{
                padding: 10,
                borderColor: COLOR.textTintColor,
                borderWidth: 1,
                borderRadius: 5,
                height: LAYOUT.window.height * 0.7,
              }}
            >
              <Image
                style={{ height: LAYOUT.window.height * 0.4 }}
                source={{ uri: item.imageUrl }}
              />
              <View
                style={{
                  height: LAYOUT.window.height * 0.1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  padding: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: 'column',
                    width: LAYOUT.window.width * 0.7,
                  }}
                >
                  <Text note style={thisStyle.centerText}>
                    {item.spotName}
                  </Text>
                  <Text note style={thisStyle.centerText}>
                    {item.address}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'column',
                    width: LAYOUT.window.width * 0.3,
                    paddingRight: 50,
                  }}
                >
                  <View style={{ height: LAYOUT.window.height * 0.04 }}>
                    {PlannerLike}
                  </View>
                  <Text note style={thisStyle.footerText}>
                    {item.rating}
                  </Text>
                </View>
              </View>
              <View style={thisStyle.footer}>
                <TouchableOpacity
                  style={thisStyle.footerIcon1}
                  onPress={() => setSpotRestore()}
                >
                  <Ionicons
                    name="md-refresh"
                    size={30}
                    color={COLOR.tintColor}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={thisStyle.footerIcon2}
                  onPress={() => setSpotDelete()}
                >
                  <Ionicons
                    name="ios-close"
                    size={50}
                    color={COLOR.tintColor}
                  />
                </TouchableOpacity>
                {item.heart ? (
                  <TouchableOpacity
                    style={[thisStyle.footerIcon2, thisStyle.footerIconActive]}
                    onPress={() => setSpotSelect()}
                  >
                    <FontAwesome5
                      name="heart"
                      size={40}
                      color={COLOR.greyColor}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={thisStyle.footerIcon2}
                    onPress={() => setSpotSelect()}
                  >
                    <FontAwesome5
                      name="heart"
                      size={40}
                      color={COLOR.tintColor}
                    />
                  </TouchableOpacity>
                )}
                {item.like ? (
                  <TouchableOpacity
                    style={[thisStyle.footerIcon1, thisStyle.footerIconActive]}
                    onPress={() => setSpotLike()}
                  >
                    <FontAwesome5
                      name="star"
                      size={30}
                      color={COLOR.greyColor}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={thisStyle.footerIcon1}
                    onPress={() => setSpotLike()}
                  >
                    <FontAwesome5
                      name="star"
                      size={30}
                      color={COLOR.tintColor}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        ></DeckSwiper>
      </View>
      <Footer style={thisStyle.touchable}>
        <Button style={thisStyle.button} onPress={onCompleteButtonPress}>
          <Text>次へ</Text>
        </Button>
      </Footer>
    </Content>
  );
};

/** スタイリング */
const thisStyle = StyleSheet.create({
  swiper: {
    marginTop: 10,
    padding: 20,
  },
  centerText: {
    fontFamily: 'genju-medium',
    fontSize: 14,
  },
  bodylike: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  likebutton: {
    padding: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: LAYOUT.window.height * 0.01,
    marginBottom: LAYOUT.window.height * 0.01,
    height: LAYOUT.window.height * 0.1,
  },
  footerText: {
    textAlign: 'center',
  },
  footerIcon1: {
    backgroundColor: COLOR.greyColor,
    width: LAYOUT.window.width * 0.1,
    height: LAYOUT.window.width * 0.1,
    padding: 10,
    borderRadius: LAYOUT.window.width * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: LAYOUT.window.width * 0.05,
    marginRight: LAYOUT.window.width * 0.05,
  },
  footerIcon2: {
    backgroundColor: COLOR.greyColor,
    width: LAYOUT.window.width * 0.13,
    height: LAYOUT.window.width * 0.13,
    padding: 10,
    borderRadius: LAYOUT.window.width * 0.13,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: LAYOUT.window.width * 0.05,
    marginRight: LAYOUT.window.width * 0.05,
  },
  footerIconActive: {
    backgroundColor: COLOR.tintColor,
  },
  touchable: {
    backgroundColor: COLOR.backgroundColor,
    height: LAYOUT.window.height * 0.05,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    justifyContent: 'center',
    backgroundColor: COLOR.tintColor,
    width: LAYOUT.window.width * 0.3,
    borderRadius: 10,
    marginBottom: 5,
  },
});
