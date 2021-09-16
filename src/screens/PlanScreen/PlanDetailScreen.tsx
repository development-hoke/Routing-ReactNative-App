import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Container, Content, Text } from 'native-base';

// from app
import { useGlobalState } from 'app/src/Store';
import { COLOR } from 'app/src/constants';
import { LoadingSpinner } from 'app/src/components/Spinners';
import { ImageCarousel, UserHeader } from 'app/src/components/Content';
import { CommentGrid } from 'app/src/components/List';
import { SimpleMapView } from 'app/src/components/MapItem';
import { LikeButton, EditPlanFab } from 'app/src/components/Button';
import {
  useGetPlanDetail,
  useGetCommentList,
  useLikePlan,
  useFollowUser,
  useGooglePlace,
} from 'app/src/hooks';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { IPlanNavigationParam } from 'app/src/interfaces/app/Navigation';
import { formatDate } from 'app/src/utils';
import { appStyle, appTextStyle } from 'app/src/styles';

/** デートプラン詳細画面 */
const PlanDetailScreen: React.FC = () => {
  const route = useRoute();
  const { API_KEY } = useGooglePlace();
  let origin = {};

  const planNavigationParam = route.params as IPlanNavigationParam;

  /** ログイン中のユーザー */
  const loginUser = useGlobalState('loginUser');

  /** ナビゲーター */
  const { navigate } = useNavigation();

  if (route) {
    console.log(route, planNavigationParam, '-----------------------------');
  }

  /** デートプラン詳細取得 */
  const { isPlanLoading, plan, getPlanDetail } = useGetPlanDetail(
    planNavigationParam.planId,
    loginUser.id,
    loginUser.authorization,
  );

  /** コメント一覧取得 */
  const { isCommentsLoading, comments } = useGetCommentList(
    planNavigationParam.planId,
    loginUser.authorization,
  );

  /** お気に入り登録・解除 */
  const { likePlan, unlikePlan } = useLikePlan(
    loginUser.id,
    loginUser.authorization,
  );

  /** フォロー・フォロー解除 */
  const { follow, unfollow } = useFollowUser(
    loginUser.id,
    loginUser.authorization,
  );

  /** コメントもっと見る押下時の処理 */
  const onMoreCommentPress = useCallback(() => {
    navigate('Comment', { planId: plan.plan_id });
  }, [plan]);

  // ローディング
  if (isPlanLoading || isCommentsLoading) {
    return LoadingSpinner;
  }

  /** デートプラン作成者部分の描画 */
  const PlannerHeader: JSX.Element = (
    <UserHeader
      user={{
        userId: plan.user_id,
        userName: plan.user_name,
        userAttr: plan.user_attr,
        userImageUrl: plan.user_image_url,
        isFollow: plan.is_follow,
      }}
      onFollow={follow}
      onUnfollow={unfollow}
      reload={getPlanDetail}
    />
  );

  /** デートプラン説明部分 */
  const PlanDescription: JSX.Element = (
    <View style={thisStyle.planDescriptionContainer}>
      <View style={thisStyle.route}>
        <Text note style={thisStyle.descriptionText}>
          {plan.spots.map((spot) => spot.spot_name).join(' > ')}
        </Text>
      </View>
      <View style={appStyle.row}>
        <View style={thisStyle.title}>
          <Text style={thisStyle.titleText}>{plan.title}</Text>
        </View>
        {/* お気に入り登録解除ボタン(自分のプランの場合は押せない) */}
        {loginUser.id === plan.user_id ? (
          <LikeButton
            targetPlanId={plan.plan_id}
            likeCount={plan.like_count}
            liked={plan.is_liked}
          />
        ) : (
          <LikeButton
            targetPlanId={plan.plan_id}
            likeCount={plan.like_count}
            liked={plan.is_liked}
            onLike={likePlan}
            onUnlike={unlikePlan}
            reload={getPlanDetail}
          />
        )}
      </View>
      <View style={thisStyle.detail}>
        <View style={appStyle.row}>
          <View style={thisStyle.columnTitle}>
            <Text style={thisStyle.columnTitleText}>ポイント</Text>
          </View>
          <View style={thisStyle.description}>
            <Text style={thisStyle.descriptionText}>{plan.description}</Text>
          </View>
        </View>
        <View style={appStyle.row}>
          <View style={thisStyle.columnTitle}>
            <Text style={thisStyle.columnTitleText}>デート予定日</Text>
          </View>
          <View style={thisStyle.description}>
            <Text style={thisStyle.descriptionText}>
              {formatDate(plan.date, 'YYYY年MM月DD日')}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
  const renderMarker = (place: any, color: string) => (
    <Marker
      coordinate={{
        latitude: place.latitude,
        longitude: place.longitude,
      }}
      pinColor={color}
      key={place.id}
    />
  );

  const renderDirection = (place: any, index: any) => {
    if (index == 0) {
      origin = place;
    } else {
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
          strokeColor="orange"
        />
      );
    }
  };

  return (
    <Container>
      <Content>
        {loginUser.id !== plan.user_id ? (
          PlannerHeader
        ) : (
          <View style={thisStyle.myPlanHeader}>
            <Text style={appTextStyle.standardText}>マイプラン</Text>
          </View>
        )}
        <ImageCarousel plan={plan} />
        {/* <SimpleMapView spot={plan.spots[0]} /> */}
        <MapView
          region={{
            latitude: plan.spots[0].latitude,
            longitude: plan.spots[0].longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.05,
          }}
          style={thisStyle.map}
        >
          {plan.spots.map((place: any, index: any) =>
            renderDirection(place, index),
          )}
          {plan.spots.map((place: any) => renderMarker(place, 'orange'))}
        </MapView>
        {PlanDescription}
        <CommentGrid comments={comments.comment_list} />
        {comments.total > 0 && (
          <View style={{ alignItems: 'flex-end', marginRight: 10 }}>
            <Text
              onPress={onMoreCommentPress}
              style={appTextStyle.detailLinkText}
            >
              &gt;&gt; 全{comments.total}件のコメントを見る
            </Text>
          </View>
        )}
      </Content>
      <EditPlanFab plan={plan} />
    </Container>
  );
};

/** スタイリング */
const thisStyle = StyleSheet.create({
  planDescriptionContainer: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
  route: {
    alignItems: 'flex-end',
    backgroundColor: COLOR.baseBackgroundColor,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  title: {
    marginLeft: 10,
  },
  detail: {
    marginLeft: 10,
  },
  titleText: {
    fontFamily: 'genju-medium',
    textDecorationColor: COLOR.tintColor,
    textDecorationLine: 'underline',
  },
  columnTitle: {
    backgroundColor: COLOR.tintColor,
    borderRadius: 10,
    marginRight: 5,
    marginTop: 2,
    paddingHorizontal: 5,
  },
  columnTitleText: {
    color: 'white',
    fontFamily: 'genju-medium',
    fontSize: 10,
  },
  description: {
    marginTop: 2,
  },
  descriptionText: {
    color: COLOR.textTintColor,
    fontFamily: 'genju-light',
    fontSize: 10,
  },
  myPlanHeader: {
    alignItems: 'center',
    backgroundColor: COLOR.baseBackgroundColor,
  },
  map: {
    flex: 1,
    height: 200,
  },
});

export default PlanDetailScreen;
