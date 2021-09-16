import React, { createContext, useReducer, useContext } from 'react';
import { MenuProvider } from 'react-native-popup-menu';
// from app
import Reducer, { State, Action } from 'app/src/Reducer';
import { LatLng } from 'react-native-maps';

const initialState: State = {
  loginUser: {
    id: '',
    name: '',
    imageUrl: '',
    authorization: '',
  },
  registerUser: {
    mailAddress: '',
    password: '',
  },
  createPlan: {
    dateFrom: '',
    dateTo: '',
    neededTime: 180,
    transportations: [],
    center: {
      latitude: 35.658606737323325,
      longitude: 139.69814462256613,
    } as LatLng,
    radius: 1000,
    spots: [],
    candidatedSpots: [],
    heartedSpots: [],
    route: {
      spots: [],
      cost: 0,
    },
  },
  myPlanArrival: 0,
};

const StoreContext = createContext<State>(initialState);
const DispatchContext = createContext<React.Dispatch<Action>>(() => true);

/** Provider */
const Provider = (props: any) => {
  const { children } = props;

  const [state, dispatch] = useReducer(Reducer, initialState);

  return (
    <StoreContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <MenuProvider>{children}</MenuProvider>
      </DispatchContext.Provider>
    </StoreContext.Provider>
  );
};

/** GlobalState を更新するための関数 */
const useDispatch = () => {
  return useContext(DispatchContext);
};

/** GlobalState を参照するための関数 */
const useGlobalState = <K extends keyof State>(property: K) => {
  const state = useContext(StoreContext);

  return state[property];
};

export { StoreContext, DispatchContext, Provider, useDispatch, useGlobalState };
