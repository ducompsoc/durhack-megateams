import OAuth2Strategy from "passport-oauth2";
import fetch from "node-fetch";


export interface DurHackLiveProfile {
  email: string,
  preferred_name: string,
}

export default class DurHackLiveOAuth2Strategy extends OAuth2Strategy {
  async userProfile(accessToken: string, done: (err?: (Error | null), profile?: DurHackLiveProfile) => void) {
    await
    super.userProfile(accessToken, done);
  }
}