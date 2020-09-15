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

	private updateGroup(groupName: string, callback?: () => void): void {
		HttpUtils.get(`/group/${groupName}`)
			.then((response) => {
				response.json().then((value: WordGroups) => {
					const words = value[groupName];
					if (this.state.groups) {
						this.state.groups[groupName] = words;
						this.setState({ groups: this.state.groups }, callback);
					}
				});
			});
	}

	public componentDidMount(): void {
		HttpUtils.get("/init")
			.then((response) => {
				response.json().then((responseMsg) => {
					this.setState({ loadingText: responseMsg }, () => {
						HttpUtils.get("/")
							.then((response) => {
								response.json().then((jsonResponse) => {
									this.setState({ loading: false, groups: jsonResponse });
								});
							});
					});
				});
			})
			.catch((reason) => {
				console.error(reason);
			});
	}

	public renderLoading(): React.ReactNode {
		return <div className="centered-container" style={{ height: "100vh" }}><Loading message={this.state.loadingText} /></div>;
	}

	public renderGroups(): React.ReactNode {
		if (!this.state.groups) {
			return <BigText>Groups are not loaded! What happened?</BigText>;
		}
		return <div className="margined-container"><Groups groups={this.state.groups} updateGroup={this.updateGroup} /></div>;
	}

	public render(): React.ReactNode {
		return this.state.loading ? this.renderLoading() : this.renderGroups();
	}
}

export default App;
