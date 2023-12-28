import { useDispatch } from "react-redux";
import Login from "./Login";
import { refreshAuths } from "./Refreshers";
import { getSpotifyAccessToken, getTwitchAccessToken } from "./slices/Auth";
import React from "react";


interface AuthProps {
    children: React.ReactNode;
}


export default function AuthLogin (props: AuthProps) {
    const dispatch = useDispatch();
    const [loading, setLoading] = React.useState(true);
    
    const twitchAccessToken = getTwitchAccessToken();
    const spotifyAccessToken = getSpotifyAccessToken();
    
    const shouldRender = twitchAccessToken !== undefined && spotifyAccessToken !== undefined;

    if (!shouldRender) {
        refreshAuths(dispatch, spotifyAccessToken, setLoading);
    }

    return (
        <>
            {shouldRender ? props.children : <Login loading={loading} />}
        </>
    )
}