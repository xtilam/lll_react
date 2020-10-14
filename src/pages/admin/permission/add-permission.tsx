import React from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import PermissionAPI, { PermissionDTO } from "../../../api/admin/permission-api";
import WForm from "../../../components/wform";
import WInput, { WInputOther } from "../../../components/winput";
import SYSTEM_CONSTANTS from "../../../constants";
import AdminMessageRequest from "../../../page-component/admin/admin-message-request";

interface AddPermissionState {
    input: PermissionDTO,
    isValidInput: {
        permissionCode: boolean
    },
    isDisable: boolean,
}


export default class AddPermission extends React.Component<any, AddPermissionState>{
    messageRequest: React.RefObject<AdminMessageRequest> = React.createRef();
    constructor(props: any) {
        super(props);
        this.state = {
            isDisable: false,
            input: {
                permissionCode: "ACTION_0",
                description: '.',
                name: "NAME_"
            },
            isValidInput: {
                permissionCode: true
            }
        }
    }
    static filter = {
        permissionCode: (value: string) => { return value.match(SYSTEM_CONSTANTS.REGEX.code) !== null }
    }
    setInputOnChange(evt: React.FormEvent<any>) {
        let { input, isValidInput } = this.state;
        let { name, value } = evt.currentTarget;
        (input as any)[name] = value;
        let filter = (AddPermission.filter as any)[name];
        if (filter instanceof Function) {
            (isValidInput as any)[name] = filter(value);
        }
        this.setState({});
    }
    onSubmit(evt: any) {
        evt.preventDefault();
        this.messageRequest.current?.sendRequest(() => { return PermissionAPI.addPermission(this.state.input) });
    }
    render() {
        let { isValidInput, input } = this.state;
        return <div className="form-container">
            <AdminMessageRequest ref={this.messageRequest} />
            <WForm className={this.state.isDisable ? 'disabled' : ''} onSubmit={this.onSubmit.bind(this)}>
                <WInput title_input="Mã chức năng" value={input.permissionCode} is_invalid={!isValidInput.permissionCode} name="permissionCode" onChange={this.setInputOnChange.bind(this)}  required/>
                <WInput title_input="Tên chức năng" value={input.name} name="name" onChange={this.setInputOnChange.bind(this)} required/>
                <WInputOther title_input="Mô tả">
                    <textarea rows={4} value={input.description} name="description" onChange={this.setInputOnChange.bind(this)} />
                </WInputOther>
                <div className="d-flex space-sm">
                    <Button color="primary" size="sm">Thêm chức năng</Button>
                    <Link to="/admin/permissions" className="btn btn-danger btn-sm">Quay về</Link>
                </div>
            </WForm>
        </div>
    }
}