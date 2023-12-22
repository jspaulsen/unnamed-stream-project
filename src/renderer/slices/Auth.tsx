import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { ipc } from "../ipc";


interface AuthState {
    accessToken?: string;
    username?: string;
    user_id?: string;
    client_id?: string;
}


function storeState(state: AuthState) {
    ipc.setAccessToken(state.accessToken);
}

function unsetState() {
    ipc.setAccessToken(undefined);
}


const AuthStateSlice = createSlice({
    name: "AuthState",
    // initialState,
    initialState: {} as AuthState,
    reducers: {
        setAuthState: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.username = action.payload.username;
            state.user_id = action.payload.user_id;
            state.client_id = action.payload.client_id;
            
            storeState(state);
        },
        unsetAuthState: (state) => {
            state.accessToken = undefined;
            state.username = undefined;
            state.user_id = undefined;
            state.client_id = undefined;
            
            unsetState();
        },
    },
});


const getAuthState = () => {
    return useSelector((state: any) => state.authState);
}


export default AuthStateSlice;
export { getAuthState };
export const { setAuthState, unsetAuthState } = AuthStateSlice.actions;