/** よくある質問一覧取得APIレスポンス要素 */
export interface IFaq {
  question_id: number;
  question: string;
  answer: string;
}

/** よくある質問一覧取得APIレスポンス */
export interface IFaqList {
  question_list: Array<IFaq>;
}

/** 質問投稿APIリクエストボディ */
export interface IPostQuestionBody {
  user_id: string;
  question: string;
}
