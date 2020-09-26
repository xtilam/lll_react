import React from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import GroupPermissionAPI from "../../../api/admin/group-api";
import WForm from "../../../components/wform";
import WInput, { WInputOther } from "../../../components/winput";
import SYSTEM_CONSTANTS from "../../../constants";
import AdminMessageRequest from "../../../page-component/admin/admin-message-request";


interface AdminGroupPermissionState {
    isValidInput: {
        groupCode: boolean
    },
    isDisable: boolean,
}

export default class AddGroupPermission extends React.Component<any, AdminGroupPermissionState> {
    form = React.createRef<WForm>();
    messageRequest: React.RefObject<AdminMessageRequest> = React.createRef();
    constructor(props: any) {
        super(props);
        this.state = {
            isDisable: false,
            isValidInput: {
                groupCode: true
            }
        }
    }
    onSubmit(evt: any) {
        evt.preventDefault();
        console.log(this.form.current?.getData());
        this.messageRequest.current?.sendRequest(() => { return GroupPermissionAPI.addGroup(this.form.current?.getData() as any) });
    }
    render() {
        let { isValidInput } = this.state;
        return <div className="form-container">
            <AdminMessageRequest ref={this.messageRequest} />
            <WForm className={this.state.isDisable ? 'disabled' : ''} onSubmit={this.onSubmit.bind(this)} ref={this.form as any}>
                <h2>Thêm nhóm</h2>
                <WInput title_input="Mã nhóm" name="groupCode" is_invalid={!this.state.isValidInput.groupCode} required onChange={(evt) => {
                    this.setState({ isValidInput: { ...isValidInput, groupCode: evt.currentTarget.value.match(SYSTEM_CONSTANTS.REGEX.code) !== null } })
                }} />
                <WInput title_input="Tên nhóm" name="name" required/>
                <WInputOther title_input="Mô tả" >
                    <textarea name="description" rows={4}></textarea>
                </WInputOther>
                <br />
                <div className="d-flex space-sm">
                    <Button color="primary" size="sm">Thêm nhóm</Button>
                    <Link to="/admin/groups" className="btn btn-danger btn-sm">Quay về</Link>
                </div>
            </WForm>
        </div>
    }
}
