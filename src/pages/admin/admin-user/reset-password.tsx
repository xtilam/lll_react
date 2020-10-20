import React from "react";
import { Button } from "reactstrap";
import AdminUserAPI, { AdminUserResult } from "../../../api/admin/admin-api";
import WForm from "../../../components/wform";
import WInput from "../../../components/winput";
import AdminMessageRequest from "../../../page-component/admin/admin-message-request";

interface AdminResetPasswordProps {
    adminInfo: AdminUserResult,
    adminMessageRequest: ()=>AdminMessageRequest
}
interface AdminResetPasswordState {
    passwordInput: string,
    passwordConfirmInput: string
}
export default class AdminResetPassword extends React.Component<AdminResetPasswordProps, AdminResetPasswordState> {
    constructor(props: AdminResetPasswordProps) {
        super(props);
        this.state = {
            passwordInput: '',
            passwordConfirmInput: ''
        }
    }
    update(evt: any) {
        evt.preventDefault();
        this.props.adminMessageRequest().sendRequest(() => {
            return AdminUserAPI.resetPasswordUser(this.props.adminInfo.id, this.state.passwordInput);
        })
    }
    render() {
        let { adminInfo } = this.props;
        return <div className="form-container">
            <WForm onSubmit={this.update.bind(this)}>
                <h2>Thay đổi mật khẩu {adminInfo.fullname}</h2>
                <WInput title_input="Mật khẩu mới" type="password"
                    onChange={(evt) => { this.setState({ passwordInput: evt.currentTarget.value }) }} />
                <WInput title_input="Xác nhận mật khẩu mới" type="password"
                    is_invalid={this.state.passwordConfirmInput !== this.state.passwordInput}
                    onChange={(evt) => { this.setState({ passwordConfirmInput: evt.currentTarget.value }) }} />
                <br />
                <Button color="primary" size="sm" children="Cập nhật mật khẩu" />
            </WForm>
        </div>
    }
}