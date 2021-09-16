import { useState, useCallback } from 'react';
import axios from 'axios';

// from app
import { useDispatch, useGlobalState } from 'app/src/Store';
import { ActionType } from 'app/src/Reducer';
import { API_ENDPOINT } from 'app/src/constants';
import { useSignin } from 'app/src/hooks';
import { ILoginUser, ICreateUserBody } from 'app/src/interfaces/api/User';
import { IApiError } from 'app/src/interfaces/api/Error';
import { getAge, handleError } from 'app/src/utils';

/** ユーザー登録フック */
export const useSignup = () => {
  /** ユーザー登録に必要な情報 */
  const registerUser = useGlobalState('registerUser');

  /** グローバルステート更新関数 */
  const dispatch = useDispatch();

  /** ユーザー名 */
  const [name, setName] = useState<string>('');

  /** 男性かどうか */
  const [isMan, setMan] = useState<boolean>(false);

  /** 女性かどうか */
  const [isWoman, setWoman] = useState<boolean>(false);

  /** 生年月日 */
  const [birthday, setBirthday] = useState<string>('1995-01-01');

  /** 都道府県 */
  const [prefecture, setPrefecture] = useState<string>('');

  /** 1DID */
  const [onedateId, setOnedateId] = useState<string>('');

  /** 異常レスポンス */
  const [errors, setErrors] = useState<IApiError>();

  /** ログイン機能 */
  const { setLoginUser } = useSignin();

  /** ユーザー登録 */
  // eslint-disable-next-line consistent-return
  const createUser = async (): Promise<boolean> => {
    const url = API_ENDPOINT.USERS;

    const body: ICreateUserBody = {
      name,
      sex: isMan ? 'man' : 'woman',
      age: getAge(birthday),
      area: prefecture,
      mail_address: registerUser.mailAddress,
      password: registerUser.password,
      onedate_id: onedateId,
    };

    try {
      const { data, headers } = await axios.post<ILoginUser>(url, body);
      const { user_id, name, user_image_url } = data;
      const authorization = headers['x-authentication-token'];
      setErrors({ code: 0, message: '', detail_message: [] });

      setLoginUser(user_id, name, authorization, user_image_url);
    } catch (err) {
      const apiError = handleError(err);
      console.log(apiError);
      if (apiError) {
        setErrors(apiError);
      }

      return false;
    }

    return true;
  };

  /**
   * ユーザー登録に必要な情報の永続化
   * @param mailAddress メールアドレスう
   * @param password パスワード
   */
  const setRegisterUserParts = useCallback(
    (mailAddress: string, password: string) => {
      dispatch({
        type: ActionType.SET_REGISTER_USER,
        payload: {
          mailAddress,
          password,
        },
      });
    },
    [],
  );

  return {
    setRegisterUserParts,
    name,
    setName,
    isMan,
    setMan,
    isWoman,
    setWoman,
    birthday,
    setBirthday,
    prefecture,
    setPrefecture,
    onedateId,
    setOnedateId,
    createUser,
    errors,
  };
};
