import Axios from 'axios';
import { useEffect, useState } from 'react';
import { useGlobalState } from 'app/src/Store';
import { API_ENDPOINT } from '../constants';

/** 画像アップロードフック */
export const useUpdatePost = (plan) => {
  const loginUser = useGlobalState('loginUser');

  /** カメラロールに対するパーミッションの有無 */
  const [transportation, setTransportation] = useState<string>(
    plan.transportation[0],
  );
  const [fromDate, updateFrom] = useState<string>(plan.date);

  const [title, setTitle] = useState<string>(plan.title);
  const [desc, setDesc] = useState<string>(plan.description);
  const [status, setStatus] = useState<string>(plan.status);

  const updatePlan = async () => {
    const url = API_ENDPOINT.PLAN.replace('$1', plan.plan_id);
    const date = fromDate.split(' ')[0];
    try {
      await Axios.put(url, {
        user_id: plan.user_id,
        spots: plan.spots,
        title,
        description: desc,
        date,
        need_time: plan.need_time,
        transportation: [transportation],
      });

      return true;
    } catch (e) {
      console.log('Error when update date plan');
      console.log(e.response.data);
    }
  };

  return {
    transportation,
    setTransportation,
    fromDate,
    updateFrom,
    title,
    setTitle,
    desc,
    setDesc,
    updatePlan,
    status,
    setStatus,
  };
};
