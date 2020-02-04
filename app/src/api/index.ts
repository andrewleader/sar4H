import Util, { HttpMethod } from './util';
import * as Responses from './responses';

export default class Api {
  static async authenticateAsync(username: string, password: string) {
    return await Util.postSilentRequestAsync<Responses.IAuthenticateResponse>("/account/authenticate", {
      username: username,
      password: password,
      grant_type: "client_credentials",
      client_id: "SAR4H"
    });
  }

  static async getIncedentsAsync(parameters: {
    published: number, // 0-1, whether activity has been published
    limit?: number, // 1-251, number of records to return
    offset?: number // >=0, number of records to skip from the start
  }) {
    return await Util.postSilentRequestAsync<any>("/team/incidents", parameters);
  }

  static async getAccountMembershipsAsync() {
    return await Util.fetchAuthenticatedAsync<any>(HttpMethod.GET, "/account/memberships");
  }
}