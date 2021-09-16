import { useState, useEffect } from 'react';
import axios, { CancelTokenSource } from 'axios';

// from app
import { API_ENDPOINT, AUTH_ERROR } from 'app/src/constants/Url';
import { ILikeUserList } from 'app/src/interfaces/api/Like';
import { IApiError } from 'app/src/interfaces/api/Error';
import { handleError } from 'app/src/utils';
import { useNavigation } from '@react-navigation/native';

/**
 * デートプランお気に入り登録者一覧取得フック
 * @param planId デートプランID
 */
export const useGetLikeUserList = (planId: string, authorization: string) => {
  /** 正常レスポンス */
  const [users, setUsers] = useState<ILikeUserList>({
    total: 0,
    liked_user_list: [],
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
    getLikeUserList(signal);

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
   * デートプランお気に入り登録者一覧取得API
   * @param signal CancelTokenSource
   */
  const getLikeUserList = async (signal: CancelTokenSource): Promise<void> => {
    const url = API_ENDPOINT.PLAN_LIKES.replace('$1', planId);

    try {
      const { data } = await axios.get<ILikeUserList>(url, {
        headers: {
          Authorization: authorization,
        },
        cancelToken: signal.token,
      });
      setUsers(Object.assign(data));
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

  return { isLoading, users, errors };
};
