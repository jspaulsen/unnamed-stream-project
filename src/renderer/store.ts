import { configureStore } from "@reduxjs/toolkit";

import AuthState from "./slices/Auth";


// Use `configureStore` function to create the store:
export const store = configureStore({
    reducer: {
        authState: AuthState.reducer,
    },
});


// Define the `RootState` as the return type:
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch