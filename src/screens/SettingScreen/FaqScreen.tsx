import React, { useCallback } from 'react';
import { Container, Header, Content, Text } from 'native-base';
import FlashMessage, { showMessage } from 'react-native-flash-message';

// from app
import { useGlobalState } from 'app/src/Store';
import { LoadingSpinner } from 'app/src/components/Spinners';
import { FaqList } from 'app/src/components/List';
import { QuestionForm } from 'app/src/components/Form';
import { useGetFaqList, usePostQuestion } from 'app/src/hooks';
import { appTextStyle } from 'app/src/styles';

/** よくある質問画面 */
const FaqScreen: React.FC = () => {
  /** ログイン中のユーザー */
  const loginUser = useGlobalState('loginUser');

  /** よくある質問一覧取得 */
  const { isLoading, faqList } = useGetFaqList(loginUser.authorization);

  /** 質問投稿 */
  const { question, setQuestion, postQuestion, errors } = usePostQuestion(
    loginUser.id,
    loginUser.authorization,
  );

  /** 質問送信ボタン押下時の処理 */
  const onSendButtonPress = useCallback(async () => {
    const result = await postQuestion();
    if (result) {
      showMessage({
        message: '質問を投稿しました。',
        type: 'success',
      });
    }
  }, [question]);

  /** 投稿成功時メッセージ */
  const SuccessMessage = (
    <FlashMessage
      position="bottom"
      duration={2500}
      titleStyle={{ fontFamily: 'genju-medium', textAlign: 'center' }}
    />
  );

  // エラーメッセージ
  const questionErrors: Array<string> = [];
  if (errors && errors.detail_message.length > 0) {
    errors.detail_message.forEach((item) => {
      if (item.match(/Questionは/)) {
        questionErrors.push(item.replace('Questionは', ''));
      }
    });
  }

  /** ローディング */
  if (isLoading) {
    return LoadingSpinner;
  }

  return (
    <Container>
      <Header>
        <Text style={appTextStyle.standardText}>よくある質問</Text>
      </Header>
      <Content>
        <FaqList faqList={faqList} />
        <Header>
          <Text style={appTextStyle.standardText}>お問い合わせ</Text>
        </Header>
        <QuestionForm
          question={question}
          setQuestion={setQuestion}
          onSendButtonPress={onSendButtonPress}
          errors={questionErrors}
        />
      </Content>
      {SuccessMessage}
    </Container>
  );
};

export default FaqScreen;
