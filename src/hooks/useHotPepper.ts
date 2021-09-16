/* eslint-disable react-hooks/rules-of-hooks */
import axios from 'axios';
import { HOT_PEPPER } from 'app/src/constants/Url';
import { LatLng } from 'react-native-maps';
import { IHPShop, IGooglePrediection } from 'app/src/interfaces/app/Map';

interface IHPShopResponse {
  results: {
    api_version: string;
    results_available: number;
    results_returned: number;
    results_start: number;
    shop: IHPShop[];
  };
}

export interface IHPGenre {
  code: string;
  name: string;
}

export const useHotPepper = () => {
  const searchNearbyPlaceH = async (
    location: LatLng,
    radius: number,
    genre: string,
  ): Promise<IHPShop[]> => {
    let radiusStep = 5;
    if (radius <= 300) radiusStep = 1;
    if (radius <= 500) radiusStep = 2;
    if (radius <= 1000) radiusStep = 3;
    if (radius <= 2000) radiusStep = 4;
    if (radius <= 3000) radiusStep = 5;
    const url = `${HOT_PEPPER.DETAIL}?key=${HOT_PEPPER.KEY}&lat=${location.latitude}&lng=${location.longitude}&genre=${genre}&range=${radiusStep}&format=json`;
    const { data } = await axios.get<IHPShopResponse>(url);

    return data.results.shop.map((item) => {
      return {
        ...item,
        origin: 'HOTPEPPER',
        genreCode: genre,
        place_id: item.id,
        icon:
          'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
        geometry: {
          location: { lat: item.lat, lng: item.lng },
        },
        photolink: item.photo.pc.l,
      };
    });
  };

  const searchByKeyword = async (
    keyword: string,
    location: LatLng,
    radius: number,
  ): Promise<IHPShop[]> => {
    let radiusStep = 5;
    if (radius <= 300) radiusStep = 1;
    if (radius <= 500) radiusStep = 2;
    if (radius <= 1000) radiusStep = 3;
    if (radius <= 2000) radiusStep = 4;
    if (radius <= 3000) radiusStep = 5;
    const url = `${HOT_PEPPER.DETAIL}?key=${HOT_PEPPER.KEY}&lat=${location.latitude}&lng=${location.longitude}&name=${keyword}&range=${radiusStep}&format=json`;
    const { data } = await axios.get<IHPShopResponse>(url);

    return data.results.shop.map((item) => {
      return {
        ...item,
        origin: 'HOTPEPPER',
        genreCode: item.genre.code,
        place_id: item.id,
        icon:
          'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
        geometry: {
          location: { lat: item.lat, lng: item.lng },
        },
        photolink: item.photo.pc.l,
      };
    });
  };

  const getPlaceHDetail = async (placeID: string) => {
    const url = `${HOT_PEPPER.DETAIL}?key=${HOT_PEPPER.KEY}&id=${placeID}&format=json`;
    const { data } = await axios.get<IHPShopResponse>(url);

    return data.results.shop[0];
  };

  return {
    searchNearbyPlaceH,
    searchByKeyword,
    getPlaceHDetail,
  };
};
