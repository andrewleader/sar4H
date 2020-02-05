import Api from "../api";
import CookiesHelper from "../helpers/cookiesHelper";

export default class MembershipModel {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async getIncidentsAsync(parameters: {
    published: number, // 0-1, whether activity has been published
    limit?: number, // 1-251, number of records to return
    offset?: number // >=0, number of records to skip from the start
  }) {
    return await Api.getIncidentsAsync(this.token, parameters);
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