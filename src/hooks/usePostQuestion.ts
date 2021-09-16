import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

// from app
import { API_ENDPOINT, AUTH_ERROR } from 'app/src/constants/Url';
import { IPostQuestionBody } from 'app/src/interfaces/api/Question';
import { IOK } from 'app/src/interfaces/api/Success';
import { IApiError } from 'app/src/interfaces/api/Error';
import { handleError } from 'app/src/utils';
import { useNavigation } from '@react-navigation/native';

/**
 * 質問投稿フック
 * @param userId 操作を行うユーザーID
 */
export const usePostQuestion = (userId: string, authorization: string) => {
  /** 質問投稿内容 */
  const [question, setQuestion] = useState<string>('');

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

  /**
   * 質問投稿API
   * @param question 質問内容
   */
  const postQuestion = useCallback(async (): Promise<boolean> => {
    const url = API_ENDPOINT.QUESTIONS;

    const body: IPostQuestionBody = {
      user_id: userId,
      question,
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
    setQuestion('');

    return true;
  }, [userId, question]);

  return {
    question,
    setQuestion,
    postQuestion,
    errors,
  };
};
