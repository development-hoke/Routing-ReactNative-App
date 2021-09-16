import React from 'react';
import { Content, Form, Textarea, View, Item, Label, Text } from 'native-base';
import { StyleSheet, Keyboard } from 'react-native';
import { COLOR, LAYOUT } from 'app/src/constants';
import { appTextStyle } from 'app/src/styles';

interface Props {
  label: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  errors?: Array<string>;
}

/** ラベル付きテキストエリアフォーム */
export const InputLabelTextAreaForm: React.FC<Props> = (props: Props) => {
  const { label, value, setValue, errors } = props;

  // エラーメッセージ出力
  const ErrorList =
    errors &&
    errors.length > 0 &&
    errors.map((item) => (
      <View key={item} style={thisStyle.errorTextContainter}>
        <Text style={appTextStyle.errorText}>{item}</Text>
      </View>
    ));

  // 正常入力
  return (
    <Item inlineLabel onPress={() => Keyboard.dismiss()}>
      <Label style={thisStyle.labelText}>{label}</Label>
      <Content padder>
        <Form>
          <Textarea
            rowSpan={5}
            bordered
            underline
            placeholder="自己紹介"
            onChangeText={(value) => setValue(value)}
            value={value}
          />
          {ErrorList}
        </Form>
      </Content>
    </Item>
  );
};

/** スタイリング */
const thisStyle = StyleSheet.create({
  errorTextContainter: {
    alignItems: 'flex-start',
  },
  labelText: {
    color: COLOR.textTintColor,
    fontFamily: 'genju-medium',
    fontSize: 14,
    width: LAYOUT.window.width * 0.25,
  },
});
