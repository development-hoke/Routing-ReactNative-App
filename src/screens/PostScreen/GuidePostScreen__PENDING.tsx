import React, { useCallback } from 'react';
// import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Container,
  Content,
  Text,
  Left,
  Body,
  // Switch,
  Right,
  Form,
  Label,
  Item,
  Input,
} from 'native-base';

// from app
// import { COLOR } from 'app/src/constants';
import { CompleteButton } from 'app/src/components/Button';
import { appTextStyle } from 'app/src/styles';

/** 案内中投稿画面 */
const GuidePostScreen__PENDING: React.FC = () => {
  /** ナビゲーター */
  const { navigate } = useNavigation();

  const onCompleteButtonPress = useCallback(() => {
    navigate('Post');
  }, []);

  return (
    <Container>
      <Content>
        {/* TODO 投稿する画像を表示できるようにする */}
        {/* TODO 投稿する場所をマップで表示する */}
        <Form>
          <Item fixedLabel>
            {/* TODO ここにスポットの名前が自動で挿入されるようにする */}
            <Label>スポット名を入力</Label>
            <Input />
          </Item>
          <Item fixedLabel last>
            <Label>ポイントを書く</Label>
            <Input />
          </Item>
        </Form>
        <Left>
          <Text style={appTextStyle.defaultText}>スポット滞在時間</Text>
        </Left>
        <Body>
          {/* TODO スポット滞在時間を表示、変更もできるようにする */}
          {/* <Text style={thisStyle.descriptionText}>
            {formatDate(plan.date, "YYYY年MM月DD日TT時MM分")}
          </Text> */}
        </Body>
        <Right>
          {/* TODO 非公開ボタンを挿入 */}
          {/* <Text>投稿を非公開にする</Text>
          <Switch onValueChange={handleSwitchPrivateValue} value={privateOn} />
          <Text>投稿を非公開にする</Text>
          <Switch onValueChange={handleSwitchPrivateValue} value={privateOn} /> */}
        </Right>
      </Content>
      <CompleteButton title="投稿" onPress={onCompleteButtonPress} />
      <CompleteButton title="出発" onPress={onCompleteButtonPress} />
    </Container>
  );
};

/** スタイリング */
// const thisStyle = StyleSheet.create({
//   descriptionText: {
//     color: COLOR.textTintColor,
//     fontFamily: 'genju-light',
//     fontSize: 10,
//   },
// });

export default GuidePostScreen__PENDING;
