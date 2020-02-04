const baseUrl = "https://api.d4h.org/v2";

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

    var response = await fetch(url, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("Network response was " + response.status);
    }

    var obj = await response.json();
    return obj as T;
  }

}