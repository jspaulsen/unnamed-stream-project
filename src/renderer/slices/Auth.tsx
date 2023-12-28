import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { ipc } from "../ipc";


interface AuthState {
    twitchAccessToken?: string;
    spotifyAccessToken?: string;
    spotifyRefreshToken?: string;
    username?: string;
    userId?: string;
    clientId?: string;
}


const AuthStateSlice = createSlice({
    name: "AuthState",
    initialState: {} as AuthState,
    reducers: {
        setTwitchAccessToken: (state, action) => {
            state.twitchAccessToken = action.payload;
            ipc.setTwitchAccessToken(action.payload);
        },
        setSpotifyAccessToken: (state, action) => {
            state.spotifyAccessToken = action.payload;
        },
        setSpotifyRefreshToken: (state, action) => {
            state.spotifyRefreshToken = action.payload;
            ipc.setSpotifyRefreshToken(action.payload);
        },
        setUsername: (state, action) => {
            state.username = action.payload;
        },
        setUserId: (state, action) => {
            state.userId = action.payload;
        },
        setClientId: (state, action) => {
            state.clientId = action.payload;
        },
        unsetTwitchAccessToken: (state) => {
            state.twitchAccessToken = undefined;
            ipc.setTwitchAccessToken(undefined);
        },
        unsetSpotifyRefreshToken: (state) => {
            state.spotifyRefreshToken = undefined;
            state.spotifyAccessToken = undefined;

            ipc.setSpotifyRefreshToken(undefined);
        },
        unsetAuthState: (state) => {
            state.twitchAccessToken = undefined;
            state.spotifyRefreshToken = undefined;
            state.spotifyAccessToken = undefined;
            state.username = undefined;
            state.userId = undefined;

            ipc.setTwitchAccessToken(undefined);
            ipc.setSpotifyRefreshToken(undefined);
        }
    },
});


const getTwitchAccessToken = () => {return useSelector((state: any) => state.authState.twitchAccessToken)}
const getSpotifyAccessToken = () => {return useSelector((state: any) => state.authState.spotifyAccessToken)}
const getSpotifyRefreshToken = () => {return useSelector((state: any) => state.authState.spotifyRefreshToken)}
const getUsername = () => {return useSelector((state: any) => state.authState.username)}
const getUserId = () => {return useSelector((state: any) => state.authState.userId)}
const getClientId = () => {return useSelector((state: any) => state.authState.clientId)}


export default AuthStateSlice;
export { 
    getTwitchAccessToken,
    getSpotifyAccessToken,
    getSpotifyRefreshToken,
    getUsername,
    getUserId,
    getClientId,
};

export const {
    unsetAuthState,
    unsetTwitchAccessToken,
    unsetSpotifyRefreshToken,
    setTwitchAccessToken,
    setSpotifyAccessToken,
    setSpotifyRefreshToken,
    setUsername,
    setUserId,
    setClientId,
} = AuthStateSlice.actions;