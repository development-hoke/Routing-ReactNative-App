import { useState, useEffect } from 'react';
import axios, { CancelTokenSource } from 'axios';

// from app
import { API_ENDPOINT, AUTH_ERROR } from 'app/src/constants/Url';
import { IUserDetail } from 'app/src/interfaces/api/User';
import { IApiError } from 'app/src/interfaces/api/Error';
import { handleError } from 'app/src/utils';
import { useNavigation } from '@react-navigation/native';

/**
 * ユーザー詳細取得フック
 * @param userId 対象のユーザーID
 * @param meId 操作者のユーザーID
 */
export const useGetUserDetail = (
  userId: string,
  meId: string,
  authorization: string,
) => {
  /** 正常レスポンス */
  const [user, setUser] = useState<IUserDetail>({
    user_id: '',
    name: '',
    profile: '',
    sex: '',
    age: 0,
    area: '',
    address: '',
    mail_address: '',
    user_attr: '',
    user_image_url: '',
    plan_count: 0,
    follow_count: 0,
    follower_count: 0,
    is_follow: false,
    onedate_id: '',
    status: '',
  });

  /** 異常レスポンス */
  const [errors, setErrors] = useState<IApiError>({
    code: 0,
    message: '',
    detail_message: [],
  });

  /** ローディング状態 */
  const [isUserLoading, setIsUserLoading] = useState<boolean>(true);

  /** ライフサイクル */
  useEffect(() => {
    const signal = axios.CancelToken.source();
    getUserDetail(signal);

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
   * ユーザー詳細取得API
   * @param signal CancelTokenSource
   */
  const getUserDetail = async (signal?: CancelTokenSource): Promise<void> => {
    const url = API_ENDPOINT.USER.replace('$1', userId);
    console.log(url);
    const cancelToken = signal
      ? signal.token
      : axios.CancelToken.source().token;

    try {
      const { data } = await axios.get<IUserDetail>(url, {
        headers: {
          Authorization: authorization,
        },
        params: {
          me_user_id: meId,
        },
        cancelToken,
      });
      console.log(data);
      setUser(Object.assign(data));
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

    setIsUserLoading(false);
  };

  return { isUserLoading, user, getUserDetail, errors };
};
