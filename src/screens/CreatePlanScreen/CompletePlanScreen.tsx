import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// from app
import { CompleteButton } from 'app/src/components/Button';
import { appStyle, appTextStyle } from 'app/src/styles';

/**
 * デートプラン作成完了画面
 */
const CompletePlanScreen: React.FC = () => {
  const { navigate } = useNavigation();

  /* TODO 今すぐ案内が仮の値を置いている */
  return (
    <View style={appStyle.standardContainer}>
      <View style={{ marginBottom: 10 }}>
        <Text style={appTextStyle.defaultText}>ルートを保存しました。</Text>
      </View>
      <View style={{ marginBottom: 10 }}>
        <CompleteButton title="今すぐ案内" onPress={() => navigate('Plan')} />
      </View>
      <CompleteButton title="ホームへ" onPress={() => navigate('Home')} />
    </View>
  );
};

export default CompletePlanScreen;
