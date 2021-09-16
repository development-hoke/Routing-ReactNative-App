import { useState, useEffect } from 'react';
import axios, { CancelTokenSource } from 'axios';

// from app
import { API_ENDPOINT, AUTH_ERROR } from 'app/src/constants';
import { IPlanFull } from 'app/src/interfaces/api/Plan';
import { IApiError } from 'app/src/interfaces/api/Error';
import { handleError } from 'app/src/utils';
import { useNavigation } from '@react-navigation/native';

/**
 * デートプラン詳細取得フック
 * @param planId 取得するデートプランID
 * @param userId 取得者のユーザーID
 */
export const useGetPlanDetail = (
  planId: string,
  userId: string,
  authorization: string,
) => {
  /** 正常レスポンス */
  const [plan, setPlan] = useState<IPlanFull>({
    plan_id: '',
    title: '',
    description: '',
    date: '',
    transportation: [],
    need_time: 0,
    create_date: '',
    spots: [],
    user_id: '',
    user_name: '',
    user_attr: '',
    user_image_url: '',
    like_count: 0,
    comment_count: 0,
    is_liked: false,
    is_follow: false,
    is_fav: false,
  });

  /** 異常レスポンス */
  const [errors, setErrors] = useState<IApiError>({
    code: 0,
    message: '',
    detail_message: [],
  });

  /** ローディング状態 */
  const [isPlanLoading, setIsPlanLoading] = useState<boolean>(true);

  /** ライフサイクル */
  useEffect(() => {
    const signal = axios.CancelToken.source();
    getPlanDetail(signal);

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
   * デートプラン詳細取得API
   * @param signal CancelTokenSource
   */
  const getPlanDetail = async (signal?: CancelTokenSource): Promise<void> => {
    const url = API_ENDPOINT.PLAN.replace('$1', planId);
    const cancelToken = signal
      ? signal.token
      : axios.CancelToken.source().token;

    try {
      const { data } = await axios.get<IPlanFull>(url, {
        headers: {
          Authorization: authorization,
        },
        params: {
          user_id: userId,
        },
        cancelToken,
      });
      const detail = { ...data };

      const favList = await axios.get<{
        favored_user_list: { user_id: string }[];
      }>(API_ENDPOINT.PLAN_FAVS.replace('$1', planId), {
        headers: {
          Authorization: authorization,
        },
        cancelToken,
      });
      if (
        favList.data.favored_user_list.findIndex((v) => v.user_id === userId) >=
        0
      )
        detail.is_fav = true;
      setPlan(detail);
    } catch (err) {
      console.log(err);
      if (axios.isCancel(err)) {
        console.log(`Request Cancelled: ${err.message}`);
      } else {
        const apiError = handleError(err);
        if (apiError) {
          setErrors(apiError);
        }
      }
    }

    setIsPlanLoading(false);
  };

  return { isPlanLoading, plan, getPlanDetail, errors };
};
