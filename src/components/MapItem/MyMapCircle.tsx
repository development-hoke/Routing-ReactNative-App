import React, { useEffect, useRef } from 'react';
import { Circle } from 'react-native-maps';

interface Props {
  location: {
    longitude: number;
    latitude: number;
  };
  color: string;
  radius: number;
}

/** 範囲円 */
export const MyMapCircle: React.FC<Props> = (props: Props) => {
  const { location, color, radius } = props;

  return (
    <Circle
      center={{
        latitude: location.latitude,
        longitude: location.longitude,
      }}

      strokeColor="transparent"
      fillColor={color}
      radius={radius}
    />
  );
};
