import * as Mui from "@material-ui/core";
import React from "react";
import { ComponentBase } from "../Base/ComponentBase";
import BigText from "./BigText";

type LoadingState = {}

interface LoadingProps {
	message?: string;
}

class Loading extends ComponentBase<LoadingProps, LoadingState> {
	public render(): React.ReactNode {
		return (
			<React.Fragment>
				<BigText>{this.props.message || "Loading Groups..."}</BigText>
				<Mui.CircularProgress variant="indeterminate" />
			</React.Fragment>
		);
	}
}

export default Loading;
