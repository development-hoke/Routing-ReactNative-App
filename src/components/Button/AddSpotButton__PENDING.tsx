import React from 'react';
import { Button, Text } from 'native-base';
// import { AntDesign } from "@expo/vector-icons";

// from app
import { COLOR } from 'app/src/constants';
import { appTextStyle } from 'app/src/styles';

interface Props {
  spot: string;
  addSpot: boolean;
  onAddSpot: (id: string) => Promise<boolean>;
  reload: () => Promise<void>;
}

/** スポット追加ボタン */
export const AddSpotButton: React.FC<Props> = (props: Props) => {
  // const { spot, addSpot, onAddspot, reload } = props;

  /** スポット追加 */
  // const handleAddSpot = useCallback(async (): Promise<void> => {
  //   const result = await onAddspot(spot);
  //   if (result) {
  //     await reload();
  //   }
  // }, [spot]);

  return (
    <Button
      small
      rounded
      light
      color={COLOR.textTintColor}
      // onPress={addSpot}
    >
      {/* <AntDesign
        name="pluscircleo"
        size={15}
        style={{ color: COLOR.tintColor, marginLeft: 15 }}
      /> */}
      <Text style={appTextStyle.standardLightText}>＋ 追加</Text>
    </Button>
  );
};
