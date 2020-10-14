import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import GroupPermissionAPI, { GroupPermissionAPIResult } from "../../../api/admin/group-api";
import PermissionAPI, { PermissionAPIResult } from "../../../api/admin/permission-api";
import AdminMessageRequest from "../../../page-component/admin/admin-message-request";
import UpdateGroupInfo from "./update-group";
import UpdateGroupPermission from "./update-group-permissions";

interface DetailGroupPermissionProps {
    goBack?: {
        action: () => any,
        id: number | string,
        oldLocation: string
    },
}
interface DetailGroupPermissionState {
    groupInfo: GroupPermissionAPIResult,
    viewAction: 'view-info' | 'update-group' | 'update-permissions',
    isDisable: boolean,
    isNotFoundResult: boolean,
    nextUpdate: boolean
}
export default class DetailGroupPermission extends React.Component<DetailGroupPermissionProps, DetailGroupPermissionState>{
    adminMessageRequest: React.RefObject<AdminMessageRequest> = React.createRef();

    constructor(props: any) {
        super(props);
        this.state = {
            groupInfo: {} as any,
            isDisable: false,
            isNotFoundResult: false,
            nextUpdate: false,
            viewAction: 'view-info'
        }
    }
    componentDidMount() {
        this.getGroup();
    }
    menuClickEvent(evt: React.MouseEvent<HTMLLIElement, MouseEvent>) {
        let target = evt.currentTarget;
        this.setState({ viewAction: target.getAttribute('view-action') as any });
        this.adminMessageRequest.current?.closeMessage();
    }
    async componentDidUpdate() {
        if (this.state.nextUpdate && this.state.viewAction === 'view-info') {
            await this.setState({ nextUpdate: false });
            this.getGroup();
        }
    }
    render() {
        let { viewAction, groupInfo } = this.state;
        let btnGoBack = this.props.goBack
            ? <div onClick={
                () => { window.history.replaceState('', '', this.props.goBack?.oldLocation); this.props.goBack?.action(); }
            }> Trở về</div >
            : <Link to="/admin/groups">Trở về</Link>;
        return (
            <div className={`menu-select-layout ${this.state.isDisable ? 'disabled' : ''}`} style={{ height: '100%' }}>
                <div className="menu-select">
                    <ul>
                        <li className="bg-danger text-white"
                            onClick={(evt) => {
                                let firstChild = evt.currentTarget.firstChild; firstChild && (firstChild as any).click();
                            }}>{btnGoBack}</li>
                        <li className={viewAction === 'view-info' ? 'active' : ''} view-action="view-info" onClick={this.menuClickEvent.bind(this)}>Xem thông tin</li>
                        <li className={viewAction === 'update-group' ? 'active' : ''} view-action="update-group" onClick={this.menuClickEvent.bind(this)}>Cập nhật thông tin</li>
                        <li className={viewAction === 'update-permissions' ? 'active' : ''} view-action="update-permissions" onClick={this.menuClickEvent.bind(this)}>Cập nhật chức năng</li>
                    </ul>
                </div>
                <div className="child-content">
                    <div className={`form-container`}>
                        <AdminMessageRequest ref={this.adminMessageRequest} />
                        {
                            !this.state.isNotFoundResult ? (
                                <div>
                                    { viewAction === "view-info"
                                        && <div>
                                            <div className="d-flex justify-content-between">
                                                <h2>Thông tin nhóm năng {this.state.groupInfo.name}</h2>
                                            </div>
                                            <br />
                                            <table className="table wtable-info">
                                                <tbody>
                                                    <tr>
                                                        <td>ID</td>
                                                        <td>{groupInfo.id}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Mã Nhóm</td>
                                                        <td>{groupInfo.groupCode}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Tên nhóm</td>
                                                        <td>{groupInfo.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Khởi tạo</td>
                                                        <td><Link to={`/admin/admin-user/detail?adminCode=${groupInfo.modifiedBy}`}>{groupInfo.modifiedBy}</Link> - {moment(groupInfo.modifiedDate).calendar()}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Cập nhật</td>
                                                        <td><Link to={`/admin/admin-user/detail?adminCode=${groupInfo.createBy}`}>{groupInfo.createBy}</Link> - {moment(groupInfo.createDate).calendar()}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Mô tả</td>
                                                        <td>{groupInfo.description}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    }
                                    { viewAction === 'update-group' && <UpdateGroupInfo
                                        adminMessageRequest={()=>(this.adminMessageRequest.current as any)}
                                        groupInfo={this.state.groupInfo}
                                        onUpdateSuccess={() => { this.setState({ nextUpdate: true }) }}
                                    />}
                                    { viewAction === 'update-permissions' && <UpdateGroupPermission
                                        id={this.state.groupInfo.id}
                                        adminMessageRequest={()=>(this.adminMessageRequest.current as any)} />}
                                </div>
                            ) : <div className="d-flex space-sm">
                                    <Button color="primary" size="sm" onClick={this.getGroup.bind(this)}>Tải lại</Button>
                                    {btnGoBack}
                                </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
    async getGroup() {
        await this.setState({ isDisable: true });
        let id = new URLSearchParams(window.location.search).get("id") || (this.props.goBack && this.props.goBack.id);
        if (!id) {
            this.setState({ isNotFoundResult: false, isDisable: false }); return;
        }

        window.history.replaceState('', '', `/admin/group/detail?id=${id}`);

        let resultReq = await this.adminMessageRequest.current?.sendRequest(() => { return GroupPermissionAPI.getGroup(id as any) }, { hideWhenDone: true });

        if (resultReq) {
            let groupInfo = resultReq.data;
            await this.setState({ groupInfo: groupInfo, isDisable: false });
        } else {
            this.setState({ isNotFoundResult: true, isDisable: false });
        };
    }
}