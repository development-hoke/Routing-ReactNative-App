import { useState, useEffect } from 'react';
import axios from 'axios';

// from app
import { API_ENDPOINT, AUTH_ERROR } from 'app/src/constants';
import { IApiError } from 'app/src/interfaces/api/Error';
import { handleError } from 'app/src/utils';
import { useNavigation } from '@react-navigation/native';
import { IOK } from '../interfaces/api/Success';
import { ISpotFull } from '../interfaces/api/Plan';

export interface IPostPlan {
  user_id: string;
  title: string;
  description: string;
  date: string;
  need_time: number;
  transportation: string[];
  spots: ISpotFull[];
  status: 'public' | 'private' | 'delete';
  datetime_status: 'public' | 'private';
}

export const usePostPlan = (authorization: string) => {
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

  const createPost = async (plan: IPostPlan): Promise<IOK | undefined> => {
    const url = API_ENDPOINT.PLANS;
    try {
      const { data } = await axios.post<IOK>(url, plan, {
        headers: {
          Authorization: authorization,
        },
      });

      return data;
    } catch (err) {
      const apiError = handleError(err);
      if (apiError) {
        setErrors(apiError);
      }
    }

    setErrors({ code: 0, message: '', detail_message: [] });

    return undefined;
  };

  return { errors, createPost };
};
