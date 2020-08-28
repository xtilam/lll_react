import React from "react";

export default class TestCom extends React.Component<any, any> {
    constructor(props: Readonly<any>) {
        super(props);
        this.state = { valueChange: 0, value: 0 };
    }
    changeValue(value: number) {
        this.setState((state: any) => { return { valueChange: value, value: this.state.value + value } });
        this.setState((state: any) => { return { valueChange: undefined } });
    }
    shouldComponentUpdate(nextProps: any, nextState: any) {
        return nextState.value != this.state.value;
    }
    render() {
        return (
            <div>
                <span>Number: {this.state.value}</span><br>?</br>
                <div>{() => { return 123 }}</div>
                <button onClick={()=>{this.changeValue(1)}}>Increase</button>
                <button onClick={()=>{this.changeValue(-1)}}>Decrease</button>
            </div>
        );
    }
}