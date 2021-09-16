import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// from app
import SearchScreen from 'app/src/screens/PlanScreen/SearchScreen';
import PlanDetailScreen from 'app/src/screens/PlanScreen/PlanDetailScreen';
import CommentScreen from 'app/src/screens/PlanScreen/CommentScreen';
import LikeUserScreen from 'app/src/screens/PlanScreen/LikeUserScreen';
import ProfileScreen from 'app/src/screens/UserScreen/ProfileScreen';
import FollowScreen from 'app/src/screens/UserScreen/FollowScreen';
import FollowerScreen from 'app/src/screens/UserScreen/FollowerScreen';
import { COLOR } from 'app/src/constants';
// import CreateSpotScreen from '../screens/PostScreen/CreateSpotScreen';

const SearchStack = createStackNavigator();

/** 検索タブのナビゲーター */
const SearchNavigator: React.FC = () => (
  <SearchStack.Navigator>
    <SearchStack.Screen
      name="Top"
      component={SearchScreen}
      options={{
        title: '検索',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <SearchStack.Screen
      name="Detail"
      component={PlanDetailScreen}
      options={{
        title: 'プラン詳細',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <SearchStack.Screen
      name="Comment"
      component={CommentScreen}
      options={{
        title: 'コメント',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <SearchStack.Screen
      name="Like"
      component={LikeUserScreen}
      options={{
        title: 'お気に入り',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <SearchStack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: 'ユーザー詳細',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <SearchStack.Screen
      name="Follow"
      component={FollowScreen}
      options={{
        title: 'フォロー',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <SearchStack.Screen
      name="Follower"
      component={FollowerScreen}
      options={{
        title: 'フォロワー',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
  </SearchStack.Navigator>
);

export default SearchNavigator;
