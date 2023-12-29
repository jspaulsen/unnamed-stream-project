import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";


interface Reward {
    id: string;
    image: {
        url_1x: string;
        url_2x: string;
        url_4x: string;
    };
    background_color: string;
    is_enabled: boolean;
    title: string;
    prompt: string;
    default_image: {
        url_1x: string;
        url_2x: string;
        url_4x: string;
    };
}


interface RewardState {
    rewards: Reward[];
    fetched: boolean;
}


const RewardStateSlice = createSlice({
    name: "AuthState",
    initialState: {fetched: false, rewards:[]} as RewardState,
    reducers: {
        setRewards: (state, action) => {
            state.fetched = action.payload.fetched;
            state.rewards = action.payload.rewards;
        },
    },
});


const getRewards = () => {
    return useSelector((state: any) => state.rewardState);
}

export default RewardStateSlice;
export { getRewards, RewardState, Reward };
export const { setRewards } = RewardStateSlice.actions;