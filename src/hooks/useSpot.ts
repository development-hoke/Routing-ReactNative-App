import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import axios from 'axios';

// from app
import { API_ENDPOINT, AUTH_ERROR } from 'app/src/constants';
import { IApiError } from 'app/src/interfaces/api/Error';
import { handleError } from 'app/src/utils';
import { useNavigation } from '@react-navigation/native';
import { LatLng } from 'react-native-maps';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import { IOK } from '../interfaces/api/Success';
import { ISpotFull } from '../interfaces/api/Plan';

export interface IPostSpot {
  name: string;
  formatted_address: string;
  category: string;
  opening_hours: string;
  formatted_phone_number: string;
  website: string;
  images: ImageInfo[];
  latitude: number;
  longitude: number;
  spot_type: string;
  description: string;
  icon_url: string;
  place_id: string;
}

export interface ICustomSpot {
  category: string;
  description: string;
  formatted_address: string;
  formatted_phone_number: string;
  icon_url: string;
  images: string[];
  latitude: number;
  longitude: number;
  opening_hours: string;
  place_id: string;
  spot_id: string;
  spot_name: string;
  spot_type: 'ONEDATE' | 'GOOGLE' | 'HOTPEPPER';
  website: string;
}

export interface ISpotFetch extends IOK {
  spot_list: ICustomSpot[];
}

export const useSpot = (authorization: string) => {
  const [errors, setErrors] = useState<IApiError>({
    code: 0,
    message: '',
    detail_message: [],
  });

  const { reset } = useNavigation();

  useEffect(() => {
    if (errors.detail_message.includes(AUTH_ERROR)) {
      reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    }
  }, [errors]);

  const createSpot = async (spot: IPostSpot): Promise<IOK | undefined> => {
    const url = API_ENDPOINT.SPOT_CREATE;
    try {
      const formData = new FormData();
      formData.append('name', spot.name);
      formData.append('formatted_address', spot.formatted_address);
      formData.append('category', spot.category);
      formData.append('opening_hours', spot.opening_hours);
      formData.append('formatted_phone_number', spot.formatted_phone_number);
      formData.append('latitude', spot.latitude);
      formData.append('longitude', spot.longitude);
      formData.append('description', spot.description);
      formData.append('icon_url', spot.icon_url);
      formData.append('spot_type', spot.spot_type);
      formData.append('place_id', spot.place_id);
      const file = {
        fileName: spot.images[0].uri.replace(/^.*[\\\/]/, ''),
        type: spot.images[0].type,
        uri: spot.images[0].uri,
      };
      formData.append('images[]', {
        name: file.fileName,
        type: file.type,
        uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
      });
      const { data } = await axios({
        url,
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: authorization,
        },
      });

      return data;
    } catch (err) {
      const apiError = handleError(err);
      if (apiError) {
        setErrors(apiError);
      }
    }

    setErrors({ code: 0, message: '', detail_message: [] });

    return undefined;
  };

  const fetchSpot = async (
    input: string,
    location: LatLng,
    radius: number,
  ): Promise<ICustomSpot[]> => {
    const url = `${API_ENDPOINT.SPOT_FETCH}?latitude=${
      location.latitude
    }&longitude=${location.longitude}&radius=${
      radius * 100
    }&keyword=${input}&spot_type=ONEDATE`;
    const signal = axios.CancelToken.source();
    try {
      const { data } = await axios.get<ISpotFetch>(url, {
        cancelToken: signal.token,
        headers: {
          Authorization: authorization,
        },
      });

      return data.spot_list;
    } catch (err) {
      const apiError = handleError(err);
      if (apiError) {
        setErrors(apiError);
      }
    }
    setErrors({ code: 0, message: '', detail_message: [] });

    return [];
  };

  return { errors, createSpot, fetchSpot };
};
