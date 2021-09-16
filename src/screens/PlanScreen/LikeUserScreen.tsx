import React from 'react';
import { useRoute } from '@react-navigation/native';
import { Container, Text } from 'native-base';

// from app
import { LoadingSpinner } from 'app/src/components/Spinners';
import { LikeUserList } from 'app/src/components/List';
import { useGetLikeUserList } from 'app/src/hooks';
import { useGlobalState } from 'app/src/Store';
import { IPlanNavigationParam } from 'app/src/interfaces/app/Navigation';
import { appTextStyle } from 'app/src/styles';

/** デートプランお気に入り登録者一覧画面 */
const LikeUserScreen: React.FC = () => {
  const route = useRoute();
  const planNavigationParam = route.params as IPlanNavigationParam;
  const loginUser = useGlobalState('loginUser');
  /** デートプランお気に入り登録者一覧取得 */
  const { isLoading, users } = useGetLikeUserList(
    planNavigationParam.planId,
    loginUser.authorization,
  );

  if (isLoading) {
    return LoadingSpinner;
  }

  return (
    <Container>
      <Text style={appTextStyle.countText}>
        お気に入り登録者数: {users.total}
      </Text>
      <LikeUserList users={users.liked_user_list} />
    </Container>
  );
};

export default LikeUserScreen;
