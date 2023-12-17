import { getAuthState } from "./slices/Auth";

export default function Main() {
    const authState = getAuthState();
    
    return (
        <div>
            <h1>Hello {authState.username}</h1>
        </div>
    )
}