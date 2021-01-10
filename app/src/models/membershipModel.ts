import Api from "../api";
import CookiesHelper from "../helpers/cookiesHelper";
import ActivityListItemModel from "./activityListItemModel";
import { IMemberListItem, IActivityListItem, IAttendanceListItem } from "../api/responses";
import moment from "moment";

export default class MembershipModel {
  private memberId: number;
  private token: string;

  constructor(memberId: number, token: string) {
    this.memberId = memberId;
    this.token = token;
  }

  getMemberId() {
    return this.memberId;
  }

  async getActiveMissionsAsync() {
    var draftMissions = await this.getMissionsAsync({
      published: false
    });

    var activeMissions:ActivityListItemModel[] = [];
    draftMissions.forEach((mission) => {
      if (mission.enddate === undefined || mission.enddate > new Date()) {
        activeMissions.push(mission);
      }
    });
    
    return activeMissions;
  }

  async getMembersAsync(
    parameters: {
      group_id: number, // unit id number
      include_details: boolean //include or not extra member details
  }){
    let results = await Api.getMembersListAsync(
      this.token, 
      {
        group_id: parameters.group_id,
        include_details: parameters.include_details
      }
    )
  
    return results
  }

  async getMissionsAsync(parameters: {
    published: boolean, // Whether activity has been published or is a draft
    limit?: number, // 1-251, number of records to return
    offset?: number, // >=0, number of records to skip from the start
    after?: string, // string date format "2020-10-01T20:35:00.000Z"
    before?: string, // string date format "2020-10-01T20:35:00.000Z"
  }) {
    var result = await Api.getIncidentsAsync(this.token, {
      published: parameters.published ? 1 : 0,
      limit: parameters.limit,
      offset: parameters.offset,
      after: parameters.after

    });
    var answer: ActivityListItemModel[] = [];
    result.data.forEach((activity) => {
      // Ignore missions that don't have a date
      if (activity.date) {
        answer.push(this.createActivityListItemModel(activity));
      }
    });
    return answer;
  }

  async getUpcomingMeetingsAsync() {
    var result = await Api.getEventsAsync(this.token, {
      published: 0,
      after: moment().startOf('day').toISOString()
    });
    var answer: ActivityListItemModel[] = [];
    result.data.forEach((activity) => {
      // Ignore missions that don't have a date
      // if (activity.date) {
        answer.push(this.createActivityListItemModel(activity));
      // }
    });
    return answer;
  }

  private createActivityListItemModel(activity: IActivityListItem) {
    var model = new ActivityListItemModel(activity);
    this.requestedActivites.set(model.id, Promise.resolve(model));
    return model;
  }

  private attendanceCache:Map<number, Promise<IAttendanceListItem[]>> = new Map<number, Promise<IAttendanceListItem[]>>();

  getAttendanceAsync(activityId: number) {
    if (this.attendanceCache.has(activityId)) {
      return this.attendanceCache.get(activityId);
    }

    var promise = (async () => {
      return await Api.getAttendanceAsync(this.token, activityId, "attending");
    })();

    this.attendanceCache.set(activityId, promise);
    return promise;
  }

  async setAttendingAsync(activityId: number, activityStartDate?: Date, activityEndDate?: Date) {
    await Api.addAttendanceAsync(this.token, activityId, this.memberId, activityStartDate, activityEndDate);

    // Clear affected caches
    this.attendanceCache.delete(activityId);
    this.requestedActivites.delete(activityId);
  }

  async removeAttendingAsync(activityId: number, attendanceId: number) {
    await Api.deleteAttendanceAsync(this.token, attendanceId);
    
    // Clear affected caches
    this.attendanceCache.delete(activityId);
    this.requestedActivites.delete(activityId);
  }

  private requestedActivites:Map<number, Promise<ActivityListItemModel>> = new Map<number, Promise<ActivityListItemModel>>();

  getActivityAsync(activityId: number) {
    if (this.requestedActivites.has(activityId)) {
      return this.requestedActivites.get(activityId);
    } else {
      var promise = this.getActivityHelperAsync(activityId);
      this.requestedActivites.set(activityId, promise);
      return promise;
    }
  }

  private async getActivityHelperAsync(activityId: number) {
    return new ActivityListItemModel(await Api.getActivityAsync(this.token, activityId));
  }

  static membershipModels:Map<string, MembershipModel> = new Map<string, MembershipModel>();

  static get(membershipId: string) {
    if (this.membershipModels.has(membershipId)) {
      return this.membershipModels.get(membershipId);
    }

    var token = CookiesHelper.getCookie("membership" + membershipId);
    var memberId = CookiesHelper.getCookie("membership" + membershipId + "_memberId");
    if (token !== null && memberId !== null) {
      var model = new MembershipModel(parseInt(memberId), token);
      this.membershipModels.set(membershipId, model);
      return model;
    } else {
      return null;
    }
  }
}