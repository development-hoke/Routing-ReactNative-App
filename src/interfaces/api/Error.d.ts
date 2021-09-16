/** APIエラーレスポンス */
export interface IApiError {
  code: number;
  message: string;
  detail_message: Array<string>;
}
