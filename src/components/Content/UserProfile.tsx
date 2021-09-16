import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Thumbnail, Text } from 'native-base';

// from app
import { COLOR, IMAGE, LAYOUT } from 'app/src/constants';
import { IUserDetail } from 'app/src/interfaces/api/User';
import { ImagePickerButton, FollowButton } from 'app/src/components/Button';
import { appTextStyle } from 'app/src/styles';
import { FontAwesome5 } from '@expo/vector-icons';

interface Props {
  user: IUserDetail;
  me?: boolean;
  image?: any;
  pickImage?: () => Promise<void>;
  follow?: (id: string) => Promise<boolean>;
  unfollow?: (id: string) => Promise<boolean>;
  reload: () => Promise<void>;
}

/** ユーザー情報 */
export const UserProfile: React.FC<Props> = (props: Props) => {
  const { navigate } = useNavigation();
  const { user, me, image, pickImage, follow, unfollow, reload } = props;

  /** フォロー数押下時の処理 */
  const onFollowPress = useCallback(() => {
    navigate(me ? 'MyFollow' : 'Follow', { userId: user.user_id });
  }, [me, user]);

  /** フォロワー数押下時の処理 */
  const onFollowerPress = useCallback(() => {
    navigate(me ? 'MyFollower' : 'Follower', { userId: user.user_id });
  }, [me, user]);

  /** プラン数押下時の処理 */
  const onPlanPress = useCallback(() => {
    navigate('MyPlan');
  }, []);

  console.log(user);

  return (
    <View style={thisStyle.container}>
      <Thumbnail
        source={image ? { uri: image } : IMAGE.noUserImage}
        style={{
          width: LAYOUT.window.width * 0.2,
          height: LAYOUT.window.width * 0.2,
          borderWidth: 2,
          borderRadius: LAYOUT.window.width * 0.1,
          borderColor: COLOR.greyColor,
        }}
      />
      {me && pickImage && <ImagePickerButton pickImage={pickImage} />}
      <View style={thisStyle.userInfoContainer}>
        <Text style={thisStyle.nameText}>
          {user.name}&nbsp;&nbsp;
          {user.user_attr === 'official' && (
            <FontAwesome5
              name="check-circle"
              size={16}
              color={COLOR.tintColor}
            />
          )}
        </Text>
        <Text note style={thisStyle.nameText}>
          @{user.user_id}
        </Text>
      </View>
      <View style={thisStyle.countContainer}>
        <View style={[thisStyle.countItem, { margin: 1 }]}>
          <Text style={thisStyle.nameText}>{user.profile}</Text>
        </View>
      </View>
      <View style={thisStyle.countContainer}>
        <View style={[thisStyle.countItem]}>
          <Text style={thisStyle.nameText}>フォロー</Text>
          <Text style={thisStyle.nameText} onPress={onFollowPress}>
            {user.follow_count}人
          </Text>
        </View>
        <View style={thisStyle.countItem}>
          <Text style={thisStyle.nameText}>フォロワー</Text>
          <Text style={thisStyle.nameText} onPress={onFollowerPress}>
            {user.follower_count}人
          </Text>
        </View>
        <View style={thisStyle.countItem}>
          <Text style={thisStyle.nameText}>プラン数</Text>
          <Text style={thisStyle.nameText} onPress={onPlanPress}>
            {user.plan_count}
          </Text>
        </View>
      </View>
      {!me && follow && unfollow && (
        <View style={thisStyle.followContainer}>
          <FollowButton
            targetUserId={user.user_id}
            followed={user.is_follow}
            onFollow={follow}
            onUnfollow={unfollow}
            reload={reload}
          />
        </View>
      )}
    </View>
  );
};

/** デフォルト値 */
UserProfile.defaultProps = {
  me: false,
};

/** スタイリング */
const thisStyle = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  userInfoContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  countContainer: {
    alignContent: 'space-around',
    flexDirection: 'row',
  },
  followContainer: {
    marginBottom: 10,
    marginTop: 10,
  },
  countItem: {
    alignItems: 'center',
    flexDirection: 'column',
    margin: 10,
  },
  nameText: {
    color: COLOR.textTintColor,
    fontFamily: 'genju-medium',
    marginTop: 5,
  },
  countTitleText: {
    color: COLOR.textTintColor,
    fontFamily: 'genju-light',
    fontSize: 15,
  },
  officalStar: {
    color: '#ff891f',
  },
});
