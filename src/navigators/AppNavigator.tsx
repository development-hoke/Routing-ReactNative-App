import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// from app
import TopNavigator from 'app/src/navigators/TopNavigator';
import MainTabNavigator from 'app/src/navigators/MainTabNavigator';
import WelcomeScreen from 'app/src/screens/TopScreen/WelcomeScreen';
import EntryScreen from 'app/src/screens/TopScreen/EntryScreen';

const AppStack = createStackNavigator();

/** アプリ全体のナビゲーター */
const AppNavigator: React.FC = () => (
  <NavigationContainer>
    <AppStack.Navigator headerMode="none">
      <AppStack.Screen name="Welcome" component={WelcomeScreen} />
      <AppStack.Screen name="AppTop" component={TopNavigator} />
      {/* <AppStack.Screen name="Welcome" component={WelcomeScreen} /> */}
      <AppStack.Screen name="Entry" component={EntryScreen} />
      <AppStack.Screen name="Main" component={MainTabNavigator} />
    </AppStack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
