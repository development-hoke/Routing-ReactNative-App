import { useState, useEffect, useCallback } from 'react';
import axios, { CancelTokenSource } from 'axios';

// from app
import { API_ENDPOINT, AUTH_ERROR } from 'app/src/constants/Url';
import { INotificationList } from 'app/src/interfaces/api/Notification';
import { IApiError } from 'app/src/interfaces/api/Error';
import { handleError } from 'app/src/utils';
import { useNavigation } from '@react-navigation/native';

/**
 * 通知一覧取得フック
 * @param userId 対象のユーザーID
 */
export const useGetNotificationList = (
  userId: string,
  authorization: string,
) => {
  /** 正常レスポンス */
  const [notifications, setNotifications] = useState<INotificationList>({
    unread_count: 0,
    notification_list: [],
  });

  /** 異常レスポンス */
  const [errors, setErrors] = useState<IApiError>({
    code: 0,
    message: '',
    detail_message: [],
  });

  /** ローディング状態 */
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /** リフレッシュ状態 */
  const [isRefreshing, setRefreshing] = useState<boolean>(false);

  /** ライフサイクル */
  useEffect(() => {
    const signal = axios.CancelToken.source();
    getNotificationList(signal);

    return () => {
      signal.cancel('Cancelling in Cleanup.');
    };
  }, []);

  const { reset } = useNavigation();
  useEffect(() => {
    if (errors.detail_message.includes(AUTH_ERROR)) {
      reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    }
  }, [errors]);

  /** プルリロード */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getNotificationList(axios.CancelToken.source());
    setRefreshing(false);
  }, []);

  /**
   * 通知一覧取得API
   * @param signal CancelTokenSource
   */
  const getNotificationList = async (
    signal: CancelTokenSource,
  ): Promise<void> => {
    const url = API_ENDPOINT.USER_NOTIFICATIONS.replace('$1', userId);

    try {
      const { data } = await axios.get<INotificationList>(url, {
        headers: {
          Authorization: authorization,
        },
        cancelToken: signal.token,
      });
      setNotifications(Object.assign(data));
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log(`Request Cancelled: ${err.message}`);
      } else {
        const apiError = handleError(err);
        if (apiError) {
          setErrors(apiError);
        }
      }
    }

    setIsLoading(false);
  };
  const readNotification = async (notifyId: string) => {
    const url = `${API_ENDPOINT.USER_NOTIFICATIONS.replace(
      '$1',
      userId,
    )}/${notifyId}`;
    try {
      await axios.put(url, {
        headers: {
          Authorization: authorization,
        },
      });
    } catch (err) {
      if (!axios.isCancel(err)) {
        const apiError = handleError(err);
        if (apiError) {
          setErrors(apiError);
        }
      }
    }
  };

  return {
    isLoading,
    isRefreshing,
    onRefresh,
    notifications,
    errors,
    readNotification,
  };
};
