import React from "react";
import AdminUserAPI from "../../../api/admin/admin-api";
import { PermissionAPIResult } from "../../../api/admin/permission-api";
import ListSelect from "../../../components/list-select";
import AdminMessageRequest from "../../../page-component/admin/admin-message-request";

interface UpdatePermissionsProps {
    id: number | string,
    adminMessageRequest: () => AdminMessageRequest
}
export default class UpdatePermissions extends React.Component<UpdatePermissionsProps>{
    async updatePermissions(permissions: any) {
        let permissionIds: any[] = Object.keys(permissions);
        this.props.adminMessageRequest().sendRequest(() => {
            return AdminUserAPI.updateAdminPermissions(this.props.id as number, permissionIds);
        })
    }
    render() {
        return <ListSelect
            getData={async () => {
                this.setState({ isWaiting: true });
                let result = await this.props.adminMessageRequest().sendRequest(() => {
                    return AdminUserAPI.getAdminPermissions(this.props.id as number);
                }, { hideWhenDone: true });
                this.setState(() => { return { isWaiting: false } });
                if (result !== undefined) {
                    return result.data;
                } else {
                    return [];
                }
            }}
            typeSearch={[
                { propertySearch: 'code', viewSearch: 'Mã Chức năng' },
                { propertySearch: 'name', viewSearch: 'Tên Chức năng' }
            ]}
            viewData={(data: PermissionAPIResult & { isAllow: Boolean }) => {
                return [
                    <td key="code">{data.code}</td>,
                    <td key="name">{data.name}</td>
                ]
            }}
            header={[<th key="code">Mã CN</th>, <th key="name">Tên CN</th>]}
            getKey={(data: PermissionAPIResult) => { return data.id }}
            onComplete={this.updatePermissions.bind(this)}
            getAllow={({ isAllow }) => { return isAllow }}
        />
    }
}