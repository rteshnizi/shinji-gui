import * as Mui from "@material-ui/core";
import React from "react";
import { ComponentBase } from "../Base/ComponentBase";

type LoadingState = {}

type LoadingProps = {
	message?: string;
};

class Loading extends ComponentBase<LoadingProps, LoadingState> {
	public render(): React.ReactNode {
		return (
			<React.Fragment>
				<Mui.Typography variant="h4">{this.props.message || "Loading Groups..."}</Mui.Typography>
				<Mui.CircularProgress variant="indeterminate" />
			</React.Fragment>
		);
	}
}

export default Loading;
