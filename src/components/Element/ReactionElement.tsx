import React from 'react';
import { CardItem, Text, Body, Container } from 'native-base';
import { StyleSheet, View } from 'react-native';

// from app
import { COLOR, IMAGE, LAYOUT } from 'app/src/constants';
import { IComment } from 'app/src/interfaces/api/Comment';
import { FontAwesome5 } from '@expo/vector-icons';

interface Props {
  user_ratings_total: string;
  title?: string;
}

/** コメントリスト要素 */
export const ReactionElement: React.FC<Props> = (props: Props) => {
  const { user_ratings_total, title } = props;

  return (
    <View style={thisStyle.cardInfoWrapper}>
      <Text style={{ paddingTop: 10 }}>{title}</Text>
      <View
        style={{
          height: LAYOUT.window.height * 0.07,
        }}
      >
        <Body style={thisStyle.bodylike}>
          <View>
            <FontAwesome5
              name="heart"
              size={24}
              color={COLOR.greyColor}
              style={{ marginRight: 3 }}
            />
            <Text note style={thisStyle.scoreText}>
              &nbsp;
            </Text>
          </View>
          <View>
            <FontAwesome5
              name="star"
              size={24}
              color={COLOR.greyColor}
              style={{ marginRight: 3 }}
            />
            <Text note style={thisStyle.scoreText}>
              &nbsp;
            </Text>
          </View>
          <View>
            <FontAwesome5
              name="comment"
              size={24}
              color={COLOR.greyColor}
              style={{ marginRight: 3 }}
            />
            <Text note style={thisStyle.scoreText}>
              {user_ratings_total}
            </Text>
          </View>
        </Body>
      </View>
    </View>
  );
};

/** スタイリング */
const thisStyle = StyleSheet.create({
  cardInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  bodylike: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  scoreText: {
    color: COLOR.tintColor,
  },
});
