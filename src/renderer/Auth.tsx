import { getAuthState } from "./slices/Auth";
import { useDispatch } from "react-redux";
import { setAuthState, unsetAuthState } from "./slices/Auth";
import Login from "./Login";
import { ipc } from "./ipc";
import { TwitchClient } from "./clients/Twitch";

interface AuthProps {
    children: React.ReactNode;
}

export default function AuthLogin (props: AuthProps) {
    const authState = getAuthState();
    const dispatch = useDispatch();

    /* If we don't have an access token, try to get one from the main process */
    if (authState.accessToken === undefined) {
        (async () => {
            const accessToken = await ipc.getAccessToken();

            if (accessToken === undefined) {
                return;
            }
    
            const twitch = new TwitchClient(accessToken);
            const validate = await twitch.validateToken();

            if (!validate) {
                return;
            }

            // check the token expiry; if it's less than 7 days
            // reauthorize
            const expiry = (validate.expires_in / 60 / 60 / 24);

            if (expiry < 7) {
                dispatch(unsetAuthState());
            }

            const newState = {
                ...authState,
                accessToken,
                client_id: validate.client_id,
                user_id: validate.user_id,
                username: validate.login,
            };
            
            dispatch(setAuthState(newState));
        })();
    }

    return (
        <>
            {authState.accessToken ? props.children : <Login />}
        </>
    )
}