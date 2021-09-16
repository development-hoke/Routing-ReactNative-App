import React, { useState, useCallback } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
// from app
// import { facebookLogin } from 'app/src/Firebase';
import { COLOR, IMAGE, LAYOUT, ASYNC_STORAGE_KEY } from 'app/src/constants';
import { InputForm } from 'app/src/components/Form';
import { CompleteButton } from 'app/src/components/Button';
import { useSignin, useSignup } from 'app/src/hooks';
import { validateEmail, validateAlphaNumeric } from 'app/src/utils';
import { CheckBox } from 'react-native-elements';
import { appStyle, appTextStyle } from 'app/src/styles';

/** 初回起動時の画面 */
const AppTopScreen: React.FC = () => {
  /** ナビゲーター */
  const { navigate, reset } = useNavigation();

  /**
   * 現在画面
   * [0]初回画面
   * [1]メールアドレスログイン画面
   * [2]新規登録画面
   */
  const [screenPhase, setScreenPhase] = useState<number>(0);

  /** メールアドレス(ログイン用) */
  const [emailAtSignin, setEmailAtSignin] = useState<string>('');

  /** パスワード(ログイン用) */
  const [passAtSignin, setPassAtSignin] = useState<string>('');

  /** メールアドレス(新規登録用) */
  const [emailAtSignup, setEmailAtSignup] = useState<string>('');

  /** パスワード(新規登録用) */
  const [passAtSignup, setPassAtSignup] = useState<string>('');

  /** パスワードの確認(新規登録用) */
  const [confirmPassAtSignup, setConfirmPassAtSignup] = useState<string>('');

  /** メールアドレスバリデーションエラー(新規登録用) */
  const [emailErrAtSignup, setEmailErrAtSignup] = useState<Array<string>>([]);

  /** パスワードバリデーションエラー(新規登録用)  */
  const [passErrAtSignup, setPassErrAtSignup] = useState<Array<string>>([]);

  const [acceptTermsAndPrivacy, setAcceptTermsAndPrivacy] = useState<boolean>(
    false,
  );

  const [acceptSCC, setAcceptSCC] = useState<boolean>(false);

  /** パスワード確認バリデーションエラー(新規登録用)  */
  const [confirmPassErrAtSignup, setConfirmPassErrAtSignup] = useState<
    Array<string>
  >([]);

  /** ログイン機能 */
  const { loginByEmail, errors } = useSignin();

  /** ユーザー登録機能 */
  const { setRegisterUserParts } = useSignup();

  /** 利用規約リンク押下時の処理 */
  const toTerms = useCallback(() => {
    navigate('Terms');
  }, []);

  /** プライバシーポリシーリンク押下時の処理 */
  const toPrivacy = useCallback(() => {
    navigate('Privacy');
  }, []);

  /** 特定商取引法押下時の処理 */
  const toSCC = useCallback(() => {
    navigate('SCC');
  }, []);

  /** メールアドレスでログイン押下時の処理 */
  const openMailAddressScreen = useCallback(() => {
    // デートマスターを初期値に設定しておく
    const masterMailAddress = 'yamada@onedate.com';
    const masterPassword = 'password';
    setEmailAtSignin(masterMailAddress);
    setPassAtSignin(masterPassword);
    setScreenPhase(1);
  }, [emailAtSignin, passAtSignin]);

  /** 新規登録はこちら押下時の処理 */
  const openSignUpScreen = useCallback(() => {
    setScreenPhase(2);
  }, [emailAtSignin, passAtSignin]);

  /** Facebookログインボタン押下時の処理 */
  // const onFacebookButtonPress = useCallback(async (): Promise<void> => {
  //   const result = await facebookLogin();
  //   if (result) {
  //     navigate('Welcome');
  //   }
  // }, []);

  /** メールアドレスログインボタン押下時の処理 */
  const onSignInButtonPress = useCallback(async (): Promise<void> => {
    const result = await loginByEmail(emailAtSignin, passAtSignin);
    if (result) {
      AsyncStorage.multiSet([
        [ASYNC_STORAGE_KEY.USER, emailAtSignin],
        [ASYNC_STORAGE_KEY.PASSWORD, passAtSignin],
      ]);
      reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    }
  }, [emailAtSignin, passAtSignin]);

  /** 新規登録ボタン押下時の処理 */
  const onNextButtonPress = useCallback(() => {
    const emailErrors: Array<string> = [];
    const passErrors: Array<string> = [];
    const confirmPassErrors: Array<string> = [];

    if (!validateEmail(emailAtSignup)) {
      emailErrors.push('メールアドレスを入力してください');
    }
    if (!validateAlphaNumeric(passAtSignup)) {
      passErrors.push('半角英数を入力してください');
    }
    if (!validateAlphaNumeric(confirmPassAtSignup)) {
      confirmPassErrors.push('半角英数を入力してください');
    }
    if (passAtSignup !== confirmPassAtSignup) {
      confirmPassErrors.push('パスワードが一致しません');
    }

    setEmailErrAtSignup(emailErrors);
    setPassErrAtSignup(passErrors);
    setConfirmPassErrAtSignup(confirmPassErrors);

    if (
      emailErrors.length === 0 &&
      passErrors.length === 0 &&
      confirmPassErrors.length === 0
    ) {
      setRegisterUserParts(emailAtSignup, passAtSignup);
      navigate('Entry');
      // navigate('Main');
    }
  }, [emailAtSignup, passAtSignup, confirmPassAtSignup]);

  /** 初期画面 */
  const TopScreen: JSX.Element = (
    <View>
      {/**
      <FontAwesome.Button
        name="facebook"
        size={30}
        backgroundColor={COLOR.facebookColor}
        borderRadius={30}
        iconStyle={{ marginLeft: 30 }}
        onPress={onFacebookButtonPress}
      >
        Facebookでログイン
      </FontAwesome.Button>
      */}
      <Text style={thisStyle.link} onPress={openMailAddressScreen}>
        メールアドレスでログイン
      </Text>
      <Text style={thisStyle.link} onPress={openSignUpScreen}>
        新規登録はこちら
      </Text>
    </View>
  );

  /** メールアドレスログイン画面 */
  const renderSignInScreen = (): JSX.Element => {
    const emailErrAtSignin: Array<string> = [];
    const passwordErrAtSignin: Array<string> = [];
    console.log(errors.detail_message);
    if (errors && errors.detail_message.length > 0) {
      errors.detail_message.forEach((item) => {
        if (item.match(/Mail Address/) || item === 'ユーザーが見つかりません') {
          emailErrAtSignin.push(item.replace('Mail Addressは', ''));
        }
        if (item.match(/Password/)) {
          passwordErrAtSignin.push(item.replace('Passwordは', ''));
        }
      });
    }

    return (
      <View>
        <InputForm
          placeholder="メールアドレスを入力"
          value={emailAtSignin}
          setValue={setEmailAtSignin}
          errors={emailErrAtSignin}
          returnKeyType="done"
        />
        <InputForm
          placeholder="パスワードを入力"
          value={passAtSignin}
          setValue={setPassAtSignin}
          errors={passwordErrAtSignin}
          returnKeyType="done"
        />
        <View style={thisStyle.completeButtonContainer}>
          {/* 未入力項目がある場合はボタン押下不可 */}
          {emailAtSignin.length > 0 && passAtSignin.length > 0 ? (
            <CompleteButton title="ログイン" onPress={onSignInButtonPress} />
          ) : (
            <CompleteButton title="ログイン" disabled />
          )}
        </View>
      </View>
    );
  };

  /** 新規登録画面 */
  const SignUpScreen: JSX.Element = (
    <View>
      <InputForm
        placeholder="メールアドレスを入力"
        value={emailAtSignup}
        setValue={setEmailAtSignup}
        errors={emailErrAtSignup}
        returnKeyType="done"
      />
      <InputForm
        placeholder="パスワードを入力"
        value={passAtSignup}
        setValue={setPassAtSignup}
        errors={passErrAtSignup}
        returnKeyType="done"
      />
      <InputForm
        placeholder="パスワードを再入力"
        value={confirmPassAtSignup}
        setValue={setConfirmPassAtSignup}
        errors={confirmPassErrAtSignup}
        returnKeyType="done"
      />
      <CheckBox
        checked={acceptTermsAndPrivacy}
        checkedColor={COLOR.tintColor}
        wrapperStyle={{ margin: 0, padding: 0 }}
        containerStyle={thisStyle.checkBoxStyle}
        onPress={() => {
          setAcceptTermsAndPrivacy(!acceptTermsAndPrivacy);
        }}
        title="利用規約とプライバシーポリシーに同意します"
      />
      <CheckBox
        checked={acceptSCC}
        checkedColor={COLOR.tintColor}
        wrapperStyle={{ margin: 0, padding: 0 }}
        containerStyle={[
          thisStyle.checkBoxStyle,
          thisStyle.checkBoxMarginStyle,
        ]}
        onPress={() => {
          setAcceptSCC(!acceptSCC);
        }}
        title="特定商取引法に同意します"
      />
      <View style={thisStyle.completeButtonContainer}>
        {/* 未入力項目がある場合はボタン押下不可 */}
        {emailAtSignup.length > 0 &&
        passAtSignup.length > 0 &&
        acceptTermsAndPrivacy &&
        acceptSCC &&
        confirmPassAtSignup.length > 0 ? (
          <CompleteButton title="新規登録" onPress={onNextButtonPress} />
        ) : (
          <CompleteButton title="新規登録" disabled />
        )}
      </View>
    </View>
  );

  /** 利用規約とプライバシーポリシーのリンク */
  const TermsLinks: JSX.Element = (
    <View style={thisStyle.termsLinkContainer}>
      <Text onPress={toTerms} style={appTextStyle.linkText}>
        利用規約
      </Text>
      <View style={{ width: 20 }} />
      <Text onPress={toPrivacy} style={appTextStyle.linkText}>
        プライバシーポリシー
      </Text>
      <View style={{ width: 20 }} />
      <Text onPress={toSCC} style={appTextStyle.linkText}>
        特定商取引法
      </Text>
    </View>
  );

  const renderBackButton: JSX.Element = (
    <TouchableOpacity
      style={thisStyle.backlinkWrapper}
      onPress={() => setScreenPhase(0)}
    >
      {/* <FontAwesome name="chevron-left" size={24} color={COLOR.linkColor} /> */}
      <FontAwesome name="chevron-left" size={24} color={COLOR.tintColor} />
      <Text style={thisStyle.backlinkText}>戻る</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAwareScrollView>
      <View
        style={{ ...appStyle.standardContainer, height: LAYOUT.window.height }}
      >
        {screenPhase > 0 && renderBackButton}
        <View style={appStyle.emptySpace} />
        <View style={thisStyle.topImage}>
          <Image
            resizeMode="contain"
            source={IMAGE.logo}
            style={{ flex: 1 }}
            width={LAYOUT.window.width * 0.8}
          />
          <Text style={thisStyle.welcomeText}>1Dateへようこそ</Text>
          {TermsLinks}
        </View>
        <View style={thisStyle.linkOrFormGroup}>
          {screenPhase === 0 && TopScreen}
          {screenPhase === 1 && renderSignInScreen()}
          {screenPhase === 2 && SignUpScreen}
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

/** スタイリング */
const thisStyle = StyleSheet.create({
  topImage: {
    alignItems: 'center',
    flex: 2,
    justifyContent: 'center',
  },
  linkOrFormGroup: {
    alignItems: 'center',
    flex: 3,
    justifyContent: 'center',
  },
  completeButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  termsLinkContainer: {
    flexDirection: 'row',
  },
  checkBoxStyle: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginLeft: 0,
    paddingLeft: 5,
  },
  checkBoxMarginStyle: {
    marginBottom: 30,
    marginTop: -10,
  },
  welcomeText: {
    color: COLOR.textTintColor,
    fontFamily: 'genju-medium',
    fontSize: 20,
    padding: 10,
  },
  link: {
    color: COLOR.textTintColor,
    fontFamily: 'genju-medium',
    fontSize: 20,
    padding: 10,
    textAlign: 'center',
    textDecorationColor: COLOR.tintColor,
    textDecorationLine: 'underline',
  },
  backlinkWrapper: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    left: 15,
    position: 'absolute',
    top: 55,
  },
  backlinkText: {
    // color: COLOR.linkColor,
    color: COLOR.tintColor,
    fontSize: 18,
  },
});

export default AppTopScreen;
