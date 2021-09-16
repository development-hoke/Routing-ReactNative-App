import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// from app
import EditDatePlanScreen from 'app/src/screens/EditDatePlanScreen/EditDatePlanScreen';
import { COLOR } from 'app/src/constants';

const PostStack = createStackNavigator();

/** 投稿画面のナビゲーター */
const PostNavigator: React.FC = () => (
  <PostStack.Navigator>
    <PostStack.Screen
      name="EditDatePlan"
      component={EditDatePlanScreen}
      options={{
        title: '投稿編集',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
  </PostStack.Navigator>
);

export default PostNavigator;
