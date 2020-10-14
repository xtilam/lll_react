
import React from 'react';

export const ScreenContext = React.createContext<IContextState>(undefined as any);

interface IContextState {
    screenInnerWidth: number
}

export default class ScreenProvider extends React.Component<any, IContextState>{
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
            <ScreenContext.Provider value={this.state}>
                {this.props.children}
            </ScreenContext.Provider>
        )
    }
}