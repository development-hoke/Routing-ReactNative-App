/** 通知一覧取得APIレスポンス要素 */
export interface INotification {
  notification_id: string;
  notification_category: NOTIFICATION_CATEGORY;
  notification_date: string;
  plan_id: string;
  plan_title: string;
  plan_comment: string;
  user_id: string;
  user_name: string;
  user_image_url: string;
  read: boolean;
}

/**  通知一覧取得APIレスポンス */
export interface INotificationList {
  unread_count: number;
  notification_list: Array<INotification>;
}

/** 運営からのお知らせ一覧取得APIレスポンス要素 */
export interface IInformation {
  notification_id: string;
  notification_date: string;
  title: string;
  link: string;
  read: boolean;
}

/** 運営からのお知らせ一覧取得APIレスポンス */
export interface IInformationList {
  unread_count: number;
  information_list: Array<IInformation>;
}
