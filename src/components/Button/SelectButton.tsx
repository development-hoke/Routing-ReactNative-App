import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Text } from 'native-base';

// from app
import { COLOR } from 'app/src/constants';

interface Props {
  // 現在のオンオフ状態
  value: boolean;
  // 当該ボタンのオンオフ状態を更新する関数
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
  // 他のボタンのオンオフ状態を更新する関数のリスト
  setOtherValues?: Array<React.Dispatch<React.SetStateAction<boolean>>>;
  // オン状態をオフ状態に変更可能か
  reversible?: boolean;
  // ボタンの表示名
  buttonName: string;
}

/** 選択ボタン */
export const SelectButton: React.FC<Props> = (props: Props) => {
  const { value, setValue, setOtherValues, reversible, buttonName } = props;

  /** ボタンをオン状態にする */
  const handleChangeTrue = useCallback(() => {
    setValue(true);

    // 他のボタンを当該ボタンの逆の状態にする
    if (
      setOtherValues !== undefined &&
      setOtherValues !== null &&
      setOtherValues.length
    ) {
      setOtherValues.forEach(
        (setValue: React.Dispatch<React.SetStateAction<boolean>>) => {
          setValue(false);
        },
      );
    }
  }, [value]);

  /** ボタンをオフ状態にする */
  const handleChangeFalse = useCallback(() => {
    if (!reversible) return;

    setValue(false);

    // 他のボタンを当該ボタンの逆の状態にする
    if (
      setOtherValues !== undefined &&
      setOtherValues !== null &&
      setOtherValues.length
    ) {
      setOtherValues.forEach(
        (setValue: React.Dispatch<React.SetStateAction<boolean>>) => {
          setValue(false);
        },
      );
    }
  }, [value]);

  if (!value) {
    return (
      <Button
        small
        light
        style={thisStyle.inactiveButton}
        onPress={handleChangeTrue}
      >
        <Text style={thisStyle.inactiveText}>{buttonName}</Text>
      </Button>
    );
  }

  return (
    <Button small style={thisStyle.activeButton} onPress={handleChangeFalse}>
      <Text style={thisStyle.activeText}>{buttonName}</Text>
    </Button>
  );
};

/** デフォルト値 */
SelectButton.defaultProps = {
  reversible: false,
};

/** スタイリング */
const thisStyle = StyleSheet.create({
  inactiveButton: {
    backgroundColor: '#ddd',
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: COLOR.tintColor,
    marginHorizontal: 5,
  },
  inactiveText: {
    backgroundColor: '#ddd',
    color: COLOR.textTintColor,
    fontFamily: 'genju-medium',
  },
  activeText: {
    backgroundColor: COLOR.tintColor,
    color: 'white',
    fontFamily: 'genju-medium',
  },
});
