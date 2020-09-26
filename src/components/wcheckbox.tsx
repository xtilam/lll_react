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
                    this.state.isChecked && (
                        <svg
                            className="done-svg"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            viewBox="0 0 512 512" >
                            <linearGradient id="a" gradientUnits="userSpaceOnUse" x1="256" x2="256" y1="0" y2="512">
                                <stop offset="0" stopColor="#2af598" /><stop offset="1" stopColor="#009efd" />
                            </linearGradient>
                            <path d="m258.257812 310.347656 223.957032-245.820312 29.566406 26.9375-251.472656 276.019531-137.089844-130.320313 27.5625-28.992187zm237.992188-143.09375-31.191406 34.34375c4.527344 17.386719 6.941406 35.617188 6.941406 54.402344 0 119.101562-96.898438 216-216 216s-216-96.898438-216-216 96.898438-216 216-216c55.175781 0 105.574219 20.804688 143.796875 54.96875l26.964844-29.691406c-47.007813-42.191406-107.109375-65.277344-170.761719-65.277344-68.378906 0-132.667969 26.628906-181.019531 74.980469-48.351563 48.351562-74.980469 112.640625-74.980469 181.019531s26.628906 132.667969 74.980469 181.019531c48.351562 48.351563 112.640625 74.980469 181.019531 74.980469s132.667969-26.628906 181.019531-74.980469c48.351563-48.351562 74.980469-112.640625 74.980469-181.019531 0-30.773438-5.410156-60.710938-15.75-88.746094zm0 0" fill="url(#a)" />
                        </svg>
                    )
                }
            </label >
        )
    }
}