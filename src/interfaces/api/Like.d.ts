/** デートプランお気に入り登録者一覧取得APIレスポンス要素  */
export interface ILikeUser {
  user_id: string;
  user_name: string;
  user_attr: string;
  user_image_url: string;
}

/** デートプランお気に入り登録者一覧取得APIレスポンス */
export interface ILikeUserList {
  total: number;
  liked_user_list: Array<ILikeUser>;
}

/** デートプランお気に入り登録APIリクエスストボディ */
export interface ILikeBody {
  user_id: string;
}
