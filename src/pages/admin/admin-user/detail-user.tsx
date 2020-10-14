import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import AdminUserAPI, { AdminUserResult } from "../../../api/admin/admin-api";
import ReloadSVG from "../../../logo-svg/reload";
import AdminMessageRequest from "../../../page-component/admin/admin-message-request";
import DetailAdminPage from "../../../page-component/admin/menu-detail";
import UpdateGroups from "./admin-groups";
import EditAdminUser from "./edit-user";
import AdminResetPassword from "./reset-password";
import UpdatePermissions from "./update-permissions";

interface DetailAdminUserProps {
    goBack?: {
        action: () => any,
        id?: number | string
        adminCode?: string,
    },
}
interface DetailAdminUserState {
    adminInfo: AdminUserResult,
    isNotFoundUser: boolean
}

export default class DetailAdminUser extends React.Component<DetailAdminUserProps, DetailAdminUserState>{
    avatar: React.RefObject<HTMLImageElement> = React.createRef();
    oldLocation: { url: string, state: any };
    detailPage = React.createRef<DetailAdminPage>();
    nextUpdate = false;

    constructor(props: any) {
        super(props);
        this.state = {
            adminInfo: {} as any,
            isNotFoundUser: false,
        }
        this.oldLocation = {} as any;
    }
    componentDidMount() {
        this.getUser();
    }
    updateInfo() {
        if (this.nextUpdate) {
            this.nextUpdate = false;
            setTimeout(() => {
                this.getUser();
            })
        }
    }
    checkGender() {
        console.log(Number(this.state.adminInfo.gender));
        switch (Number(this.state.adminInfo.gender)) {
            case 0: return 0;
            case 1: return 1;
            default: return undefined;
        }
    }
    getAdminMessageReq(): AdminMessageRequest {
        return this.detailPage.current?.adminMessageRequest.current as any
    }
    render() {
        let { adminInfo } = this.state;
        let goBackAction = this.props.goBack
            ? () => { window.history.replaceState(this.oldLocation.state, '', this.oldLocation.url); this.props.goBack?.action() }
            : '/admin/admin-users'

        return (
            // <div className={`menu-select-layout ${this.state.isDisable ? 'disabled' : ''}`}>
            //     <div className="menu-select">
            //         <ul>
            //             <li className="bg-danger text-white"
            //                 onClick={(evt) => {
            //                     let firstChild = evt.currentTarget.firstChild; firstChild && (firstChild as any).click();
            //                 }}>{btnGoBack}</li>
            //             <li className={viewAction === 'view-detail' ? 'active' : ''} view-action="view-detail"
            //                 onClick={this.menuClickEvent.bind(this)}>Xem thông tin</li>
            //             <li className={viewAction === 'update-user' ? 'active' : ''} view-action="update-user"
            //                 onClick={this.menuClickEvent.bind(this)}>Cập nhật TK</li>
            //             <li className={viewAction === 'change-password' ? 'active' : ''} view-action="change-password"
            //                 onClick={this.menuClickEvent.bind(this)}>Thay đổi mật khẩu</li>
            //             <li className={viewAction === 'permissions' ? 'active' : ''} view-action="permissions"
            //                 onClick={this.menuClickEvent.bind(this)}>Chức năng</li>
            //             <li className={viewAction === 'group-permissions' ? 'active' : ''} view-action="group-permissions"
            //                 onClick={this.menuClickEvent.bind(this)}>Nhóm chức năng</li>
            //         </ul>
            //     </div>
            //     <div className="child-content">
            //         <div className={`form-container`}>
            //             <AdminMessageRequest ref={this.adminMessageRequest}
            //                 onBeforeSendRequest={() => { this.setState({ isDisable: true }) }}
            //                 callback_after_send_request={() => { this.setState({ isDisable: false }) }}
            //             />
            //             {
            //                 !this.state.isNotFoundUser ? (
            //                     <div>
            //                         { viewAction === "view-detail"
            //                             && 
            //                         }
            //                         { viewAction === 'update-user' && }
            //                         { viewAction === 'permissions' && <UpdatePermissions
            //                             adminMessageRequest={() => (this.adminMessageRequest.current as any)}
            //                             id={adminInfo.id}
            //                         />}
            //                         { viewAction === 'change-password' && <AdminResetPassword
            //                             adminMessageRequest={() => (this.adminMessageRequest.current as any)}
            //                             adminInfo={this.state.adminInfo}
            //                         />}
            //                         { viewAction === 'group-permissions' && <UpdateGroups
            //                             adminInfo={this.state.adminInfo}
            //                             adminMessageRequest={() => (this.adminMessageRequest.current as any)}
            //                         />}
            //                     </div>
            //                 ) : <div className="d-flex space-sm">
            //                         <Button color="primary" size="sm" onClick={this.getUser.bind(this)}>Tải lại</Button>
            //                         {btnGoBack}
            //                     </div>
            //             }
            //         </div>
            //     </div>
            // </div >
            <DetailAdminPage
                ref={this.detailPage}
                goBackAction={goBackAction}
                menuConfig={[
                    {
                        name: "Xem thông tin", body: <div>
                            <div className="d-flex justify-content-between">
                                <h2>Thông tin tài khoản {this.state.adminInfo.fullname}</h2>
                                <img className="avatar" src={`${process.env.REACT_APP_ADMIN_USER_IMAGE_PATH}${adminInfo.id}.jpg`}
                                    onError={(evt) => { evt.currentTarget.src = `${process.env.REACT_APP_ADMIN_USER_IMAGE_PATH}default.jpg` }}
                                />
                            </div>
                            <br />
                            <table className="table wtable-info">
                                <tbody>
                                    <tr>
                                        <td>ID</td>
                                        <td>{adminInfo.id}</td>
                                    </tr>
                                    <tr>
                                        <td>Tên tài khoản</td>
                                        <td>{adminInfo.adminCode}</td>
                                    </tr>
                                    <tr>
                                        <td>Tên đầy đủ</td>
                                        <td>{adminInfo.fullname}</td>
                                    </tr>
                                    <tr>
                                        <td>Email</td>
                                        <td>{adminInfo.email}</td>
                                    </tr>
                                    <tr>
                                        <td>Giới tính</td>
                                        <td>{adminInfo.gender == 0 ? 'Nam' : adminInfo.gender == 1 ? 'Nữ' : 'Khác'}</td>
                                    </tr>
                                    <tr>
                                        <td>Địa chỉ</td>
                                        <td>{adminInfo.address}</td>
                                    </tr>
                                    <tr>
                                        <td>Số điện thoại</td>
                                        <td>{adminInfo.phone}</td>
                                    </tr>
                                    <tr>
                                        <td>Số CMND</td>
                                        <td>{adminInfo.identityDocument}</td>
                                    </tr>
                                    <tr>
                                        <td>Người tạo</td>
                                        <td><Link to={"/admin/admin-user/detail?adminCode=" + adminInfo.createBy}>{adminInfo.createBy} - {moment(adminInfo.createDate).calendar()}</Link></td>
                                    </tr>
                                    <tr>
                                        <td>Cập nhật lần cuối</td>
                                        <td><Link to={"/admin/admin-user/detail?adminCode=" + adminInfo.modifiedBy}>{adminInfo.modifiedBy} - {moment(adminInfo.createDate).calendar()}</Link></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>,
                        callback: this.updateInfo.bind(this)
                    },
                    {
                        name: "Cập nhật TK",
                        body: <EditAdminUser
                            adminInfo={this.state.adminInfo}
                            adminMessageRequest={this.getAdminMessageReq.bind(this)}
                            onUpdate={() => { this.nextUpdate = true }}
                        />
                    },
                    {
                        name: 'Cập nhật CN',
                        body: <UpdatePermissions
                            adminMessageRequest={this.getAdminMessageReq.bind(this)}
                            id={adminInfo.id}
                        />
                    },
                    {
                        name: 'Thay đổi mật khẩu',
                        body: <AdminResetPassword
                            adminMessageRequest={this.getAdminMessageReq.bind(this)}
                            adminInfo={this.state.adminInfo}
                        />
                    },
                    {
                        name: 'Cập nhật nhóm CN',
                        body: <UpdateGroups
                            adminInfo={this.state.adminInfo}
                            adminMessageRequest={this.getAdminMessageReq.bind(this)}
                        />
                    }
                ]}
                interceptor={(menu: JSX.Element) =>
                    !this.state.isNotFoundUser
                        ? menu
                        : (<div className="d-flex space-sm">
                            <Button color="primary" size="sm" onClick={this.getUser.bind(this)}><ReloadSVG color="white" className="icon" /> Tải lại</Button>
                        </div>)
                }
            />
        )
    }
    async getUser() {
        let getData = () => {
            let { goBack }: any = this.props;
            let search = new URLSearchParams(window.location.search);
            for (let key of ['id', 'adminCode']) {
                let value = (goBack && goBack[key]) || search.get(key);
                if (value) return { data: { [key]: value }, key: key, value: value }
            }
        }
        let data: any = getData();
        if (data !== undefined) {
            window.history.replaceState('', '', `/admin/admin-user/detail?${data.key}=${data.value}`);

            let resultReq = await this.getAdminMessageReq().sendRequest(() => AdminUserAPI.getUser(data.data), { hideWhenDone: true });

            if (resultReq) {
                let adminInfo = resultReq.data;
                await this.setState({ adminInfo: adminInfo });
                return;
            }
        }

        this.setState({ isNotFoundUser: true });
    }
}