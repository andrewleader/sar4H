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
  data: IActivityListItem[];
}

export interface IActivityListItem {
  id: number;
  published: number; // 0 or 1
  date: string; // "2018-10-06T18:30:00.000Z"
  enddate: string;
  ref_desc: string; // The title
  lat: number;
  lng: number;
  count_attendance: number; // # of attendees, like 4
  description: string;
  activity: string; // "incident", "event", etc
  tags: string[]; // Custom tags like "Rigging", "Snow", etc
}

export interface IAttendanceListItem {
  id: number, // The attendance ID
  member: IMemberListItem,
  status: string, // "attending", "requested", or "absent"
  activity: {
    id: number,
    type: string, // Exercise, event, etc
    ref: string, // Custom ref
    title: string, // "First Aid, CPR, & AED"
    date: string, // 2023-09-01T01:30:00.000Z
    enddate: string // 2023-09-01T04:30:00.000Z
  },
  duration: number, // Duration of the attendance, in minutes (like 180)
  date: string,
  enddate: string,
  role: string | null
}

export interface IMemberList{
  data: IMember[]
}

export interface IMemberListItem {
  id: number,
  name: string
}

export interface IMember {
  id: number,
  name: string,
  ref: string, // Where we store their DEM number
  email: string,
  address: string, // Home address
  homephone: string,
  mobilephone: string,
  workphone: string,
  position: string // Things like "President", "Field Team Leader", etc
}

export interface IGroup {
  id: number,
  title: string, // Title of group, like "IT Committee"
  bundle: string, // Custom bundle of group, like "Others" or "Primary"
  animal: number, // Boolean, 0 or 1
  members: number[] // Array of member IDs of the group
}

export interface IGroupListItem {
  id: number,
  title: string, // Title of group, like "IT Committee"
  bundle: string, // Custom bundle of group, like "Others" or "Primary"
  animal: number, // Boolean, 0 or 1
}