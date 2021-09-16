import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

// from app
import { COLOR } from 'app/src/constants';
import HomeNavigator from 'app/src/navigators/HomeNavigator';
import SearchNavigator from 'app/src/navigators/SearchNavigator';
import MyPlanNavigator from 'app/src/navigators/MyPlanNavigator';
import NotificationNavigator from 'app/src/navigators/NotificationNavigator';
import MyProfileNavigator from 'app/src/navigators/MyProfileNavigator';
import {
  HomeTabIcon,
  SearchTabIcon,
  MyPlanTabIcon,
  NotificationTabIcon,
  ProfileTabIcon,
} from 'app/src/components/TabIcons';

const MainButtomTab = createMaterialBottomTabNavigator();

/** メイン画面のタブナビゲーター */
const MainTabNavigator: React.FC = () => {
  return (
    <MainButtomTab.Navigator
      initialRouteName="Home"
      activeColor={COLOR.tintColor}
      inactiveColor={COLOR.inactiveColor}
      barStyle={{
        backgroundColor: COLOR.backgroundColor,
      }}
    >
      <MainButtomTab.Screen
        name="Search"
        component={SearchNavigator}
        options={{
          title: '検索',
          tabBarIcon: ({ color }) => <SearchTabIcon tintColor={color} />,
        }}
      />
      <MainButtomTab.Screen
        name="MyPlan"
        component={MyPlanNavigator}
        options={{
          title: 'マイプラン',
          tabBarIcon: ({ color }) => <MyPlanTabIcon tintColor={color} />,
        }}
      />
      <MainButtomTab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          title: 'ホーム',
          tabBarIcon: ({ color }) => <HomeTabIcon tintColor={color} />,
        }}
      />
      <MainButtomTab.Screen
        name="Notification"
        component={NotificationNavigator}
        options={{
          title: '通知',
          tabBarIcon: ({ color }) => <NotificationTabIcon tintColor={color} />,
        }}
      />
      <MainButtomTab.Screen
        name="Profile"
        component={MyProfileNavigator}
        options={{
          title: 'プロフィール',
          tabBarIcon: ({ color }) => <ProfileTabIcon tintColor={color} />,
        }}
      />
    </MainButtomTab.Navigator>
  );
};

export default MainTabNavigator;
