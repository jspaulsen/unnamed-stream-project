import Button from '@mui/material/Button';
import './App.css';
import twitchLogo from './assets/twitch.png';
import Container from '@mui/material/Container';
import { getAuthState, setAuthState } from './slices/Auth';
import { ipc } from './ipc';
import { useDispatch } from 'react-redux';
import { TwitchClient } from './clients/Twitch';

// TODO: We need to check the status of the auth state; if we have a refresh token, we should try to refresh the access token


export default function Login() {
    const authState = getAuthState();
    const dispatch = useDispatch();

    async function authorizeTwitch() {
        const accessToken = await ipc.authorizeTwitch();
        const twitch = new TwitchClient(accessToken);
        const validate = await twitch.validateToken();

        if (!validate) {
            return;
        }

        const newState = {
            ...authState,
            accessToken,
            username: validate.login,
        };

        dispatch(setAuthState(newState));
    }

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
            <img src={twitchLogo} alt="Twitch" width={250} height={250} />

            <Button
                variant="contained"
                color='secondary'
                sx={{
                    width: '250px',
                    fontSize: '1rem',
                    display: 'flex',
                }}
                onClick={() => {
                    authorizeTwitch();
                }}
            >
                Login with Twitch
            </Button>
        </Container>
    );
}
