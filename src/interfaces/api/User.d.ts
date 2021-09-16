/** ユーザー情報取得APIレスポンス */
export interface IUserDetail {
  user_id: string;
  name: string;
  onedate_id: string;
  profile: string;
  sex: string;
  age: number;
  area: string;
  address: string;
  mail_address: string;
  user_attr: string;
  user_image_url: string;
  plan_count: number;
  follow_count: number;
  follower_count: number;
  is_follow: boolean;
  status: string;
}

/** ユーザー登録APIリクエストボディ */
export interface ICreateUserBody {
  name: string;
  sex: string;
  age: number;
  area: string;
  mail_address: string;
  password: string;
  onedate_id: string;
}

/** アプリにログインAPIリクエストボディ */
export interface ILogin {
  mail_address?: string;
  '1did'?: string;
  password: string;
}

/** アプリにログインAPIレスポンス */
export interface ILoginUser {
  user_id: string;
  name: string;
  user_image_url: string;
}

/** プロフィール編集APIレスポンス */
export interface IUpdateUserBody {
  name?: string;
  onedate_id?: string;
  profile?: string;
  age?: number;
  area?: string;
  address?: string;
  mail_address?: string;
  status: string;
}

/** パスワード編集APIレスポンス */
export interface IUpdatePasswordBody {
  old_password: string;
  new_password: string;
}
