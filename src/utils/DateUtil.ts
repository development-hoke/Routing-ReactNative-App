import moment from 'moment';

/**
 * 日付を任意の形式に変換する
 * @param value 入力値
 * @param format 変換する形式
 * @return 変換後の日付文字列
 */
export function formatDate(
  value: string | number | Date,
  format: string,
): string {
  const datetime = moment(value);

  if (!datetime.isValid) {
    console.warn('Cannot convert by Moment');

    return '';
  }

  return datetime.format(format);
}

/**
 * 今日の日付を「yyyy-MM-dd」形式で取得する
 * @return yyyy-MM-dd
 */
export const getToday = (): string => moment().format('YYYY-MM-DD');

export const getNextDay = (): string =>
  moment().add(1, 'd').format('YYYY-MM-DD');

/**
 * 日付をDateオブジェクトに変換する
 * @param value 入力値
 * @return Dateオブジェクト(変換できなければnull)
 */
export function toDate(value: string | number): Date | null {
  const datetime = moment(value);

  if (!datetime.isValid) {
    console.warn('Cannot convert by Moment');

    return null;
  }

  return datetime.toDate();
}

/**
 * 日付からから年齢を計算する
 * @param value 入力値
 * @return 年齢
 */
export function getAge(value: string | number): number {
  const d = moment(value);

  if (!d.isValid) {
    console.warn('Cannot convert by Moment');

    return 0;
  }

  const dObj = d.toObject();
  const birthDate = moment()
    .year(dObj.years)
    .month(dObj.months - 1)
    .date(dObj.date);

  return moment().diff(birthDate, 'years');
}
