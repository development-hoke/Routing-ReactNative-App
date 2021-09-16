import React from 'react';
import { StyleSheet } from 'react-native';
import { Body, Left, ListItem, Text, Thumbnail } from 'native-base';

// from app
import { COLOR, IMAGE } from 'app/src/constants';
import { IComment } from 'app/src/interfaces/api/Comment';

interface Props {
  comment: IComment;
}

/** コメントリスト要素 */
export const CommentElement: React.FC<Props> = (props: Props) => {
  const { comment } = props;

  return (
    <ListItem avatar style={thisStyle.container}>
      <Left>
        <Thumbnail source={IMAGE.noUserImage} />
      </Left>
      <Body>
        <Text note style={thisStyle.nameText}>
          {comment.user_name}
        </Text>
        <Text style={thisStyle.commentText}>{comment.comment}</Text>
        <Text note style={thisStyle.dateText}>
          {comment.create_date.substr(0, 10)}
        </Text>
      </Body>
    </ListItem>
  );
};

/** スタイリング */
const thisStyle = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  nameText: {
    fontFamily: 'genju-medium',
    textDecorationColor: COLOR.inactiveColor,
    textDecorationLine: 'underline',
  },
  commentText: {
    fontFamily: 'genju-light',
    fontSize: 12,
  },
  dateText: {
    fontFamily: 'genju-light',
    fontSize: 10,
  },
});
