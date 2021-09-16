import React, { useMemo, useState, useEffect } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

// from app
import { formatDate, toDate } from 'app/src/utils/DateUtil';
import { Text, View } from 'native-base';
import { StyleSheet } from 'react-native';
import { COLOR } from 'app/src/constants/Color';

interface Props {
  date: string;
  setDate: React.Dispatch<React.SetStateAction<string>>;
  minDate?: string;
  maxDate?: string;
  showTime?: boolean;
}

export const DateTimePickerLabel: React.FC<Props> = (props: Props) => {
  const { date, setDate, minDate, maxDate, showTime } = props;

  const datetime = useMemo(() => {
    if (!date) return new Date();

    return toDate(date) || new Date();
  }, [date]);

  const strDate = useMemo(() => {
    return formatDate(datetime, 'MM/DD');
  }, [datetime]);

  const strTime = useMemo(() => {
    return formatDate(datetime, 'HH:mm');
  }, [date]);

  const minDatetime = useMemo(() => {
    if (!minDate) return undefined;

    return toDate(minDate) || undefined;
  }, [minDate]);

  const maxDatetime = useMemo(() => {
    if (!maxDate) return undefined;

    return toDate(maxDate) || undefined;
  }, [maxDate]);

  const [mode, setMode] = React.useState<'date' | 'time'>('date');
  const [show, setShow] = useState(false);

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const onChange = (selectedDate: Date) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(formatDate(currentDate, 'YYYY-MM-DD HH:mm'));
  };

  const showMode = (currentMode: 'date' | 'time') => {
    setShow(true);
    setMode(currentMode);
  };

  // TODO スタイリング
  return (
    <View style={thisStyle.containerView}>
      <Text style={thisStyle.displayText} onPress={showDatepicker}>
        {strDate}
      </Text>
      {showTime && (
        <Text style={thisStyle.displayText} onPress={showTimepicker}>
          {strTime}
        </Text>
      )}
      <DateTimePickerModal
        isVisible={show}
        mode={mode}
        onConfirm={onChange}
        onCancel={() => setShow(false)}
        minimumDate={minDatetime}
        maximumDate={maxDatetime}
        date={datetime}
      />
    </View>
  );
};

DateTimePickerLabel.defaultProps = {
  minDate: '1970-01-01',
  maxDate: '2020-12-31',
  showTime: true,
};

const thisStyle = StyleSheet.create({
  containerView: {
    display: 'flex',
    flexDirection: 'row',
  },
  displayText: {
    color: COLOR.tintColor,
    fontFamily: 'genju-medium',
    fontSize: 20,
    marginRight: 10,
  },
});
