import { LatLng } from 'react-native-maps';
import { IPlace, IHPShop, IPlaceUnity } from './interfaces/app/Map';
import { IPlanFull } from './interfaces/api/Plan';

/** ログイン中のユーザー */
interface LoginUser {
  id: string;
  name: string;
  imageUrl: string;
  authorization: string;
}

/** ユーザー登録に必要な情報 */
interface RegisterUser {
  mailAddress: string;
  password: string;
}

export interface IPlaceNode {
  place: IPlaceUnity;
  cost: number;
  check: boolean;
}

/** プラン作成に必要な情報 */
interface CreatePlan {
  dateFrom: string;
  dateTo: string;
  neededTime: number;
  transportations: Array<string>;
  center: LatLng;
  radius: number;
  spots: IPlaceUnity[];
  candidatedSpots: IPlaceNode[];
  heartedSpots: IPlaceNode[];
  route: {
    spots: IPlaceNode[];
    cost: number;
  };
}
interface MyPlan {
  plan: object;
}

/** Global State */
export interface State {
  loginUser: LoginUser;
  registerUser: RegisterUser;
  createPlan: CreatePlan;
  myPlan: IPlanFull;
  myPlanArrival: number;
  extraSpot: IPlace | IHPShop;
}

export enum ActionType {
  SET_LOGIN_USER = 'SET_LOGIN_USER',
  SET_REGISTER_USER = 'SET_REGISTER_USER',
  SET_CREATE_PLAN = 'SET_CREATE_PLAN',
  SET_MY_PLAN = 'SET_MY_PLAN',
  SET_MY_PLAN_ARRIVAL = 'SET_MY_PLAN_ARRIVAL',
  SET_EXTRA_SPOT = 'SET_EXTRA_PLACE',
}

export interface Action {
  type: ActionType;
  payload: any;
}

/** Reducer */
const Reducer = (state: State, action: Action): any => {
  const { type, payload } = action;

  switch (type) {
    case ActionType.SET_LOGIN_USER:
      return {
        ...state,
        loginUser: payload,
      };
    case ActionType.SET_REGISTER_USER:
      return {
        ...state,
        registerUser: payload,
      };
    case ActionType.SET_CREATE_PLAN:
      return {
        ...state,
        createPlan: payload,
      };
    case ActionType.SET_MY_PLAN:
      return {
        ...state,
        myPlan: payload,
      };
    case ActionType.SET_MY_PLAN_ARRIVAL:
      return {
        ...state,
        myPlanArrival: payload,
      };
    case ActionType.SET_EXTRA_SPOT:
      return {
        ...state,
        extraSpot: payload,
      };
    default:
      break;
  }

  return state;
};

export default Reducer;
