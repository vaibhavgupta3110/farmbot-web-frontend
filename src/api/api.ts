type ProtocolString = "http:" | "https:";
let current: API | undefined;
/** Record of all the relevant stuff in a string URL, except without all the
 *  stringly typed nonsense. */
interface UrlInfo {
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  host: string;
};

/** Store all API endpoints in one place for the sake of DRYness.
 * API.current is probably the instance you want to use. */
export class API {
  /** Guesses the most appropriate API port based on a number of environment
   *  factors such as hostname and protocol (HTTP vs. HTTPS). */
  static inferPort(): string {

    // ATTEMPT 1: Most devs running a webpack server on localhost
    //            run the API on port 3000.
    if (location.port === "8080") { return "3000"; }

    // ATTEMPT 2: If they provide an explicit port (as in ://localhost:3000)
    //            use that port.
    if (location.port) { return location.port; }

    // ATTEMPT 3:  If that doesn't work, check for HTTPS:// and use the
    //             default of 443.
    if (API.parseURL(location.origin).protocol === "https:") {
      return "443";
    }

    // All others just use port 80.
    return "80";
  }

  static fetchBrowserLocation() {
    return `//${window.location.hostname}:${API.inferPort()}`;
  }

  static fetchHostName() {
    // Figured we could centralize this in case we change the method.
    return window.location.hostname;
  }

  static parseURL(url: string): UrlInfo {
    // Such an amazing hack!
    var info = document.createElement("a");
    info.href = url;
    return info;
  }

  static setBaseUrl(base: string) {
    current = new API(base);
  }
  /** The base URL can't be known until the user is logged in.
   * API.current will give URLs is the base URL is known and throw an
   * exception otherwise.
   */
  static get current(): API {
    if (current) {
      return current;
    } else {
      throw new Error(`
            Tried to access API before URL was resolved.
            Call API.setBaseUrl() before using API.current .`);
    }
  };

  /** "https:" or "http:". NO "//"! */
  private readonly protocol: ProtocolString;
  /** "localhost", "yahoo.com" */
  private readonly hostname: string;
  /** "80", "443" or "" */
  private readonly port: string;
  /** "/pathname/x/whatever" or "/foo/" */
  private readonly pathname: string;
  /** "?foo=bar" */
  private readonly search: string;
  /** "#hashfragment" */
  private readonly hash: string;
  /** "example.com:3000" */
  private readonly host: string;

  constructor(input: string) {
    let url = API.parseURL(input);
    this.protocol = url.protocol as ProtocolString;
    this.hostname = url.hostname;
    this.port = url.port;
    this.pathname = url.pathname;
    this.search = url.search;
    this.hash = url.hash;
    this.host = url.host;
  }

  /** http://localhost:3000 */
  get baseUrl() { return `${this.protocol}//${this.host}`; };
  /** /api/tokens/ */
  get tokensPath() { return `${this.baseUrl}/api/tokens/`; };
  /** /api/password_resets/ */
  get passwordResetPath() { return `${this.baseUrl}/api/password_resets/`; };
  /** /api/device/ */
  get devicePath() { return `${this.baseUrl}/api/device/`; };
  /** /api/users/ */
  get usersPath() { return `${this.baseUrl}/api/users/`; };
  /** /api/peripherals/ */
  get peripheralsPath() { return `${this.baseUrl}/api/peripherals/`; };
  /** /api/plants/ */
  get farmEventsPath() { return `${this.baseUrl}/api/farm_events/`; };
  /** /api/plants/ */
  get plantsPath() { return `${this.baseUrl}/api/plants/`; };
  /** /api/regimens/ */
  get regimensPath() { return `${this.baseUrl}/api/regimens/`; };
  /** /api/sequences/ */
  get sequencesPath() { return `${this.baseUrl}/api/sequences/`; };
  /** /api/tool_bays/ */
  get toolBaysPath() { return `${this.baseUrl}/api/tool_bays/`; };
  /** /api/tool_slots/ */
  get toolSlotsPath() { return `${this.baseUrl}/api/tool_slots/`; };
  /** /api/tools/ */
  get toolsPath() { return `${this.baseUrl}/api/tools/`; };
  /** /api/images/ */
  get imagesPath() { return `${this.baseUrl}/api/images/`; };
  /** /api/points/ */
  get pointsPath() { return `${this.baseUrl}/api/points/`; };
  /** /api/points/search */
  get pointSearchPath() { return `${this.pointsPath}/search/`; };
  /** /api/logs */
  get logsPath() { return `${this.baseUrl}/api/logs/`; };
}
