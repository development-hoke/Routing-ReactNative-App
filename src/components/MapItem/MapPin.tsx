import React from 'react';
import { View, Text } from 'react-native';
import { Marker, Callout } from 'react-native-maps';

interface Props {
  children: string;
  center?: boolean;
  location: {
    longitude: number;
    latitude: number;
    timestamp: number;
  };
  accuracy: number;
  onCalloutPress?: () => void;
}

/** ピン付けマーカー */
export const MapPin: React.FC<Props> = (props: Props) => {
  const { children, center, location, onCalloutPress } = props;
  const pinColor = center ? 'black' : 'red';

  return (
    <Marker coordinate={location} pinColor={pinColor}>
      {onCalloutPress && (
        <Callout tooltip onPress={onCalloutPress}>
          <View
            style={{
              padding: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(0,0,0,0.6)',
              zIndex: 10,
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              {children}
            </Text>
          </View>
        </Callout>
      )}
    </Marker>
  );
};
