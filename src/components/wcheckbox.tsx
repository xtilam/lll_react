import React from "react";
import './wcheckbox.scss';
interface WCheckBoxProps extends React.HTMLProps<HTMLInputElement> {
    'classname-input'?: any;
}

export default class WCheckBox extends React.Component<WCheckBoxProps, { isChecked: boolean }>{
    constructor(props: Readonly<WCheckBoxProps>) {
        super(props);
        this.state = {
            isChecked: this.props.checked as any
        }
    }
    shouldComponentUpdate(nextProps: any) {
        if (nextProps === this.props) {
            return true;
        } else {
            if (nextProps.hasOwnProperty('checked')) this.setState({ isChecked: nextProps.checked });
            return false;
        }
    }
    render() {
        return (
            <label className={'wcheckbox ' +
                (this.state.isChecked ? 'checked ' : '') +
                (this.props.className || '')}
                style={this.props.style}
            >
                {React.createElement('input', {
                    ... this.props, type: "checkbox", style: null, className: this.props['classname-input'], checked: this.state.isChecked,
                    onChange: (evt: React.MouseEvent<HTMLInputElement>) => {
                        (this.props.onChange instanceof Function) && this.props.onChange(evt);
                        this.setState({ isChecked: evt.currentTarget.checked });
                    }
                })}
                {
                    this.state.isChecked && (<svg xmlns="http://www.w3.org/2000/svg" className="done-svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 128 128" xmlSpace="preserve">
                        <g><circle fill="#31AF91" cx="64" cy="64" r="64" /></g>
                        <g><path fill="#FFF" d="M54.3,97.2L24.8,67.7c-0.4-0.4-0.4-1,0-1.4l8.5-8.5c0.4-0.4,1-0.4,1.4,0L55,78.1l38.2-38.2   c0.4-0.4,1-0.4,1.4,0l8.5,8.5c0.4,0.4,0.4,1,0,1.4L55.7,97.2C55.3,97.6,54.7,97.6,54.3,97.2z" /></g>
                    </svg>
                    )
                }
            </label>
        )
    }
}