import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Form, Item, Label, Text } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { LAYOUT } from 'app/src/constants';

// from app
import { useGlobalState } from 'app/src/Store';
import { InputFormFloating } from 'app/src/components/Form';
import { CompleteButton } from 'app/src/components/Button';
import { useUpdatePassword } from 'app/src/hooks';
import { isEmpty } from 'app/src/utils';
import { appStyle } from 'app/src/styles';
import { Input } from 'react-native-elements';

/** パスワード変更画面 */
const ChangePasswordScreen: React.FC = () => {
  /** ナビゲーター */
  const { navigate } = useNavigation();

  /** ログイン中のユーザー */
  const loginUser = useGlobalState('loginUser');

  /** パスワード変更 */
  const {
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    updatePassword,
    errors,
  } = useUpdatePassword(loginUser.id, loginUser.authorization);

  /** 現在のパスワードのバリデーションエラー */
  const oldPasswordErrors: Array<string> = [];

  /** 新しいパスワードのバリデーションエラー */
  const newPasswordErrors: Array<string> = [];

  /** パスワードの確認のバリデーションエラー */
  const [confirmPasswordErrors, setConfirmPasswordErrors] = useState<
    Array<string>
  >([]);

  const inputNew = useRef();
  const inputConfirm = useRef();

  /** ライフサイクル */
  useEffect(() => {
    setConfirmPasswordErrors([]);
  }, [newPassword, confirmNewPassword]);

  // APIバリデーションエラーの分別
  if (errors && errors.detail_message.length > 0) {
    errors.detail_message.forEach((item) => {
      if (item.match(/Old Password/)) {
        oldPasswordErrors.push(
          item.replace('Old Passwordが', '現在のパスワードが'),
        );
      } else if (item.match(/Password/)) {
        newPasswordErrors.push(item.replace('Passwordは', ''));
      }
    });
  }

  /** 完了ボタン押下時の処理 */
  const onCompleteButtonPress = useCallback(async (): Promise<void> => {
    if (newPassword !== confirmNewPassword) {
      setConfirmPasswordErrors(['パスワードが間違っています']);

      return;
    }

    const result = await updatePassword();
    if (result) {
      navigate('Top');
    }
  }, [newPassword, confirmNewPassword]);

  /** 完了ボタン */
  const ChangePasswordButton: JSX.Element = (
    <View style={appStyle.standardContainer}>
      {isEmpty(oldPassword) ||
      isEmpty(newPassword) ||
      isEmpty(confirmNewPassword) ? (
        <CompleteButton title="完了" disabled />
      ) : (
        <CompleteButton title="完了" onPress={onCompleteButtonPress} />
      )}
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={thisStyle.container}>
        <Form>
          <Input
            label="現在のパスワード"
            containerStyle={thisStyle.passwordWrapper}
            value={oldPassword}
            onChangeText={(text) => setOldPassword(text)}
            errorStyle={{ color: 'red' }}
            errorMessage={oldPasswordErrors.join(' ')}
            returnKeyType="next"
            autoCorrect={false}
            autoCapitalize="none"
            onSubmitEditing={(e) => {
              inputNew.current.focus();
            }}
          />
          <Input
            ref={inputNew}
            label="新しいパスワード"
            containerStyle={thisStyle.passwordWrapper}
            value={newPassword}
            onChangeText={(text) => setNewPassword(text)}
            errorStyle={{ color: 'red' }}
            errorMessage={newPasswordErrors.join(' ')}
            returnKeyType="next"
            autoCorrect={false}
            autoCapitalize="none"
            onSubmitEditing={(e) => {
              inputConfirm.current.focus();
            }}
          />
          <Input
            ref={inputConfirm}
            label="新しいパスワードの確認"
            containerStyle={thisStyle.passwordWrapper}
            value={confirmNewPassword}
            onChangeText={(text) => setConfirmNewPassword(text)}
            errorStyle={{ color: 'red' }}
            errorMessage={confirmPasswordErrors.join(' ')}
            returnKeyType="done"
            autoCorrect={false}
            autoCapitalize="none"
          />
        </Form>
        {ChangePasswordButton}
        <View style={appStyle.emptySpace} />
      </View>
    </TouchableWithoutFeedback>
  );
};

/** スタイリング */
const thisStyle = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 0.7,
    justifyContent: 'center',
  },
  passwordWrapper: {
    marginTop: 10,
    width: LAYOUT.window.width * 0.9,
  },
});

export default ChangePasswordScreen;
