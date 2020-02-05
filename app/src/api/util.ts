import { IErrorResponse } from "./responses";
import Authorized from '../components/Authorized';

const baseUrl = "https://api.d4h.org/v2";

export enum HttpMethod {
  GET = "GET",
  POST = "POST"
}

export default class Util {

  // Doesn't trigger loading indicator or anything else. Just silently sends.
  static async postSilentRequestAsync<T>(relativeUrl: string, data: any): Promise<T> {

    if (data == null)
      throw new Error("data was null");

    const formData = new FormData();

    for (const property in data) {
      formData.append(property, data[property]);
    }

    var url = baseUrl + relativeUrl;

    var requestInfo:any = {
      method: "POST",
      body: formData
    };

    var token = Authorized.getToken();
    if (token)
    {
      requestInfo.headers = {
        'Authorization': 'Bearer ' + token
      };
    }

    var response = await fetch(url, requestInfo);

    if (!response.ok) {
      try {
        var errorObj = await response.json() as IErrorResponse;
        errorObj.toString = () => errorObj.message;
        throw errorObj;
      } catch {
        var errorResp: IErrorResponse = {
          statusCode: response.status,
          error: response.statusText,
          message: "Unknown error. Check internet connection."
        };
        errorResp.toString = () => errorObj.message;
        throw errorResp;
      }
    }

    var obj = await response.json();
    return obj as T;
  }

  static async fetchAuthenticatedAsync<T>(method: HttpMethod, relativeUrl: string, data?: any): Promise<T> {
    var token = Authorized.getToken();
    if (token) {
      return await Util.fetchAsync(method, relativeUrl, token, data);
    } else {
      throw new Error("Token was null");
    }
  }

  static async fetchAsync<T>(method: HttpMethod, relativeUrl: string, token: string, data?: any): Promise<T> {
    var url = new URL(baseUrl + relativeUrl);

    if (method === HttpMethod.GET && data) {
      Object.keys(data).forEach(key => url.searchParams.append(key, data[key]));
    }

    var requestInfo:any = {
      method: method.toString()
    };

    if (method === HttpMethod.POST && data) {
      const formData = new FormData();

      for (const property in data) {
        formData.append(property, data[property]);
      }

      requestInfo.body = formData;
    }

    if (token) {
      requestInfo.headers = {
        'Authorization': 'Bearer ' + token
      };
    } else {
      throw new Error("Token was null");
    }

    var response = await fetch(url.href, requestInfo);

    if (!response.ok) {
      try {
        var errorObj = await response.json() as IErrorResponse;
        errorObj.toString = () => errorObj.message;
        throw errorObj;
      } catch {
        var errorResp: IErrorResponse = {
          statusCode: response.status,
          error: response.statusText,
          message: "Unknown error. Check internet connection."
        };
        errorResp.toString = () => errorObj.message;
        throw errorResp;
      }
    }

    var obj = await response.json();
    return obj as T;
  }

}