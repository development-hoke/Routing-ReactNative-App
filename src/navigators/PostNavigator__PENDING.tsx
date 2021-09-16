import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// from app
import GuidePostScreen from 'app/src/screens/PostScreen/GuidePostScreen__PENDING';
import PostScreen from 'app/src/screens/PostScreen/PostScreen__PENDING';
import EditPostScreen from 'app/src/screens/PostScreen/EditPostScreen__PENDING';
import { COLOR } from 'app/src/constants';

const PostStack = createStackNavigator();

/** 投稿画面のナビゲーター */
const PostNavigator: React.FC = () => (
  <PostStack.Navigator>
    <PostStack.Screen
      name="Post"
      component={PostScreen}
      options={{
        title: '投稿',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <PostStack.Screen
      name="GuidePost"
      component={GuidePostScreen}
      options={{
        title: '投稿',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
    <PostStack.Screen
      name="EditPost"
      component={EditPostScreen}
      options={{
        title: '投稿編集',
        headerTitleStyle: { color: 'black' },
        headerTintColor: COLOR.tintColor,
      }}
    />
  </PostStack.Navigator>
);

export default PostNavigator;
