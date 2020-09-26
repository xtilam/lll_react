import React from "react";
import { Button } from "reactstrap";
import { AdminPermissionsResult } from "../../../api/admin/admin-api";
import GroupPermissionAPI from "../../../api/admin/group-api";
import PermissionAPI, { PermissionAPIResult } from "../../../api/admin/permission-api";
import Utils from "../../../common/Utils";
import WCheckBox from "../../../components/wcheckbox";
import WInput, { WInputOther } from "../../../components/winput";
import ReloadSVG from "../../../logo-svg/reload";
import AdminMessageRequest from "../../../page-component/admin/admin-message-request";

interface UpdateGroupPermissionProps {
    id: number | string,
    adminMessageRequest: AdminMessageRequest
}

interface UpdateGroupPermissionState {
    justShowSelected: boolean,
    isWaiting: boolean,
    permissions: AdminPermissionsResult[],
    filter: any,
}

export default class UpdateGroupPermission extends React.Component<UpdateGroupPermissionProps, UpdateGroupPermissionState> {
    refComponent = {
        typeSearch: React.createRef<HTMLSelectElement>(),
        searchValue: React.createRef<HTMLInputElement>(),
    }
    searchValue: string = '';
    permissionSelected: Set<any> = new Set([]);
    constructor(props: UpdateGroupPermissionProps) {
        super(props);
        this.state = {
            justShowSelected: false,
            isWaiting: false,
            permissions: [],
            filter: undefined
        }
    }
    componentDidMount() {
        this.getAllPermission();
    }
    findPermission() {
        this.searchValue = (this.refComponent.searchValue.current as any).input.current.value.trim();
        let typeSearch = this.refComponent.typeSearch.current?.value;
        if (this.searchValue) {
            switch (typeSearch) {
                case 'method':
                    this.setState({
                        filter: {
                            data: this.searchValue.toLowerCase(),
                            filter: function (per: PermissionAPIResult) { return per.method?.toLowerCase() == this.data; }
                        }
                    });
                    break;
                default:
                    this.setState({
                        filter: Utils.filterString(this.searchValue, (per) => { return per[typeSearch as string] })
                    })
            }
        } else {
            this.setState({ filter: undefined });
        }
    }
    async updatePermissions() {
        let permissionIds = new Array(this.permissionSelected.size);
        let index = 0;
        for (let value of this.permissionSelected as any) {
            permissionIds[index++] = value;
        }
        this.props.adminMessageRequest.sendRequest(() => {
            return GroupPermissionAPI.updateAdminPermissions({groupId: this.props.id as number, permissionIds: permissionIds});
        })
    }
    async getAllPermission() {
        let result = await this.props.adminMessageRequest.sendRequest(() => {
            return GroupPermissionAPI.getAllPermissionInGroup(this.props.id as number);
        }, { hideWhenDone: true });
        this.permissionSelected.clear();
        if (result !== undefined) {
            this.setState({ permissions: result.data as any });
        }
    }
    render() {
        let { isWaiting, filter } = this.state;
        return <div>
            <style children={
                [
                    '.table th:nth-child(1), .table td:nth-child(1){text-align: center}',
                    '.table td:nth-child(2) > label, .table th:nth-child(2) > label{ margin: auto}'
                ]} />
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex space-sm">
                    <Button color="primary" onClick={this.getAllPermission.bind(this)} title="reload" size="sm">
                        <ReloadSVG color="white" className={'icon' + (isWaiting ? 'spin' : '')} />
                    </Button>
                    <Button onClick={this.updatePermissions.bind(this)} color="primary" size="sm" children="Cập nhật" />
                </div>
                <div className="d-flex space-sm">
                    <WInput title_input="Tìm kiếm" onChange={this.findPermission.bind(this)} ref={this.refComponent.searchValue as any} />
                    <WInputOther title_input="Loại">
                        <select ref={this.refComponent.typeSearch} onChange={this.findPermission.bind(this)}>
                            <option value="code">Mã chức năng</option>
                            <option value="api">Đường dẫn</option>
                            <option value="method">Phương thức</option>
                            <option value="name">Tên chức năng</option>
                        </select>
                    </WInputOther>
                </div>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>
                            <WCheckBox checked={this.state.justShowSelected} onChange={(evt) => { this.setState({ justShowSelected: evt.currentTarget.checked }) }} />
                        </th>
                        <th>Mã CN</th>
                        <th>Tên CN</th>
                        <th>API</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.permissions.map((permission, index) => {
                            let permissionExits: boolean;
                            if (permission.isAllow) {
                                this.permissionSelected.add(permission.id);
                                permissionExits = true;
                            } else {
                                permissionExits = this.permissionSelected.has(permission.id);
                            }
                            if (
                                (!this.state.justShowSelected || permissionExits)
                                && (filter ? filter.filter(permission) : true)
                            ) {
                                return <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <WCheckBox onChange={(evt) => {
                                            let checked = evt.currentTarget.checked;
                                            if (checked) {
                                                this.permissionSelected.add(permission.id);
                                                permission.isAllow = true;
                                            } else {
                                                this.permissionSelected.delete(permission.id);
                                                permission.isAllow = false;
                                            }
                                        }} checked={permissionExits} />
                                    </td>
                                    <td>{permission.code}</td>
                                    <td>{permission.name}</td>
                                    <td>{permission.api}{' => '}{permission.method}</td>
                                </tr>
                            }
                        })
                    }
                </tbody>
            </table>
        </div>
    }
}