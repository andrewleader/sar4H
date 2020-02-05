import Api from "../api";
import CookiesHelper from "../helpers/cookiesHelper";
import ActivityListItemModel from "./activityListItemModel";
import { IMemberListItem } from "../api/responses";
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
        answer.push(new ActivityListItemModel(activity));
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
        answer.push(new ActivityListItemModel(activity));
      // }
    });
    return answer;
  }

  async getAttendingMembers(activityId: number) {
    var result = await Api.getAttendanceAsync(this.token, activityId);
    var answer: IMemberListItem[] = [];
    result.forEach(attendance => {
      answer.push(attendance.member);
    });
    return answer;
  }

  async setAttendingAsync(activityId: number) {
    await Api.addAttendanceAsync(this.token, activityId, this.memberId);
  }

  static get(membershipId: string) {
    var token = CookiesHelper.getCookie("membership" + membershipId);
    var memberId = CookiesHelper.getCookie("membership" + membershipId + "_memberId");
    if (token !== null && memberId !== null) {
      return new MembershipModel(parseInt(memberId), token);
    } else {
      return null;
    }
  }
}