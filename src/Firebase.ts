import * as Facebook from 'expo-facebook';
import firebase from 'firebase';
import Constants from 'expo-constants';

/** Firebase 初期化 */
firebase.initializeApp(Constants.manifest.extra.firebase);

/** Facebook ログイン認証 */
export const facebookLogin = async () => {
  const { appId } = Constants.manifest.extra.facebook;

  try {
    // prettier-ignore
    await Facebook.initializeAsync(appId);
    const facebookLoginResult = await Facebook.logInWithReadPermissionsAsync(
      appId,
    );
    console.log('facebookLoginResult: ', facebookLoginResult);
    if (facebookLoginResult.type === 'success') {
      // prettier-ignore
      const credential = firebase.auth.FacebookAuthProvider.credential(facebookLoginResult.token);

      return firebase
        .auth()
        .signInWithCredential(credential)
        .catch((error) => console.log(`Facebook SignIn Error: ${error}`));
    }
    console.log('Facebook SignIn Cancelled.');

    return { cancelled: true, error: false };
  } catch (e) {
    console.log(`Facebook Auth Error: ${e}`);

    return { cancelled: true, error: true };
  }
};
