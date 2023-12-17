import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { ipc } from "../ipc";
import { useDispatch } from "react-redux";

interface AuthState {
    accessToken?: string;
    username?: string;
}


function storeState(state: AuthState) {
    ipc.setAccessToken(state.accessToken);
}


const AuthStateSlice = createSlice({
    name: "AuthState",
    // initialState,
    initialState: {} as AuthState,
    reducers: {
        setAuthState: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.username = action.payload.username;

            storeState(state);
        },
        // unsetJwt: (state) => {
        //     state.access_token = undefined;
        // }
    },
});


const getAuthState = () => {
    return useSelector((state: any) => state.authState);
}


export default AuthStateSlice;
export { getAuthState };
export const { setAuthState } = AuthStateSlice.actions;