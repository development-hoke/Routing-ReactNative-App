import React from 'react';
import { Picker } from 'native-base';

// from app
import { COLOR } from 'app/src/constants';
import { appTextStyle } from 'app/src/styles';

interface Props {
  prefecture: string;
  setPrefecture: React.Dispatch<React.SetStateAction<string>>;
}

/** 都道府県選択フォーム */
export const PrefecturePicker: React.FC<Props> = (props: Props) => {
  const { prefecture, setPrefecture } = props;

  return (
    <Picker
      mode="dropdown"
      placeholder="都道府県を選択"
      placeholderStyle={{ color: COLOR.tintColor, marginLeft: 10 }}
      style={{ width: 160, marginLeft: 10 }}
      textStyle={appTextStyle.defaultText}
      note={false}
      selectedValue={prefecture}
      onValueChange={(itemValue) => setPrefecture(itemValue)}
    >
      <Picker.Item label="北海道" value="hokkaido" />
      <Picker.Item label="青森" value="aomori" />
      <Picker.Item label="岩手" value="iwate" />
      <Picker.Item label="宮城" value="miyagi" />
      <Picker.Item label="秋田" value="akita" />
      <Picker.Item label="山形" value="yamagata" />
      <Picker.Item label="福島" value="fukushima" />
      <Picker.Item label="茨城" value="ibaraki" />
      <Picker.Item label="栃木" value="tochigi" />
      <Picker.Item label="群馬" value="gunma" />
      <Picker.Item label="埼玉" value="saitama" />
      <Picker.Item label="千葉" value="chiba" />
      <Picker.Item label="東京" value="tokyo" />
      <Picker.Item label="神奈川" value="kanagawa" />
      <Picker.Item label="新潟" value="niigata" />
      <Picker.Item label="富山" value="toyama" />
      <Picker.Item label="石川" value="ishikawa" />
      <Picker.Item label="福井" value="fukui" />
      <Picker.Item label="山梨" value="yamanashi" />
      <Picker.Item label="長野" value="nagano" />
      <Picker.Item label="岐阜" value="gifu" />
      <Picker.Item label="静岡" value="shizuoka" />
      <Picker.Item label="愛知" value="aichi" />
      <Picker.Item label="三重" value="mie" />
      <Picker.Item label="滋賀" value="shiga" />
      <Picker.Item label="京都" value="kyoto" />
      <Picker.Item label="大阪" value="osaka" />
      <Picker.Item label="兵庫" value="hyogo" />
      <Picker.Item label="奈良" value="nara" />
      <Picker.Item label="和歌山" value="wakayama" />
      <Picker.Item label="鳥取" value="tottori" />
      <Picker.Item label="島根" value="shimane" />
      <Picker.Item label="岡山" value="okayama" />
      <Picker.Item label="広島" value="hiroshima" />
      <Picker.Item label="山口" value="yamaguchi" />
      <Picker.Item label="徳島" value="tokushima" />
      <Picker.Item label="香川" value="kagawa" />
      <Picker.Item label="愛媛" value="ehime" />
      <Picker.Item label="高知" value="kochi" />
      <Picker.Item label="福岡" value="fukuoka" />
      <Picker.Item label="佐賀" value="saga" />
      <Picker.Item label="長崎" value="nagasaki" />
      <Picker.Item label="熊本" value="kumamoto" />
      <Picker.Item label="大分" value="oita" />
      <Picker.Item label="宮崎" value="miyazaki" />
      <Picker.Item label="鹿児島" value="kagoshima" />
      <Picker.Item label="沖縄" value="okinawa" />
    </Picker>
  );
};
