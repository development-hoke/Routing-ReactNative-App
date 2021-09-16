import { useState, useEffect } from 'react';
import axios, { CancelTokenSource } from 'axios';

// from app
import { API_ENDPOINT, AUTH_ERROR } from 'app/src/constants/Url';
import { ICommentList } from 'app/src/interfaces/api/Comment';
import { IApiError } from 'app/src/interfaces/api/Error';
import { handleError } from 'app/src/utils';
import { useNavigation } from '@react-navigation/native';

/**
 * コメント一覧取得フック
 * @param planId コメントのデートプランID
 */
export const useGetCommentList = (planId: string, authorization: string) => {
  /** 正常レスポンス */
  const [comments, setComments] = useState<ICommentList>({
    total: 0,
    comment_list: [],
  });

  /** 異常レスポンス */
  const [errors, setErrors] = useState<IApiError>({
    code: 0,
    message: '',
    detail_message: [],
  });

  /** ローディング状態 */
  const [isCommentsLoading, setIsCommentsLoading] = useState<boolean>(true);

  /** ライフサイクル */
  useEffect(() => {
    const signal = axios.CancelToken.source();
    getCommentList();

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
   * コメント一覧取得API
   * @param signal CancelTokenSource
   */
  const getCommentList = async (): Promise<void> => {
    const url = API_ENDPOINT.PLAN_COMMENTS.replace('$1', planId);
    const signal = axios.CancelToken.source();
    try {
      const { data } = await axios.get<ICommentList>(url, {
        cancelToken: signal.token,
        headers: {
          Authorization: authorization,
        },
      });
      setComments(Object.assign(data));
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

    setIsCommentsLoading(false);
  };

  return { isCommentsLoading, comments, errors, getCommentList };
};
