import React, { useCallback } from 'react';
import { Fab } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

// from app
import { COLOR } from 'app/src/constants';
import { IPlan } from 'app/src/interfaces/api/Plan';

interface EditPostScreenProps {
  plan: IPlan;
}
/** プラン編集フローティングボタン */
export const EditPlanFab: React.FC<EditPostScreenProps> = (
  props: EditPostScreenProps,
) => {
  const navigation = useNavigation();
  const { plan } = props;

  /** プラン編集画面に遷移 */
  const toCreate = useCallback(() => {
    // TODO プラン編集画面に遷移
    navigation.navigate('EditDatePlanNav', {
      screen: 'EditDatePlan',
      params: { plan },
    });
  }, []);

  return (
    <Fab
      active
      containerStyle={{}}
      style={{ backgroundColor: COLOR.tintColor }}
      position="bottomRight"
      onPress={toCreate}
    >
      <AntDesign name="edit" />
    </Fab>
  );
};
