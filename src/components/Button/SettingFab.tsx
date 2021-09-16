import React, { useCallback } from 'react';
import { Fab } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// from app
import { COLOR } from 'app/src/constants';

/** 設定フローティングボタン */
export const SettingFab: React.FC = () => {
  const { navigate } = useNavigation();

  /** 設定一覧に遷移 */
  const toSetting = useCallback(() => {
    navigate('Setting');
  }, []);

  return (
    <Fab
      active
      containerStyle={{}}
      style={{ backgroundColor: COLOR.tintColor }}
      position="topRight"
      onPress={toSetting}
    >
      <MaterialCommunityIcons name="settings" />
    </Fab>
  );
};
