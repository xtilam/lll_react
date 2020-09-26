import React from "react";
import { Spring } from 'react-spring/renderprops';
import './winput.scss';

interface WInputProps extends React.HTMLProps<HTMLInputElement> {
    title_input: string,
    is_invalid?: boolean,
    no_title_animation?: boolean
}
export default class WInput extends React.Component<WInputProps, { inputValid: boolean, isFocusOut: boolean }> {
    static config = {
        durian: 80,
        cssConfig: {
            inputFontSize: 15,
            smallLabelSize: 12,
            labelInvalidLocation: 28,
            labelValidLocation: 28 - 12 - 8 - 6
        }
    }
    otherValid: boolean;
    input: React.RefObject<HTMLInputElement>;
    constructor(props: WInputProps) {
        super(props);
        this.state = {
            inputValid: props.value ? true : false,
            isFocusOut: true
        };
        this.input = React.createRef();
        this.otherValid = false;
    }
    setValid(value: any) {
        this.setState({ inputValid: value ? true : false });
    }
    shouldComponentUpdate(nextProps: any) {
        if (this.props !== nextProps) {
            this.otherValid = nextProps.value ? true : false;
        } else {
            this.otherValid = false;
        }
        return true;
    }
    render() {
        let { inputValid, isFocusOut } = this.state;
        inputValid = inputValid || this.otherValid;
        let isValidInput = this.props["is_invalid"];
        let { config } = WInput;
        let { cssConfig } = config;
        let onFocusEvt = () => {
            this.setState({ inputValid: true, isFocusOut: false });
        }
        let onBlurEvt = (evt: any) => {
            this.setState({ inputValid: evt.currentTarget.value.length !== 0, isFocusOut: true })
        }

        let inputProps = {
            ... this.props,
            ... { is_invalid: null, no_title_animation: null, title_input: null },
            style: (isValidInput || !isFocusOut) ? { border: 'none' } : null,
            value: this.props.value,
            ref: this.input,
            onFocus: this.props.onFocus instanceof Function
                ? (evt: any) => { onFocusEvt(); (this.props.onFocus as any)(evt); } : onFocusEvt,
            onBlur: this.props.onBlur instanceof Function
                ? (evt: any) => { onBlurEvt(evt); (this.props.onBlur as any)(evt); } : onBlurEvt
        };
        return (
            <div className="winput-group" style={this.props.style}>
                {
                    React.createElement('input', inputProps)
                }
                <Spring from={{ size: isFocusOut ? 0 : 60 }} reverse={true} config={{ duration: config.durian }}>
                    {({ size }) => <div key="1" className={'bar' + (isValidInput ? ' invalid' : '')}
                        style={isValidInput ? { width: '100%' } : { width: isFocusOut ? 0 : `${size + 40}%`, left: `${30 - (size / 2)}%` }}>
                    </div>}
                </Spring>
                <Spring from={inputValid || this.props["no_title_animation"] ?
                    { fontSize: cssConfig.smallLabelSize, top: cssConfig.labelValidLocation }
                    : { fontSize: cssConfig.inputFontSize, top: cssConfig.labelInvalidLocation }
                } reverse={true} config={{ duration: config.durian }}>
                    {(props) => <label key="2" style={props} className={isFocusOut ? '' : 'focus'}>{this.props["title_input"]}</label>}
                </Spring>

            </div >

        )
    }
}

interface WInputOtherProps {
    title_input: string
}
export class WInputOther extends React.Component<WInputOtherProps, any>{
    render() {
        return <div className="winput-group-other">
            {this.props.children}
            <label>{this.props.title_input}</label>
            <div className="bar"></div>
        </div>
    }
}