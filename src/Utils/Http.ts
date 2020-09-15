export class HttpUtils {
	protected static readonly IS_DEV = window.location.href.includes("localhost") || window.location.href.includes("127.0.0.1");
	public static readonly BASE_URL = "https://shinji-project.azurewebsites.net";
	// public static readonly CORS_SAFE_URL = `https://cors-anywhere.herokuapp.com/${HttpUtils.BASE_URL}`;
	public static readonly CORS_SAFE_URL = HttpUtils.BASE_URL;
	public static get(url: string): Promise<Response> {
		const slash = url === "/" || url.startsWith("/") ? "" : "/";
		const baseUrl = this.IS_DEV ? "http://localhost:5000" : this.CORS_SAFE_URL;
		return fetch(`${baseUrl}${slash}${url}`);
	}
}
