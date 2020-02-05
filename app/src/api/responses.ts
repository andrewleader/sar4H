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

export interface IIncidentsResponse {
  data: IIncidentListItem[];
}

export interface IIncidentListItem {
  id: number;
  published: number; // 0 or 1
  date: string; // "2018-10-06T18:30:00.000Z"
  enddate: string;
  ref_desc: string; // The title
  lat: number;
  lng: number;
  count_attendance: number; // # of attendees, like 4
}