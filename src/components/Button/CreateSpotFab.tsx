import React, { useCallback } from 'react';
import { Fab, View } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';

// from app
import { COLOR } from 'app/src/constants';

/** スポット作成フローティングボタン */
export const CreateSpotFab: React.FC = () => {
  const { navigate } = useNavigation();

  /** スポット作成トップに遷移 */
  const toCreate = useCallback(() => {
    navigate('CreateSpot');
  }, []);

  return (
    <Fab
      active
      containerStyle={{}}
      style={{ backgroundColor: COLOR.tintColor }}
      position="bottomRight"
      onPress={toCreate}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <FontAwesome5 name="map-marker-alt" size={24} color="#ffffff" />
        <FontAwesome5 name="plus" size={12} color="#ffffff" />
      </View>
    </Fab>
  );
};
