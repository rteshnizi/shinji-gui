import * as Mui from "@material-ui/core";
import React from "react";
import { ComponentBase } from "../Base/ComponentBase";

class BigText extends ComponentBase {
	public render(): React.ReactNode {
		return <Mui.Typography variant="h4">{this.props.children}</Mui.Typography>;
	}
}

export default BigText;
