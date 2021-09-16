import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

// from app
import { LAYOUT, COLOR } from 'app/src/constants';

interface Props {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
}

/** 完了ボタン(ミニ) */
export const SmallCompleteButton: React.FC<Props> = (props: Props) => {
  const { disabled, title, onPress } = props;

  if (disabled) {
    return <Button buttonStyle={thisStyle.button} title={title} disabled />;
  }

  return (
    <Button buttonStyle={thisStyle.button} title={title} onPress={onPress} />
  );
};

/** デフォルト値 */
SmallCompleteButton.defaultProps = {
  disabled: false,
};

/** スタイリング */
const thisStyle = StyleSheet.create({
  button: {
    backgroundColor: COLOR.tintColor,
    width: LAYOUT.window.width * 0.4,
  },
});
