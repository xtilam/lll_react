import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import PermissionAPI, { PermissionAPIResult } from "../../../api/admin/permission-api";
import AdminMessageRequest from "../../../page-component/admin/admin-message-request";
import UpdatePermission from "./update-permission";

interface DetailPermissionProps {
    goBack?: {
        action: () => any,
        id: number | string,
        oldLocation: string
    },
}
interface DetailPermissionState {
    permissionInfo: PermissionAPIResult,
    viewAction: 'view-info' | 'update-permission' | 'change-password',
    isDisable: boolean,
    isNotFoundResult: boolean,
    nextUpdate: boolean
}
export default class DetailPermission extends React.Component<DetailPermissionProps, DetailPermissionState>{
    adminMessageRequest: React.RefObject<AdminMessageRequest> = React.createRef();

    constructor(props: any) {
        super(props);
        this.state = {
            permissionInfo: {} as any,
            isDisable: false,
            isNotFoundResult: false,
            nextUpdate: false,
            viewAction: 'view-info'
        }
    }
    componentDidMount() {
        this.getPermission();
    }
    menuClickEvent(evt: React.MouseEvent<HTMLLIElement, MouseEvent>) {
        let target = evt.currentTarget;
        this.setState({ viewAction: target.getAttribute('view-action') as any });
        this.adminMessageRequest.current?.closeMessage();
    }
    async componentDidUpdate() {
        if (this.state.nextUpdate && this.state.viewAction === 'view-info') {
            await this.setState({ nextUpdate: false });
            this.getPermission();
        }
    }
    render() {
        let { viewAction, permissionInfo } = this.state;
        let btnGoBack = this.props.goBack
            ? <div onClick={
                () => { window.history.replaceState('', '', this.props.goBack?.oldLocation); this.props.goBack?.action(); }
            }> Trở về</div >
            : <Link to="/admin/permissions">Trở về</Link>;
        return (
            <div className={`menu-select-layout ${this.state.isDisable ?  'disabled' : ''}`} style={{ height: '100%' }}>
                <div className="menu-select">
                    <ul>
                        <li className="bg-danger text-white"
                            onClick={(evt) => {
                                let firstChild = evt.currentTarget.firstChild; firstChild && (firstChild as any).click();
                            }}>{btnGoBack}</li>
                        <li className={viewAction === 'view-info' ? 'active' : ''} view-action="view-info" onClick={this.menuClickEvent.bind(this)}>Xem thông tin</li>
                        <li className={viewAction === 'update-permission' ? 'active' : ''} view-action="update-permission" onClick={this.menuClickEvent.bind(this)}>Cập nhật thông tin</li>
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
                                                <h2>Thông tin Chức năng {this.state.permissionInfo.name}</h2>
                                            </div>
                                            <br />
                                            <table className="table wtable-info">
                                                <tbody>
                                                    <tr>
                                                        <td>ID</td>
                                                        <td>{permissionInfo.id}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Mã Chức năng</td>
                                                        <td>{permissionInfo.code}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Đường dẫn</td>
                                                        <td>{permissionInfo.api}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Phương thức</td>
                                                        <td>{permissionInfo.method}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Khởi tạo</td>
                                                        <td><Link to={`/admin/admin-user/detail?adminCode=${permissionInfo.modifiedBy}`}>{permissionInfo.modifiedBy}</Link> - {moment(permissionInfo.modifiedDate).calendar()}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Cập nhật</td>
                                                        <td><Link to={`/admin/admin-user/detail?adminCode=${permissionInfo.createBy}`}>{permissionInfo.createBy}</Link> - {moment(permissionInfo.createDate).calendar()}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Mô tả</td>
                                                        <td>{permissionInfo.description}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    }
                                    { viewAction === 'update-permission' && <UpdatePermission
                                        adminMessageRequest={this.adminMessageRequest.current as any}
                                        permissionInfo={this.state.permissionInfo}
                                        onUpdateSuccess={() => { this.setState({ nextUpdate: true }) }}
                                    />}
                                </div>
                            ) : <div className="d-flex space-sm">
                                    <Button color="primary" size="sm" onClick={this.getPermission.bind(this)}>Tải lại</Button>
                                    {btnGoBack}
                                </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
    updatePermission() {
        // this.editForm.current?.update(this.adminMessageRequest.current as any);
    }
    async getPermission() {
        await this.setState({ isDisable: true });
        let id = new URLSearchParams(window.location.search).get("id") || (this.props.goBack && this.props.goBack.id);
        if (!id) {
            this.setState({ isNotFoundResult: true, isDisable: false }); return;
        }

        window.history.replaceState('', '', `/admin/permission/detail?id=${id}`);

        let resultReq = await this.adminMessageRequest.current?.sendRequest(() => { return PermissionAPI.getPermission(id as any) }, { hideWhenDone: true });

        if (resultReq) {
            let permissionInfo = resultReq.data;
            console.log(permissionInfo);
            await this.setState({ permissionInfo: permissionInfo, isDisable: false });
        } else {
            this.setState({ isNotFoundResult: true, isDisable: false });
        };
    }
}