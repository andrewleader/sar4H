export default class CookiesHelper {

  static getCookie(cname: string) : string | null {

    /* http://www.w3schools.com/js/js_cookies.asp */
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return null;
  }

  static setCookie(cname: string, cvalue: string, exdays: number) {

      if (cvalue === null || typeof cvalue === "undefined") {
          this.deleteCookie(cname);
          return;
      }

      var d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      var expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + "; " + expires;
  }

  static deleteCookie(cname: string) {
      document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
  }
}