// import axios
import axios from 'axios';

const TWITCH_URL = 'https://api.twitch.tv/helix';


interface TwitchTokenValidationResponse {
    client_id: string;
    login: string;
    scopes: string[];
    user_id: string;
    expires_in: number;
};

interface TwitchCustomReward {
    id: string;
    image: {
        url_1x: string;
        url_2x: string;
        url_4x: string;
    };
    background_color: string;
    is_enabled: boolean;
    title: string;
    prompt: string;
    default_image: {
        url_1x: string;
        url_2x: string;
        url_4x: string;
    };
};

interface TwitchCustomRewardResponse {
    data: TwitchCustomReward[];
};


class TwitchClient {
    private token: string;

    constructor(token: string) {
        this.token = token;
    }

    async validateToken(): Promise<TwitchTokenValidationResponse | null> {
        // get request to https://id.twitch.tv/oauth2/validate with the token as a bearer token
        const result = await axios.get('https://id.twitch.tv/oauth2/validate', {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        });

        // check if the status code is 200; if nto, return null
        if (result.status !== 200) {
            return null;
        }

        return result.data;
    }

    async getCustomRewards(user_id: string): Promise<TwitchCustomRewardResponse> {
        //GET https://api.twitch.tv/helix/channel_points/custom_rewards
        throw new Error('Not implemented');
    }
};

export {
    TwitchClient,
    TwitchTokenValidationResponse,
}