import Button from '@mui/material/Button';
import './App.css';
import TwitchLogo from './assets/twitch.png';
import SpotifyLogo from './assets/spotify.png';
import Container from '@mui/material/Container';
import { getSpotifyRefreshToken, getTwitchAccessToken, setTwitchAccessToken, setUsername, setUserId, setSpotifyAccessToken, setSpotifyRefreshToken, setClientId } from './slices/Auth';
import { ipc } from './ipc';
import { useDispatch } from 'react-redux';
import { TwitchClient } from './clients/Twitch';
import { Dispatch } from '@reduxjs/toolkit';
// TODO: We need to check the status of the auth state; if we have a refresh token, we should try to refresh the access token


async function authorizeTwitch(dispatch: Dispatch) {
    const twitchAccessToken = await ipc.authorizeTwitch();
    const twitch = new TwitchClient(twitchAccessToken);
    const validate = await twitch.validateToken();

    if (!validate) {
        return;
    }

    dispatch(setTwitchAccessToken(twitchAccessToken));
    dispatch(setUsername(validate.login));
    dispatch(setUserId(validate.user_id));
    dispatch(setClientId(validate.client_id));
}


async function authorizeSpotify(dispatch: Dispatch) {
    const spotifyToken = await ipc.authorizeSpotify();

    dispatch(setSpotifyRefreshToken(spotifyToken.refresh_token));
    dispatch(setSpotifyAccessToken(spotifyToken.access_token));
}


export default function Login(props: {loading: boolean}) {
    const twitchAccessToken = getTwitchAccessToken();
    const spotifyRefreshToken = getSpotifyRefreshToken();

    const dispatch = useDispatch();
    let logo = TwitchLogo;
    let text = "Authorize Access";
    let onClick = () => authorizeTwitch(dispatch);

    // if the spotify access token is undefined, we need to authorize
    if (twitchAccessToken !== undefined && spotifyRefreshToken == undefined) {
        logo = SpotifyLogo;
        text = "Authorize Access";
        onClick = () => authorizeSpotify(dispatch);
    }

    // if loading, don't render the logo or button
    const logoPrompt = props.loading ? (<></>) : (
        <>
            <img src={logo} width={250} height={250} />

            <Button
                variant="contained"
                color='secondary'
                sx={{
                    width: '250px',
                    fontSize: '1rem',
                    display: 'flex',
                    marginTop: 10,
                }}
                onClick={onClick}
            >
                {text}
            </Button>
        </>
    );


    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}
        >   
            {logoPrompt}
        </Container>
    );
}
