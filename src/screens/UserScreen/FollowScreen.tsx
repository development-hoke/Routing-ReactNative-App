import React from 'react';
import { Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Container } from 'native-base';

// from app
import { useGlobalState } from 'app/src/Store';
import { LoadingSpinner } from 'app/src/components/Spinners';
import { FollowList } from 'app/src/components/List';
import { useGetFollowList, useFollowUser } from 'app/src/hooks';
import { IUserNavigationParam } from 'app/src/interfaces/app/Navigation';
import { appTextStyle } from 'app/src/styles';

/** フォローリスト一覧画面 */
const FollowScreen: React.FC = () => {
  const route = useRoute();
  const planNavigationParam = route.params as IUserNavigationParam;

  /** ログイン中のユーザー */
  const loginUser = useGlobalState('loginUser');

  /** フォローリスト取得 */
  const { isLoading, follows, getFollowList } = useGetFollowList(
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
      <Text style={appTextStyle.countText}>フォロー数: {follows.total}</Text>
      <FollowList
        meId={loginUser.id}
        follows={follows.follow_list}
        onFollow={follow}
        onUnfollow={unfollow}
        reload={getFollowList}
      />
    </Container>
  );
};

export default FollowScreen;
