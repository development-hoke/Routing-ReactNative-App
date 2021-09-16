import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// from app
import AppTopScreen from 'app/src/screens/TopScreen/AppTopScreen';
import TermsScreen from 'app/src/screens/TopScreen/TermsScreen';
import PrivacyPolycyScreen from 'app/src/screens/TopScreen/PrivacyPolicyScreen';
import SCCScreen from 'app/src/screens/TopScreen/SCCScreen';
import { COLOR } from 'app/src/constants';

const TopStack = createStackNavigator();

/** アプリトップ画面のナビゲーター */
const TopNavigator: React.FC = () => (
  <TopStack.Navigator>
    <TopStack.Screen
      name="Top"
      component={AppTopScreen}
      options={{ headerShown: false }}
    />
    <TopStack.Screen
      name="Terms"
      component={TermsScreen}
      options={{
        title: '利用規約',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <TopStack.Screen
      name="Privacy"
      component={PrivacyPolycyScreen}
      options={{
        title: 'プライバシーポリシー',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <TopStack.Screen
      name="SCC"
      component={SCCScreen}
      options={{
        title: '特定商取引法',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
  </TopStack.Navigator>
);

export default TopNavigator;
