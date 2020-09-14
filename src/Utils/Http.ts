export class HttpUtils {
	public static get(url: string): Promise<Response> {
		return fetch(`https://cors-anywhere.herokuapp.com/${url}`);
	}
}
