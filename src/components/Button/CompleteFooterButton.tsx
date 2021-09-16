import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Footer, Text, Left, Right } from 'native-base';
import { ICandidateSpot } from 'app/src/interfaces/app/Spot';

// from app
import { LAYOUT, COLOR } from 'app/src/constants';
import { appTextStyle } from 'app/src/styles';
import moment from 'moment';

interface Props {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  spotCount: number;
  remainTime: string;
}

/** フッター完了ボタン */
export const CompleteFooterButton: React.FC<Props> = (props: Props) => {
  const { disabled, title, onPress, spotCount, remainTime } = props;

  return (
    <Footer style={thisStyle.touchable}>
      <Left
        style={{
          flexDirection: 'row',
          marginTop: 20,
        }}
      >
        <Text note style={{ marginLeft: 10 }}>
          スポット数 {spotCount}
        </Text>
        <Text note style={{ marginLeft: 10 }}>
          残り時間 {remainTime}
        </Text>
      </Left>
      <Right>
        <Button onPress={onPress} style={thisStyle.button}>
          <Text style={appTextStyle.whiteText}>{title}</Text>
        </Button>
      </Right>
    </Footer>
  );
};

/** デフォルト値 */
CompleteFooterButton.defaultProps = {
  disabled: false,
};

/** スタイリング */
const thisStyle = StyleSheet.create({
  touchable: {
    backgroundColor: COLOR.greyColor,
    height: 60,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  disTouchable: {
    backgroundColor: COLOR.greyColor,
    height: LAYOUT.window.height * 0.04,
  },
  button: {
    justifyContent: 'center',
    backgroundColor: COLOR.tintColor,
    width: LAYOUT.window.width * 0.3,
    height: 40,
  },
});
