/** フォロー一覧取得APIレスポンス要素 */
export interface IFollow {
  user_id: string;
  user_name: string;
  user_attr: string;
  user_image_url: string;
  plan_count: number;
  follow_date: string;
  is_followed: boolean;
}

/** フォロー一覧取得APIレスポンス */
export interface IFollowList {
  total: number;
  follow_list: Array<IFollow>;
}

/** フォロワー一覧取得APIレスポンス要素 */
export interface IFollower {
  user_id: string;
  user_name: string;
  user_attr: string;
  user_image_url: string;
  plan_count: number;
  followed_date: string;
  is_follow: boolean;
}

/** フォロワー一覧取得APIレスポンス */
export interface IFollowerList {
  total: number;
  follower_list: Array<IFollower>;
}

/** アカウントフォローAPIリクエスストボディ */
export interface IFollowBody {
  user_id: string;
}
