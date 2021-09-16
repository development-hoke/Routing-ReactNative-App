import React from 'react';
import { Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Container } from 'native-base';

// from app
import { useGlobalState } from 'app/src/Store';
import { LoadingSpinner } from 'app/src/components/Spinners';
import { FollowList } from 'app/src/components/List';
import { useGetFollowerList, useFollowUser } from 'app/src/hooks';
import { IUserNavigationParam } from 'app/src/interfaces/app/Navigation';
import { appTextStyle } from 'app/src/styles';

/** フォロワーリスト一覧画面 */
const FollowScreen: React.FC = () => {
  const route = useRoute();
  const planNavigationParam = route.params as IUserNavigationParam;

  /** ログイン中のユーザー */
  const loginUser = useGlobalState('loginUser');

  /** フォロワーリスト取得 */
  const { isLoading, followers, getFollowerList } = useGetFollowerList(
    planNavigationParam.userId,
    loginUser.authorization,
  );

  /** フォロー・フォロー解除 */
  const { follow, unfollow } = useFollowUser(
    loginUser.id,
    loginUser.authorization,
  );

  /** ローディング */
  if (isLoading) {
    return LoadingSpinner;
  }

  return (
    <Container>
      <Text style={appTextStyle.countText}>
        フォロワー数: {followers.total}
      </Text>
      <FollowList
        meId={loginUser.id}
        followers={followers.follower_list}
        onFollow={follow}
        onUnfollow={unfollow}
        reload={getFollowerList}
      />
    </Container>
  );
};

export default FollowScreen;
