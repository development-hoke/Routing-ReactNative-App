import { useState, useEffect } from 'react';
import axios from 'axios';

// from app
import { API_ENDPOINT, AUTH_ERROR } from 'app/src/constants/Url';
import { IUpdatePasswordBody } from 'app/src/interfaces/api/User';
import { IOK } from 'app/src/interfaces/api/Success';
import { IApiError } from 'app/src/interfaces/api/Error';
import { handleError } from 'app/src/utils';
import { useNavigation } from '@react-navigation/native';

/**
 * パスワード変更フック
 * @param userId 対象のユーザーID
 */
export const useUpdatePassword = (userId: string, authorization: string) => {
  /** 現在のパスワード */
  const [oldPassword, setOldPassword] = useState<string>('');
  /** 新しいパスワード */
  const [newPassword, setNewPassword] = useState<string>('');
  /** 新しいパスワードの確認 */
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
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

  /** パスワード変更API */
  const updatePassword = async (): Promise<boolean> => {
    const url = API_ENDPOINT.USER_PASSWORD.replace('$1', userId);

    const body: IUpdatePasswordBody = {
      old_password: oldPassword,
      new_password: newPassword,
    };

    try {
      await axios.put<IOK>(url, body, {
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
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    updatePassword,
    errors,
  };
};
