import * as Mui from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import DeleteIcon from "@material-ui/icons/Delete";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SearchIcon from "@material-ui/icons/Search";
import * as MuiLab from "@material-ui/lab";
import lodash, { clone } from "lodash";
import React from "react";
import { ComponentBase } from "../Base/ComponentBase";
import { WordGroups } from "../Base/WordGroup";
import { HttpUtils } from "../Utils/Http";
import TreeItem from "./TreeItem";
import Word from "./Word";

type GroupsState = {
	addingGroup: boolean;
	controlledGroups: WordGroups;
	errorMsg?: string;
	newGroupName: string;
	savingToStorage: boolean;
	successMsg?: string;
}

type GroupsProps = {
	groups: WordGroups;
	updateGroups: (groups: WordGroups) => void;
	refreshAllGroups: () => void;
};

class Groups extends ComponentBase<GroupsProps, GroupsState> {
	public constructor(props: GroupsProps) {
		super(props);
		this.state = {
			addingGroup: false,
			controlledGroups: this.props.groups,
			errorMsg: undefined,
			newGroupName: "",
			savingToStorage: false,
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

	private updateGroup(groupName: string, callback?: () => void): void {
		HttpUtils.get(`/group/${groupName}`)
			.then((response) => {
				response.json().then((value: WordGroups) => {
					console.warn(value);
					const words = value[groupName];
					this.props.groups[groupName] = words;
					if (callback) {
						callback();
					} else {
						this.props.updateGroups(this.props.groups);
					}
				});
			})
			.catch((reason) => {
				console.error(reason);
			});
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
								this.updateGroup(this.state.newGroupName);
							});
						}
					});
				})
				.catch((reason) => {
					console.error(reason);
				});
		});
	}

	private deleteGroup(groupName: string): void {
		HttpUtils.get(`/deleteGroup/${groupName}`)
			.then((response) => {
				response.json().then((errorMsg) => {
					if (errorMsg) {
						this.setState({ addingGroup: false, errorMsg });
					} else {
						this.setState({ addingGroup: false, successMsg: `Group "${groupName}" deleted.` }, () => {
							delete this.props.groups[groupName];
							this.props.updateGroups(this.props.groups);
						});
					}
				});
			})
			.catch((reason) => {
				console.error(reason);
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
							this.updateGroup(oldGroup, () => { this.updateGroup(newGroup); });
						});
					}
				});
			})
			.catch((reason) => {
				console.error(reason);
			});
	}

	private saveToStorage(): void {
		if (this.state.savingToStorage) return;
		this.setState({ savingToStorage: true }, () => {
			HttpUtils.get("/save")
				.then((response) => {
					response.json().then((errorMsg) => {
						if (errorMsg) {
							this.setState({ errorMsg });
						} else {
							this.setState({ savingToStorage: false, successMsg: `Saved to Storage.` });
						}
					});
				})
				.catch((reason) => {
					console.error(reason);
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

	private renderProgressIndicator(): React.ReactElement {
		return <Mui.CircularProgress variant="indeterminate" size={20} />;
	}

	public render(): React.ReactNode {
		return (
			<React.Fragment>
				<Mui.AppBar elevation={0}>
					<Mui.Toolbar>
						<Mui.Input
							className="app-bar-input"
							placeholder="Search..."
							endAdornment={<Mui.InputAdornment position="end"><SearchIcon /></Mui.InputAdornment>}
							onChange={this.filter}
						/>
						<Mui.Input
							className="app-bar-input"
							placeholder="َAdd a new Group..."
							endAdornment={
								<Mui.InputAdornment position="end">
									<Mui.IconButton aria-label="Add Group" size="small" onClick={this.addGroup}>
										{this.state.addingGroup ? this.renderProgressIndicator() : <AddIcon />}
									</Mui.IconButton>
								</Mui.InputAdornment>
							}
							onChange={(e) => { this.setState({ newGroupName: e.target.value }); }}
						/>
						<Mui.Button
							className="save-button"
							variant="outlined"
							onClick={this.saveToStorage}
						>
							{this.state.savingToStorage ? this.renderProgressIndicator() : "Save to Storage"}
						</Mui.Button>
					</Mui.Toolbar>
				</Mui.AppBar>
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
				<div className="app-bar-filler" />
				<MuiLab.TreeView
					defaultCollapseIcon={<ExpandMoreIcon />}
					defaultExpandIcon={<ChevronRightIcon />}
				>
					{lodash.map(this.state.controlledGroups, (group, groupName) => (
						<TreeItem
							key={groupName}
							id={groupName}
							label={groupName}
							action={this.deleteGroup}
							actionIcon={<DeleteIcon />}
							hideAction={group.length > 0}
							disableHover={true}
							actionTooltip="Delete group"
						>
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
						</TreeItem>
					))}
				</MuiLab.TreeView>
			</React.Fragment>
		);
	}
}

export default Groups;
