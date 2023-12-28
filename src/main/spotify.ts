import * as crypto from 'crypto';

function base64encode(input: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}


function randomCodeVerifier() {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomValues = crypto.getRandomValues(new Uint8Array(64));
  const randomString = randomValues.reduce((acc, x) => acc + possible[x % possible.length], "");

  return randomString;
}


class SpotifyAuth {
  private clientId: string;
  private callbackUrl: string;
  private codeVerifier: string;
  private scope: string[];

  constructor(clientId: string, callbackUrl: string, scope: string[]) {
    this.clientId = clientId;
    this.callbackUrl = callbackUrl;
    this.scope = scope;
    this.codeVerifier = randomCodeVerifier();
  }

  public async generateAuthUrl(): Promise<string> {
    const authUrl = new URL('https://accounts.spotify.com/authorize');
    const data = new TextEncoder().encode(this.codeVerifier);
    const hashed = await crypto.subtle.digest('SHA-256', data);
    const codeChallenge = base64encode(hashed);

    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: this.callbackUrl,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      scope: this.scope.join(' '),
    });

    authUrl.search = params.toString();
    return authUrl.toString();
  }

  public async exchangeCodeForToken(code: string): Promise<any> {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.callbackUrl,
        client_id: this.clientId,
        code_verifier: this.codeVerifier,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to exchange code for token: ${response.status} ${response.statusText}: ${await response.text()}`);
    }

    return response.json();
  }
}

export {
  SpotifyAuth,
}
