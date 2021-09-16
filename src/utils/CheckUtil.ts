/**
 * nullまたはundefinedでないかをチェックする
 * @param value 任意の値
 * @return boolean
 */
export const isNotNullOrUndefined = (value?: any): boolean =>
  value !== null && value !== undefined;

/**
 * 空文字かどうかをチェックする
 * @param value 任意の文字列
 * @return boolean
 */
export const isEmpty = (value: string): boolean => value === '';

/**
 * メールアドレスかどうかをチェックする
 * @param value 任意の文字列
 * @return boolean
 */
export function validateEmail(value: string): boolean {
  // eslint-disable-next-line no-useless-escape
  const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (value.match(EMAIL_REGEX)) {
    return true;
  }

  return false;
}

/**
 * 半角英数記号かどうかをチェックする
 * @param value 任意の文字列
 * @return boolean
 */
export function validateAlphaNumericSymbol(value: string): boolean {
  const ALPHA_NUMERIC_SYMBOL_REGEX = /^[\x20-\x7e]*$/;

  if (value.match(ALPHA_NUMERIC_SYMBOL_REGEX)) {
    return true;
  }

  return false;
}

/**
 * 半角英数かどうかをチェックする
 * @param value 任意の文字列
 * @return boolean
 */
export function validateAlphaNumeric(value: string): boolean {
  const ALPHA_NUMERIC_REGEX = /^[a-zA-Z0-9]*$/;

  if (value.match(ALPHA_NUMERIC_REGEX)) {
    return true;
  }

  return false;
}

/**
 * 文字数が6文字以上20文字以内かどうかをチェックする
 * @param value 任意の文字列
 * @return boolean
 */

 export function validateStringLength(value: string): boolean {
  if (value.length < 6) {
    return true;
  } else if (value.length > 20) {
    return true;
  }

  return false;
}
