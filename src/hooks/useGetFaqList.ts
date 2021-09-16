import { useState, useEffect } from 'react';
import axios, { CancelTokenSource } from 'axios';

// from app
import { API_ENDPOINT, AUTH_ERROR } from 'app/src/constants';
import { IFaqList } from 'app/src/interfaces/api/Question';
import { IApiError } from 'app/src/interfaces/api/Error';
import { handleError } from 'app/src/utils';
import { useNavigation } from '@react-navigation/native';

/** よくある質問一覧取得フック */
export const useGetFaqList = (authorization: string) => {
  /** 正常レスポンス */
  const [questions, setQuestions] = useState<IFaqList>({
    question_list: [],
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
    getFaqList(signal);

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
   * よくある質問一覧取得API
   * @param signal CancelTokenSource
   */
  const getFaqList = async (signal: CancelTokenSource): Promise<void> => {
    const url = API_ENDPOINT.QUESTIONS_FAQ;

    try {
      const { data } = await axios.get<IFaqList>(url, {
        headers: {
          Authorization: authorization,
        },
        cancelToken: signal.token,
      });
      setQuestions(Object.assign(data));
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

  return { isLoading, faqList: questions.question_list, errors };
};
