import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import PermissionAPI, { PermissionAPIResult } from "../../../api/admin/permission-api";
import ReloadSVG from "../../../logo-svg/reload";
import AdminMessageRequest from "../../../page-component/admin/admin-message-request";
import DetailAdminPage from "../../../page-component/admin/menu-detail";
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
    isNotFoundResult: boolean,
}
export default class DetailPermission extends React.Component<DetailPermissionProps, DetailPermissionState>{
    detailPage = React.createRef<DetailAdminPage>();
    nextUpdate = false;

    constructor(props: any) {
        super(props);
        this.state = {
            permissionInfo: {} as any,
            isNotFoundResult: false
        }
    }
    componentDidMount() {
        this.getPermission();
    }
    updateInfo() {
        if (this.nextUpdate) {
            this.nextUpdate = false;
            setTimeout(() => {
                this.getPermission();
            })
        }
    }
    renderMenu(menu: JSX.Element) {
        if (!this.state.isNotFoundResult) {
            return menu;
        } else {
            return <div className="d-flex space-sm">
                <Button color="primary" size="sm" onClick={this.getPermission.bind(this)}><ReloadSVG color="white" className="icon" /> Tải lại</Button>
            </div>
        }
    }
    getAdminMessageReq(): AdminMessageRequest {
        return this.detailPage.current?.adminMessageRequest.current as any
    }
    render() {
        let { permissionInfo } = this.state;
        let goBack = this.props.goBack
            ? () => { window.history.replaceState('', '', this.props.goBack?.oldLocation); this.props.goBack?.action(); }
            : '/admin/permissions';

        return <DetailAdminPage
            ref={this.detailPage}
            goBackAction={goBack}
            menuConfig={[
                {
                    name: "Xem thông tin",
                    callback: this.updateInfo.bind(this),
                    body: this.renderMenu(<div>
                        <div className="d-flex justify-content-between">
                            <h2><strong>Chức năng </strong>{this.state.permissionInfo.name}</h2>
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
                                    <td>Tên chức năng</td>
                                    <td>{permissionInfo.name}</td>
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
                    </div>)
                },
                {
                    name: "Cập nhật CN",
                    body: this.renderMenu(<UpdatePermission
                        adminMessageRequest={this.getAdminMessageReq.bind(this)}
                        permissionInfo={permissionInfo}
                        onUpdateSuccess={() => { this.nextUpdate = true }}
                    />)
                }
            ]}
        />
    }
    async getPermission() {
        // find id
        let id = new URLSearchParams(window.location.search).get("id") || (this.props.goBack && this.props.goBack.id);
        if (id) {
            window.history.replaceState('', '', `/admin/permission/detail?id=${id}`);
            let resultReq = await this.getAdminMessageReq().sendRequest(() => { return PermissionAPI.getPermission(id as any) }, { hideWhenDone: true });
            if (resultReq) {
                let permissionInfo = resultReq.data;
                await this.setState({ permissionInfo: permissionInfo });
                return;
            }
        }
        this.setState({ isNotFoundResult: true });
    }
}