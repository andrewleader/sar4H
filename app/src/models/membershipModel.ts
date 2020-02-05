import Api from "../api";
import CookiesHelper from "../helpers/cookiesHelper";
import ActivityListItemModel from "./activityListItemModel";
import { IMemberListItem, IActivityListItem } from "../api/responses";
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

  async getMissionsAsync(parameters: {
    published: boolean, // Whether activity has been published or is a draft
    limit?: number, // 1-251, number of records to return
    offset?: number // >=0, number of records to skip from the start
  }) {
    var result = await Api.getIncidentsAsync(this.token, {
      published: parameters.published ? 1 : 0,
      limit: parameters.limit,
      offset: parameters.offset
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

  private attendeesCache:Map<number, Promise<IMemberListItem[]>> = new Map<number, Promise<IMemberListItem[]>>();

  getAttendingMembers(activityId: number) {
    if (this.attendeesCache.has(activityId)) {
      return this.attendeesCache.get(activityId);
    }

    var promise = (async () => {
      var result = await Api.getAttendanceAsync(this.token, activityId, "attending");
      var answer: IMemberListItem[] = [];
      result.forEach(attendance => {
        answer.push(attendance.member);
      });
      return answer;
    })();

    this.attendeesCache.set(activityId, promise);
    return promise;
  }

  async setAttendingAsync(activityId: number) {
    await Api.addAttendanceAsync(this.token, activityId, this.memberId);
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