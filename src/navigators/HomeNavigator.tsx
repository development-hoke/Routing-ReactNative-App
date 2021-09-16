import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// from app
import HomeScreen from 'app/src/screens/PlanScreen/HomeScreen';
import PlanDetailScreen from 'app/src/screens/PlanScreen/PlanDetailScreen';
import CommentScreen from 'app/src/screens/PlanScreen/CommentScreen';
import LikeUserScreen from 'app/src/screens/PlanScreen/LikeUserScreen';
import ProfileScreen from 'app/src/screens/UserScreen/ProfileScreen';
import FollowScreen from 'app/src/screens/UserScreen/FollowScreen';
import FollowerScreen from 'app/src/screens/UserScreen/FollowerScreen';
// import CreateSpotScreen from 'app/src/screens/PostScreen/CreateSpotScreen';
import SpotDetailScreen from 'app/src/screens/PostScreen/SpotDetailScreen';
import CreatePlanNavigator from 'app/src/navigators/CreatePlanNavigator';
import PostNavigator from 'app/src/navigators/EditDatePlanNavigator';
import { COLOR } from 'app/src/constants';
import MyPlanRoadScreen from '../screens/PlanScreen/MyPlanRoadScreen';
import MyPlanArrivalScreen from '../screens/PlanScreen/MyPlanArrivalScreen';

const HomeStack = createStackNavigator();

/** ホームタブのナビゲーター */
const HomeNavigator: React.FC = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="Top"
      component={HomeScreen}
      options={{
        title: 'ホーム',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <HomeStack.Screen
      name="Detail"
      component={PlanDetailScreen}
      options={{
        title: 'プラン詳細',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <HomeStack.Screen
      name="Comment"
      component={CommentScreen}
      options={{
        title: 'コメント',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <HomeStack.Screen
      name="Like"
      component={LikeUserScreen}
      options={{
        title: 'お気に入り',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <HomeStack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: 'ユーザー詳細',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <HomeStack.Screen
      name="Follow"
      component={FollowScreen}
      options={{
        title: 'フォロー',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <HomeStack.Screen
      name="Follower"
      component={FollowerScreen}
      options={{
        title: 'フォロワー',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <HomeStack.Screen
      name="Create"
      component={CreatePlanNavigator}
      options={{ headerShown: false }}
    />
    <HomeStack.Screen
      name="PostNav"
      component={PostNavigator}
      options={{
        title: '計画の編集',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <HomeStack.Screen
      name="EditDatePlanNav"
      component={PostNavigator}
      options={{
        title: '計画の編集',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <HomeStack.Screen
      name="Road"
      component={MyPlanRoadScreen}
      options={{
        title: '経路',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <HomeStack.Screen
      name="Arrival"
      component={MyPlanArrivalScreen}
      options={{
        title: '到着',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <HomeStack.Screen
      name="SpotDetail"
      component={SpotDetailScreen}
      options={{
        title: 'スポット詳細',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
  </HomeStack.Navigator>
);

export default HomeNavigator;
