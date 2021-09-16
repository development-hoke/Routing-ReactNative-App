import React, { useMemo } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

// from app
import { formatDate, toDate } from 'app/src/utils/DateUtil';

interface Props {
  date: string;
  setDate: React.Dispatch<React.SetStateAction<string>>;
  minDate?: string;
  maxDate?: string;
}

/** 日付選択フォーム */
export const DatePicker: React.FC<Props> = (props: Props) => {
  const { date, setDate, minDate, maxDate } = props;

  const datetime = useMemo(() => {
    if (!date) return new Date();

    return toDate(date) || new Date();
  }, [date]);

  const minDatetime = useMemo(() => {
    if (!minDate) return undefined;

    return toDate(minDate) || undefined;
  }, [minDate]);

  const maxDatetime = useMemo(() => {
    if (!maxDate) return undefined;

    return toDate(maxDate) || undefined;
  }, [maxDate]);

  // TODO スタイリング
  return (
    <DateTimePicker
      style={{ width: 200 }}
      value={datetime}
      mode="date"
      minimumDate={minDatetime}
      maximumDate={maxDatetime}
      onChange={(_, date) => date && setDate(formatDate(date, 'YYYY-MM-DD'))}
    />
  );
};

DatePicker.defaultProps = {
  minDate: '1970-01-01',
  maxDate: '2020-12-31',
};
