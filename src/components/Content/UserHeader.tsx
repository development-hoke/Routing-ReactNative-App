import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Thumbnail, Text } from 'native-base';

// from app
import { IMAGE } from 'app/src/constants';
import { IUserInfo } from 'app/src/interfaces/app/User';
import { FollowButton } from 'app/src/components/Button';

interface Props {
  user: IUserInfo;
  onFollow?: (id: string) => Promise<boolean>;
  onUnfollow?: (id: string) => Promise<boolean>;
  reload?: () => Promise<void>;
}

/** ユーザーヘッダー */
export const UserHeader: React.FC<Props> = (props: Props) => {
  const { navigate } = useNavigation();
  const { user, onFollow, onUnfollow, reload } = props;

  /** ユーザー押下時の処理 */
  const onPress = useCallback(() => {
    navigate('Profile', { userId: user.userId });
  }, []);

  return (
    <View style={thisStyle.container}>
      <View style={thisStyle.thumbnailContainer}>
        <Thumbnail source={IMAGE.noUserImage} />
      </View>
      <View style={thisStyle.userContainer}>
        <Text style={thisStyle.nameText} onPress={onPress}>
          {user.userName}
        </Text>
        <Text note style={thisStyle.attrText}>
          {user.userAttr}
        </Text>
      </View>
      {user.isFollow !== undefined && onFollow && onUnfollow && reload && (
        <View style={thisStyle.followContainer}>
          <FollowButton
            targetUserId={user.userId}
            followed={user.isFollow}
            onFollow={onFollow}
            onUnfollow={onUnfollow}
            reload={reload}
          />
        </View>
      )}
    </View>
  );
};

/** スタイリング */
const thisStyle = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    margin: 5,
  },
  thumbnailContainer: {
    padding: 5,
  },
  userContainer: {
    padding: 5,
  },
  followContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    height: 30,
    justifyContent: 'flex-end',
    marginRight: 10,
  },
  nameText: {
    fontFamily: 'genju-medium',
  },
  attrText: {
    fontFamily: 'genju-light',
  },
});
