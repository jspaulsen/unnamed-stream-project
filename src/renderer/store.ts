import { configureStore } from "@reduxjs/toolkit";

import AuthState from "./slices/Auth";
import RewardState from "./slices/Rewards";


// Use `configureStore` function to create the store:
export const store = configureStore({
    reducer: {
        authState: AuthState.reducer,
        rewardState: RewardState.reducer,
    },
});


// Define the `RootState` as the return type:
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch