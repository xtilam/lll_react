import React from "react";
interface ImageErrorProps extends React.HTMLAttributes<HTMLImageElement> {
    'err_src': string,
    src: string 
}
export default class ImageError extends React.Component<ImageErrorProps, any>{
    constructor(props: ImageErrorProps) {
        super(props);
        this.state = {
            src: this.props.src,
        }
    }
    onError() {
        if (this.state.src !== this.props['err_src']) {
            this.setState({
                src: this.props.err_src
            })
        }
    }
    render() {
        const props = {
            ... this.props,
            onError: () => {
                this.onError();
            },
            src: this.state.src,
            err_src: undefined
        };
        return <img {...props}></img>;
    }
}