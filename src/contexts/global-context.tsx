
import React from 'react';

export const GlobalContext = React.createContext<IContextState>(undefined as any);

interface IContextState {
    screenInnerWidth: number
}
export let setRedirect: (url: string) => void;
export default class GlobalProvider extends React.Component<{}, IContextState>{
    constructor(props: any) {
        super(props);
        this.state = {
            screenInnerWidth: window.innerWidth,

        }
        window.addEventListener('resize', () => {
            this.setState(state => { return { screenInnerWidth: window.innerWidth } });
        })
    }
    render() {
        return (
            <GlobalContext.Provider value={
                {
                    screenInnerWidth: this.state.screenInnerWidth
                }
            }>
                {this.props.children}
            </GlobalContext.Provider>
        )
    }
}