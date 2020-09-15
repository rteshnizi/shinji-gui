// import * as Mui from "@material-ui/core";
import React from "react";
import { ComponentBase } from "./Base/ComponentBase";
import { WordGroups } from "./Base/WordGroup";
import BigText from "./Components/BigText";
import Groups from "./Components/Groups";
import Loading from "./Components/Loading";
import { HttpUtils } from "./Utils/Http";

interface AppState {
	loading: boolean;
	groups?: WordGroups;
	loadingText?: string;
}

type AppProps = {};

class App extends ComponentBase<AppProps, AppState> {
	public constructor(props: AppProps) {
		super(props);
		this.state = {
			loading: true,
			groups: undefined,
			loadingText: undefined,
		};
	}

	private updateGroups(groups: WordGroups): void {
		this.setState({ groups });
	}

	private refreshAllGroups(failureCallback?: () => void): void {
		HttpUtils.get("/")
			.then((response) => {
				response.json().then((jsonResponse) => {
					if (jsonResponse.message) {
						failureCallback && failureCallback();
					} else {
						this.setState({ loading: false, groups: jsonResponse });
					}
				});
			})
			.catch((reason) => {
				console.warn(reason);
			});
	}

	public componentDidMount(): void {
		this.refreshAllGroups(() => {
			this.setState({ loadingText: "Initializing Defaults..." }, () => {
				HttpUtils.get("/init")
					.then((response) => {
						response.json().then((responseMsg) => {
							this.setState({ loadingText: responseMsg }, this.refreshAllGroups);
						});
					})
					.catch((reason) => {
						console.error(reason);
					});
			});
		});
	}

	public renderLoading(): React.ReactNode {
		return <div className="centered-container" style={{ height: "100vh" }
		} > <Loading message={this.state.loadingText} /></div >;
	}

	public renderGroups(): React.ReactNode {
		if (!this.state.groups) {
			return <BigText>Groups are not loaded! What happened?</BigText>;
		}
		return <div className="margined-container"><Groups groups={this.state.groups} updateGroups={this.updateGroups} refreshAllGroups={() => { }} /></div>;
	}

	public render(): React.ReactNode {
		return this.state.loading ? this.renderLoading() : this.renderGroups();
	}
}

export default App;
