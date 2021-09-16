import { useState } from 'react';
import axios from 'axios';

// from app
import { useDispatch } from 'app/src/Store';
import { ActionType } from 'app/src/Reducer';
import { API_ENDPOINT } from 'app/src/constants';
import { ILoginUser, ILogin } from 'app/src/interfaces/api/User';
import { IApiError } from 'app/src/interfaces/api/Error';

import { handleError } from 'app/src/utils';

/** ログインフック */
export const useSignin = () => {
  /** グローバルステート更新関数 */
  const dispatch = useDispatch();

  /** 異常レスポンス */
  const [errors, setErrors] = useState<IApiError>({
    code: 0,
    message: '',
    detail_message: [],
  });

  /**
   * メールアドレスでログイン
   * @param mailAddress メールアドレス
   * @param password パスワード
   */
  const loginByEmail = async (
    mailAddress: string,
    password: string,
  ): Promise<boolean> => {
    const url = API_ENDPOINT.USERS_LOGIN;
    const body: ILogin = {
      mail_address: mailAddress,
      password,
    };

    try {
      const { data, headers } = await axios.post<ILoginUser>(url, body);
      const { user_id, name, user_image_url } = data;
      const authorization = headers['x-authentication-token'];
      setLoginUser(user_id, name, authorization, user_image_url);
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

  /**
   * ログインユーザーの永続化
   * @param id ユーザーID
   * @param name ユーザー名
   * @param imageUrl プロフィール画像URL
   */
  const setLoginUser = (
    id: string,
    name: string,
    authorization: string,
    imageUrl?: string,
  ) => {
    dispatch({
      type: ActionType.SET_LOGIN_USER,
      payload: {
        id,
        name,
        authorization,
        imageUrl: '',
      },
    });
  };

  return { loginByEmail, setLoginUser, errors };
};
