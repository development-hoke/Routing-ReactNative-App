import React, { useCallback } from 'react';
import { Fab } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';

// from app
import { COLOR } from 'app/src/constants';

/** プラン作成フローティングボタン */
export const CreatePlanFab: React.FC = () => {
  const { navigate } = useNavigation();

  /** プラン作成トップに遷移 */
  const toCreate = useCallback(() => {
    navigate('Create');
  }, []);

  return (
    <Fab
      active
      containerStyle={{}}
      style={{ backgroundColor: COLOR.tintColor }}
      position="bottomRight"
      onPress={toCreate}
    >
      <FontAwesome5 name="route" size={32} color={COLOR.tintColor} />
    </Fab>
  );
};
