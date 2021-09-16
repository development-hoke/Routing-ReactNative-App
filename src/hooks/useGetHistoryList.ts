import { useState, useEffect } from 'react';
import axios, { CancelTokenSource } from 'axios';

// from app
import { API_ENDPOINT, AUTH_ERROR } from 'app/src/constants';
import { IHistoryList } from 'app/src/interfaces/api/History';
import { IOK } from 'app/src/interfaces/api/Success';
import { IApiError } from 'app/src/interfaces/api/Error';
import { handleError } from 'app/src/utils';
import { useNavigation } from '@react-navigation/native';

/**
 * 検索履歴一覧取得・検索履歴削除フック
 * @param userId ユーザーID
 */
export const useGetHistoryList = (userId: string, authorization: string) => {
  /** 検索履歴一覧取得 正常レスポンス */
  const [histories, setHistories] = useState<IHistoryList>({
    total: 0,
    history_list: [],
  });

  /** 異常レスポンス */
  const [errors, setErrors] = useState<IApiError>({
    code: 0,
    message: '',
    detail_message: [],
  });

  /** ライフサイクル */
  useEffect(() => {
    const signal = axios.CancelToken.source();
    getHistoryList(signal);

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
   * 検索履歴一覧取得API
   * @param signal CancelTokenSource
   */
  const getHistoryList = async (signal: CancelTokenSource): Promise<void> => {
    const url = API_ENDPOINT.PLANS_SEARCH_HISTORIES;

    try {
      const { data } = await axios.get<IHistoryList>(url, {
        headers: {
          Authorization: authorization,
        },
        params: {
          user_id: userId,
        },
        cancelToken: signal.token,
      });
      setHistories(Object.assign(data));
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
  };

  /**
   * 検索履歴削除API
   * @param id 検索履歴ID
   */
  const deleteHistory = async (id: number): Promise<boolean> => {
    const url = API_ENDPOINT.PLANS_SEARCH_HISTORY.replace('$1', `${id}`);

    try {
      await axios.delete<IOK>(url, {
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

    getHistoryList(axios.CancelToken.source());

    return true;
  };

  return { histories, deleteHistory, errors };
};
