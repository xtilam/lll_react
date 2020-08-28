import React from "react";
import './winput.scss';

interface WInputProps {
    style?: React.CSSProperties,
    className?: 'string'
    nameInput: string,
    id?: string
}
export default class WInput extends React.Component<WInputProps> {
    render() {
        // React.createElement()
        return <div id={this.props.id} style={this.props.style} className={'winput-group' + (this.props.className || '')}>
            {this.props.children}
            <label>{this.props.nameInput}</label>
            <span className='bar'></span>
        </div>
    }
}
