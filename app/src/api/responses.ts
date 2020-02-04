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

export interface IErrorResponse {
  statusCode: number; // Like 401
  error: string; // Basic error category, like "Unauthorized"
  message: string; // Informative message, like "The account could not be found."
}