import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// from app
import { IMAGE } from 'app/src/constants';

interface Props {
  tintColor: string;
}

/** ホームタブ */
// TODO 1Dateのロゴに変更
export const HomeTabIcon = (props: Props) => (
  <Image source={IMAGE.home_icon} fadeDuration={0} style={tabStyle.logo} />
);

/** 検索タブ */
export const SearchTabIcon = (props: Props) => {
  const { tintColor } = props;

  return (
    <Ionicons
      name="md-search"
      size={26}
      style={tabStyle.icon}
      color={tintColor}
    />
  );
};

/** マイプランタブ */
export const MyPlanTabIcon = (props: Props) => {
  const { tintColor } = props;

  return (
    <Ionicons name="md-pin" size={26} style={tabStyle.icon} color={tintColor} />
  );
};

/** 通知タブ */
export const NotificationTabIcon = (props: Props) => {
  const { tintColor } = props;

  return (
    <Ionicons
      name="md-notifications"
      size={26}
      style={tabStyle.icon}
      color={tintColor}
    />
  );
};

/** プロフィールタブ */
// TODO プロフィール画像に変更
export const ProfileTabIcon = (props: Props) => {
  const { tintColor } = props;

  return (
    <Ionicons
      name="md-person"
      size={26}
      style={tabStyle.icon}
      color={tintColor}
    />
  );
};

/** スタイリング */
const tabStyle = StyleSheet.create({
  icon: {
    marginBottom: -3,
  },
  logo: {
    height: 20,
    width: 30,
  },
});
