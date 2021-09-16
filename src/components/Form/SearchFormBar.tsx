import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

// from app
import { COLOR } from 'app/src/constants';

interface Props {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  onSearch: () => void;
}

/** 検索フォームバー */
export const SearchFormBar: React.FC<Props> = (props: Props) => {
  const { value, setValue, onSearch } = props;

  /** テキスト変更 */
  const handleChangeValue = useCallback((value) => setValue(value), [value]);

  /** テキストクリア */
  const handleClear = useCallback(() => {
    setValue('');
  }, []);

  return (
    <SearchBar
      placeholder="検索"
      round
      lightTheme
      searchIcon={
        <Ionicons name="ios-search" size={26} color={COLOR.textTintColor} />
      }
      clearIcon={
        <Ionicons name="ios-close" size={26} color={COLOR.textTintColor} />
      }
      onChangeText={handleChangeValue}
      onEndEditing={onSearch}
      onClear={handleClear}
      value={value}
      containerStyle={thisStyle.searchBar}
      inputContainerStyle={thisStyle.searchInput}
      returnKeyType="search"
    />
  );
};

/** スタイリング */
const thisStyle = StyleSheet.create({
  searchBar: {
    backgroundColor: 'white',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  searchInput: {
    backgroundColor: '#eee',
  },
});
