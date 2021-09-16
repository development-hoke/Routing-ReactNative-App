import React, { useCallback, useState, useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import {
  Body,
  Card,
  CardItem,
  Text,
  Button,
  Left,
  Right,
  Thumbnail,
  ListItem,
} from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import { Col, Row, Grid } from 'react-native-easy-grid';
// from app
import { COLOR } from 'app/src/constants';
import { useNavigation } from '@react-navigation/native';
import { useGlobalState } from 'app/src/Store';
import { useGetLikePlanList } from 'app/src/hooks';
import { PlanCardList } from 'app/src/components/List';
/** ホーム画面トップ */
const HomeScreen: React.FC = () => {
  /** デートプラン一覧取得 */
  const { navigate } = useNavigation();
  const loginUser = useGlobalState('loginUser');
  const { isLoading, plans, isRefreshing, onRefresh } = useGetLikePlanList(
    loginUser.id,
    loginUser.authorization,
  );

  return (
    <View style={thisStyle.container}>
      <PlanCardList
        planList={plans.plan_list}
        isRefreshing={isRefreshing}
        onRefresh={onRefresh}
        showUsePlan
      />
    </View>
  );
};

/** スタイリング */
const thisStyle = StyleSheet.create({
  container: {
    backgroundColor: COLOR.backgroundColor,
    flex: 1,
  },
});

export default HomeScreen;
