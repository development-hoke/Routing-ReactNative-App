import React from 'react';
import { FlatList } from 'react-native';

// from app
import { IPlan } from 'app/src/interfaces/api/Plan';
import { RefreshSpinner } from 'app/src/components/Spinners';
import { PlanCard } from 'app/src/components/Element';

interface Props {
  planList: Array<IPlan>;
  isRefreshing: boolean;
  showUsePlan?: boolean;
  onRefresh: () => Promise<void>;
}

/** デートプランリスト */
export const PlanCardList: React.FC<Props> = (props: Props) => {
  const { planList, isRefreshing, showUsePlan, onRefresh } = props;

  const renderPlanCard = ({ item }: { item: IPlan }): JSX.Element => {
    return <PlanCard plan={item} showUsePlan={showUsePlan} />;
  };

  return (
    <FlatList
      data={planList}
      renderItem={renderPlanCard}
      refreshControl={RefreshSpinner(isRefreshing, onRefresh)}
      keyExtractor={(item) => item.plan_id}
    />
  );
};

PlanCardList.defaultProps = {
  showUsePlan: false,
};
