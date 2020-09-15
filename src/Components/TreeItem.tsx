import * as Mui from "@material-ui/core";
import * as MuiLab from "@material-ui/lab";
import React from "react";
import { ComponentBase } from "../Base/ComponentBase";

type TreeItemState = {}

interface TreeItemProps {
	action: (label: string) => void;
	actionIcon: React.ReactElement;
	actionTooltip: string;
	children: string;
	id: string;
}

class TreeItem extends ComponentBase<TreeItemProps, TreeItemState> {
	public render(): React.ReactNode {
		return (
			<div className="tree-item-container">
				<Mui.Grid container={true} direction="row">
					<Mui.Grid item={true} xs={11}>
						<MuiLab.TreeItem key={this.props.id} nodeId={this.props.id} label={this.props.children} />
					</Mui.Grid>
					<Mui.Tooltip title={this.props.actionTooltip}>
						<Mui.Grid className="tree-item-icon" item={true} xs={1}>
							<Mui.IconButton aria-label="Add Group" size="small" onClick={() => { this.props.action(this.props.children); }}>{this.props.actionIcon}</Mui.IconButton>
						</Mui.Grid>
					</Mui.Tooltip>
				</Mui.Grid>
			</div>
		);
	}
}

export default TreeItem;
