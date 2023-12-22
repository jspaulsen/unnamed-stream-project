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
}


const RewardStateSlice = createSlice({
    name: "AuthState",
    // initialState,
    initialState: {} as RewardState,
    reducers: {
        setRewards: (state, action) => {
            state.rewards = action.payload;
        },
    },
});


const getRewards = () => {
    return useSelector((state: any) => state.rewards);
}

export default RewardStateSlice;
export { getRewards };
export const { setRewards } = RewardStateSlice.actions;