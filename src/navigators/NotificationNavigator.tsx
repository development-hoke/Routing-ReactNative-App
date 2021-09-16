import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// from app
import { COLOR } from 'app/src/constants';
import NotificationTabNavigator from './NotificationTabNavigator';

const NotificationStack = createStackNavigator();

/** 通知タブのナビゲーター */
const NotificationNavigator: React.FC = () => (
  <NotificationStack.Navigator>
    <NotificationStack.Screen
      name="Top"
      component={NotificationTabNavigator}
      options={{
        title: '通知',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
  </NotificationStack.Navigator>
);

export default NotificationNavigator;
