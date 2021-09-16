import { useState, useEffect } from 'react';
import axios, { CancelTokenSource } from 'axios';

// from app
import { API_ENDPOINT, AUTH_ERROR } from 'app/src/constants/Url';
import { IFollowerList } from 'app/src/interfaces/api/Follow';
import { IApiError } from 'app/src/interfaces/api/Error';
import { handleError } from 'app/src/utils';
import { useNavigation } from '@react-navigation/native';

/**
 * フォロワーリスト取得フック
 * @param userId 対象のユーザーID
 */
export const useGetFollowerList = (userId: string, authorization: string) => {
  /** 正常レスポンス */
  const [followers, setFollowers] = useState<IFollowerList>({
    total: 0,
    follower_list: [],
  });

  /** 異常レスポンス */
  const [errors, setErrors] = useState<IApiError>({
    code: 0,
    message: '',
    detail_message: [],
  });

  /** ローディング状態 */
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /** ライフサイクル */
  useEffect(() => {
    const signal = axios.CancelToken.source();
    getFollowerList(signal);

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

  /**
   * フォロワーリスト取得
   * @param signal CancelTokenSource
   */
  const getFollowerList = async (signal?: CancelTokenSource): Promise<void> => {
    const url = API_ENDPOINT.USER_FOLLOWERS.replace('$1', userId);
    const cancelToken = signal
      ? signal.token
      : axios.CancelToken.source().token;

    try {
      const { data } = await axios.get<IFollowerList>(url, {
        headers: {
          Authorization: authorization,
        },
        cancelToken,
      });
      setFollowers(Object.assign(data));
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

  return { isLoading, followers, getFollowerList, errors };
};
