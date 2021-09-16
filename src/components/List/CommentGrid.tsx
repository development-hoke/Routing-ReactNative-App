import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Thumbnail, Text } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

// from app
import { IMAGE } from 'app/src/constants';
import { IComment } from 'app/src/interfaces/api/Comment';
import { isNotNullOrUndefined } from 'app/src/utils';

interface Props {
  comments: Array<IComment>;
}

/** コメントグリッド表示 */
export const CommentGrid: React.FC<Props> = (props: Props) => {
  const { comments } = props;

  // 1つのコメントを描画する
  const renderComment = (comment: IComment): JSX.Element | undefined => {
    if (isNotNullOrUndefined(comment)) {
      return (
        <Row style={thisStyle.item}>
          <View style={thisStyle.thumbnail}>
            <Thumbnail small source={IMAGE.noUserImage} />
          </View>
          <View style={thisStyle.comment}>
            <Text note style={thisStyle.nameText}>
              {comment.user_name}
            </Text>
            <Text style={thisStyle.commentText}>{comment.comment}</Text>
            <Text note style={thisStyle.dateText}>
              {comment.create_date.substr(0, 10)}
            </Text>
          </View>
        </Row>
      );
    }
  };

  return (
    <Grid style={thisStyle.container}>
      <Col>
        {renderComment(comments[0])}
        {renderComment(comments[2])}
      </Col>
      <Col>
        {renderComment(comments[1])}
        {renderComment(comments[3])}
      </Col>
    </Grid>
  );
};

/** スタイリング */
const thisStyle = StyleSheet.create({
  container: {
    margin: 5,
  },
  item: {
    // borderBottomWidth: 1,
    borderColor: '#eee',
    borderTopWidth: 1,
    flexDirection: 'row',
    margin: 5,
  },
  thumbnail: {
    padding: 5,
  },
  comment: {
    padding: 5,
  },
  nameText: {
    fontFamily: 'genju-light',
    fontSize: 8,
    textDecorationLine: 'underline',
  },
  commentText: {
    fontFamily: 'genju-light',
    fontSize: 8,
  },
  dateText: {
    fontFamily: 'genju-light',
    fontSize: 8,
  },
});
