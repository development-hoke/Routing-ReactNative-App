import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { View, Image, StyleSheet, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Body,
  Card,
  CardItem,
  Text,
  Button,
  Left,
  Right,
  Thumbnail,
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { FontAwesome5, Entypo } from '@expo/vector-icons';
import TimeAgo from 'react-native-timeago';
import { useActionSheet } from '@expo/react-native-action-sheet';
// from app
import { COLOR, LAYOUT } from 'app/src/constants';
import { IPlan, ISpot, IPlanFull } from 'app/src/interfaces/api/Plan';
import { ScrollView } from 'react-native-gesture-handler';
import {
  useGooglePlace,
  useLikePlan,
  useGetPlanDetail,
  useGetCommentList,
  useFavoritePlan,
} from 'app/src/hooks';
import { useDispatch, useGlobalState } from 'app/src/Store';
import { ActionType } from 'app/src/Reducer';
import { useCommentPlan } from 'app/src/hooks/useCommentPlan';
import { CompleteButton } from '../Button';

interface Props {
  plan: IPlan;
  showUsePlan?: boolean;
}
const moment = require('moment');
require('moment/locale/ja');

moment.locale('ja');
/** デートプランカード */
export const PlanCard: React.FC<Props> = (props: Props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { showActionSheetWithOptions } = useActionSheet();

  const { plan, showUsePlan } = props;
  const loginUser = useGlobalState('loginUser');
  const planDetail = useGetPlanDetail(
    plan.plan_id,
    loginUser.id,
    loginUser.authorization,
  );
  const { isCommentsLoading, comments, getCommentList } = useGetCommentList(
    plan.plan_id,
    loginUser.authorization,
  );

  const [selectedSpot, setSelectedSpot] = useState(0);
  const [detail, setDetail] = useState<IPlanFull>(planDetail.plan);

  const [comment, setComment] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>('');

  const [isCommented, setIsCommented] = useState<boolean>(false);

  const { API_KEY } = useGooglePlace();
  const { likePlan, unlikePlan } = useLikePlan(
    loginUser.id,
    loginUser.authorization,
  );
  const { favPlan, unfavPlan } = useFavoritePlan(
    loginUser.id,
    loginUser.authorization,
  );

  const { commentPlan } = useCommentPlan(
    loginUser.id,
    plan.plan_id,
    loginUser.authorization,
  );

  let origin: ISpot = { spot_name: '', latitude: 0, longitude: 0 };

  // /** プラン押下時の処理 */
  const onPlanPress = useCallback(() => {
    navigation.navigate('Detail', { planId: plan.plan_id });
  }, [plan]);

  /** コメント数押下時の処理 */
  const onCommentPress = useCallback(() => {
    navigation.navigate('Comment', { planId: plan.plan_id });
  }, [plan]);

  /** お気に入り数押下時の処理 */
  const onLikePress = useCallback(() => {
    navigation.navigate('Like', { planId: plan.plan_id });
  }, [plan]);

  /** ユーザー押下時の処理 */
  const onUserPress = useCallback(() => {
    navigation.navigate('Profile', { userId: plan.user_id });
  }, [plan]);

  useEffect(() => {
    planDetail.getPlanDetail();
  }, []);

  useEffect(() => {
    setDetail(planDetail.plan);
  }, [planDetail.plan]);

  useEffect(() => {
    comments.comment_list.forEach((c) => {
      if (c.user_id === loginUser.id) {
        setIsCommented(true);
      }
    });
  }, [comments]);

  const onLike = async () => {
    if (!planDetail.plan.is_liked) {
      await likePlan(plan.plan_id);
    } else {
      await unlikePlan(plan.plan_id);
    }
    planDetail.getPlanDetail();
  };

  const onFav = async () => {
    if (!planDetail.plan.is_fav) {
      await favPlan(plan.plan_id);
    } else {
      await unfavPlan(plan.plan_id);
    }
    planDetail.getPlanDetail();
  };

  const onComment = async () => {
    if (commentText !== '') {
      setComment(false);
      await commentPlan(commentText);
    }
    getCommentList();
  };

  const onGuide = () => {
    dispatch({
      type: ActionType.SET_MY_PLAN,
      payload: planDetail.plan,
    });
    dispatch({
      type: ActionType.SET_MY_PLAN_ARRIVAL,
      payload: -1,
    });
    dispatch({
      type: ActionType.SET_EXTRA_SPOT,
      payload: null,
    });
    navigation.navigate('Road');
  };

  const optionsMyPlan = [
    '削除',
    '編集',
    'リンクをコピー',
    '別アプリでシェア',
    'キャンセル',
  ];

  const optionsOtherPlan = [
    '通報',
    'リンクをコピー',
    '別アプリでシェア',
    '非表示',
    'キャンセル',
  ];

  const optionsFavPlan = [
    '通報',
    'リンクをコピー',
    '別アプリでシェア',
    'お気に入り解除',
    'キャンセル',
  ];

  function showPlanMenu() {
    let options = optionsOtherPlan;
    let destructiveButtonIndex = -1;
    if (plan.user_id === loginUser.id) {
      destructiveButtonIndex = 0;
      options = optionsMyPlan;
    } else if (planDetail.plan.is_liked) {
      options = optionsFavPlan;
    }
    showActionSheetWithOptions(
      {
        options,
        destructiveButtonIndex,
        cancelButtonIndex: 4,
      },
      (buttonIndex) => {
        // Do something here depending on the button index selected
        if (plan.user_id === loginUser.id) {
          if (buttonIndex === 0) {
            console.log('delete');
          } else if (buttonIndex === 1) {
            navigation.navigate('EditDatePlanNav', {
              screen: 'EditDatePlan',
              params: { plan: detail },
            });
          }
        }
      },
    );
  }

  const formatMinute = (time: number) =>
    `${Math.floor(time / 60)}時間${time % 60}分`;

  /** プラン作成者ヘッダー */
  const PlannerHeader = (
    <CardItem>
      <View style={thisStyle.planner}>
        <Thumbnail
          source={{ uri: 'https://www.w3schools.com/howto/img_avatar.png' }}
          small
        />
        <Body style={thisStyle.body}>
          <View>
            <Text
              style={(thisStyle.mainText, [{ fontSize: 16 }])}
              onPress={onUserPress}
            >
              {plan.user_name}&nbsp;&nbsp;
              {plan.status === 'public' && (
                <FontAwesome5
                  name="check-circle"
                  size={12}
                  color={COLOR.tintColor}
                />
              )}
            </Text>
            <Text note style={thisStyle.mainText}>
              {plan.user_attr}
            </Text>
          </View>
        </Body>
      </View>
      <View style={thisStyle.headRight}>
        <View style={{ marginRight: 10, paddingTop: 3 }}>
          <Text
            note
            style={{
              color: 'black',
              fontSize: 12,
              textAlign: 'left',
              fontWeight: 'bold',
            }}
          >
            所要時間
          </Text>
          <Text
            note
            style={{
              color: 'black',
              fontSize: 15,
              textAlign: 'left',
              fontWeight: 'bold',
            }}
          >
            {formatMinute(detail.need_time)}
          </Text>
        </View>
        <View>
          <Text onPress={() => showPlanMenu()}>
            <FontAwesome5 name="caret-down" size={36} color={COLOR.tintColor} />
          </Text>
        </View>
      </View>
    </CardItem>
  );
  // plan like
  const PlannerLike = (
    <CardItem>
      <Left />
      <Body />
      <Right>
        <Body style={thisStyle.bodylike}>
          <Button style={thisStyle.likebutton} transparent onPress={onLike}>
            {planDetail.plan.is_liked ? (
              <FontAwesome5 name="heart" size={24} color={COLOR.tintColor} />
            ) : (
              <FontAwesome5 name="heart" size={24} color={COLOR.greyColor} />
            )}
          </Button>
          <Button style={thisStyle.likebutton} transparent onPress={onFav}>
            {planDetail.plan.is_fav ? (
              <FontAwesome5 name="star" size={24} color={COLOR.tintColor} />
            ) : (
              <FontAwesome5 name="star" size={24} color={COLOR.greyColor} />
            )}
          </Button>
          <Button
            style={thisStyle.likebutton}
            transparent
            onPress={() => {
              setComment(true);
              setCommentText('');
            }}
          >
            {isCommented ? (
              <FontAwesome5 name="comment" size={24} color={COLOR.tintColor} />
            ) : (
              <FontAwesome5 name="comment" size={24} color={COLOR.greyColor} />
            )}
          </Button>
        </Body>
      </Right>
    </CardItem>
  );

  const commentRows = useMemo(() => {
    const elements = [];

    for (let i = 0; i < comments.total / 2; i += 2) {
      elements.push(
        <Row>
          <Col onPress={onCommentPress}>
            <CardItem style={thisStyle.footer}>
              <View style={{ marginRight: 10 }}>
                <Thumbnail
                  source={{
                    uri: 'https://www.w3schools.com/howto/img_avatar.png',
                  }}
                  small
                />
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  width: LAYOUT.window.width * 0.2,
                }}
              >
                <Text style={thisStyle.footerText}>
                  {comments.comment_list[i].user_name}
                </Text>
                <Text note style={thisStyle.footerText}>
                  {comments.comment_list[i].comment.length > 15
                    ? `${comments.comment_list[i].comment.substr(0, 12)}...`
                    : comments.comment_list[i].comment}
                </Text>
              </View>
              <View>
                <Text note style={thisStyle.footerText}>
                  <TimeAgo
                    time={comments.comment_list[i].create_date}
                    hideAgo
                  />
                </Text>
              </View>
            </CardItem>
          </Col>
          {i < comments.total - 1 ? (
            <Col onPress={onCommentPress}>
              <CardItem style={thisStyle.footer}>
                <View style={{ marginRight: 10 }}>
                  <Thumbnail
                    source={{
                      uri: 'https://www.w3schools.com/howto/img_avatar.png',
                    }}
                    small
                  />
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    width: LAYOUT.window.width * 0.2,
                  }}
                >
                  <Text style={thisStyle.footerText}>
                    {comments.comment_list[i + 1].user_name}
                  </Text>
                  <Text note style={thisStyle.footerText}>
                    {comments.comment_list[i + 1].comment.length > 15
                      ? `${comments.comment_list[i + 1].comment.substr(
                          0,
                          12,
                        )}...`
                      : comments.comment_list[i + 1].comment}
                  </Text>
                </View>
                <View>
                  <Text note style={thisStyle.footerText}>
                    <TimeAgo
                      time={comments.comment_list[i + 1].create_date}
                      hideAgo
                    />
                  </Text>
                </View>
              </CardItem>
            </Col>
          ) : (
            <Col />
          )}
        </Row>,
      );
    }

    return elements;
  }, [comments]);
  const PlannerFooter = <Grid>{commentRows}</Grid>;
  const renderMarker = (place: any, color: string) => (
    <Marker
      coordinate={{
        latitude: place.latitude,
        longitude: place.longitude,
      }}
      pinColor={color}
      key={place.id}
    >
      <View>
        <FontAwesome5 name="map-marker" size={30} color={COLOR.tintColor} />
        {place.icon_url !== '' && (
          <View style={{ position: 'absolute', top: 5, left: 4 }}>
            <Image
              source={{ uri: place.icon_url }}
              style={{ width: 15, height: 15 }}
            />
          </View>
        )}
      </View>
    </Marker>
  );
  const renderDirection = (place: ISpot, index: number) => {
    if (index === 0) {
      origin = place;

      return null;
    }
    const temp_origin = origin;
    origin = place;

    return (
      <MapViewDirections
        origin={{
          latitude: temp_origin.latitude,
          longitude: temp_origin.longitude,
        }}
        destination={{
          latitude: place.latitude,
          longitude: place.longitude,
        }}
        apikey={`${API_KEY}`}
        strokeWidth={3}
        strokeColor={index <= selectedSpot ? 'orange' : 'grey'}
      />
    );
  };

  return (
    <Card style={thisStyle.card}>
      {PlannerHeader}
      <CardItem cardBody>
        <Image
          source={{
            uri:
              detail.spots[selectedSpot] &&
              detail.spots[selectedSpot].images[0],
          }}
          style={thisStyle.image}
        />
      </CardItem>
      <CardItem cardBody>
        {plan.spots.length > 0 && (
          <MapView
            region={{
              latitude: plan.spots[selectedSpot].latitude,
              longitude: plan.spots[selectedSpot].longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            style={thisStyle.map}
          >
            {detail.spots.map((place, index) => renderDirection(place, index))}
            {detail.spots.map((place, index) =>
              renderMarker(place, index <= selectedSpot ? 'orange' : 'grey'),
            )}
          </MapView>
        )}
      </CardItem>
      <CardItem style={thisStyle.description}>
        <View style={{ flex: 1 }}>
          <Text style={thisStyle.mainText}>{plan.title}</Text>
        </View>
        <View style={{ flex: 2 }}>
          <ScrollView horizontal>
            {plan.spots.map((spot, index) => (
              <View style={thisStyle.spotContainer}>
                <Text
                  style={{
                    ...thisStyle.buttonTitleStyle,
                    color: index === selectedSpot ? 'orange' : 'black',
                  }}
                  onPress={() => setSelectedSpot(index)}
                >
                  {spot.spot_name}
                </Text>
                {index < plan.spots.length - 1 && (
                  <Text style={thisStyle.arrowText}>→</Text>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      </CardItem>
      {PlannerLike}
      {PlannerFooter}
      <View
        style={{
          alignItems: 'center',
          padding: 15,
        }}
      >
        <CompleteButton title="プランを使用する" onPress={onGuide} />
      </View>
      <Modal animationType="slide" transparent visible={comment}>
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
              width: LAYOUT.window.width * 0.8,
              height: 200,
              backgroundColor: COLOR.backgroundColor,
              padding: 10,
              borderRadius: 10,
              shadowOffset: {
                width: 1,
                height: 1,
              },
              shadowColor: 'lightgrey',
              shadowOpacity: 1,
            }}
          >
            <View
              style={{
                marginTop: 10,
                marginBottom: 10,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'baseline',
              }}
            >
              <TextInput
                placeholder="コメント"
                style={{
                  fontSize: 20,
                  width: '100%',
                  height: 110,
                  borderColor: 'lightgrey',
                  borderWidth: 1,
                }}
                defaultValue={commentText}
                multiline
                onChangeText={(text) => setCommentText(text)}
              />
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <Button
                warning
                style={{ marginRight: 10 }}
                onPress={() => onComment()}
              >
                <Text>OK</Text>
              </Button>
              <Button danger onPress={() => setComment(false)}>
                <Text>Cancel</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </Card>
  );
};

/** スタイリング */
const thisStyle = StyleSheet.create({
  card: {
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    shadowColor: '#ccc',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  planner: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
  headRight: {
    zIndex: 100,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  image: {
    flex: 1,
    height: 180,
  },
  map: {
    flex: 1,
    height: 200,
  },
  description: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    borderBottomColor: COLOR.greyColor,
    borderBottomWidth: 1,
    // height: LAYOUT.window.height * 0.03
  },
  linkButtonGroup: {
    // backgroundColor: COLOR.baseBackgroundColor,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    height: 0,
    marginBottom: 10,
  },
  linkButton: {
    flex: 1,
    justifyContent: 'center',
  },
  mainText: {
    fontFamily: 'genju-medium',
    fontSize: 14,
  },
  footerText: {
    fontFamily: 'genju-medium',
    fontSize: 10,
  },
  descriptionText: {
    fontFamily: 'genju-light',
    fontSize: 12,
  },
  linkButtonText: {
    color: COLOR.tintColor,
    fontSize: 15,
  },
  body: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginLeft: 10,
  },
  bodylike: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  likebutton: {
    padding: 5,
  },
  footer: {
    paddingLeft: 10,
  },
  buttonTitleStyle: {
    maxWidth: LAYOUT.window.width * 0.3,
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
});
PlanCard.defaultProps = {
  showUsePlan: false,
};

export default PlanCard;
