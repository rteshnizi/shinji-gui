// import * as Mui from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import * as MuiLab from "@material-ui/lab";
import * as lodash from "lodash";
import React from "react";
import { ComponentBase } from "../Base/ComponentBase";
import { WordGroups } from "../Base/WordGroup";

type GroupsState = {}

type GroupsProps = {
	groups: WordGroups;
};

class Groups extends ComponentBase<GroupsProps, GroupsState> {
	public render(): React.ReactNode {
		return (
			<MuiLab.TreeView
				defaultCollapseIcon={<ExpandMoreIcon />}
				defaultExpandIcon={<ChevronRightIcon />}
			>
				{lodash.map(this.props.groups, (group, groupName) => (
					<MuiLab.TreeItem key={groupName} nodeId={groupName} label={groupName}>
						{group.map((word) => <MuiLab.TreeItem key={`${groupName}-${word}`} nodeId={`${groupName}-${word}`} label={`${groupName}-${word}`} />)}
					</MuiLab.TreeItem>
				))}
			</MuiLab.TreeView>
		);
	}
}

export default Groups;
