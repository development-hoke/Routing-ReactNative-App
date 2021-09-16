import React, { useMemo } from 'react';
import { Content, Form, Text, Textarea, View } from 'native-base';
import { StyleSheet } from 'react-native';

// from app
import { CompleteButton } from 'app/src/components/Button';
import { appTextStyle } from 'app/src/styles';

interface Props {
  question: string;
  setQuestion: React.Dispatch<React.SetStateAction<string>>;
  onSendButtonPress: () => Promise<void>;
  errors?: Array<string>;
}

/** お問い合わせフォーム */
export const QuestionForm: React.FC<Props> = (props: Props) => {
  const { question, setQuestion, onSendButtonPress, errors } = props;

  /** エラーメッセージ */
  const ErrorList = useMemo(
    () =>
      errors && errors.length > 0
        ? errors.map((item) => (
            <Text key={item} style={appTextStyle.errorText}>
              {item}
            </Text>
          ))
        : [],
    [errors],
  );

  // 正常入力
  return (
    <Content padder>
      <Form>
        <Textarea
          rowSpan={5}
          bordered
          underline
          placeholder="質問を入力してください。"
          onChangeText={(value) => setQuestion(value)}
          value={question}
        />
      </Form>
      {ErrorList.length > 0 && ErrorList}
      <View style={thisStyle.item}>
        <CompleteButton title="送信" onPress={onSendButtonPress} />
      </View>
    </Content>
  );
};

/** スタイリング */
const thisStyle = StyleSheet.create({
  item: {
    alignItems: 'center',
    marginTop: 20,
  },
});
