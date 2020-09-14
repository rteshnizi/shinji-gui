import * as Mui from "@material-ui/core";
import React from "react";
import { ComponentBase } from "./Base/ComponentBase";
import Loading from "./Components/Loading";

interface AppState {
	loading: boolean;
}

type AppProps = {};

class App extends ComponentBase<AppProps, AppState> {
	public constructor(props: AppProps) {
		super(props);
		this.state = {
			loading: true,
		};
	}

	public componentDidMount(): void {
		return;
	}

	public renderLoading(): React.ReactNode {
		return <Loading />;
	}

	public renderGroups(): React.ReactNode {
		return null;
	}

	public render(): React.ReactNode {
		if (this.state.loading)
			return this.renderLoading();
		return this.renderGroups();
	}
}

export default App;
