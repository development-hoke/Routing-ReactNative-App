import React, { useState } from 'react';
import { StyleSheet, Button } from 'react-native';
import {
  Body,
  Left,
  ListItem,
  Text,
  Thumbnail,
  View,
  Right,
} from 'native-base';
import { SimpleLineIcons } from '@expo/vector-icons';
// from app
import { COLOR, IMAGE } from 'app/src/constants';
import { INotification } from 'app/src/interfaces/api/Notification';

import { useDispatch, useGlobalState } from 'app/src/Store';
import { useFollowUser } from 'app/src/hooks/useFollowUser';

interface Props {
  notification: INotification;
}

/** 通知リスト要素(フォロー通知) */
export const NotificationFollowElement: React.FC<Props> = (props: Props) => {
  const { notification } = props;
  const loginUser = useGlobalState('loginUser');

  const [followed, setFollowed] = useState<boolean>(false);

  const followHook = useFollowUser(loginUser.id, loginUser.authorization);

  const unFollow = async () => {
    await followHook.unfollow(notification.user_id);
    setFollowed(false);
  };

  const follow = async () => {
    await followHook.follow(notification.user_id);
    setFollowed(true);
  };

  return (
    <ListItem avatar style={thisStyle.container}>
      <Left>
        <Thumbnail small source={IMAGE.noUserImage} />
      </Left>
      <Body style={{ overflow: 'hidden' }}>
        <View style={thisStyle.titleContainer}>
          <SimpleLineIcons
            name="user-follow"
            size={16}
            style={thisStyle.followIcon}
          />
          <Text style={thisStyle.titleLinkText}>{notification.user_name}</Text>
          {` さんがあなたをフォローしました。`.split('').map((s) => (
            <Text style={thisStyle.titleText}>{s}</Text>
          ))}
        </View>
        <Text note style={thisStyle.dateText}>
          {notification.notification_date.substr(0, 10)}
        </Text>
      </Body>
      <Right>
        {notification.user_id !== loginUser.id && (
          <View style={thisStyle.followBtn}>
            {!followed && (
              <Button title="フォロー" onPress={follow} color="orange" />
            )}
            {followed && (
              <Button title="フォロー中" onPress={unFollow} color="orange" />
            )}
          </View>
        )}
      </Right>
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
  dateText: {
    fontFamily: 'genju-light',
    fontSize: 9,
  },
  followIcon: {
    color: COLOR.tintColor,
    marginRight: 5,
  },
  followBtn: {
    borderColor: 'orange',
    borderRadius: 60,
    borderWidth: 1,
    marginLeft: 10,
  },
});
