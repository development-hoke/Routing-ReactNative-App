import { useState, useEffect } from 'react';
import axios from 'axios';

// from app
import { API_ENDPOINT, AUTH_ERROR } from 'app/src/constants/Url';
import { ILikeBody } from 'app/src/interfaces/api/Like';
import { IOK } from 'app/src/interfaces/api/Success';
import { IApiError } from 'app/src/interfaces/api/Error';
import { handleError } from 'app/src/utils';
import { useNavigation } from '@react-navigation/native';

/**
 * お気に入り登録・解除フック
 * @param userId 操作を行うユーザーID
 */
export const useFavoritePlan = (userId: string, authorization: string) => {
  /** 異常レスポンス */
  const [errors, setErrors] = useState<IApiError>({
    code: 0,
    message: '',
    detail_message: [],
  });

  const { reset } = useNavigation();
  useEffect(() => {
    if (errors.detail_message.includes(AUTH_ERROR)) {
      reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    }
  }, [errors]);

  const favPlan = async (planId: string): Promise<boolean> => {
    const url = API_ENDPOINT.PLAN_FAVS.replace('$1', planId);

    const body: ILikeBody = {
      user_id: userId,
    };

    try {
      await axios.post<IOK>(url, body, {
        headers: {
          Authorization: authorization,
        },
      });
    } catch (err) {
      const apiError = handleError(err);
      if (apiError) {
        setErrors(apiError);
      }

      return false;
    }

    setErrors({ code: 0, message: '', detail_message: [] });

    return true;
  };

  const unfavPlan = async (planId: string): Promise<boolean> => {
    const url = API_ENDPOINT.PLAN_FAVS.replace('$1', planId);

    try {
      await axios.delete<IOK>(url, {
        headers: {
          Authorization: authorization,
        },
        params: {
          user_id: userId,
        },
      });
    } catch (err) {
      const apiError = handleError(err);
      if (apiError) {
        setErrors(apiError);
      }

      return false;
    }

    setErrors({ code: 0, message: '', detail_message: [] });

    return true;
  };

  return {
    favPlan,
    unfavPlan,
    errors,
  };
};
