import * as Mui from "@material-ui/core";
import React from "react";
import { ComponentBase } from "../Base/ComponentBase";

type LoadingState = {}

type LoadingProps = {};

class Loading extends ComponentBase<LoadingProps, LoadingState> {
	public render(): React.ReactNode {
		return (
			<div className="centered-container" style={{ height: "100vh" }}>
				<Mui.Typography variant="h4"> Loading Groups... </Mui.Typography>
				<Mui.CircularProgress variant="indeterminate" />
			</div>
		);
	}
}

export default Loading;
