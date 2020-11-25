import Util, { HttpMethod } from './util';
import * as Responses from './responses';
import { IIncidentsResponse } from './responses';

export default class Api {
  static async authenticateAsync(username: string, password: string) {
    return await Util.postSilentRequestAsync<Responses.IAuthenticateResponse>("/account/authenticate", {
      username: username,
      password: password,
      grant_type: "client_credentials",
      client_id: "SAR4H"
    });
  }

  static async getIncidentsAsync(memberToken: string, parameters: {
    published: number, // 0-1, whether activity has been published
    limit?: number, // 1-251, number of records to return
    offset?: number // >=0, number of records to skip from the start
    after?: string, // string date format "2020-10-01T20:35:00.000Z" 
    before?: string,// string date format "2020-10-01T20:35:00.000Z"
  }) {
    return await Util.fetchAsync<IIncidentsResponse>(HttpMethod.GET, "/team/incidents", memberToken, parameters);
  }

  static async addIncidentAsync(memberToken: string, 
    title: string, // greater then 3 characters
    activity: string, //"incident", "exercise" , or "event"
    date: Date, // 2020-11-24 format
    enddate: Date //same as above
  ){
     await Util.fetchAsync<any>(HttpMethod.POST, "/team/incidents", memberToken, {title: title, // create then 3 characters
      activity: activity, //"incident", "exercise" , or "event"
      date: date.toISOString(), // 2020-11-24 format
      enddate: enddate.toISOString()})
  }



  static async getActivityAsync(memberToken: string, activityId: number) {
    var response = await Util.fetchAsync<any>(HttpMethod.GET, `/team/activities/${activityId}`, memberToken);
    return response.data as Responses.IActivityListItem;
  }

  static async getAttendanceAsync(memberToken: string, activityId: number, status?: string) {
    var response = await Util.fetchAsync<any>(HttpMethod.GET, "/team/attendance", memberToken, {
      activity_id: activityId,
      status: status
    });
    return response.data as Responses.IAttendanceListItem[];
  }

  static async addAttendanceAsync(memberToken: string, activityId: number, memberId: number, activityStartDate?: Date, activityEndDate?: Date) {
    await Util.fetchAsync<any>(HttpMethod.POST, "/team/attendance", memberToken, {
      activity_id: activityId,
      member: memberId,
      status: "attending",
      date: activityStartDate?.toISOString(),
      enddate: activityEndDate?.toISOString()
    });
  }

  static async deleteAttendanceAsync(memberToken: string, attendanceId: number) {
    await Util.fetchAsync<any>(HttpMethod.DELETE, `/team/attendance/${attendanceId}`, memberToken);
  }

  static async getEventsAsync(memberToken: string, parameters: {
    published: number, // 0-1, whether activity has been published
    limit?: number, // 1-251, number of records to return
    offset?: number, // >=0, number of records to skip from the start
    before?: string,
    after?: string
  }) {
    return await Util.fetchAsync<IIncidentsResponse>(HttpMethod.GET, "/team/events", memberToken, parameters);
  }

  static async getAccountMembershipsAsync() {
    return await Util.fetchAuthenticatedAsync<any>(HttpMethod.GET, "/account/memberships");
  }
}