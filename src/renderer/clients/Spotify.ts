export interface AccessToken {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    expires?: number;
}

class SpotifyClient {
    private clientId: string;

    constructor(clientId: string) {
        this.clientId = clientId;
    }

    public async refreshAccessToken(refreshToken: string): Promise<AccessToken | null> {
        const url = "https://accounts.spotify.com/api/token";
        const payload = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: this.clientId,
          }),
        };
    
        const response = await fetch(url, payload);

        if (!response.ok) {
            return null;
        }

        const body = await response.json();

        return body;
    }
}

export {
    SpotifyClient,
}


    // private async refreshAccessToken(): Promise<AccessToken> {
    //     const url = "https://accounts.spotify.com/api/token";
    //     const payload = {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //       },
    //       body: new URLSearchParams({
    //         grant_type: 'refresh_token',
    //         refresh_token: this.refreshToken,
    //         client_id: this.clientId,
    //       }),
    //     }
      
    //     const body = await fetch(url, payload);
    //     const response = await body.json();

    //     // if the response is 400-499, then we need to re-authenticate
    //     if (response.error) {
    //         localStorage.removeItem('spotifyRefreshToken');
    //         onError(response.error_description);
    //     }

    //     return response;
    // }