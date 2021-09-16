import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Body, CardItem, Text, Left, Right, Thumbnail } from 'native-base';
// from app
import { useGlobalState } from 'app/src/Store';
import { LoadingSpinner } from 'app/src/components/Spinners';
import { UserProfile } from 'app/src/components/Content';
import { SettingFab } from 'app/src/components/Button';
import {
  useGetUserDetail,
  useGetPlanList,
  useUploadImage,
} from 'app/src/hooks';
import { Entypo } from '@expo/vector-icons';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
// from app
import { COLOR, LAYOUT } from 'app/src/constants';
import { CreateSpotFab } from 'app/src/components/Button/CreateSpotFab';
import { PlanCardList } from 'app/src/components/List';
/** マイプロフィール画面 */
const MyProfileScreen: React.FC = () => {
  /** ログイン中のユーザー */
  const loginUser = useGlobalState('loginUser');

  /** ユーザー詳細取得 */
  const { isUserLoading, user, getUserDetail } = useGetUserDetail(
    loginUser.id,
    loginUser.id,
    loginUser.authorization,
  );

  /** デートプラン取得 */
  const { plans, isPlanListLoading, isRefreshing, onRefresh } = useGetPlanList(
    loginUser.authorization,
    loginUser.id,
  );

  /** 画像選択アップロード */
  const { image, pickImage } = useUploadImage(loginUser.authorization);

  // ローディング
  if (isUserLoading || isPlanListLoading) {
    return LoadingSpinner;
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <UserProfile
          user={user}
          me
          image={image}
          pickImage={pickImage}
          reload={getUserDetail}
        />
        <PlanCardList
          planList={plans.plan_list}
          isRefreshing={isRefreshing}
          onRefresh={onRefresh}
        />
      </ScrollView>
      <SettingFab />
      <CreateSpotFab />
    </View>
  );
};
const thisStyle = StyleSheet.create({
  card: {
    borderRadius: 10,
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
  },
  image: {
    flex: 1,
    height: LAYOUT.window.height * 0.18,
  },
  map: {
    flex: 1,
    height: LAYOUT.window.height * 0.2,
  },
  description: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    borderBottomColor: COLOR.greyColor,
    borderBottomWidth: 1,
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
  },
  bodylike: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  likebutton: {
    padding: 5,
  },
  footer: {
    paddingLeft: 0,
  },
});

export default MyProfileScreen;
