import React from 'react';
import { CardItem, Text, Body, Container } from 'native-base';
import { StyleSheet, View } from 'react-native';

// from app
import { COLOR, IMAGE, LAYOUT } from 'app/src/constants';
import { IComment } from 'app/src/interfaces/api/Comment';

interface Props {
  title: string;
}

/** コメントリスト要素 */
export const PlaceNameElement: React.FC<Props> = (props: Props) => {
  const { title } = props;

  return (
    <View style={thisStyle.cardNameWrapper}>
      <Text
        style={{
          ...thisStyle.nameTextShadow,
          textShadowOffset: {
            width: 1,
            height: 1,
          },
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          ...thisStyle.nameTextShadow,
          position: 'absolute',
          textShadowOffset: {
            width: -1,
            height: -1,
          },
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          ...thisStyle.nameTextShadow,
          position: 'absolute',
          textShadowOffset: {
            width: 1,
            height: -1,
          },
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          ...thisStyle.nameTextShadow,
          position: 'absolute',
          textShadowOffset: {
            width: -1,
            height: 1,
          },
        }}
      >
        {title}
      </Text>
    </View>
  );
};

/** スタイリング */
const thisStyle = StyleSheet.create({
  cardNameWrapper: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    width: LAYOUT.window.width * 0.65,
  },
  nameTextShadow: {
    color: 'white',
    fontSize: 22,
    textShadowColor: 'black',
    textShadowRadius: 1,
  },
});
