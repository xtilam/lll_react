import React from "react";

interface WInputProps {
    style?: React.CSSProperties,
    className?: 'string'
    nameInput: string,
    id?: string
}

export default class WInputCustom extends React.Component<WInputProps> {
    render() {
        return <div id={this.props.id} style={this.props.style} className={'winput-group-custom' + (this.props.className || '')}>
            {/* {this.props.children} */}
            {/* <label>{this.props.nameInput}</label> */}
        </div>;
    }
}
