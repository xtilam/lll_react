import React from "react";
import { Button } from "reactstrap";
import PermissionAPI, { PermissionAPIResult } from "../../../api/admin/permission-api";
import WForm from "../../../components/wform";
import WInput, { WInputOther } from "../../../components/winput";
import AdminMessageRequest from "../../../page-component/admin/admin-message-request";

interface UpdatePermissionProps {
    permissionInfo: PermissionAPIResult,
    adminMessageRequest: () => AdminMessageRequest,
    onUpdateSuccess?: () => any
}
interface UpdatePermissionState {
    inputValidPermissionCode: boolean
}
export default class UpdatePermission extends React.Component<UpdatePermissionProps, UpdatePermissionState>{
    private form: React.RefObject<WForm> = React.createRef();

    constructor(props: UpdatePermissionProps) {
        super(props);
        this.state = {
            inputValidPermissionCode: true,
        }
    }
    componentDidMount() {
        this.form.current?.setData({ ... this.props.permissionInfo, permissionCode: this.props.permissionInfo.code });
    }
    update(evt: any) {
        evt.preventDefault();
        let data = this.form.current?.getData();
        data.id = this.props.permissionInfo.id;
        this.props.adminMessageRequest().sendRequest(() => { return PermissionAPI.updatePermission(data) })
            .then((result) => { result !== undefined && this.props.onUpdateSuccess && this.props.onUpdateSuccess() });
    }
    render() {
        return (
            <WForm ref={this.form as any} onSubmit={this.update.bind(this)}>
                <h2>Cập nhật chức năng {this.props.permissionInfo.name}</h2>
                <br />
                <WInput title_input="Tên chức năng" name="name" required />
                <WInputOther title_input="Mô tả">
                    <textarea rows={4} name="description" />
                </WInputOther>
                <div className="d-flex space-sm">
                    <Button color="primary" size="sm">Cập nhật</Button>
                    <Button color="danger" size="sm" onClick={
                        () => { this.form.current?.setData(this.props.permissionInfo) }
                    }>Xóa</Button>
                </div>
            </WForm>
        )
    }
} 