import React from "react";
import { Button } from "reactstrap";
import AdminUserAPI, { AdminGroupAPIResult, AdminUserResult } from "../../../api/admin/admin-api";
import { GroupPermissionAPIResult } from "../../../api/admin/group-api";
import Utils from "../../../common/Utils";
import WCheckBox from "../../../components/wcheckbox";
import WInput, { WInputOther } from "../../../components/winput";
import ReloadSVG from "../../../logo-svg/reload";
import AdminMessageRequest from "../../../page-component/admin/admin-message-request";

interface UpdateGroupsProps {
    adminInfo: AdminUserResult,
    adminMessageRequest: AdminMessageRequest
}
interface UpdateGroupsState {
    justShowSelected: boolean,
    isWaiting: boolean,
    groups: AdminGroupAPIResult[],
    filter: any,
}
export default class UpdateGroups extends React.Component<UpdateGroupsProps, UpdateGroupsState>{
    groupsSelected: Set<number> = new Set([]);
    refComponent = {
        typeSearch: React.createRef<HTMLSelectElement>(),
        searchValue: React.createRef<HTMLInputElement>(),
    }
    searchValue: string = '';
    constructor(props: UpdateGroupsProps) {
        super(props);
        this.state = {
            justShowSelected: false,
            isWaiting: false,
            groups: [],
            filter: undefined
        }
    }
    componentDidMount() {
        this.getAllGroup();
    }
    async getAllGroup() {
        await this.setState({isWaiting: true});
        let result = await this.props.adminMessageRequest.sendRequest(() => {
            return AdminUserAPI.getAllGroups(this.props.adminInfo.adminCode);
        }, { hideWhenDone: true });
        this.groupsSelected.clear();
        if (result !== undefined) {
            this.setState({ groups: result.data, isWaiting: false });
        }else{
            this.setState({isWaiting: false});
        }
    }
    findGroup() {
        this.searchValue = (this.refComponent.searchValue.current as any).input.current.value.trim();
        let typeSearch = this.refComponent.typeSearch.current?.value;
        if (this.searchValue) {
            this.setState({
                filter: Utils.filterString(this.searchValue, (group) => { return group[typeSearch as string] })
            })
        } else {
            this.setState({ filter: undefined });
        }
    }
    async updateGroups() {
        
        this.props.adminMessageRequest.sendRequest(()=>{
            return AdminUserAPI.updateAdminGroups({adminId: this.props.adminInfo.id, groupIds: Utils.setToArray(this.groupsSelected)});
        })
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
                    <Button color="primary" onClick={this.getAllGroup.bind(this)} title="reload" size="sm">
                        <ReloadSVG color="white" className={'icon ' + (isWaiting ? 'spin' : '')} />
                    </Button>
                    <Button onClick={this.updateGroups.bind(this)} color="primary" size="sm" children="Cập nhật" />
                </div>
                <div className="d-flex space-sm">
                    <WInput title_input="Tìm kiếm" onChange={this.findGroup.bind(this)} ref={this.refComponent.searchValue as any} />
                    <WInputOther title_input="Loại">
                        <select ref={this.refComponent.typeSearch} onChange={this.findGroup.bind(this)}>
                            <option value="groupCode">Mã nhóm</option>
                            <option value="name">Tên nhóm</option>
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
                        <th>Mã nhóm</th>
                        <th>Tên nhóm</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.groups.map((group, index) => {
                            let groupExits: boolean;
                            if (group.isAllow) {
                                this.groupsSelected.add(group.id);
                                groupExits = true;
                            } else {
                                groupExits = this.groupsSelected.has(group.id);
                            }
                            if (
                                (!this.state.justShowSelected || groupExits)
                                && (filter ? filter.filter(group) : true)
                            ) {
                                return <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <WCheckBox onChange={(evt) => {
                                            let checked = evt.currentTarget.checked;
                                            if (checked) {
                                                this.groupsSelected.add(group.id);
                                                group.isAllow = true;
                                            } else {
                                                this.groupsSelected.delete(group.id);
                                                group.isAllow = false;
                                            }
                                        }} checked={groupExits} />
                                    </td>
                                    <td>{group.groupCode}</td>
                                    <td>{group.name}</td>
                                </tr>
                            }
                        })
                    }
                </tbody>
            </table>
        </div>
    }
}