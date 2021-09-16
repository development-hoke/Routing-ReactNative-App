# one-date-client

1Date のフロントエンドのリポジトリです。

_バックエンドはこちら [one-date-server](https://github.com/1date-inc/one-date-server)_

## Technology

- React `16.9.x`
- React Native `Expo SDK 37.0.0`
- TypeScript `3.8.x`

## Getting Started

### Node のインストール

- Homebrew / nodebrew を用いて Node.js をインストールしてください（v12 系推奨）

### Expo の準備

- [expo.io](https://expo.io) にアカウント登録
- [Expo Client](https://itunes.apple.com/jp/app/expo-client/id982107779) をスマホにインストール

```bash
# Expo CLIのインストール
$ npm i -g expo-cli

# コンソールログイン
$ expo login
```

### ソースコードのクローン

```bash
$ git clone git@github.com:1date-inc/one-date-client.git
$ cd one-date-client
```

### 必要なライブラリのインストール

```bash
$ yarn
```

### ローカルサーバーの起動

- [one-date-server](https://github.com/1date-inc/one-date-server) 参照
- ローカルサーバーに繋ぐ場合に必要な手順です（ `yarn start:dev` で起動する場合はスキップ可能です）

### クライアントアプリの起動

```bash
# 起動(接続先:ローカルサーバー)
$ yarn start

# キャッシュクリアして起動(接続先:ローカルサーバー)
$ yarn start -c

# 起動(接続先:検証環境)
$ yarn start:dev
```

- **iOS シミュレータ**  
  ブラウザコンソール http://localhost:19002 で `Run on iOS simulator` をクリックして起動します。

- **実機（Expo Client）** _Utilities「実機でのローカルサーバー接続方法」参照_  
  コンソールに表示される QR コードをスマホで読み取り Expo Client アプリで起動します。  
  ※ PC とスマホは同一 LAN に繋がっている必要があります。

## Utilities

### 実機でのローカルサーバー接続方法

- プライベート IP アドレスを取得する。

```bash
$ yarn ip
...
xxx.xxx.xxx.xxx
```

- 上記で取得した IP アドレスを `app.json` の `expo.extra.apiEndpoint` のホスト部分に設定する（変更後要再起動）

```json
"apiEndpoint": "http://xxx.xxx.xxx.xxx:3080"
```

### iOS シミュレータ GIF キャプチャ

```bash
# キャプチャスタート（Command + C で終了）
$ yarn capture:start

# GIF に変換
$ yarn capture:togif
```

### Lint エラーチェック・自動整形

```bash
$ yarn lint
```
