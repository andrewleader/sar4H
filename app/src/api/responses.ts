export interface IAuthenticateResponse {
  data: {
    token_id: number;
    token: string;
    created: string;
    expires_on: string;
    scope: {
      source: string;
      profile: string;
    }
    account: {
      id: number;
      username: string;
      primary_email: string;
    }
  }
}