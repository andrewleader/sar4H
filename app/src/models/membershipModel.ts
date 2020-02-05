import Api from "../api";
import CookiesHelper from "../helpers/cookiesHelper";

export default class MembershipModel {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async getIncidentsAsync() {
    return await Api.getIncidentsAsync(this.token, {
      published: 1
    });
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