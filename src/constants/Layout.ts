import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

/** レイアウト定数 */
export const LAYOUT = {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
};
