/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Container } from 'native-base';
import moment from 'moment';

// from app
import { ImageGrid } from 'app/src/components/List';
import { CompleteFooterButton } from 'app/src/components/Button';
import { useDispatch, useGlobalState } from 'app/src/Store';
import { ActionType, IPlaceNode } from 'app/src/Reducer';
import { useGooglePlace } from 'app/src/hooks';
import {
  SPOT_TYPE,
  getRightSpotType,
  getTypeIndex,
  getElapse,
} from 'app/src/constants';
import { LoadingSpinner } from 'app/src/components/Spinners';

const G = require('generatorics');

/** デートスポット厳選画面 */
const SelectSpotScreen: React.FC = () => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch();
  const { distanceMatrix, getDistanceMatrix } = useGooglePlace();
  const createPlan = useGlobalState('createPlan');

  const [selectedSpots, setSelectedSpots] = useState<IPlaceNode[]>(
    createPlan.heartedSpots,
  );
  const [isPlacesLoading, setIsPlacesLoading] = useState<boolean>(true);

  useEffect(() => {
    const placeIDs: string[] = [];
    createPlan.candidatedSpots.forEach((item) => {
      placeIDs.push(`${item.place.latitude},${item.place.longitude}`);
    });

    const mode =
      createPlan.transportations.indexOf('car') >= 0 ? 'drive' : 'transit';
    getDistanceMatrix(placeIDs, mode);
  }, []);

  useEffect(() => {
    if (distanceMatrix) setIsPlacesLoading(false);
  }, [distanceMatrix]);

  const getOriginalIndex = (place_id: string) => {
    return createPlan.candidatedSpots.findIndex(
      (item) => item.place.place_id === place_id,
    );
  };

  const path = useMemo(() => {
    if (distanceMatrix.length > 0) {
      if (selectedSpots.length === 1) {
        const fdx = getOriginalIndex(selectedSpots[0].place.place_id);

        return {
          cost: getElapse(selectedSpots[0].place.category),
          route: [fdx],
        };
      }
      if (selectedSpots.length === 2) {
        const fdx = getOriginalIndex(selectedSpots[0].place.place_id);
        const tdx = getOriginalIndex(selectedSpots[1].place.place_id);

        return {
          cost:
            getElapse(selectedSpots[0].place.category) +
            getElapse(selectedSpots[1].place.category) +
            Math.round(distanceMatrix[fdx][tdx].duration.value / 60),
          route: [fdx, tdx],
        };
      }
      if (selectedSpots.length > 2) {
        const fdx = getOriginalIndex(selectedSpots[0].place.place_id);
        const route: number[] = [fdx];
        let cost = getElapse(selectedSpots[0].place.category);
        while (route.length < selectedSpots.length) {
          const remainSpots = selectedSpots
            .filter(
              (item) =>
                route.indexOf(getOriginalIndex(item.place.place_id)) < 0,
            )
            .map((spot) => getOriginalIndex(spot.place.place_id));
          const zdx = route[route.length - 1];
          const tdx = remainSpots[0];
          let minDist = distanceMatrix[zdx][tdx].distance.value;
          let nextSpot = tdx;
          remainSpots.forEach((id) => {
            if (distanceMatrix[zdx][id].distance.value < minDist) {
              minDist = distanceMatrix[zdx][id].distance.value;
              nextSpot = id;
            }
          });
          route.push(nextSpot);
          cost += Math.round(distanceMatrix[zdx][nextSpot].duration.value / 60);
          cost += getElapse(
            createPlan.candidatedSpots[nextSpot].place.category,
          );
        }

        return {
          route,
          cost,
        };
      }
    }

    return {
      cost: 0,
      route: [],
    };
  }, [selectedSpots, distanceMatrix]);

  const remainTime = useMemo(() => {
    const orgTime = createPlan.neededTime;
    if (selectedSpots.length === 1) {
      const elapse = getElapse(selectedSpots[0].place.category);

      return orgTime - elapse;
    }
    if (selectedSpots.length > 1) {
      return orgTime - path.cost;
    }

    return orgTime;
  }, [path]);

  const possibilitySpots = useMemo(() => {
    const remainSpots = createPlan.candidatedSpots.filter((item) => {
      return selectedSpots.indexOf(item) < 0;
    });
    if (distanceMatrix.length > 0) {
      return remainSpots.filter((item) => {
        if (selectedSpots.length > 0) {
          const lastItem = path.route[path.route.length - 1];
          const estimateTime =
            Math.round(
              distanceMatrix[lastItem][getOriginalIndex(item.place.place_id)]
                .duration.value / 60,
            ) + getElapse(item.place.category);

          return estimateTime < remainTime;
        }

        return true;
      });
    }

    return remainSpots;
  }, [remainTime]);

  function onCompleteButtonPress() {
    if (path.route.length === 0) return;
    const routedSpots: IPlaceNode[] = [];
    selectedSpots.forEach((item, index) => {
      const elapse = getElapse(item.place.category);
      routedSpots.push({
        ...item,
        cost: elapse,
      });
    });
    dispatch({
      type: ActionType.SET_CREATE_PLAN,
      payload: {
        ...createPlan,
        route: {
          spots: routedSpots,
          cost: path.cost,
          check: false,
        },
      },
    });
    navigate('Arrange');
  }

  const formatMinute = (time: number) =>
    `${Math.floor(time / 60)}時間${time % 60}分`;

  if (isPlacesLoading) {
    return LoadingSpinner;
  }

  return (
    <Container>
      <ImageGrid
        realSpots={createPlan.candidatedSpots}
        possibilitySpots={possibilitySpots}
        updateSelectedSpots={setSelectedSpots}
      />
      <CompleteFooterButton
        title="次へ"
        spotCount={selectedSpots.length}
        remainTime={formatMinute(remainTime)}
        onPress={onCompleteButtonPress}
      />
    </Container>
  );
};

export default SelectSpotScreen;
