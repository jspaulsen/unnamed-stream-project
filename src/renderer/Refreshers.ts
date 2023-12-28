import { Dispatch } from "@reduxjs/toolkit";
import { ipc } from "./ipc";
import { TwitchClient, TwitchTokenValidationResponse } from "./clients/Twitch";
import { AccessToken, SpotifyClient } from "./clients/Spotify";
import { getSpotifyAccessToken, getSpotifyRefreshToken, getTwitchAccessToken, setClientId, setSpotifyAccessToken, setSpotifyRefreshToken, setTwitchAccessToken, setUserId, setUsername, unsetSpotifyRefreshToken, unsetTwitchAccessToken } from "./slices/Auth";


async function refreshAuths(dispatch: Dispatch, spotifyAccessToken: string | undefined, setLoading: (loading: boolean) => void) {
    const twitchAccessToken = await ipc.getTwitchAccessToken();
    const spotifyRefreshToken = await ipc.getSpotifyRefreshToken();

    /* If we're missing either token, we cannot refresh; we'll let the Login page sort it out */
    if (twitchAccessToken === undefined || spotifyRefreshToken === undefined) {
        setLoading(false);
        return;
    }

    if (spotifyAccessToken === undefined) {
        const spotifyToken = await refreshSpotifyToken(spotifyRefreshToken);

        if (spotifyToken === null) {
            dispatch(unsetSpotifyRefreshToken());
            setLoading(false);
            return;
        }

        dispatch(setSpotifyAccessToken(spotifyToken.access_token));
        dispatch(setSpotifyRefreshToken(spotifyToken.refresh_token));
    }

    const validate = await validateTwitchToken(twitchAccessToken);

    if (!validate) {
        dispatch(unsetTwitchAccessToken());
        setLoading(false);
        return;
    }

    dispatch(setTwitchAccessToken(twitchAccessToken));
    dispatch(setUsername(validate.login));
    dispatch(setClientId(validate.client_id));
    dispatch(setUserId(validate.user_id));

    setLoading(false);
}


async function validateTwitchToken(accessToken: string): Promise<TwitchTokenValidationResponse | null> {
    const twitch = new TwitchClient(accessToken);
    const validate = await twitch.validateToken();

    if (!validate) {
        return null;
    }

    // check the token expiry; if it's less than 7 days
    // reauthorize
    const expiry = (validate.expires_in / 60 / 60 / 24);

    if (expiry < 7) {
        return null;
    }

    return validate;
}

async function refreshSpotifyToken(refreshToken: string): Promise<AccessToken | null> {
    const clientId = await ipc.getSpotifyClientId();
    const spotifyClient = new SpotifyClient(clientId);

    if (clientId === undefined) {
        return null;
    }

    const result = await spotifyClient.refreshAccessToken(refreshToken);

    if (!result || result.expires_in === undefined) {
        return null;
    }

    return result;
}



export {
    refreshAuths,
}