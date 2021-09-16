import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, TextInput, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'native-base';
import { Button } from 'react-native-elements';
import moment from 'moment';

// from app
import { useDispatch } from 'app/src/Store';
import { ActionType } from 'app/src/Reducer';
import { COLOR, LAYOUT } from 'app/src/constants';
import { SelectButton, SmallCompleteButton } from 'app/src/components/Button';
import { DateTimePickerLabel } from 'app/src/components/Form';
import { getToday } from 'app/src/utils';
import { appStyle } from 'app/src/styles';

/** デートプラン作成画面トップ(基本情報入力画面) */
const CreatePlanTopScreen: React.FC = () => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch();

  const [fromDate, updateFrom] = useState<string>('');
  const [toDate, updateTo] = useState<string>('');
  const [car, setCar] = useState<boolean>(false);
  const [train, setTrain] = useState<boolean>(false);
  const [bus, setBus] = useState<boolean>(false);
  const [walk, setWalk] = useState<boolean>(false);
  const [needTime, setNeedTime] = useState<number>(180);
  const [timeModal, showTimeModal] = useState<boolean>(false);
  const [timeModalValue, setTimeModalValue] = useState<string>('180');

  useEffect(() => {
    updateFrom(
      moment()
        .add(1, 'day')
        .set('minute', 0)
        .set('second', 0)
        .format('YYYY/MM/DD HH:mm'),
    );
    updateTo(
      moment()
        .add(1, 'day')
        .add(8, 'hours')
        .set('minute', 0)
        .set('second', 0)
        .format('YYYY/MM/DD HH:mm'),
    );
  }, []);

  /** デート予定日と交通手段を永続化 */
  function setCreatePlan() {
    const dateFrom = new Date(fromDate);
    const dateTo = new Date(toDate);
    if (dateFrom > dateTo) {
      return;
    }

    let transportationList = [];
    if (car) {
      transportationList = [];
      transportationList.push('car');
    } else if (train) {
      transportationList = [];
      transportationList.push('train');
    } else if (bus) {
      transportationList = [];
      transportationList.push('bus');
    } else if (walk) {
      transportationList = [];
      transportationList.push('walk');
    }

    dispatch({
      type: ActionType.SET_CREATE_PLAN,
      payload: {
        dateFrom: fromDate,
        dateTo: toDate,
        neededTime: needTime,
        transportations: transportationList,
      },
    });
  }

  function onCompleteButtonPress() {
    setCreatePlan();
    navigate('Map');
  }

  /** 移動手段選択ボタン */
  const TransportationButtonGroup: JSX.Element = (
    <View style={thisStyle.formGroup}>
      <Text style={thisStyle.itemTitleText}>移動手段</Text>

      <SelectButton
        value={car}
        setValue={setCar}
        reversible
        buttonName="車"
        setOtherValues={[setTrain, setBus, setWalk]}
      />
      <SelectButton
        value={train}
        setValue={setTrain}
        reversible
        setOtherValues={[setBus, setCar, setWalk]}
        buttonName="電車・徒歩"
      />
    </View>
  );

  return (
    <View style={appStyle.standardContainer}>
      <View style={appStyle.emptySpace} />
      <View style={thisStyle.dateGroup}>
        <View style={thisStyle.dateView}>
          <Text style={thisStyle.timeTitleText}>開始予定時間日時</Text>

          <View style={thisStyle.displayDateTxt}>
            <DateTimePickerLabel
              date={fromDate}
              setDate={updateFrom}
              minDate={getToday()}
            />
          </View>
        </View>
        <View style={thisStyle.dateView}>
          <Text style={thisStyle.timeTitleText}>所要時間</Text>
          <Text
            style={thisStyle.displayText}
            onPress={() => showTimeModal(true)}
          >
            {needTime}分
          </Text>
        </View>
      </View>
      {TransportationButtonGroup}
      <View style={appStyle.emptySpace} />
      {fromDate > toDate ||
      fromDate === '' ||
      toDate === '' ||
      (!car && !train && !bus && !walk) ? (
        <SmallCompleteButton title="決定" disabled />
      ) : (
        <SmallCompleteButton title="決定" onPress={onCompleteButtonPress} />
      )}
      <View style={{ marginBottom: 10 }} />

      <Modal animationType="slide" transparent visible={timeModal}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                alignItems: 'center',
                width: LAYOUT.window.width * 0.35,
                height: 120,
                backgroundColor: COLOR.backgroundColor,
                padding: 10,
                borderRadius: 10,
              }}
            >
              <View
                style={{
                  marginTop: 10,
                  marginBottom: 15,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'baseline',
                }}
              >
                <TextInput
                  placeholder="所要時間"
                  style={{
                    fontSize: 20,
                  }}
                  defaultValue={needTime.toString()}
                  keyboardType="numeric"
                  onChangeText={(text) => setTimeModalValue(text)}
                />
                <Text style={{ fontSize: 18 }}>分</Text>
              </View>
              <View>
                <Button
                  title="OK"
                  buttonStyle={{ backgroundColor: 'orange', width: 75 }}
                  onPress={() => {
                    showTimeModal(false);
                    setNeedTime(Number.parseInt(timeModalValue, 10));
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

/** スタイリング */
const thisStyle = StyleSheet.create({
  formGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    // justifyContent: 'center',
    paddingTop: LAYOUT.window.height * 0.03,
  },
  dateGroup: {
    // alignItems: 'center',
    borderBottomColor: COLOR.textTintColor,
    borderBottomWidth: 2,
    paddingBottom: LAYOUT.window.height * 0.03,
  },
  dateView: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
    marginRight: 5,
  },
  itemTitleText: {
    color: COLOR.textTintColor,
    fontFamily: 'genju-medium',
    fontSize: 14,
    justifyContent: 'space-between',
    marginRight: 10,
    width: 120,
  },
  timeTitleText: {
    color: COLOR.textTintColor,
    fontFamily: 'genju-medium',
    fontSize: 14,
    marginRight: 10,
    width: 150,
  },

  displayText: {
    color: COLOR.tintColor,
    fontFamily: 'genju-medium',
    fontSize: 20,
    marginRight: 10,
    textAlign: 'right',
    width: 130,
  },
  displayDateTxt: {
    color: COLOR.tintColor,
    fontFamily: 'genju-medium',
    fontSize: 20,
    marginRight: 25,
    textAlign: 'right',
    width: 100,
  },
});

export default CreatePlanTopScreen;
