import React from "react";
import { Button } from "reactstrap";
import GroupPermissionAPI, { GroupPermissionAPIResult } from "../../../api/admin/group-api";
import WForm from "../../../components/wform";
import WInput, { WInputOther } from "../../../components/winput";
import SYSTEM_CONSTANTS from "../../../constants";
import AdminMessageRequest from "../../../page-component/admin/admin-message-request";

interface UpdateGroupInfoProps {
    groupInfo: GroupPermissionAPIResult,
    adminMessageRequest: ()=>AdminMessageRequest,
    onUpdateSuccess?: () => any
}
interface UpdateGroupInfoState {
    isValidInput: any
}
export default class UpdateGroupInfo extends React.Component<UpdateGroupInfoProps, UpdateGroupInfoState>{
    private form: React.RefObject<WForm> = React.createRef();

    constructor(props: UpdateGroupInfoProps) {
        super(props);
    }
    componentDidMount() {
        this.form.current?.setData({ ... this.props.groupInfo });
    }
    update(evt: any) {
        evt.preventDefault();
        let data = this.form.current?.getData();
        this.props.adminMessageRequest().sendRequest(() => { return GroupPermissionAPI.updateGroup(data) })
            .then((result) => { result !== undefined && this.props.onUpdateSuccess && this.props.onUpdateSuccess() });
    }
    render() {
        return (
            <WForm ref={this.form as any} onSubmit={this.update.bind(this)}>
                <h2>Cập nhật nhóm CN {this.props.groupInfo.name}</h2>
                <input type="hidden" value={this.props.groupInfo.id} name="id"/>
                <WInput title_input="Tên nhóm" name="name" required />
                <WInputOther title_input="Mô tả" >
                    <textarea name="description" rows={4}></textarea>
                </WInputOther>
                <br />
                <div className="d-flex space-sm">
                    <Button color="primary" size="sm">Cập nhật</Button>
                    <Button color="danger" size="sm" onClick={
                        () => {
                            this.form.current?.setData(this.props.groupInfo);
                        }
                    }>Xóa</Button>
                </div>
            </WForm >
        )
    }
} 