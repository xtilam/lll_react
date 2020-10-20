import React from "react";
import authentication from "../../admin-auth";
import Utils from "../../common/Utils";
import CancelSVG from "../../logo-svg/cancel";

interface AdminMessageRequestProps extends React.HTMLAttributes<HTMLElement> {
    message?: string,
    is_hide?: boolean,
    onCompleteSendRequest?: () => any,
    onBeforeSendRequest?: () => any,
}
interface AdminMessageRequestState {
    isHide?: boolean
    message?: string,
    color?: string,
    isWaitRequest?: boolean
}
export default class AdminMessageRequest extends React.Component<AdminMessageRequestProps, AdminMessageRequestState>{
    __isMounted = true;
    constructor(props: AdminMessageRequestProps) {
        super(props);
        this.state = { isHide: this.props.is_hide ?? true, message: this.props.message ?? '', color: this.props.color ?? '', isWaitRequest: false };
        Utils.notSetStateWhenComponentUnmount(this);
    }
    async sendRequest<K>(requestMethod: (() => Promise<K> | Promise<K>),
        config: {
            hideWhenDone?: boolean,
            getFailed?: boolean,
            waitingMessage?: string,
            hideWaiting?: boolean
        } = {}): Promise<K | undefined> {
        this.props.onBeforeSendRequest && this.props.onBeforeSendRequest();
        console.log('start request....', this.setState)
        !config.hideWaiting && this.setState(() => { return { isWaitRequest: true, isHide: false, message: config?.waitingMessage ?? 'Đang xử lí', color: 'success' } });
        Utils.lostFocus();
        await Utils.waitPromise(2000)
        let state: AdminMessageRequestState = {};
        let request;
        try {
            if (requestMethod instanceof Function) {
                request = await requestMethod();
            } else {
                request = await requestMethod;
            }
            state = { message: (request as any).message.content, color: 'success', isHide: Boolean(config?.hideWhenDone), isWaitRequest: false };
        } catch (err) {
            state = { color: 'danger', isWaitRequest: false, isHide: false };
            if (config?.getFailed && err.response !== null) request = err;
            try {
                switch (err.message.code) {
                    case undefined:
                        request = undefined;
                        console.log(err.response);
                        if (err.response === undefined) {
                            state.message = 'Kêt nối hỏng';
                        } else if (err.response.status === 403 && err.response.data.error === "Forbidden") {
                            setTimeout(() => { authentication.logout() }); break;
                        } else {
                            state.message = "Lỗi server: " + err.response.data.message;
                        };
                        break;
                    // case SYSTEM_CONSTANTS.ERROR_REQUEST.PERMISSION_NOT_ALLOW:
                    default:
                        let data = err.data instanceof Object
                            ? '- ' + JSON.stringify(err.data) :
                            err.data ? `- ${err.data}` : '';
                        state.message = `${err.message.content} ${data}`;
                };
            } catch (error) {
                state.message = 'Lỗi nhận request: ' + error;
            }
        }
        await this.setState(() => state);
        this.props.onCompleteSendRequest && this.props.onCompleteSendRequest();
        return request;
    }
    setMessage(message: { color?: string, message?: string, isHide?: boolean }): any {
        this.setState(message as any);
    }
    closeMessage() {
        this.setState({ isHide: true });
    }
    render() {
        return this.state.isHide ? null : <div className={`alert d-flex ${(this.state.color ? `alert-${this.state.color} ` : '')}`}>
            <span key="0" className={"mr-auto mb-1 " + (this.state.isWaitRequest ? ' loading-text' : '')}>{this.state.message}</span>,
            <CancelSVG key="1" className="icon" color="red" style={{ minWidth: 16 }} onClick={() => { this.setState({ isHide: true }) }} />
        </div>


    }
}