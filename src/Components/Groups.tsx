import * as Mui from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SearchIcon from "@material-ui/icons/Search";
import * as MuiLab from "@material-ui/lab";
import lodash, { clone } from "lodash";
import React from "react";
import { ComponentBase } from "../Base/ComponentBase";
import { WordGroups } from "../Base/WordGroup";
import { HttpUtils } from "../Utils/Http";
import Word from "./Word";

type GroupsState = {
	addingGroup: boolean;
	controlledGroups: WordGroups;
	errorMsg?: string;
	newGroupName: string;
	successMsg?: string;
}

type GroupsProps = {
	groups: WordGroups;
	updateGroup: (groupName: string, callback?: () => void) => void;
};

class Groups extends ComponentBase<GroupsProps, GroupsState> {
	public constructor(props: GroupsProps) {
		super(props);
		this.state = {
			addingGroup: false,
			controlledGroups: this.props.groups,
			errorMsg: undefined,
			newGroupName: "",
			successMsg: undefined,
		};
	}

	private closeSnackbar(): void {
		setTimeout(() => {
			this.setState({
				errorMsg: undefined,
				successMsg: undefined,
			});
		}, 1000);
	}

	private addGroup(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
		if (!this.state.newGroupName) return;
		this.setState({ addingGroup: true }, () => {
			HttpUtils.get(`/createGroup/${this.state.newGroupName}`)
				.then((response) => {
					response.json().then((errorMsg) => {
						if (errorMsg) {
							this.setState({ addingGroup: false, errorMsg });
						} else {
							this.setState({ addingGroup: false, successMsg: `Group "${this.state.newGroupName}" added.` }, () => {
								this.props.updateGroup(this.state.newGroupName);
							});
						}
					});
				});
		});
	}

	private updateWord(word: string, oldGroup: string, newGroup: string): void {
		HttpUtils.get(`/add/${newGroup}/${word}`)
			.then((response) => {
				response.json().then((errorMsg) => {
					if (errorMsg) {
						this.setState({ errorMsg });
					} else {
						this.setState({ addingGroup: false, successMsg: `Moved "${word}": "${oldGroup}" → "${newGroup}".` }, () => {
							this.props.updateGroup(oldGroup, () => { this.props.updateGroup(newGroup); });
						});
					}
				});
			});
	}

	private filter(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
		const searchTerm = event.target.value;
		if (!searchTerm) {
			this.setState({ controlledGroups: this.props.groups });
			return;
		}
		const filteredGroups: WordGroups = {};
		lodash.forEach(this.props.groups, (words, groupName) => {
			if (groupName.includes(searchTerm)) {
				filteredGroups[groupName] = clone(words);
				return;
			}
			const filteredWords = words.filter((word) => word.includes(searchTerm));
			if (filteredWords.length > 0)
				filteredGroups[groupName] = filteredWords;
		});
		this.setState({ controlledGroups: filteredGroups });
	}

	public render(): React.ReactNode {
		return (
			<React.Fragment>
				<Mui.Snackbar
					open={!!this.state.errorMsg || !!this.state.successMsg}
					onClose={this.closeSnackbar}
					autoHideDuration={3000}
					anchorOrigin={{ vertical: "top", horizontal: "center" }}
				>
					{
						this.state.errorMsg ?
							this.state.errorMsg ? <MuiLab.Alert severity="error">{this.state.errorMsg}</MuiLab.Alert> : undefined
							:
							this.state.successMsg ? <MuiLab.Alert severity="success">{this.state.successMsg}</MuiLab.Alert> : undefined
					}
				</Mui.Snackbar>
				<Mui.Input
					placeholder="Search..."
					endAdornment={<Mui.InputAdornment position="end"><SearchIcon /></Mui.InputAdornment>}
					onChange={this.filter}
				/>
				<div>
					<Mui.Input
						placeholder="َAdd a new Group..."
						endAdornment={
							<Mui.InputAdornment position="end">
								<Mui.IconButton aria-label="Add Group" size="small" onClick={this.addGroup}>
									{this.state.addingGroup ? <Mui.CircularProgress variant="indeterminate" size={20} /> : <AddIcon />}
								</Mui.IconButton>
							</Mui.InputAdornment>
						}
						onChange={(e) => { this.setState({ newGroupName: e.target.value }); }}
					/>

				</div>
				<MuiLab.TreeView
					defaultCollapseIcon={<ExpandMoreIcon />}
					defaultExpandIcon={<ChevronRightIcon />}
				>
					{lodash.map(this.state.controlledGroups, (group, groupName) => (
						<MuiLab.TreeItem key={groupName} nodeId={groupName} label={groupName}>
							{group.map((word) => {
								return (
									<Word
										id={`${groupName}-${word}`}
										key={`${groupName}-${word}`}
										groupName={groupName}
										updateWord={this.updateWord}
									>
										{word}
									</Word>
								);
							})}
						</MuiLab.TreeItem>
					))}
				</MuiLab.TreeView>
			</React.Fragment>
		);
	}
}

export default Groups;
