import * as Mui from "@material-ui/core";
import * as MuiLab from "@material-ui/lab";
import React from "react";
import { ComponentBase } from "../Base/ComponentBase";

type TreeItemState = {}

interface TreeItemProps {
	action: (label: string) => void;
	actionIcon: React.ReactElement;
	actionTooltip: string;
	/** If set to true, CSS class `no-hover` will be used. */
	disableHover?: boolean;
	hideAction?: boolean;
	/** If not provided, it will be assumed that children is a string */
	label?: string;
	children: React.ReactNode;
	id: string;
}

class TreeItem extends ComponentBase<TreeItemProps, TreeItemState> {
	public render(): React.ReactNode {
		return (
			<div className={`tree-item-container ${this.props.disableHover ? "no-hover" : ""}`}>
				<Mui.Grid container={true} direction="row">
					<Mui.Grid item={true} xs={11}>
						<MuiLab.TreeItem key={this.props.id}
							nodeId={this.props.id}
							label={this.props.label || this.props.children}
						>
							{this.props.label ? this.props.children : undefined}
						</MuiLab.TreeItem>
					</Mui.Grid>
					{this.props.hideAction ?
						undefined
						:
						<Mui.Tooltip title={this.props.actionTooltip}>
							<Mui.Grid className="tree-item-icon" item={true} xs={1}>
								<Mui.IconButton
									aria-label="Add Group"
									size="small"
									onClick={() => { this.props.action(this.props.label || this.props.children as string); }}
								>
									{this.props.actionIcon}
								</Mui.IconButton>
							</Mui.Grid>
						</Mui.Tooltip>

					}
				</Mui.Grid>
			</div>
		);
	}
}

export default TreeItem;
