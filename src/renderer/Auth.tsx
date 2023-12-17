import { getAuthState } from "./slices/Auth";
import { useDispatch } from "react-redux";
import { setAuthState } from "./slices/Auth";
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

            console.log(validate);

            const newState = {
                ...authState,
                accessToken,
                username: validate.login,
            };
            
            console.log(`Setting auth state: ${JSON.stringify(newState)}`);
            dispatch(setAuthState(newState));
        })();
    }

    return (
        <>
            {authState.accessToken ? props.children : <Login />}
        </>
    )
}