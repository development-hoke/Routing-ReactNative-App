import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { ListItem, Thumbnail, Text, Left, Body, Right } from 'native-base';
import { useNavigation } from '@react-navigation/native';

// from app
import { COLOR, IMAGE } from 'app/src/constants';
import { IFollow, IFollower } from 'app/src/interfaces/api/Follow';
import { FollowButton } from 'app/src/components/Button';

interface Props {
  meId: string;
  follow?: IFollow;
  follower?: IFollower;
  onFollow: (id: string) => Promise<boolean>;
  onUnfollow: (id: string) => Promise<boolean>;
  reload: () => Promise<void>;
}

/** フォロー/フォロワーリスト要素 */
export const FollowElement: React.FC<Props> = (props: Props) => {
  const { navigate } = useNavigation();
  const { meId, follow, follower, onFollow, onUnfollow, reload } = props;

  /** フォローユーザー押下時の処理 */
  const onPressFollow = useCallback(() => {
    if (follow) {
      navigate('Profile', { userId: follow.user_id });
    }
  }, [follow]);

  /** フォロワー押下時の処理 */
  const onPressFollower = useCallback(() => {
    if (follower) {
      navigate('Profile', { userId: follower.user_id });
    }
  }, [follower]);

  // フォローリスト
  if (follow && !follower) {
    return (
      <ListItem avatar onPress={onPressFollow} style={thisStyle.container}>
        <Left>
          <Thumbnail source={IMAGE.noUserImage} />
        </Left>
        <Body>
          <Text style={thisStyle.nameText}>{follow.user_name}</Text>
          <Text style={thisStyle.idText}>@{follow.user_id}</Text>
          <Text note style={thisStyle.dateText}>
            followd at {follow.follow_date.substr(0, 10)}
          </Text>
        </Body>
        <Right>
          {meId !== follow.user_id && (
            <FollowButton
              targetUserId={follow.user_id}
              followed={follow.is_followed}
              onFollow={onFollow}
              onUnfollow={onUnfollow}
              reload={reload}
            />
          )}
        </Right>
      </ListItem>
    );
  }

  // フォロワーリスト
  if (!follow && follower) {
    return (
      <ListItem avatar onPress={onPressFollower} style={thisStyle.container}>
        <Left>
          <Thumbnail source={IMAGE.noUserImage} />
        </Left>
        <Body>
          <Text style={thisStyle.nameText}>{follower.user_name}</Text>
          <Text style={thisStyle.idText}>@{follower.user_id}</Text>
          <Text note style={thisStyle.dateText}>
            followd at {follower.followed_date.substr(0, 10)}
          </Text>
        </Body>
        <Right>
          {meId !== follower.user_id && (
            <FollowButton
              targetUserId={follower.user_id}
              followed={follower.is_follow}
              onFollow={onFollow}
              onUnfollow={onUnfollow}
              reload={reload}
            />
          )}
        </Right>
      </ListItem>
    );
  }

  return <></>;
};

/** スタイリング */
const thisStyle = StyleSheet.create({
  container: {
    alignContent: 'space-around',
    justifyContent: 'center',
  },
  nameText: {
    fontFamily: 'genju-medium',
  },
  idText: {
    fontFamily: 'genju-light',
    fontSize: 10,
    textDecorationColor: COLOR.inactiveColor,
    textDecorationLine: 'underline',
  },
  dateText: {
    fontFamily: 'genju-light',
    fontSize: 10,
  },
});

export default FollowElement;
