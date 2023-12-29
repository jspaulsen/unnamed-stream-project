import { Reward, RewardState, getRewards } from "../slices/Rewards";
import LabeledDropdown from "./LabeledDropdown";


interface RewardRedemptionProps {
  reward: string;
  setReward: (reward: string) => void;
}


export default function RewardRedemption(props: RewardRedemptionProps) {
  const rewardState = getRewards();

  return (
    <>
      <LabeledDropdown
        label="Reward"
        options={rewardState.rewards.map((reward: Reward) => {
          return reward.title;
        })}
        value={props.reward}
        setValue={props.setReward}
      />
    </>
  );
}