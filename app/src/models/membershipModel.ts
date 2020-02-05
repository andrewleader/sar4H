import Api from "../api";
import CookiesHelper from "../helpers/cookiesHelper";
import MissionListItemModel from "./missionListItemModel";

export default class MembershipModel {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async getActiveMissionsAsync() {
    var draftMissions = await this.getMissionsAsync({
      published: false
    });

    var activeMissions:MissionListItemModel[] = [];
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
    var answer: MissionListItemModel[] = [];
    result.data.forEach((incident) => {
      // Ignore missions that don't have a date
      if (incident.date) {
        answer.push(new MissionListItemModel(incident));
      }
    });
    return answer;
  }

  static get(membershipId: string) {
    var token = CookiesHelper.getCookie("membership" + membershipId);
    if (token !== null) {
      return new MembershipModel(token);
    } else {
      return null;
    }
  }
}