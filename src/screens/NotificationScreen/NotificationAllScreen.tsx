import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// from app
import { useGlobalState } from 'app/src/Store';
import { COLOR } from 'app/src/constants';
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
      {notifications.notification_list.length ? (
        <NotificationList
          notificationList={notifications.notification_list}
          isRefreshing={isRefreshing}
          onRefresh={onRefresh}
        />
      ) : (
        <Text style={appTextStyle.defaultText}>通知はありません。</Text>
      )}
    </View>
  );
};

/** スタイリング */
const thisStyle = StyleSheet.create({
  container: {
    backgroundColor: COLOR.backgroundColor,
  },
});

export default NotificationAllScreen;
