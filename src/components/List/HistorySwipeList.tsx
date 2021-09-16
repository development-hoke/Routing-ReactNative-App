import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

// from app
import { COLOR, LAYOUT } from 'app/src/constants';
import { IHistory } from 'app/src/interfaces/api/History';
import { appTextStyle } from 'app/src/styles';

interface Props {
  histories: Array<IHistory>;
  onDelete: (id: number) => void;
}

/** 検索履歴スワイプリスト */
export const HistorySwipeList: React.FC<Props> = (props: Props) => {
  const { histories, onDelete } = props;

  const renderHistoryItem = ({ item }: { item: IHistory }): JSX.Element => {
    return (
      <View style={thisStyle.word}>
        <Text style={appTextStyle.standardLightText}>{item.word}</Text>
      </View>
    );
  };

  const renderDeletableHistoryItem = ({
    item,
  }: {
    item: IHistory;
  }): JSX.Element => {
    const handleDelete = () => {
      onDelete(item.history_id);
    };

    return (
      <View style={thisStyle.delete}>
        <TouchableOpacity onPress={handleDelete}>
          <Text style={appTextStyle.whiteText}>削除</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SwipeListView
      keyExtractor={(item) => `${item.history_id}`}
      data={histories}
      renderItem={renderHistoryItem}
      renderHiddenItem={renderDeletableHistoryItem}
      rightOpenValue={-LAYOUT.window.width * 0.25}
      disableRightSwipe
    />
  );
};

/** スタイリング */
const thisStyle = StyleSheet.create({
  delete: {
    backgroundColor: COLOR.tintColor,
    borderBottomColor: COLOR.inactiveColor,
    borderBottomWidth: 1,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 20,
    paddingVertical: 15,
  },
  word: {
    backgroundColor: 'white',
    borderBottomColor: COLOR.inactiveColor,
    borderBottomWidth: 1,
    paddingLeft: 20,
    paddingVertical: 15,
  },
});
