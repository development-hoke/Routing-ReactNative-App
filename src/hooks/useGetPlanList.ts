import { useState, useEffect, useCallback } from 'react';
import axios, { CancelTokenSource } from 'axios';

// from app
import { API_ENDPOINT, AUTH_ERROR } from 'app/src/constants';
import { IPlanList } from 'app/src/interfaces/api/Plan';
import { IApiError } from 'app/src/interfaces/api/Error';
import { handleError } from 'app/src/utils';
import { useNavigation } from '@react-navigation/native';

/**
 * デートプラン一覧取得フック
 * @param userId ユーザーID(Optional:マイプラン一覧取得時に必要)
 */
export const useGetPlanList = (authorization?: string, userId?: string) => {
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
  const [isPlanListLoading, setIsPlanListLoading] = useState<boolean>(true);

  /** リフレッシュ状態 */
  const [isRefreshing, setRefreshing] = useState<boolean>(false);

  /** ライフサイクル */
  useEffect(() => {
    const signal = axios.CancelToken.source();
    getPlanList(signal);
    console.log(userId);

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
   * デートプラン一覧取得API
   * @param signal CancelTokenSource
   */
  const getPlanList = async (signal: CancelTokenSource): Promise<void> => {
    const url = API_ENDPOINT.PLANS;

    const cancelToken = signal.token;
    const config = userId
      ? // マイプラン一覧取得
        {
          params: {
            user_id: userId,
          },
          cancelToken,
          headers: {
            Authorization: authorization,
          },
        }
      : // 通常のプラン一覧取得 TODO 自分のエリアで人気のデートプランを取得する
        {
          cancelToken,
          headers: {
            Authorization: authorization,
          },
        };
    try {
      const { data } = await axios.get<IPlanList>(url, config);
      setPlans(Object.assign(data));
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log(`Request Cancelled: ${err.message}`);
      } else {
        const apiError = handleError(err);
        console.log(apiError);
        if (apiError) {
          setErrors(apiError);
        }
      }
    }

    setIsPlanListLoading(false);
  };

  /** プルリロード */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getPlanList(axios.CancelToken.source());
    setRefreshing(false);
  }, []);

  return { isPlanListLoading, plans, errors, isRefreshing, onRefresh };
};
