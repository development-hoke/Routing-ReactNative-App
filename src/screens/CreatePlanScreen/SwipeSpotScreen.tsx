import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Text, Body, Container } from 'native-base';
import { View, Image, StyleSheet, SectionList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CardStack, { Card } from 'react-native-card-stack-swiper';
// from app
import { useGooglePlace, useSpot } from 'app/src/hooks';
import { useDispatch, useGlobalState } from 'app/src/Store';
import { useNavigation } from '@react-navigation/native';
import { ActionType } from 'app/src/Reducer';
import { getDistance, earthRadius } from 'geolib';

import {
  COLOR,
  SPOT_TYPE,
  SPOT_TYPE_GROUP,
  LAYOUT,
  getSpotTypesByGroup,
  SpotType,
  getElapse,
} from 'app/src/constants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button, Overlay, CheckBox } from 'react-native-elements';
import { FontAwesome5 } from '@expo/vector-icons';

import { LoadingSpinner } from 'app/src/components/Spinners';
import { IPlace, IHPShop, IPlaceUnity } from 'app/src/interfaces/app/Map';
import { useHotPepper } from 'app/src/hooks/useHotPepper';

/** デートスポット候補スワイプ画面 */
const SwipeSpotScreen: React.FC = () => {
  const { searchNearbyPlace, getPlacePhoto, places } = useGooglePlace();
  const { searchNearbyPlaceH } = useHotPepper();
  const dispatch = useDispatch();
  const { navigate } = useNavigation();

  const createPlan = useGlobalState('createPlan');
  const loginUser = useGlobalState('loginUser');
  const { fetchSpot } = useSpot(loginUser.authorization);

  const [typesPopup, setTypesPopup] = useState(false);
  const [isPlacesLoading, setIsPlacesLoading] = useState<boolean>(true);
  const [spots, setSpots] = useState<IPlaceUnity[]>([]);
  const [excludeTypes, setExcludeTypes] = useState<string[]>([]);
  const [currentSwipped, setCurrentSwipped] = useState<number>(-1);

  const [deletedSpots, setDeletedSpots] = useState<string[]>([]);
  const [likedSpots, setLikedSpots] = useState<string[]>([]);
  const [heartedSpots, setHeartedSpots] = useState<string[]>([]);

  const [likeEffect, setLikeEffect] = useState<boolean>(false);
  const [throwEffect, setThrowEffect] = useState<boolean>(false);

  const cardStack = useRef();

  const showSpots = useMemo(() => {
    const allspots = [...spots];

    const includeTypes: string[] = [];
    SPOT_TYPE.forEach((item) => {
      if (excludeTypes.indexOf(item.id) < 0) includeTypes.push(item.id);
    });

    const included = allspots.filter(
      (item) => includeTypes.indexOf(item.category) >= 0,
    );

    return included.filter(
      (item) =>
        createPlan.spots.findIndex((ci) => ci.place_id === item.place_id) < 0,
    );
  }, [excludeTypes, deletedSpots, spots]);

  function onPressSpotType(index: string) {
    const orgExcludeTypes = [...excludeTypes];
    const exists = excludeTypes.indexOf(index);
    if (exists >= 0) {
      orgExcludeTypes.splice(exists, 1);
      setExcludeTypes(orgExcludeTypes);
    } else {
      setExcludeTypes((prev) => [...prev, index]);
    }
  }

  function onPressSpotCat(cat: string) {
    if (cat === '全て選択') {
      setExcludeTypes([]);
    } else if (cat === '全て選択解除') {
      setExcludeTypes(SPOT_TYPE.map((stype) => stype.id));
    } else {
      const orgExcludeTypes = [...excludeTypes];
      const spotTypes = getSpotTypesByGroup(SPOT_TYPE_GROUP.indexOf(cat));
      if (spotTypeChecked.cat[SPOT_TYPE_GROUP.indexOf(cat)]) {
        const newExcludeTypes = spotTypes.map((item) => item.id);
        setExcludeTypes([...orgExcludeTypes, ...newExcludeTypes]);
      } else {
        setExcludeTypes(
          orgExcludeTypes.filter(
            (id) => spotTypes.findIndex((stype) => stype.id === id) < 0,
          ),
        );
      }
    }
  }

  const spotTypeChecked = useMemo(() => {
    if (excludeTypes.length === 0) {
      return {
        total: true,
        cat: SPOT_TYPE_GROUP.map((item) => true),
      };
    }

    return {
      total: false,
      cat: SPOT_TYPE_GROUP.map((item, index) => {
        const deselected = getSpotTypesByGroup(index).filter(
          (t) => excludeTypes.indexOf(t.id) >= 0,
        );

        return deselected.length === 0;
      }),
    };
  }, [excludeTypes]);

  useEffect(() => {
    setIsPlacesLoading(true);
    loadSpots();
    async function loadSpots() {
      const newSpots: IPlaceUnity[] = [];
      await Promise.all(
        SPOT_TYPE.map(async (type) => {
          let places: IPlaceUnity[] = [];
          if (type.origin === 'GOOGLE') {
            const gPlaces = await searchNearbyPlace(
              createPlan.center,
              createPlan.radius * 100,
              type.id,
            );
            places = gPlaces.map((detail) => ({
              id: detail.id,
              place_id: detail.place_id,
              name: detail.name,
              formatted_address: detail.formatted_address,
              category: type.id,
              opening_hours: '',
              formatted_phone_number: detail.formatted_phone_number,
              website: detail.website,
              images: [detail.photolink],
              latitude: detail.geometry.location.lat,
              longitude: detail.geometry.location.lng,
              spot_type: 'GOOGLE',
              icon: detail.icon,
              user_ratings_total: detail.user_ratings_total,
            }));
          } else {
            const hPlaces = await searchNearbyPlaceH(
              createPlan.center,
              createPlan.radius * 100,
              type.id,
            );
            places = hPlaces.map((detail) => ({
              id: detail.id,
              place_id: detail.place_id,
              name: detail.name,
              formatted_address: detail.address,
              category: type.id,
              opening_hours: detail.open,
              formatted_phone_number: '',
              website: '',
              images: [detail.photolink],
              latitude: detail.geometry.location.lat,
              longitude: detail.geometry.location.lng,
              spot_type: 'HOTPEPPER',
              icon: detail.icon,
              user_ratings_total: 0,
            }));
          }
          if (places.length > 0) {
            // get places from api
            for (let i = 0; i < places.length; i += 1) {
              const item = places[i];
              let exists = false;
              for (let j = 0; j < newSpots.length; j += 1) {
                if (newSpots[j].place_id === item.place_id) {
                  exists = true;
                }
              }
              if (!exists && item.images.length > 0 && item.images[0])
                newSpots.push({ ...item });
            }
          }
        }),
      );
      const oSpots = await fetchSpot(
        '',
        createPlan.center,
        createPlan.radius * 100,
      );
      const oConverts = oSpots
        .filter(
          (value, index, self) =>
            self.findIndex((se) => se.place_id === value.place_id) === index,
        )
        .map((oc) => {
          const unity: IPlaceUnity = {
            id: oc.spot_id,
            name: oc.spot_name,
            ...oc,
            icon: oc.icon_url,
            user_ratings_total: 0,
          };

          return unity;
        });
      const filtered = newSpots.filter(
        (pItem) =>
          oConverts.findIndex((aItem) => aItem.place_id === pItem.place_id) < 0,
      );
      const org = [...filtered];
      const randomSpots = [...oConverts];
      while (org.length > 0) {
        const randomIdx = Math.floor(Math.random() * org.length);
        randomSpots.push(org[randomIdx]);
        org.splice(randomIdx, 1);
      }
      setSpots(
        randomSpots.filter(
          (item) =>
            getDistance(
              {
                latitude: createPlan.center.latitude,
                longitude: createPlan.center.longitude,
              },
              {
                latitude: item.latitude,
                longitude: item.longitude,
              },
            ) <=
            createPlan.radius * 100,
        ),
      );
      setIsPlacesLoading(false);
    }
  }, []);

  if (isPlacesLoading) {
    return LoadingSpinner;
  }

  function deleteSpot(idx: number) {
    setDeletedSpots((prev) => [...prev, showSpots[idx].place_id]);
  }

  function likeSpot(idx: number) {
    setLikedSpots((prev) => [...prev, showSpots[idx].place_id]);
  }

  function rewindSpot() {
    if (currentSwipped < 0) return;
    setDeletedSpots((prev) =>
      prev.filter((item) => item !== showSpots[currentSwipped].place_id),
    );
    setLikedSpots((prev) =>
      prev.filter((item) => item !== showSpots[currentSwipped].place_id),
    );
    setHeartedSpots((prev) =>
      prev.filter((item) => item !== showSpots[currentSwipped].place_id),
    );
    if (deletedSpots.indexOf(showSpots[currentSwipped].place_id) >= 0)
      cardStack.current.goBackFromLeft();
    else if (likedSpots.indexOf(showSpots[currentSwipped].place_id) >= 0)
      cardStack.current.goBackFromRight();
    setCurrentSwipped((prev) => prev - 1);
  }

  function onCompleteButtonPress() {
    const mapSpots = createPlan.spots.map((item) => {
      return {
        place: item,
        cost: getElapse(item.category),
        check: heartedSpots.indexOf(item.place_id) >= 0,
      };
    });
    const candidates = spots
      .filter((item) => {
        return likedSpots.indexOf(item.place_id) >= 0;
      })
      .map((item) => {
        return {
          place: item,
          cost: getElapse(item.category),
          check: heartedSpots.indexOf(item.place_id) >= 0,
        };
      });
    const hearted = spots
      .filter((item) => {
        return heartedSpots.indexOf(item.place_id) >= 0;
      })
      .map((item) => {
        return {
          place: item,
          cost: getElapse(item.category),
          check: true,
        };
      });
    dispatch({
      type: ActionType.SET_CREATE_PLAN,
      payload: {
        ...createPlan,
        candidatedSpots: candidates.concat(mapSpots),
        heartedSpots: hearted,
      },
    });
    navigate('Select');
  }

  function getSectionData() {
    const result: {
      title: string;
      data: SpotType[];
    }[] = [
      {
        title: '全て選択',
        data: [],
      },
      {
        title: '全て選択解除',
        data: [],
      },
    ];
    SPOT_TYPE_GROUP.forEach((item, index) => {
      result.push({
        title: item,
        data: getSpotTypesByGroup(index),
      });
    });

    return result;
  }

  // const handleSideEffect = debounce((x: number) => {
  //   setLikeEffect(x > LAYOUT.window.width / 2);
  //   setThrowEffect(x < -LAYOUT.window.width / 2);
  // }, 150);

  function onSideEffect(x: number) {
    // handleSideEffect(x);
    setLikeEffect(x > LAYOUT.window.width / 2);
    setThrowEffect(x < -LAYOUT.window.width / 2);
  }

  const renderItem = (item: IPlaceUnity) => (
    <View key={showSpots.indexOf(item)}>
      <View
        style={{
          width: LAYOUT.window.width - 20,
          height: LAYOUT.window.height * 0.6,
        }}
      >
        <Image
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 5,
          }}
          source={{ uri: item.images[0] }}
        />
        {item.spot_type === 'HOTPEPPER' && (
          <Image
            style={{
              width: 88,
              height: 35,
              position: 'absolute',
            }}
            source={{
              uri: 'http://webservice.recruit.co.jp/banner/hotpepper-m.gif',
            }}
          />
        )}
        <View style={thisStyle.cardNameWrapper}>
          <Text
            style={{
              ...thisStyle.nameTextShadow,
              textShadowOffset: {
                width: 1,
                height: 1,
              },
            }}
          >
            {item.name}
            {`(${getDistance(
              {
                latitude: createPlan.center.latitude,
                longitude: createPlan.center.longitude,
              },
              {
                latitude: item.latitude,
                longitude: item.longitude,
              },
            )}m)`}
          </Text>
          <Text
            style={{
              ...thisStyle.nameTextShadow,
              position: 'absolute',
              textShadowOffset: {
                width: -1,
                height: -1,
              },
            }}
          >
            {item.name}
          </Text>
          <Text
            style={{
              ...thisStyle.nameTextShadow,
              position: 'absolute',
              textShadowOffset: {
                width: 1,
                height: -1,
              },
            }}
          >
            {item.name}
          </Text>
          <Text
            style={{
              ...thisStyle.nameTextShadow,
              position: 'absolute',
              textShadowOffset: {
                width: -1,
                height: 1,
              },
            }}
          >
            {item.name}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <Container>
      <View style={thisStyle.genreButtonWrapper}>
        <TouchableOpacity
          style={thisStyle.filter}
          onPress={() => setTypesPopup(true)}
        >
          {/* <FontAwesome5 name="list" size={24} color={COLOR.greyColor} /> */}
          <FontAwesome5 name="bars" size={24} color={COLOR.backgroundColor} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          height: LAYOUT.window.height * 0.6,
          width: LAYOUT.window.width,
          paddingLeft: 10,
          paddingRight: 10,
          marginTop: 10,
        }}
      >
        <CardStack
          ref={cardStack}
          disableBottomSwipe
          disableTopSwipe
          verticalSwipe={false}
          onSwipedLeft={deleteSpot}
          onSwipedRight={likeSpot}
          onSwiped={(idx) => {
            setCurrentSwipped(idx);
            setLikeEffect(false);
            setThrowEffect(false);
          }}
          onSwipe={(x) => {
            onSideEffect(x);
          }}
        >
          {showSpots.map((item, idx) => (
            <Card key={`card-${idx}`}>{renderItem(item)}</Card>
          ))}
        </CardStack>
      </View>
      <View style={thisStyle.cardInfoWrapper}>
        <View
          style={{
            height: LAYOUT.window.height * 0.07,
          }}
        >
          <Body style={thisStyle.bodylike}>
            <View>
              <FontAwesome5
                name="heart"
                size={24}
                color={COLOR.greyColor}
                style={{ marginRight: 3 }}
              />
              <Text note style={thisStyle.scoreText}>
                &nbsp;
              </Text>
            </View>
            <View>
              <FontAwesome5
                name="star"
                size={24}
                color={COLOR.greyColor}
                style={{ marginRight: 3 }}
              />
              <Text note style={thisStyle.scoreText}>
                &nbsp;
              </Text>
            </View>
            <View>
              <FontAwesome5
                name="comment"
                size={24}
                color={COLOR.greyColor}
                style={{ marginRight: 3 }}
              />
              <Text note style={thisStyle.scoreText}>
                {showSpots[currentSwipped + 1]
                  ? showSpots[currentSwipped + 1].user_ratings_total
                  : ''}
              </Text>
            </View>
          </Body>
        </View>
      </View>
      <View style={thisStyle.touchable}>
        <TouchableOpacity
          style={thisStyle.footerIcon1}
          onPress={() => rewindSpot()}
        >
          <FontAwesome5 name="redo-alt" size={24} color="white" />
        </TouchableOpacity>
        <Button
          buttonStyle={thisStyle.footerButton}
          title="決定"
          onPress={onCompleteButtonPress}
        />
        <TouchableOpacity
          style={thisStyle.footerIcon1}
          onPress={() => {
            cardStack.current.swipeRight();
            if (currentSwipped < showSpots.length - 1) {
              setHeartedSpots((prev) => [
                ...prev,
                showSpots[currentSwipped + 1].place_id,
              ]);
            }
          }}
        >
          <FontAwesome5 name="star" size={24} color="white" solid />
        </TouchableOpacity>
      </View>
      <LinearGradient
        colors={['#FFA50080', '#FFFFFF80']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          width: LAYOUT.window.width,
          height: LAYOUT.window.height,
          position: 'absolute',
          opacity: likeEffect ? 1 : 0,
          alignItems: 'flex-end',
          paddingTop: LAYOUT.window.height * 0.3,
          paddingRight: 10,
        }}
        pointerEvents="none"
      >
        <FontAwesome5 name="heart" size={48} color="white" />
      </LinearGradient>
      <LinearGradient
        colors={['#80808080', '#FFFFFF80']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: LAYOUT.window.width,
          height: LAYOUT.window.height,
          position: 'absolute',
          opacity: throwEffect ? 1 : 0,
          paddingTop: LAYOUT.window.height * 0.3,
          paddingLeft: 10,
        }}
        pointerEvents="none"
      >
        <FontAwesome5 name="times" size={48} color="white" />
      </LinearGradient>
      <Overlay
        isVisible={typesPopup}
        windowBackgroundColor="rgba(0, 0, 0, .5)"
        overlayBackgroundColor="white"
        onBackdropPress={() => {
          setTypesPopup(false);
        }}
        width="auto"
        height={500}
      >
        <SectionList
          sections={getSectionData()}
          renderSectionHeader={({ section: { title } }) => (
            <CheckBox
              containerStyle={thisStyle.sectionHeader}
              title={title}
              checked={
                (title === '全て選択' && spotTypeChecked.total) ||
                (title === '全て選択解除' && !spotTypeChecked.total) ||
                (title !== '全て選択' &&
                  title !== '全て選択解除' &&
                  spotTypeChecked.cat[SPOT_TYPE_GROUP.indexOf(title)])
              }
              checkedColor={COLOR.tintColor}
              uncheckedColor={COLOR.tintColor}
              onPress={() => onPressSpotCat(title)}
            />
          )}
          renderItem={({ item }) => (
            <CheckBox
              title={item.title}
              checked={excludeTypes.indexOf(item.id) < 0}
              onPress={() => onPressSpotType(item.id)}
              checkedColor={COLOR.tintColor}
              uncheckedColor={COLOR.tintColor}
            />
          )}
        />
      </Overlay>
    </Container>
  );
};

const thisStyle = StyleSheet.create({
  sectionHeader: {
    backgroundColor: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    borderColor: 'white',
  },
  filter: {
    width: LAYOUT.window.width * 0.15,
    height: LAYOUT.window.width * 0.15,

    padding: 10,
    borderRadius: LAYOUT.window.width * 0.15,

    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: LAYOUT.window.width * 0.05,
    marginRight: LAYOUT.window.width * 0.05,
    backgroundColor: COLOR.tintColor,

    marginTop: LAYOUT.window.width * 0.05,
  },
  content: {
    alignItems: 'center',
  },
  footerButton: {
    backgroundColor: COLOR.tintColor,
    width: LAYOUT.window.width * 0.4,
    borderRadius: 10,
    margin: 5,
    shadowColor: 'rgba(0,0,0, .4)',
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
  swiper: {
    marginTop: 10,
    padding: 20,
  },
  centerText: {
    fontFamily: 'genju-medium',
    fontSize: 14,
  },
  bodylike: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  likebutton: {
    padding: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: LAYOUT.window.height * 0.15,
  },
  footerText: {
    textAlign: 'center',
  },
  scoreText: {
    color: COLOR.tintColor,
  },
  footerIcon1: {
    backgroundColor: COLOR.tintColor,
    width: LAYOUT.window.width * 0.15,
    height: LAYOUT.window.width * 0.15,
    borderRadius: LAYOUT.window.width * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    shadowColor: 'rgba(0,0,0, .4)',
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
  footerIcon2: {
    backgroundColor: COLOR.greyColor,
    width: LAYOUT.window.width * 0.13,
    height: LAYOUT.window.width * 0.13,
    // padding: 5,
    borderRadius: LAYOUT.window.width * 0.16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: LAYOUT.window.width * 0.05,
    marginRight: LAYOUT.window.width * 0.05,
  },
  footerIconActive: {
    backgroundColor: COLOR.tintColor,
  },
  touchable: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: COLOR.backgroundColor,
    height: LAYOUT.window.height * 0.1,
    marginBottom: 0,
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: LAYOUT.window.width * 0.05,
    paddingRight: LAYOUT.window.width * 0.05,
  },
  button: {
    justifyContent: 'center',
    backgroundColor: COLOR.tintColor,
    width: LAYOUT.window.width * 0.3,
    borderRadius: 10,
    marginBottom: 0,
  },
  cardNameWrapper: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    width: LAYOUT.window.width * 0.65,
  },
  genreButtonWrapper: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 100,
    right: 5,
    top: 5,
    margin: 5,
    shadowColor: 'rgba(0,0,0, .4)',
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
  nameTextShadow: {
    color: 'white',
    fontSize: 22,
    textShadowColor: 'black',
    textShadowRadius: 1,
  },
  cardInfoWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    paddingLeft: 10,
    paddingRight: 10,
  },
});
export default SwipeSpotScreen;
