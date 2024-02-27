import Util, { HttpMethod } from './util';
import * as Responses from './responses';
import {
    IIncidentsResponse,
    IMemberListItem,
    IMemberList,
  } from './responses';

export default class Api {
  static async authenticateAsync(username: string, password: string) {
    return await Util.postSilentRequestAsync<Responses.IAuthenticateResponse>("/account/authenticate", {
      username: username,
      password: password,
      grant_type: "client_credentials",
      client_id: "SAR4H"
    });
  }

  static async getMembersListAsync(memberToken: string, parameters: {
    group_id: number, // unit id number
    include_details: boolean //include or not extra member details
  }){
    return (await Util.fetchAsync<IMemberList>(HttpMethod.GET, `/team/members`, memberToken, parameters)).data;
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
    date: any, // 2020-11-24 format
    enddate: any //same as above
  ){
    let response = await Util.fetchAsync<any>(HttpMethod.POST, "/team/incidents", memberToken, {title: title, // create then 3 characters
      activity: activity, //"incident", "exercise" , or "event"
      date: date,  // format must be 2020-12-14T07:24:00.000Z
      enddate: enddate  // same format as above
    })

      return response
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

  static async getAttendancesForMultipleActivitiesAsync(memberToken: string, activityIds: number[]) {
    var response = await Util.fetchAsync<any>(HttpMethod.GET, "/team/attendance", memberToken, {
      status: "attending",
      activity_id: activityIds
    });

    return response.data as Responses.IAttendanceListItem[];
  }

  static async addAttendanceAsync(memberToken: string, activityId: number, memberId: number, activityStartDate?: Date, activityEndDate?: Date) {
// debugger
    let response = await Util.fetchAsync<any>(HttpMethod.POST, "/team/attendance", memberToken, {
      activity_id: activityId,
      member: memberId,
      status: "attending",
      date: activityStartDate?.toISOString(),
      enddate: activityEndDate?.toISOString(),
    });
    return response
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

  static async getTrainingsAsync(memberToken: string, parameters: {
    published: number, // 0-1, whether activity has been published
    limit?: number, // 1-751, number of records to return. Defaults to 250.
    offset?: number, // >=0, number of records to skip from the start
    before?: string,
    after?: string,
    sort?: string, // Specify the field to sort by, with optional direction. Ex: "title:asc" or "title:desc"
  }) {
    return await Util.fetchAsync<IIncidentsResponse>(HttpMethod.GET, "/team/exercises", memberToken, parameters);
  }

  static async getGroupsAsync(memberToken: string) {
    return (await Util.fetchAsync<any>(HttpMethod.GET, "/team/groups", memberToken)).data as Responses.IGroupListItem[];
  }

  static async getGroupAsync(memberToken: string, groupId: number) {
    return (await Util.fetchAsync<any>(HttpMethod.GET, "/team/groups/" + groupId, memberToken)).data as Responses.IGroup;
  }

  static async getGroupQualsAsync(memberToken: string, parameters: {
    groupId: number
  }) {

    var requestInfo:any = {
      method: "GET"
    };

      requestInfo.headers = {
        'Authorization': 'Bearer ' + memberToken
      };

      var response = await fetch("https://scvsar.team-manager.us.d4h.com/oldexport?category=courses_matrix&format=csv&param%5Bgroup_id%5D=11673", requestInfo);

      if (response.ok) {
        return await response.text();
      } else {
        return response.statusText;
      }

    return await Util.fetchAsync<any>(HttpMethod.GET, "/team/qualifications/22564", memberToken);
  }

  static async getAccountMembershipsAsync() {
    return await Util.fetchAuthenticatedAsync<any>(HttpMethod.GET, "/account/memberships");
  }
}