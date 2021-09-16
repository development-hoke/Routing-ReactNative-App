import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import Axios from 'axios';
import { useGlobalState } from 'app/src/Store';
import { API_ENDPOINT } from 'app/src/constants';

/** 画像アップロードフック */
export const useUploadImage = (authorization: string) => {
  /** カメラロールに対するパーミッションの有無 */
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  const loginUser = useGlobalState('loginUser');

  /** 選択画像 */
  const [image, setImage] = useState<string>('');

  useEffect(() => {
    getPermissionAsync();
  }, []);

  /** パーミッションの許可 */
  const getPermissionAsync = async (): Promise<void> => {
    if (Platform.OS === 'ios') {
      try {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        setHasPermission(status === 'granted');
      } catch (err) {
        console.log(err);
      }
    }
  };

  /** カメラロールから画像の選択 */
  const pickImage = async (): Promise<void> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.uri);
        const formData = new FormData();
        // TODO: Call api for upload avatar here
        formData.append('file', result);
        Axios({
          url: `${API_ENDPOINT.USER.replace(
            '$1',
            loginUser.id,
          )}/profimageupload`,
          method: 'post',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: authorization,
          },
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return { hasPermission, image, pickImage };
};
