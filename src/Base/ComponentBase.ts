import React from "react";

/** The Base Class for All Components */
export abstract class ComponentBase<PropsType = {}, StateType = {}> extends React.Component<PropsType, StateType> {
	public constructor(props: PropsType) {
		super(props);
		this.BindSubclassMembers();
	}

	private BindSubclassMembers(): void {
		Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach((method) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(this as any)[method] = (this as any)[method].bind(this);
		});
	}
}

// interface RouteParams {
// 	issueId?: IssueId;
// }

// export type RoutedComponentProps = RRD.RouteComponentProps<RouteParams>;

// export abstract class RoutedComponentBase<PropsType extends RoutedComponentProps = RoutedComponentProps, StateType = {}> extends ComponentBase<PropsType, StateType> {
// 	public constructor(props: PropsType) {
// 		super(props);
// 	}
// }
