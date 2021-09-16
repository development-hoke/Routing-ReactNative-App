import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { ListItem, Thumbnail, Text, Left, Body } from 'native-base';
import { useNavigation } from '@react-navigation/native';

// from app
import { COLOR, IMAGE } from 'app/src/constants';
import { ILikeUser } from 'app/src/interfaces/api/Like';

interface Props {
  user: ILikeUser;
}

/** デートプランお気に入り登録者リスト要素 */
export const LikeUserElement: React.FC<Props> = (props: Props) => {
  const { navigate } = useNavigation();
  const { user } = props;

  /** ユーザー押下時の処理 */
  const onPress = useCallback(() => {
    navigate('Profile', { userId: user.user_id });
  }, [user]);

  return (
    <ListItem avatar onPress={onPress} style={thisStyle.container}>
      <Left>
        <Thumbnail source={IMAGE.noUserImage} />
      </Left>
      <Body>
        <Text style={thisStyle.nameText}>{user.user_name}</Text>
        <Text style={thisStyle.idText}>@{user.user_id}</Text>
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

export default LikeUserElement;
