import React from 'react';
import { FlatList } from 'react-native';

// from app
import { ILikeUser } from 'app/src/interfaces/api/Like';
import { LikeUserElement } from 'app/src/components/Element';

interface Props {
  users: Array<ILikeUser>;
}

/** デートプランお気に入り登録者リスト */
export const LikeUserList: React.FC<Props> = (props: Props) => {
  const { users } = props;

  const renderLikeUserElement = ({
    item,
  }: {
    item: ILikeUser;
  }): JSX.Element => {
    return <LikeUserElement user={item} />;
  };

  return (
    <FlatList
      data={users}
      renderItem={renderLikeUserElement}
      keyExtractor={(item) => item.user_id}
    />
  );
};
