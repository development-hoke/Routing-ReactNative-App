import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// from app
import { COLOR } from 'app/src/constants';
import { appTextStyle } from 'app/src/styles';

interface Props {
  pickImage: () => Promise<void>;
}

/** 画像選択ボタン */
export const ImagePickerButton: React.FC<Props> = (props) => {
  const { pickImage } = props;

  return (
    <TouchableOpacity onPress={pickImage} style={{ flexDirection: 'row' }}>
      <Text style={appTextStyle.detailLinkText}>プロフィール画像変更</Text>
      <MaterialCommunityIcons
        name="library-plus"
        color={COLOR.tintColor}
        onPress={pickImage}
      />
    </TouchableOpacity>
  );
};
