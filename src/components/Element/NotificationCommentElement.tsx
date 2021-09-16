import React from 'react';
import { StyleSheet } from 'react-native';
import { Body, Left, ListItem, Text, Thumbnail, View } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';

// from app
import { COLOR, IMAGE } from 'app/src/constants';
import { INotification } from 'app/src/interfaces/api/Notification';

interface Props {
  notification: INotification;
}

/** 通知リスト要素(コメント通知) */
export const NotificationCommentElement: React.FC<Props> = (props: Props) => {
  const { notification } = props;

  return (
    <ListItem avatar style={thisStyle.container}>
      <Left>
        <Thumbnail small source={IMAGE.noUserImage} />
      </Left>
      <Body>
        <View style={thisStyle.titleContainer}>
          <FontAwesome
            name="comment-o"
            size={16}
            style={thisStyle.commentIcon}
          />
          <Text style={thisStyle.titleLinkText}>{notification.user_name}</Text>
          {` さんがコメントしました。`.split('').map((s) => (
            <Text style={thisStyle.titleText}>{s}</Text>
          ))}
        </View>
        <Text note style={thisStyle.commentText}>
          {notification.plan_comment}
        </Text>
        <Text note style={thisStyle.planTitleText}>
          {notification.plan_title}
        </Text>
        <Text note style={thisStyle.dateText}>
          {notification.notification_date.substr(0, 10)}
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
  titleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  titleText: {
    fontFamily: 'genju-medium',
    fontSize: 12,
  },
  titleLinkText: {
    fontFamily: 'genju-medium',
    fontSize: 12,
    textDecorationColor: COLOR.inactiveColor,
    textDecorationLine: 'underline',
  },
  planTitleText: {
    fontFamily: 'genju-medium',
    fontSize: 10,
  },
  commentText: {
    fontFamily: 'genju-light',
    fontSize: 10,
  },
  dateText: {
    fontFamily: 'genju-light',
    fontSize: 9,
  },
  commentIcon: {
    color: COLOR.tintColor,
    marginRight: 5,
  },
});
