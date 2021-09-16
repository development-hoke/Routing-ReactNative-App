import { useState, useEffect } from 'react';
import axios, { CancelTokenSource } from 'axios';
import { useNavigation } from '@react-navigation/native';
import { IApiError } from '../interfaces/api/Error';
import { AUTH_ERROR, API_ENDPOINT } from '../constants';
import { IOK } from '../interfaces/api/Success';
import { handleError } from '../utils';

export const useCommentPlan = (
  userId: string,
  planId: string,
  authorization: string,
) => {
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

  const commentPlan = async (comment: string): Promise<boolean> => {
    const url = API_ENDPOINT.PLAN_COMMENTS.replace('$1', planId);

    const body = {
      user_id: userId,
      comment,
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

  return {
    commentPlan,
    errors,
  };
};
