import React, { useCallback, useState, useEffect } from 'react';
import { StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import {
  Container,
  Content,
  Form,
  View,
  ListItem,
  Left,
  Right,
  Switch,
  Text,
  Body,
} from 'native-base';
import FlashMessage, { showMessage } from 'react-native-flash-message';

// from app
import { useGlobalState } from 'app/src/Store';
import { LoadingSpinner } from 'app/src/components/Spinners';
import { CompleteButton } from 'app/src/components/Button';
import {
  InputLabelForm,
  InputLabelTextAreaForm,
} from 'app/src/components/Form';

import { useEditProfile } from 'app/src/hooks';
import { isEmpty } from 'app/src/utils';
import { appTextStyle } from 'app/src/styles';

/** プロフィール編集画面 */
const EditProfileScreen: React.FC = () => {
  /** ログイン中のユーザー */
  const loginUser = useGlobalState('loginUser');

  /** ユーザー情報取得とプロフィール更新 */
  const {
    name,
    setName,
    onedateId,
    setOnedateId,
    profile,
    setProfile,
    age,
    setAge,
    address,
    setAddress,
    mailAddress,
    setMailAddress,
    updateProfile,
    isLoading,
    errors,
    isPrivate,
    setIsPrivate,
  } = useEditProfile(loginUser.id, loginUser.authorization);

  /** 更新ボタン押下時の処理 */
  const onCompleteButtonPress = useCallback(async (): Promise<void> => {
    const result = await updateProfile();
    if (result) {
      showMessage({
        message: 'プロフィールを更新しました。',
        type: 'success',
      });
    }
  }, [updateProfile]);

  const [nameErrors, setNameErrors] = useState<string[]>([]);
  const [onedateIdErrors, setOneDateIdErrors] = useState<string[]>([]);
  const [profileErrors, setProfileErrors] = useState<string[]>([]);
  const [emailErrors, setEmailErrors] = useState<string[]>([]);
  const [addressErrors, setAddressErrors] = useState<string[]>([]);

  useEffect(() => {
    if (errors && errors.detail_message.length > 0) {
      console.log(errors);
      errors.detail_message.forEach((item) => {
        if (item.match(/Name/)) {
          setNameErrors((prev) => [...prev, item.replace('Nameは', '')]);
        }
        if (item.match(/OnedateID/)) {
          setOneDateIdErrors((prev) => [
            ...prev,
            item.replace('OnedateIDは', ''),
          ]);
        }
        if (item.match(/Profile/)) {
          setProfileErrors((prev) => [...prev, item.replace('Profileは', '')]);
        }
        if (item.match(/Mail Address/)) {
          setEmailErrors((prev) => [
            ...prev,
            item.replace('Mail addressは', ''),
          ]);
        }
        if (item.match(/Address/)) {
          setAddressErrors((prev) => [...prev, item.replace('Addressは', '')]);
        }
      });
    }
  }, [errors]);

  const handleSwitchPrivateValue = useCallback((value: boolean) => {
    setIsPrivate(value);
  }, []);

  // ローディング
  if (isLoading) {
    return LoadingSpinner;
  }

  /** 更新ボタンの描画 */
  const UpdateButton = (
    <View style={thisStyle.button}>
      {/* 更新ボタン(必須項目が未入力の場合は非活性) */}
      {isEmpty(name) || isEmpty(mailAddress) || isEmpty(`${age}`) ? (
        <CompleteButton title="更新" disabled />
      ) : (
        <CompleteButton title="更新" onPress={onCompleteButtonPress} />
      )}
    </View>
  );

  /** 更新成功時メッセージ */
  const SuccessMessage = (
    <FlashMessage
      position="bottom"
      duration={2500}
      titleStyle={{ fontFamily: 'genju-medium', textAlign: 'center' }}
    />
  );

  return (
    <Container>
      <Content>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <Form>
            <InputLabelForm
              label="ユーザーネーム"
              value={name}
              setValue={setName}
              errors={nameErrors}
              autoCorrect={false}
            />
            <InputLabelForm
              label="OnedateID"
              value={onedateId}
              setValue={setOnedateId}
              errors={onedateIdErrors}
            />
            <InputLabelTextAreaForm
              label="自己紹介"
              value={profile}
              setValue={setProfile}
              errors={profileErrors}
            />
            <InputLabelForm
              label="メール"
              value={mailAddress}
              setValue={setMailAddress}
              errors={emailErrors}
              autoCorrect={false}
            />
            {/* }
          <InputLabelForm
            label="年齢"
            numValue={age || 0}
            setNumValue={setAge}
          />
          <InputLabelForm
            label="住まい"
            value={address}
            setValue={setAddress}
            errors={addressErrors}
          />
          */}
          </Form>
        </TouchableWithoutFeedback>
        <ListItem icon onPress={() => Keyboard.dismiss()}>
          <Left>
            <Text style={appTextStyle.standardText}>
              アカウントを非公開にする
            </Text>
          </Left>
          <Body />
          <Right>
            <Switch
              onValueChange={handleSwitchPrivateValue}
              value={isPrivate}
            />
          </Right>
        </ListItem>
        {UpdateButton}
      </Content>
      {SuccessMessage}
    </Container>
  );
};

export default EditProfileScreen;

/** スタイリング */
const thisStyle = StyleSheet.create({
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
});
