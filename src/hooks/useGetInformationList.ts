import { useState, useEffect, useCallback } from 'react';
import axios, { CancelTokenSource } from 'axios';

// from app
import { API_ENDPOINT } from 'app/src/constants/Url';
import { IInformationList } from 'app/src/interfaces/api/Notification';
import { IApiError } from 'app/src/interfaces/api/Error';
import { handleError } from 'app/src/utils';

/**
 * 運営からのお知らせ一覧取得フック
 * @param userId 対象のユーザーID
 */
export const useGetInformationList = (
  userId: string,
  authorization: string,
) => {
  /** 正常レスポンス */
  const [information, setInformation] = useState<IInformationList>({
    unread_count: 0,
    information_list: [],
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
    getInformationList(signal);

    return () => {
      signal.cancel('Cancelling in Cleanup.');
    };
  }, []);

  /** プルリロード */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getInformationList(axios.CancelToken.source());
    setRefreshing(false);
  }, []);

  /**
   * 通知一覧取得API
   * @param signal CancelTokenSource
   */
  const getInformationList = async (
    signal: CancelTokenSource,
  ): Promise<void> => {
    const url = API_ENDPOINT.INFORMATION;

    try {
      const { data } = await axios.get<IInformationList>(url, {
        headers: {
          Authorization: authorization,
        },
        params: {
          user_id: userId,
        },
        cancelToken: signal.token,
      });
      setInformation(Object.assign(data));
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

  return { isLoading, isRefreshing, onRefresh, information, errors };
};
