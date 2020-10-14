import React from "react";
import { Button } from "reactstrap";
import { AdminPermissionsResult } from "../../../api/admin/admin-api";
import GroupPermissionAPI from "../../../api/admin/group-api";
import PermissionAPI, { PermissionAPIResult } from "../../../api/admin/permission-api";
import Utils from "../../../common/Utils";
import ListSelect from "../../../components/list-select";
import WCheckBox from "../../../components/wcheckbox";
import WInput, { WInputOther } from "../../../components/winput";
import ReloadSVG from "../../../logo-svg/reload";
import AdminMessageRequest from "../../../page-component/admin/admin-message-request";

interface UpdateGroupPermissionProps {
    id: number | string,
    adminMessageRequest: ()=>AdminMessageRequest
}
export default class UpdateGroupPermission extends React.Component<UpdateGroupPermissionProps> {
    async updatePermissions(permissions: any) {
        let permissionIds: any[] = Object.keys(permissions);
        this.props.adminMessageRequest().sendRequest(() => {
            return GroupPermissionAPI.updateAdminPermissions({ groupId: this.props.id as number, permissionIds: permissionIds });
        })
    }
    render() {
        return <ListSelect
            getData={async ()=>{
                let result = await this.props.adminMessageRequest().sendRequest(() => {
                    return GroupPermissionAPI.getAllPermissionInGroup(this.props.id as number);
                }, { hideWhenDone: true });
                if (result !== undefined) {
                    return result.data;
                }else{
                    return [];
                }
            }}
            getKey={({id})=>id}
            getAllow={({isAllow})=>isAllow}
            header={[
                <th key="code">Mã CN</th>,
                <th key="name">Tên CN</th>
            ]}
            typeSearch={[
                {propertySearch: 'code', viewSearch: 'Mã chức năng'},
                {propertySearch: 'name', viewSearch: 'Tên chức năng'}
            ]}
            viewData={(data: PermissionAPIResult)=>[
                <td key="code">{data.code}</td>,
                <td key="name">{data.name}</td>
            ]}
            onComplete={this.updatePermissions.bind(this)}
            textOnCompleteButton="Cập nhật"
        />
    }
}