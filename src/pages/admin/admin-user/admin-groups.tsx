import React, { Fragment } from "react";
import { Button } from "reactstrap";
import AdminUserAPI, { AdminGroupAPIResult, AdminUserResult } from "../../../api/admin/admin-api";
import { GroupPermissionAPIResult } from "../../../api/admin/group-api";
import Utils from "../../../common/Utils";
import ListSelect from "../../../components/list-select";
import WCheckBox from "../../../components/wcheckbox";
import WInput, { WInputOther } from "../../../components/winput";
import ReloadSVG from "../../../logo-svg/reload";
import AdminMessageRequest from "../../../page-component/admin/admin-message-request";

interface UpdateGroupsProps {
    adminInfo: AdminUserResult,
    adminMessageRequest: () => AdminMessageRequest
}
export default class UpdateGroups extends React.Component<UpdateGroupsProps>{
    refComponent = {
        typeSearch: React.createRef<HTMLSelectElement>(),
        searchValue: React.createRef<HTMLInputElement>(),
    }
    async updateGroups(selected: any) {
        this.props.adminMessageRequest().sendRequest(() => {
            return AdminUserAPI.updateAdminGroups({ adminId: this.props.adminInfo.id, groupIds: Object.keys(selected) as any });
        })
    }
    render() {
        return <ListSelect
            getData={async () => {
                let result = await this.props.adminMessageRequest().sendRequest(() => {
                    return AdminUserAPI.getAllGroups(this.props.adminInfo.id as number);
                }, { hideWhenDone: true });

                if (result !== undefined) return result.data
                return [];
            }}
            typeSearch={[
                { propertySearch: 'groupCode', viewSearch: 'Mã Chức năng' },
                { propertySearch: 'name', viewSearch: 'Tên Chức năng' }
            ]}
            viewData={(data: GroupPermissionAPIResult & { isAllow: Boolean }) => {
                return <Fragment>
                    <td>{data.groupCode}</td>
                    <td>{data.name}</td>
                </Fragment>
            }}
            header={<Fragment><th>Mã CN</th><th>Tên CN</th></Fragment>}
            getKey={(data: GroupPermissionAPIResult) => { return data.id }}
            onComplete={this.updateGroups.bind(this)}
            getAllow={({ isAllow }: any) => isAllow}
            textOnCompleteButton="Cập nhật"
        />
    }
}