import React from "react";

export const AdminOverrideWindow = React.createContext<AdminOverrideWindowState>(undefined as any);
interface AdminOverrideWindowState {
    windows: JSX.Element[],
    addWindow: (window: JSX.Element) => void,
    removeWindow: (window: JSX.Element) => void,
    clear: () => void
}
export default class AdminOverrideWindowProvider extends React.Component<{}, AdminOverrideWindowState> {
    constructor(props: any) {
        super(props);
        this.state = {
            windows: [],
            addWindow: (window) => {
                this.setState({ windows: [...this.state.windows, window] });
                return window;
            },
            removeWindow: (window) => {
                console.log(window, this.state.windows);
                let index = this.state.windows.indexOf(window);
                if (index !== -1) {
                    this.setState({
                        windows: [
                            ...this.state.windows.slice(0, index),
                            ... this.state.windows.slice(index + 1)
                        ]
                    })
                }
            },
            clear: () => { this.setState({ windows: [] }); }
        }
    }
    render() {
        return (
            <AdminOverrideWindow.Provider
                value={this.state}>
                {this.props.children}
            </AdminOverrideWindow.Provider>
        )
    }
}