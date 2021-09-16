import React from 'react';
import { useRoute } from '@react-navigation/native';
import { Container, Text } from 'native-base';

// from app
import { LoadingSpinner } from 'app/src/components/Spinners';
import { CommentList } from 'app/src/components/List';
import { useGetCommentList } from 'app/src/hooks';
import { IPlanNavigationParam } from 'app/src/interfaces/app/Navigation';
import { appTextStyle } from 'app/src/styles';

/** コメント一覧画面 */
const CommentScreen: React.FC = () => {
  const route = useRoute();
  const planNavigationParam = route.params as IPlanNavigationParam;

  /** コメント一覧取得 */
  const { isCommentsLoading, comments } = useGetCommentList(
    planNavigationParam.planId,
  );

  // ローディング
  if (isCommentsLoading) {
    return LoadingSpinner;
  }

  return (
    <Container>
      <Text style={appTextStyle.countText}>{comments.total} 件のコメント</Text>
      <CommentList commentList={comments.comment_list} />
    </Container>
  );
};

export default CommentScreen;
