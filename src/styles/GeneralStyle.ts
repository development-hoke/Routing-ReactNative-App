import { StyleSheet } from 'react-native';

/** 汎用ビュースタイリング */
export const appStyle = StyleSheet.create({
  /** 無スクロールビューのコンテナ */
  appContainer: {
    flex: 1,
  },

  /** 固定ビュー用中央配置コンテナ */
  standardContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },

  /** 固定ビュー用間隔(余白)調整コンテナ */
  emptySpace: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },

  /** 要素を横に並べるコンテナ */
  row: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
