import { IPlace } from '../interfaces/app/Map';

export interface SpotType {
  id: string;
  title: string;
  elapse: number;
  group: number;
  icon: any;
  origin: 'HOTPEPPER' | 'GOOGLE';
}

const restaurant = require('app/assets/images/map/gi/restaurant.png');
const cafe = require('app/assets/images/map/gi/cafe.png');
const bar = require('app/assets/images/map/gi/bar.png');
const shopping = require('app/assets/images/map/gi/shopping.png');
const jewelry = require('app/assets/images/map/gi/jewelry.png');
const pet = require('app/assets/images/map/gi/pet.png');
const supermarket = require('app/assets/images/map/gi/supermarket.png');
const lodging = require('app/assets/images/map/gi/lodging.png');
const bowling = require('app/assets/images/map/gi/bowling.png');
const amusement = require('app/assets/images/map/gi/amusement.png');
const camping = require('app/assets/images/map/gi/camping.png');
const zoo = require('app/assets/images/map/gi/zoo.png');
const aquarium = require('app/assets/images/map/gi/aquarium.png');
const art_gallery = require('app/assets/images/map/gi/art_gallery.png');
const museum = require('app/assets/images/map/gi/museum.png');
const movies = require('app/assets/images/map/gi/movies.png');
const library = require('app/assets/images/map/gi/library.png');
const park = require('app/assets/images/map/gi/park.png');
const business = require('app/assets/images/map/gi/business.png');

export const SPOT_TYPE: SpotType[] = [
  // { id: 'restaurant', title: '飲食店', elapse: 60, group: 0, icon: restaurant },
  // { id: 'cafe', title: 'カフェ', elapse: 60, group: 0, icon: cafe },
  // { id: 'bar', title: 'バー', elapse: 60, group: 0, icon: bar },
  // { id: 'bakery', title: 'パン屋', elapse: 10, group: 0, icon: restaurant },
  {
    id: 'G001',
    title: '居酒屋',
    elapse: 60,
    group: 0,
    icon: restaurant,
    origin: 'HOTPEPPER',
  },
  {
    id: 'G002',
    title: 'ダイニングバー・バル',
    elapse: 60,
    group: 0,
    icon: restaurant,
    origin: 'HOTPEPPER',
  },
  {
    id: 'G003',
    title: '創作料理',
    elapse: 60,
    group: 0,
    icon: restaurant,
    origin: 'HOTPEPPER',
  },
  {
    id: 'G004',
    title: '和食',
    elapse: 60,
    group: 0,
    icon: restaurant,
    origin: 'HOTPEPPER',
  },
  {
    id: 'G005',
    title: '洋食',
    elapse: 60,
    group: 0,
    icon: restaurant,
    origin: 'HOTPEPPER',
  },
  {
    id: 'G006',
    title: 'イタリアン・フレンチ',
    elapse: 60,
    group: 0,
    icon: restaurant,
    origin: 'HOTPEPPER',
  },
  {
    id: 'G007',
    title: '中華',
    elapse: 60,
    group: 0,
    icon: restaurant,
    origin: 'HOTPEPPER',
  },
  {
    id: 'G008',
    title: '焼肉・ホルモン',
    elapse: 60,
    group: 0,
    icon: restaurant,
    origin: 'HOTPEPPER',
  },
  {
    id: 'G009',
    title: 'アジア・エスニック料理',
    elapse: 60,
    group: 0,
    icon: restaurant,
    origin: 'HOTPEPPER',
  },
  {
    id: 'G010',
    title: '各国料理',
    elapse: 60,
    group: 0,
    icon: restaurant,
    origin: 'HOTPEPPER',
  },
  {
    id: 'G011',
    title: 'カラオケ・パーティ',
    elapse: 60,
    group: 0,
    icon: restaurant,
    origin: 'HOTPEPPER',
  },
  {
    id: 'G012',
    title: 'バー・カクテル',
    elapse: 60,
    group: 0,
    icon: restaurant,
    origin: 'HOTPEPPER',
  },
  {
    id: 'G013',
    title: 'ラーメン',
    elapse: 60,
    group: 0,
    icon: restaurant,
    origin: 'HOTPEPPER',
  },
  {
    id: 'G014',
    title: 'カフェ・スイーツ',
    elapse: 60,
    group: 0,
    icon: restaurant,
    origin: 'HOTPEPPER',
  },
  {
    id: 'G015',
    title: 'その他グルメ',
    elapse: 60,
    group: 0,
    icon: restaurant,
    origin: 'HOTPEPPER',
  },
  {
    id: 'G016',
    title: 'お好み焼き・もんじゃ',
    elapse: 60,
    group: 0,
    icon: restaurant,
    origin: 'HOTPEPPER',
  },
  {
    id: 'G017',
    title: '韓国料理',
    elapse: 60,
    group: 0,
    icon: restaurant,
    origin: 'HOTPEPPER',
  },

  {
    id: 'clothing_store',
    title: '衣類品店',
    elapse: 30,
    group: 1,
    icon: restaurant,
    origin: 'GOOGLE',
  },
  {
    id: 'jewelry_store',
    title: '宝石店',
    elapse: 30,
    group: 1,
    icon: jewelry,
    origin: 'GOOGLE',
  },
  {
    id: 'shoe_store',
    title: '靴屋',
    elapse: 30,
    group: 1,
    icon: shopping,
    origin: 'GOOGLE',
  },
  {
    id: 'furniture_store',
    title: '家具屋',
    elapse: 60,
    group: 1,
    icon: shopping,
    origin: 'GOOGLE',
  },
  {
    id: 'home_goods_store',
    title: '家庭用品店',
    elapse: 60,
    group: 1,
    icon: shopping,
    origin: 'GOOGLE',
  },
  {
    id: 'book_store',
    title: '書店',
    elapse: 30,
    group: 1,
    icon: shopping,
    origin: 'GOOGLE',
  },
  {
    id: 'pet_store',
    title: 'ペットショップ',
    elapse: 20,
    group: 1,
    icon: pet,
    origin: 'GOOGLE',
  },
  // {
  //   id: 'supermarket',
  //   title: 'スーパーマーケット',
  //   elapse: 30,
  //   group: 1,
  //   icon: supermarket,
  //   origin: 'GOOGLE',
  // },

  {
    id: 'department_store',
    title: 'デパート',
    elapse: 120,
    group: 2,
    icon: shopping,
    origin: 'GOOGLE',
  },
  {
    id: 'shopping_mall',
    title: 'ショッピングモール',
    elapse: 120,
    group: 2,
    icon: supermarket,
    origin: 'GOOGLE',
  },
  {
    id: 'lodging',
    title: '宿泊施設',
    elapse: 720,
    group: 4,
    icon: lodging,
    origin: 'GOOGLE',
  },

  {
    id: 'bowling_alley',
    title: 'ボーリング場',
    elapse: 120,
    group: 3,
    icon: bowling,
    origin: 'GOOGLE',
  },
  {
    id: 'amusement_park',
    title: '遊園地',
    elapse: 300,
    group: 3,
    icon: amusement,
    origin: 'GOOGLE',
  },
  {
    id: 'campground',
    title: 'キャンプ場',
    elapse: 300,
    group: 3,
    icon: camping,
    origin: 'GOOGLE',
  },
  {
    id: 'park',
    title: '公園',
    elapse: 60,
    group: 3,
    icon: park,
    origin: 'GOOGLE',
  },
  {
    id: 'tourist_attraction',
    title: '観光名所',
    elapse: 60,
    group: 3,
    icon: business,
    origin: 'GOOGLE',
  },
  {
    id: 'spa',
    title: '温泉',
    elapse: 60,
    group: 3,
    icon: business,
    origin: 'GOOGLE',
  },
  {
    id: 'zoo',
    title: '動物園',
    elapse: 180,
    group: 3,
    icon: zoo,
    origin: 'GOOGLE',
  },
  {
    id: 'aquarium',
    title: '水族館',
    elapse: 180,
    group: 3,
    icon: aquarium,
    origin: 'GOOGLE',
  },
  {
    id: 'art_gallery',
    title: '美術館',
    elapse: 180,
    group: 3,
    icon: art_gallery,
    origin: 'GOOGLE',
  },
  {
    id: 'museum',
    title: '博物館',
    elapse: 180,
    group: 3,
    icon: museum,
    origin: 'GOOGLE',
  },
  {
    id: 'movie_theater',
    title: '映画館',
    elapse: 180,
    group: 3,
    icon: movies,
    origin: 'GOOGLE',
  },
  // {
  //   id: 'library',
  //   title: '図書館',
  //   elapse: 60,
  //   group: 3,
  //   icon: library,
  //   origin: 'GOOGLE',
  // },
  // {
  //   id: 'night_club',
  //   title: 'ナイトクラブ',
  //   elapse: 120,
  //   group: 3,
  //   icon: bar,
  //   origin: 'GOOGLE',
  // },
];

export const SPOT_TYPE_GROUP = [
  '飲食系',
  'ショップ系',
  '大型施設系',
  'レジャー施設系',
  '宿泊施設系',
];

export const getSpotTypesByGroup = (group: number) =>
  SPOT_TYPE.filter((item) => item.group === group);

export function getTypeIndex(id: string) {
  let res = -1;
  for (let i = 0; i < SPOT_TYPE.length; i += 1) {
    if (id === SPOT_TYPE[i].id) {
      res = i;
      break;
    }
  }

  return res;
}

export const getIconUrl = (place: IPlace) => {
  const idx = getTypeIndex(place.types[0]);
  const asset = idx < 0 ? null : SPOT_TYPE[idx].icon;

  return asset;
};

export function getRightSpotType(types: string[]) {
  let typeIdx = -1;
  types.forEach((value) => {
    if (getTypeIndex(value) >= 0) typeIdx = getTypeIndex(value);
  });

  return typeIdx;
}

export const isGooglePlace = (placeID: string) =>
  !(placeID.startsWith('J') && placeID.length === 10);

export const getElapse = (genreCode: string) => {
  const typeIdx = getTypeIndex(genreCode);

  return typeIdx < 0 ? 10 : SPOT_TYPE[typeIdx].elapse;
};
