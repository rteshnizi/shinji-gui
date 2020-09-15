import * as Mui from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import React from "react";
import { ComponentBase } from "../Base/ComponentBase";
import TreeItem from "./TreeItem";

interface WordState {
	/** The value typed in the modal dialog when moving a word to a different group. */
	newGroupName?: string;
	/** The `open` state of the modal dialog. */
	showMoveDialog: boolean;
}

interface WordProps {
	children: string;
	groupName: string;
	id: string;
	/** Called when a word is moved to a different group. */
	updateWord: (word: string, oldGroup: string, newGroup: string) => void;
}

class Word extends ComponentBase<WordProps, WordState> {
	public constructor(props: WordProps) {
		super(props);
		this.state = {
			newGroupName: undefined,
			showMoveDialog: false,
		};
	}

	private closeDialog(): void {
		this.setState({ showMoveDialog: false });
	}

	private changeGroup(): void {
		if (!this.state.newGroupName) return;
		const groupName = this.state.newGroupName;
		this.setState({ showMoveDialog: false }, () => {
			this.props.updateWord(this.props.children, this.props.groupName, groupName);
		});
	}

	public render(): React.ReactNode {
		const key = `${this.props.id}-inner`;
		return (
			<React.Fragment>
				<Mui.Dialog
					open={this.state.showMoveDialog}
					onClose={this.closeDialog}
					maxWidth="sm"
					fullWidth={true}
				>
					<Mui.DialogTitle>Move Word to a Different Group</Mui.DialogTitle>
					<Mui.DialogContent>
						<Mui.Grid container={true} direction="row">
							<Mui.Grid item={true} xs={2}>Group:</Mui.Grid>
							<Mui.Grid item={true} xs={10}>
								<Mui.Input
									fullWidth={true}
									defaultValue={this.props.groupName}
									onChange={(e) => { this.setState({ newGroupName: e.target.value }); }}
								/>
							</Mui.Grid>
						</Mui.Grid>
					</Mui.DialogContent>
					<Mui.DialogActions>
						<Mui.Button variant="contained" color="primary" onClick={this.changeGroup}>Save</Mui.Button>
						<Mui.Button variant="contained" color="secondary" onClick={this.closeDialog}>Cancel</Mui.Button>
					</Mui.DialogActions>
				</Mui.Dialog>
				<TreeItem id={key} action={() => { this.setState({ showMoveDialog: true }); }} actionIcon={<EditIcon />} actionTooltip="Move to a different group">
					{this.props.children}
				</TreeItem>
			</React.Fragment>
		);
	}
}

export default Word;
