import React from 'react';
import { Input, Item, Label, Text, View } from 'native-base';

// from app
import { LAYOUT } from 'app/src/constants';
import { appTextStyle } from 'app/src/styles';

interface Props {
  label: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  errors?: Array<string>;
}

/** 入力中にラベルが浮く入力フォーム */
export const InputFormFloating: React.FC<Props> = (props: Props) => {
  const { label, value, setValue, errors } = props;

  // 未入力
  if (value === '') {
    return (
      <Item floatingLabel style={{ width: LAYOUT.window.width * 0.9 }}>
        <Label>{label}</Label>
        <Input onChangeText={(value) => setValue(value)} value={value} />
      </Item>
    );
  }

  // 異常入力
  if (errors && errors.length > 0) {
    const ErrorList = errors.map((item) => (
      <Text key={item} style={appTextStyle.errorText}>
        {item}
      </Text>
    ));

    return (
      <View>
        <Item floatingLabel error style={{ width: LAYOUT.window.width * 0.9 }}>
          <Label>{label}</Label>
          <Input onChangeText={(value) => setValue(value)} value={value} />
        </Item>
        {ErrorList}
      </View>
    );
  }

  // 正常入力
  return (
    <Item floatingLabel success style={{ width: LAYOUT.window.width * 0.9 }}>
      <Label>{label}</Label>
      <Input onChangeText={(value) => setValue(value)} value={value} />
    </Item>
  );
};
