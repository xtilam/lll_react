
import React from 'react';

export const ScreenContext = React.createContext<IContextState>(undefined as any);

interface IContextState {
    screenInnerWidth: number,

}

export default class ScreenProvider extends React.Component<{}, IContextState>{
    constructor(props: any) {
        super(props);
        this.state = {
            screenInnerWidth: window.innerWidth,
        }
    }
    componentDidMount() {
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