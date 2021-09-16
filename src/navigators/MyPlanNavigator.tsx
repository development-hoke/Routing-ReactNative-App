import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// from app
import MyPlanScreen from 'app/src/screens/PlanScreen/MyPlanScreen';
import MyPlanRoadScreen from 'app/src/screens/PlanScreen/MyPlanRoadScreen';
import MyPlanArrivalScreen from 'app/src/screens/PlanScreen/MyPlanArrivalScreen';
import PlanDetailScreen from 'app/src/screens/PlanScreen/PlanDetailScreen';
import CommentScreen from 'app/src/screens/PlanScreen/CommentScreen';
import LikeUserScreen from 'app/src/screens/PlanScreen/LikeUserScreen';
import ProfileScreen from 'app/src/screens/UserScreen/ProfileScreen';
import FollowScreen from 'app/src/screens/UserScreen/FollowScreen';
import FollowerScreen from 'app/src/screens/UserScreen/FollowerScreen';
import { COLOR } from 'app/src/constants';

const MyPlanStack = createStackNavigator();

/** マイプランタブのナビゲーター */
const MyPlanNavigator: React.FC = () => (
  <MyPlanStack.Navigator>
    <MyPlanStack.Screen
      name="Top"
      component={MyPlanScreen}
      options={{
        title: 'プランを選択',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <MyPlanStack.Screen
      name="Arrival"
      component={MyPlanArrivalScreen}
      options={{
        title: '到着',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <MyPlanStack.Screen
      name="Road"
      component={MyPlanRoadScreen}
      options={{
        title: '経路',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <MyPlanStack.Screen
      name="Detail"
      component={PlanDetailScreen}
      options={{
        title: 'プラン詳細',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <MyPlanStack.Screen
      name="Comment"
      component={CommentScreen}
      options={{
        title: 'コメント',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <MyPlanStack.Screen
      name="Like"
      component={LikeUserScreen}
      options={{
        title: 'お気に入り',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <MyPlanStack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: 'ユーザー詳細',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <MyPlanStack.Screen
      name="Follow"
      component={FollowScreen}
      options={{
        title: 'フォロー',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <MyPlanStack.Screen
      name="Follower"
      component={FollowerScreen}
      options={{
        title: 'フォロワー',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
  </MyPlanStack.Navigator>
);

export default MyPlanNavigator;
