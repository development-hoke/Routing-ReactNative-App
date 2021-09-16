/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import axios from 'axios';
import { GOOGLE_MAP_ENDPOINT, HOT_PEPPER } from 'app/src/constants/Url';
// from app
import {
  IPlace,
  IPlaceOpenHour,
  IGoogleResult,
  IGoogleMatrixResult,
  IGoogleDirection,
  IGooglePrediection,
  IGoogleAutoCompleteResult,
  IHotPepperResult,
  IGoogleDistanceElement,
} from 'app/src/interfaces/app/Map';
import { LatLng } from 'react-native-maps';

export const useGooglePlace = () => {
  const [places, setPlaces] = useState<IPlace[]>([]);
  const [distanceMatrix, setDistanceMatrix] = useState<
    IGoogleDistanceElement[][]
  >([]);
  const [direction, setDirection] = useState<IGoogleDirection>();
  const [nextToken, setNextToken] = useState<string | undefined>(undefined);
  const [predictions, setPredictions] = useState<IGooglePrediection[]>([]);
  const placeUrl = GOOGLE_MAP_ENDPOINT.PLACE;
  const distanceUrl = GOOGLE_MAP_ENDPOINT.DISTANCE;
  const directionUrl = GOOGLE_MAP_ENDPOINT.DIRECTION;
  const autoUrl = GOOGLE_MAP_ENDPOINT.AUTO;
  const baseUrl = GOOGLE_MAP_ENDPOINT.BASE;
  const API_KEY = GOOGLE_MAP_ENDPOINT.KEY;

  const searchNearbyPlace = async (
    location: LatLng,
    radius: number,
    type?: string,
  ): Promise<IPlace[]> => {
    let url = `${placeUrl}/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=${radius}&rankby=prominence&language=ja&key=${API_KEY}`;
    if (type) {
      url = `${placeUrl}/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=${radius}&type=${type}&language=ja&key=${API_KEY}`;
    }
    const { data } = await axios.get<IGoogleResult>(url);
    if (data.results) {
      return data.results.map((item) => {
        return type
          ? {
              ...item,
              origin: 'GOOGLE',
              genreCode: type,
              photolink: item.photos
                ? getPlacePhoto(item.photos[0].photo_reference)
                : '',
            }
          : item;
      });
    }

    return [];
  };

  const getDistanceMatrix = async (
    placeIDs: string[],
    mode: string,
  ): Promise<void> => {
    const divide = 5;
    const groupCt = Math.ceil(placeIDs.length / divide);
    const matchMatrix = [];
    for (let i = 0; i < groupCt; i += 1) {
      for (let j = 0; j < groupCt; j += 1) {
        matchMatrix.push({ i, j });
      }
    }
    const googleData = await Promise.all(
      matchMatrix.map(async (mItem) => {
        const colPlaces = placeIDs.filter(
          (item, idx) =>
            idx >= mItem.i * divide &&
            idx < Math.min((mItem.i + 1) * divide, placeIDs.length),
        );
        const rowPlaces = placeIDs.filter(
          (item, idx) =>
            idx >= mItem.j * divide &&
            idx < Math.min((mItem.j + 1) * divide, placeIDs.length),
        );

        const matrixPart = await getDistanceMatrixByTen(
          colPlaces,
          rowPlaces,
          mode,
        );

        return { ...mItem, matrixPart };
      }),
    );
    const distanceMatrix: any[][] = [];
    for (let i = 0; i < placeIDs.length; i += 1) {
      distanceMatrix[i] = [];
      for (let j = 0; j < placeIDs.length; j += 1) {
        distanceMatrix[i][j] = {};
      }
    }
    for (let i = 0; i < groupCt; i += 1) {
      for (let j = 0; j < groupCt; j += 1) {
        const gItem = googleData.find((item) => item.i === i && item.j === j);
        if (gItem) {
          for (let idx = 0; idx < gItem.matrixPart.rows.length; idx += 1) {
            const row = gItem.matrixPart.rows[idx];
            for (let jdx = 0; jdx < row.elements.length; jdx += 1) {
              const element = row.elements[jdx];
              distanceMatrix[i * divide + idx][j * divide + jdx] = {
                ...element,
              };
            }
          }
        }
      }
    }
    setDistanceMatrix(distanceMatrix);
  };

  const getDistanceMatrixByTen = async (
    ordIDs: string[],
    destIDs: string[],
    mode: string,
  ): Promise<IGoogleMatrixResult> => {
    const url = `${distanceUrl}/json?origins=${ordIDs.join(
      '|',
    )}&destinations=${destIDs.join('|')}&mode=${mode}&key=${API_KEY}`;
    const { data } = await axios.get<IGoogleMatrixResult>(url);

    return data;
  };

  const getDirection = async (
    origin: string,
    destination: string,
    mode: string,
  ): Promise<IGoogleDirection> => {
    const url = `${directionUrl}/json?origin=${origin}&destination=${destination}&mode=${mode}&key=${API_KEY}`;
    const { data } = await axios.get<IGoogleDirection>(url);
    setDirection(data);

    return data;
  };

  const getDirectionByLocation = async (
    origin: string,
    destination: string,
    mode: string,
  ): Promise<IGoogleDirection> => {
    const url = `${directionUrl}/json?origin=${origin}&destination=${destination}&mode=${mode}&key=${API_KEY}`;
    const { data } = await axios.get<IGoogleDirection>(url);
    setDirection(data);

    return data;
  };

  const getNextPlaces = async (token: string): Promise<void> => {
    const url = `${placeUrl}/nearbysearch/json?pagetoken=${token}&key=${API_KEY}`;
    const { data } = await axios.get<IGoogleResult>(url);
    if (data.results) setPlaces((prev) => prev.concat(data.results));
    if (data.next_page_token) setNextToken(data.next_page_token);
    else setNextToken(undefined);
  };

  const getPlacePhoto = (photoreference: string) => {
    return `${placeUrl}/photo?maxwidth=400&photoreference=${photoreference}&key=${API_KEY}`;
  };

  const getPlaceOpeningHours = async (
    placeId: string,
  ): Promise<IPlaceOpenHour | undefined> => {
    const url = `${placeUrl}/details/json?place_id=${placeId}&fields=opening_hours&key=${API_KEY}`;

    const { data } = await axios.get<IGoogleResult>(url);
    if (data.result && data.result.opening_hours) {
      return data.result.opening_hours;
    }

    return undefined;
  };

  const getPlaceDetail = async (
    placeId: string,
  ): Promise<IPlace | undefined> => {
    const url = `${placeUrl}/details/json?place_id=${placeId}&key=${API_KEY}&language=ja`;

    const { data } = await axios.get<IGoogleResult>(url);
    if (data.result) {
      return {
        ...data.result,
        origin: 'GOOGLE',
        photolink: data.result.photos
          ? getPlacePhoto(data.result.photos[0].photo_reference)
          : '',
      };
    }

    return undefined;
  };

  const getAutoComplete = async (
    input: string,
    location: LatLng,
    radius: number,
  ): Promise<IGooglePrediection[]> => {
    const strLocation = `${location.latitude},${location.longitude}`;
    const url = `${autoUrl}?key=${API_KEY}&input=${input}&location=${strLocation}&origin=${strLocation}&radius=${radius}&language=ja&components=country:jp`;
    const { data } = await axios.get<IGoogleAutoCompleteResult>(url);

    const org = data.predictions.map((iP) => ({ ...iP, origin: 'GOOGLE' }));

    setPredictions(org);

    return data.predictions;
  };

  const formatOpHour = (value: string) =>
    `${value.slice(0, 2)}:${value.slice(2, 4)}`;

  function formatPlaceOpeningHours(opHour: IPlaceOpenHour) {
    if (opHour.periods) {
      const dayHour = opHour.periods[0];
      if (dayHour && dayHour.close) {
        return `${formatOpHour(dayHour.open.time)} - ${formatOpHour(
          dayHour.close.time,
        )}`;
      }

      return '24時間営業';
    }

    return '';
  }

  const rad = (x: number) => {
    return (x * Math.PI) / 180;
  };

  const getDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ) => {
    const R = 6378137; // Earth’s mean radius in meter
    const dLat = rad(lat2 - lat1);
    const dLong = rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(lat1)) *
        Math.cos(rad(lat2)) *
        Math.sin(dLong / 2) *
        Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;

    return d; // returns the distance in meter
  };

  return {
    searchNearbyPlace,
    places,
    setPlaces,
    getDistanceMatrix,
    distanceMatrix,
    setDistanceMatrix,
    getDirection,
    getDirectionByLocation,
    direction,
    getPlacePhoto,
    getPlaceOpeningHours,
    getNextPlaces,
    getPlaceDetail,
    formatPlaceOpeningHours,
    nextToken,
    API_KEY,
    placeUrl,
    getAutoComplete,
    predictions,
    setPredictions,
    getDistance,
  };
};
