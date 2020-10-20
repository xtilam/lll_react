import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import GroupPermissionAPI, { GroupPermissionAPIResult } from "../../../api/admin/group-api";
import ReloadSVG from "../../../logo-svg/reload";
import DetailAdminPage from "../../../page-component/admin/menu-detail";
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
    isNotFoundResult: boolean,
}
export default class DetailGroupPermission extends React.Component<DetailGroupPermissionProps, DetailGroupPermissionState>{
    detailPage: React.RefObject<DetailAdminPage> = React.createRef();
    nextUpdate = false;
    constructor(props: any) {
        super(props);
        this.state = {
            groupInfo: {} as any,
            isNotFoundResult: false,
        }
    }
    componentDidMount() {
        this.getGroup();
    }
    getAdminMessageReq() {
        return this.detailPage.current?.adminMessageRequest.current as any;
    }
    render() {
        const { groupInfo } = this.state;
        const goBackAction = this.props.goBack
            ? () => {
                window.history.replaceState('', '', this.props.goBack?.oldLocation);
                this.props.goBack?.action();
            }
            : "/admin/groups"

        const viewGroup = (<div>
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
        </div>)
        return <DetailAdminPage ref={this.detailPage}
            interceptor={(menu) => !this.state.isNotFoundResult
                ? menu
                : (<div className="d-flex space-sm">
                    <Button color="primary" size="sm" onClick={this.getGroup.bind(this)}><ReloadSVG color="white" className="icon" /> Tải lại</Button>
                </div>)
            }
            goBackAction={goBackAction}
            menuConfig={[
                {
                    name: 'Xem thông tin nhóm',
                    body: viewGroup,
                    callback: () => {
                        if (this.nextUpdate) {
                            this.nextUpdate = false;
                            this.getGroup();
                        }
                    }
                },
                {
                    name: 'Cập nhật thông tin',
                    body: <UpdateGroupInfo
                        adminMessageRequest={this.getAdminMessageReq.bind(this)}
                        groupInfo={this.state.groupInfo}
                        onUpdateSuccess={() => { this.nextUpdate = true }}
                    />
                },
                {
                    name: 'Cập nhật CN cho nhóm',
                    body: <UpdateGroupPermission
                        id={this.state.groupInfo.id}
                        adminMessageRequest={this.getAdminMessageReq.bind(this)} />
                }
            ]}
        />
    }
    async getGroup() {
        const goBackId = this.props.goBack && this.props.goBack.id
        const requestId = new URLSearchParams(window.location.search).get("id");
        const id = goBackId || requestId;
        const adminMessageRequest = this.getAdminMessageReq();

        if (id) {
            window.history.replaceState('', '', `/admin/group/detail?id=${id}`);

            const resultReq = await adminMessageRequest.sendRequest(() => {
                return GroupPermissionAPI.getGroup(id as any)
            }, { hideWhenDone: true });

            if (resultReq) {
                await this.setState({ groupInfo: resultReq.data });
                return;
            }
        }
        this.setState({ isNotFoundResult: true });
    }
}