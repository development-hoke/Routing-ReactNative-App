import React from 'react';
import { FlatList } from 'react-native';

// from app
import { IInformation } from 'app/src/interfaces/api/Notification';
import { RefreshSpinner } from 'app/src/components/Spinners';
import { InformationElement } from 'app/src/components/Element';

interface Props {
  informationList: Array<IInformation>;
  isRefreshing: boolean;
  onRefresh: () => Promise<void>;
}

/** 運営からのお知らせリスト */
export const InformationList: React.FC<Props> = (props: Props) => {
  const { informationList, isRefreshing, onRefresh } = props;

  /** 運営からのお知らせリスト要素の描画 */
  const renderNotificationElement = ({
    item,
  }: {
    item: IInformation;
  }): JSX.Element => {
    return <InformationElement notification={item} />;
  };

  return (
    <FlatList
      data={informationList}
      renderItem={renderNotificationElement}
      refreshControl={RefreshSpinner(isRefreshing, onRefresh)}
      keyExtractor={(item) => `${item.notification_id}`}
    />
  );
};
