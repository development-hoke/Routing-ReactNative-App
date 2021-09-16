import { useState, useEffect, useCallback } from 'react';
import axios, { CancelTokenSource } from 'axios';

// from app
import { API_ENDPOINT, AUTH_ERROR } from 'app/src/constants';
import { IPlanList } from 'app/src/interfaces/api/Plan';
import { IApiError } from 'app/src/interfaces/api/Error';
import { handleError } from 'app/src/utils';
import { useNavigation } from '@react-navigation/native';

/**
 * 自分のお気に入りデートプラン一覧取得フック
 * @param userId ユーザーID
 */
export const useGetLikePlanList = (userId: string, authorization: string) => {
  /** 正常レスポンス */
  const [plans, setPlans] = useState<IPlanList>({
    total: 0,
    plan_list: [],
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
    getLikePlanList(signal);

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
   * お気に入りデートプラン一覧取得API
   * @param signal CancelTokenSource
   */
  const getLikePlanList = async (signal: CancelTokenSource): Promise<void> => {
    const url = API_ENDPOINT.USER_LIKES.replace('$1', userId);

    try {
      const { data } = await axios.get<IPlanList>(url, {
        headers: {
          Authorization: authorization,
        },
        params: {
          user_id: userId,
        },
        cancelToken: signal.token,
      });
      setPlans(Object.assign(data));
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

  /** プルリロード */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getLikePlanList(axios.CancelToken.source());
    setRefreshing(false);
  }, []);

  return { isLoading, plans, errors, isRefreshing, onRefresh };
};
