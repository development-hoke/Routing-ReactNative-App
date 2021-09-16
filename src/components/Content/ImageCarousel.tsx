import React from 'react';
import { Image, StyleSheet } from 'react-native';
import Carousel from 'react-native-snap-carousel';

// from app
import { IMAGE, LAYOUT } from 'app/src/constants';
import { IPlan } from 'app/src/interfaces/api/Plan';

interface Props {
  plan: IPlan;
}

// 仮データ
const SAMPLE_DATA = [
  {
    image: IMAGE.noImage,
  },
  {
    image: IMAGE.noImage,
  },
  {
    image: IMAGE.noImage,
  },
];

/** 画像スライドカルーセル */
export const ImageCarousel: React.FC<Props> = (props: Props) => {
  const renderImageItem = ({ item }: { item: any }): JSX.Element => {
    return <Image style={thisStyle.image} source={item.image} />;
  };

  return (
    <Carousel
      data={SAMPLE_DATA}
      renderItem={renderImageItem}
      sliderWidth={LAYOUT.window.width}
      itemWidth={LAYOUT.window.width * 0.8}
      containerCustomStyle={thisStyle.container}
      slideStyle={thisStyle.slide}
      // layout={"default"}
      // firstItem={0}
    />
  );
};

/** スタイリング */
const thisStyle = StyleSheet.create({
  container: {
    // flex: 1,
    marginVertical: 5,
  },
  slide: {
    // flex: 1,
    height: LAYOUT.window.height * 0.23,
    shadowColor: '#ccc',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  image: {
    flex: 1,
    width: LAYOUT.window.width * 0.8,
  },
});
