export class HttpUtils {
	public static readonly BASE_URL = "https://shinji-project.azurewebsites.net";
	public static get(url: string): Promise<Response> {
		const slash = url.startsWith("/") ? "" : "/";
		return fetch(`https://cors-anywhere.herokuapp.com/${this.BASE_URL}${slash}${url}`);
	}
}
