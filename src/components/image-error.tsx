import React from "react";
interface ImageErrorProps extends React.HTMLProps<HTMLImageElement>{
    'err-src': string
}
export default class ImageError extends React.Component<ImageErrorProps, any>{
    constructor(props: ImageErrorProps) {
        super(props);
        this.state = {
            src: this.props.src,
        }
    }
    onError() {
        if (this.state.src !== this.props['err-src']) {
            this.setState({
                src: this.props['err-src']
            })
        }
    }
    render() {
        let props = {
            ... this.props,
            onError: () => {
                this.onError();
            },
            src: this.state.src
        };
        return React.createElement('img', props);
    }
}