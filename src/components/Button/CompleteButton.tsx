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

/** 完了ボタン */
export const CompleteButton: React.FC<Props> = (props: Props) => {
  const { disabled, title, onPress } = props;

  if (disabled) {
    return <Button buttonStyle={thisStyle.button} title={title} disabled />;
  }

  return (
    <Button buttonStyle={thisStyle.button} title={title} onPress={onPress} />
  );
};

/** デフォルト値 */
CompleteButton.defaultProps = {
  disabled: false,
  onPress: undefined,
};

/** スタイリング */
const thisStyle = StyleSheet.create({
  button: {
    backgroundColor: COLOR.tintColor,
    width: LAYOUT.window.width * 0.75,
  },
});
