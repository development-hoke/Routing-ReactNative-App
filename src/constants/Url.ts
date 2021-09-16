import Constants from 'expo-constants';

const API_HOST =
  process.env.EXPO_API_ENV === 'development'
    ? Constants.manifest.extra.apiEndpoint.dev
    : Constants.manifest.extra.apiEndpoint.local;
const WEB_HOST = Constants.manifest.extra.webEndpoint;
const GOOGLE_MAP_API = Constants.manifest.extra.googlemapEndpoint.api;
const GOOGLE_MAP_KEY = Constants.manifest.extra.googlemapEndpoint.key;

const EKI_API = Constants.manifest.extra.ekispertEndpoint.api;
const EKI_KEY = Constants.manifest.extra.ekispertEndpoint.key;

/** APIエンドポイント */
export const API_ENDPOINT = {
  // ユーザー登録
  USERS: `${API_HOST}/users`,
  // ユーザー詳細取得, プロフィール編集
  USER: `${API_HOST}/users/$1`,
  // メールアドレスでログイン
  USERS_LOGIN: `${API_HOST}/users/login`,
  // パスワード変更
  USER_PASSWORD: `${API_HOST}/users/$1/password`,
  // フォローリスト取得
  USER_FOLLOWS: `${API_HOST}/users/$1/follows`,
  // フォロワーリスト取得, アカウントフォロー, アカウントフォロー解除
  USER_FOLLOWERS: `${API_HOST}/users/$1/followers`,
  // お気に入りデートプラン一覧取得
  USER_LIKES: `${API_HOST}/users/$1/likes`,
  // 通知一覧取得
  USER_NOTIFICATIONS: `${API_HOST}/users/$1/notifications`,
  // 運営からのお知らせ一覧取得
  INFORMATION: `${API_HOST}/information`,
  // 質問投稿
  QUESTIONS: `${API_HOST}/questions`,
  // よくある質問一覧取得
  QUESTIONS_FAQ: `${API_HOST}/questions/faq`,
  // デートプラン一覧取得
  PLANS: `${API_HOST}/plans`,
  // デートプラン検索
  PLANS_SEARCH: `${API_HOST}/plans/search`,
  // デートプラン詳細取得, デートプラン編集, デートプラン削除
  PLAN: `${API_HOST}/plans/$1`,
  // コメント一覧取得
  PLAN_COMMENTS: `${API_HOST}/plans/$1/comments`,
  // 検索履歴一覧取得
  PLANS_SEARCH_HISTORIES: `${API_HOST}/plans/search/history`,
  // 検索履歴削除
  PLANS_SEARCH_HISTORY: `${API_HOST}/plans/search/history/$1`,
  // お気に入り登録者一覧取得, お気に入り登録, お気に入り解除
  PLAN_LIKES: `${API_HOST}/plans/$1/likes`,
  PLAN_GET: `${API_HOST}/plans?`,
  PLAN_FAVS: `${API_HOST}/plans/$1/favorites`,

  SPOT_CREATE: `${API_HOST}/spots`,
  SPOT_FETCH: `${API_HOST}spots/search`,
};

/** WebViewエンドポイント */
export const WEB_ENDPOINT = {
  // 利用規約
  TERMS: `${WEB_HOST}/terms`,
  // プライバシーポリシー
  PRIVACY_POLICY: `${WEB_HOST}/privacy`,
  // 特定商取引法
  SCC: `${WEB_HOST}/scc`,
};

export const EKI_ENDPOINT = {
  NEARBYPLACE: `${EKI_API}/json/geo/station?key=${EKI_KEY}&geoPoint=$1,$2,wgs84,1000&gcs=wgs84&type=$3`,
  COURSE: `${EKI_API}/json/search/course/extreme?key=${EKI_KEY}&viaList=$1,$2,wgs84:$3,$4`,
};

export const GOOGLE_MAP_ENDPOINT = {
  DISTANCE: `https://maps.googleapis.com/maps/api/distancematrix`,
  DIRECTION: `https://maps.googleapis.com/maps/api/directions`,
  PLACE: 'https://maps.googleapis.com/maps/api/place',
  // COURSE: `${EKI_API}/json/search/course/extreme?key=${EKI_KEY}&viaList=$1,$2,wgs84:$3,$4`,
  PLACE_PHOTO: `https://maps.googleapis.com/maps/api/place/photo`,
  BASE: `https://maps.googleapis.com/maps/api`,
  AUTO: `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
  PWD: '[9v~6V*Ec.;eVEC{',
  KEY: `${GOOGLE_MAP_KEY}`,
};

export const HOT_PEPPER = {
  SEARCH: `http://webservice.recruit.co.jp/hotpepper/shop/v1`,
  DETAIL: `http://webservice.recruit.co.jp/hotpepper/gourmet/v1`,
  KEY: `aa1863c09c328729`,
};

export const AUTH_ERROR = 'Not enough or too many segments';
