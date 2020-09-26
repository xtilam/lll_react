import React from "react";
import Utils from "../common/Utils";
interface WFormProps extends React.HTMLProps<HTMLFormElement> {

}
export default class WForm extends React.Component<WFormProps> {
    formRef: React.RefObject<HTMLFormElement> = React.createRef();
    isValidInputs() {
        let winputInvalidBar = $('.invalid', (this.formRef.current as any))[0];
        if (winputInvalidBar) {
            $(winputInvalidBar.parentElement as HTMLElement).children('input').focus();
            return false;
        }
        return true;
    }
    setData(data: any) {
        if (data instanceof Object) {
            for (let key in data) {
                let input: JQuery<HTMLInputElement> = $(`[name="${key}"]`, this.formRef.current as any);
                let value = data[key];
                if (input.length > 0) {
                    switch (input.attr('type')) {
                        case 'radio':
                            for (let radio of (input as any)) {
                                if (radio.value == value) radio.checked = true;
                                break;
                            }
                            break;
                        case 'checkbox':
                            if (value instanceof Array) {
                                for (let v of value) {
                                    let checkbox = $(`[name="${key}"][value="${v}"]`, this.formRef.current as any);
                                    checkbox[0] && ((checkbox[0] as any).checked = true)
                                }
                            }
                            break;
                        default:
                            input[0].value = value;
                            input[0].focus();
                    }
                }
            }
        }
        Utils.lostFocus();
    }
    getData() {
        return Utils.formToJson(new FormData(this.formRef.current as any));
    }
    render() {
        return React.createElement('form', {
            ... this.props, onSubmit: (evt) => {
                let winputInvalidBar = $('.invalid', evt.currentTarget)[0];
                if (winputInvalidBar) {
                    evt.preventDefault();
                    $(winputInvalidBar.parentElement as HTMLElement).children('input').focus();
                } else {
                    this.props.onSubmit && this.props.onSubmit(evt);
                }
            },
            ref: this.formRef
        });
    }
}