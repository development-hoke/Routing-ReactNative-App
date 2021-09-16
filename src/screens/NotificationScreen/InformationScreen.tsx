import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

// from app
import { useGlobalState } from 'app/src/Store';
import { COLOR, LAYOUT } from 'app/src/constants';
import { NotificationList } from 'app/src/components/List';
import { useGetNotificationList } from 'app/src/hooks';
import { appTextStyle } from 'app/src/styles';

/** 通知一覧画面 */
const NotificationAllScreen: React.FC = () => {
  /** ログイン中のユーザー */
  const loginUser = useGlobalState('loginUser');

  /** 通知一覧取得 */
  const { isRefreshing, onRefresh, notifications } = useGetNotificationList(
    loginUser.id,
    loginUser.authorization,
  );

  return (
    <View style={thisStyle.container}>
      <Image
        source={{
          uri:
            'https://i.pinimg.com/originals/5b/55/88/5b5588af841070a2284ea76e2042dd9d.jpg',
        }}
        style={thisStyle.image}
      />
      {notifications.notification_list.length ? (
        <NotificationList
          notificationList={notifications.notification_list}
          isRefreshing={isRefreshing}
          onRefresh={onRefresh}
        />
      ) : (
        <Text style={appTextStyle.defaultText}>
          運営からのお知らせはありません。
        </Text>
      )}
    </View>
  );
};

/** スタイリング */
const thisStyle = StyleSheet.create({
  container: {
    backgroundColor: COLOR.backgroundColor,
    padding: 10,
  },
  image: {
    height: LAYOUT.window.height * 0.2,
  },
});

export default NotificationAllScreen;
