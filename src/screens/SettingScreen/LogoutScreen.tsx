import React, { useCallback } from 'react';
import { View, Text } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { CompleteButton } from 'app/src/components/Button';
import { appStyle, appTextStyle } from 'app/src/styles';

/** ログアウト確認画面 */
const LogoutScreen: React.FC = () => {
  const { navigate } = useNavigation();

  const onCompleteButtonPress = useCallback(() => {
    navigate('AppTop');
  }, []);

  return (
    <View style={appStyle.standardContainer}>
      <View style={{ marginBottom: 10 }}>
        <Text style={appTextStyle.defaultText}>本当にログアウトしますか？</Text>
      </View>
      <CompleteButton title="ログアウトする" onPress={onCompleteButtonPress} />
    </View>
  );
};

export default LogoutScreen;
