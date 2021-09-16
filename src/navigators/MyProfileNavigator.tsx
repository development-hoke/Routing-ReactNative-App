import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// from app
import SettingNavigator from 'app/src/navigators/SettingNavigator';
import MyProfileScreen from 'app/src/screens/UserScreen/MyProfileScreen';
import FollowScreen from 'app/src/screens/UserScreen/FollowScreen';
import FollowerScreen from 'app/src/screens/UserScreen/FollowerScreen';
import ProfileScreen from 'app/src/screens/UserScreen/ProfileScreen';
import { COLOR } from 'app/src/constants';
import CreateSpotScreen from '../screens/PostScreen/CreateSpotScreen';

const MyProfileStack = createStackNavigator();

/**  プロフィールタブのナビゲーター */
const MyProfileNavigator: React.FC = () => (
  <MyProfileStack.Navigator>
    <MyProfileStack.Screen
      name="Top"
      component={MyProfileScreen}
      options={{
        title: 'プロフィール',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <MyProfileStack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: 'ユーザー詳細',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <MyProfileStack.Screen
      name="MyFollow"
      component={FollowScreen}
      options={{
        title: 'フォロー',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <MyProfileStack.Screen
      name="MyFollower"
      component={FollowerScreen}
      options={{
        title: 'フォロワー',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <MyProfileStack.Screen
      name="Follow"
      component={FollowScreen}
      options={{
        title: 'フォロー',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <MyProfileStack.Screen
      name="Follower"
      component={FollowerScreen}
      options={{
        title: 'フォロワー',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <MyProfileStack.Screen
      name="Setting"
      component={SettingNavigator}
      options={{ headerShown: false }}
    />
    <MyProfileStack.Screen
      name="CreateSpot"
      component={CreateSpotScreen}
      options={{
        title: 'スポット作成',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
  </MyProfileStack.Navigator>
);

export default MyProfileNavigator;
