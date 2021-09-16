import React from 'react';
import { FlatList } from 'react-native';

// from app
import { IFollow, IFollower } from 'app/src/interfaces/api/Follow';
import { FollowElement } from 'app/src/components/Element';

interface Props {
  meId: string;
  follows?: Array<IFollow>;
  followers?: Array<IFollower>;
  onFollow: (id: string) => Promise<boolean>;
  onUnfollow: (id: string) => Promise<boolean>;
  reload: () => Promise<void>;
}

/** フォローリスト/フォロワーリスト */
export const FollowList: React.FC<Props> = (props: Props) => {
  const { meId, follows, followers, onFollow, onUnfollow, reload } = props;

  /** フォローリスト要素の描画 */
  const renderFollow = ({ item }: { item: IFollow }): JSX.Element => {
    return (
      <FollowElement
        meId={meId}
        follow={item}
        onFollow={onFollow}
        onUnfollow={onUnfollow}
        reload={reload}
      />
    );
  };

  /** フォロワーリスト要素の描画 */
  const renderFollower = ({ item }: { item: IFollower }): JSX.Element => {
    return (
      <FollowElement
        meId={meId}
        follower={item}
        onFollow={onFollow}
        onUnfollow={onUnfollow}
        reload={reload}
      />
    );
  };

  // フォローリスト
  if (follows && !followers) {
    return (
      <FlatList
        data={follows}
        renderItem={renderFollow}
        keyExtractor={(item) => item.user_id}
      />
    );
  }

  // フォロワーリスト
  if (!follows && followers) {
    return (
      <FlatList
        data={followers}
        renderItem={renderFollower}
        keyExtractor={(item) => item.user_id}
      />
    );
  }

  return <></>;
};
