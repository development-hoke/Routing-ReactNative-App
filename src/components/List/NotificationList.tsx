import React from 'react';
import { Button, FlatList, View, TouchableOpacity } from 'react-native';

// from app
import { NOTIFICATION_CATEGORY } from 'app/src/constants/Enum';
import { RefreshSpinner } from 'app/src/components/Spinners';
import { INotification } from 'app/src/interfaces/api/Notification';
import {
  NotificationFollowElement,
  NotificationLikeElement,
  NotificationCommentElement,
} from 'app/src/components/Element';
import { useGetNotificationList } from 'app/src/hooks';
import { useGlobalState } from 'app/src/Store';

interface Props {
  notificationList: Array<INotification>;
  isRefreshing: boolean;
  onRefresh: () => Promise<void>;
}

/** 通知リスト */
export const NotificationList: React.FC<Props> = (props: Props) => {
  const { notificationList, isRefreshing, onRefresh } = props;
  const loginUser = useGlobalState('loginUser');

  const { readNotification } = useGetNotificationList(
    loginUser.id,
    loginUser.authorization,
  );

  const onReadNotification = async (notifyId: string) => {
    await readNotification(notifyId);
  };

  /** 通知リスト要素の描画 */
  const renderNotificationElement = ({
    item,
  }: {
    item: INotification;
  }): JSX.Element => {
    let returnItem = null;
    switch (item.notification_category) {
      case NOTIFICATION_CATEGORY.FOLLOW:
        return <NotificationFollowElement notification={item} />;
      case NOTIFICATION_CATEGORY.LIKE:
        returnItem = <NotificationLikeElement notification={item} />;
        break;
      case NOTIFICATION_CATEGORY.COMMENT:
        returnItem = <NotificationCommentElement notification={item} />;
        break;
      default:
        returnItem = <View />;
    }

    return (
      <TouchableOpacity
        onPress={() => {
          onReadNotification(item.notification_id);
        }}
      >
        {returnItem}
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={notificationList}
      renderItem={renderNotificationElement}
      refreshControl={RefreshSpinner(isRefreshing, onRefresh)}
      keyExtractor={(item) => `${item.notification_id}`}
    />
  );
};
