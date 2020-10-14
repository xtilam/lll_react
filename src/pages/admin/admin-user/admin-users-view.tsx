import moment from 'moment';
import React from "react";
import { Link } from "react-router-dom";
import { Button } from 'reactstrap';
import AdminUserAPI, { AdminUserResult } from "../../../api/admin/admin-api";
import Utils from '../../../common/Utils';
import ImageError from "../../../components/image-error";
import WCheckBox from '../../../components/wcheckbox';
import WTable from "../../../components/wtable";
import SYSTEM_CONSTANTS from '../../../constants';
import AddSVG from '../../../logo-svg/add';
import CancelSVG from '../../../logo-svg/cancel';
import EditSVG from '../../../logo-svg/edit';
import AdminMessageRequest from '../../../page-component/admin/admin-message-request';
import DetailAdminUser from './detail-user';


interface AdminUserPageState {
    action: undefined | 'view-detail-page',
    isSelectedAll: boolean,
    idEdit: number
}

export default class AdminUserPage extends React.Component<any, AdminUserPageState> {
    firstNumOfKey: number;
    tableRef: React.RefObject<WTable>;
    idsSelected: number[];
    requestMessage: React.RefObject<AdminMessageRequest>;
    page: number;
    limit: number;

    render() {
        return <div id="main-view">
            {
                this.state.action === 'view-detail-page' &&
                <DetailAdminUser goBack={{
                    action: () => { this.setState({ action: undefined }); window.history.replaceState('','',`/admin/admin-users/page?${this.page}&limit=${this.limit}`) },
                    id: this.state.idEdit
                }} />
            }
            <div style={this.state.action === undefined ? undefined : { display: 'none' }}>
                <AdminMessageRequest ref={this.requestMessage} />
                <div className="d-flex f-bar space-sm">
                    <Link to="/admin/admin-user/add" className="btn btn-primary btn-sm"> <AddSVG className="icon" color="white" /> <span>Thêm tài khoản</span> </Link>
                    <Button color="danger" size="sm" onClick={this.deleteUserSelected.bind(this)}> <CancelSVG className="icon" color="white" /> <span>Xóa</span> </Button>
                </div>
                <WTable ref={this.tableRef} getPage={this.getPageUser.bind(this)}
                    fillData={this.fillData.bind(this)}
                    headers={[
                        '#',
                        <WCheckBox className="cc" checked={this.state.isSelectedAll} onChange={(evt) => {
                            let isSelectedAll = evt.currentTarget.checked;
                            this.setState({ isSelectedAll: isSelectedAll });
                        }} />,
                        'TK',
                        'Tên TK',
                        'Tên',
                        'Giới tính',
                        'Cập nhật',
                        'Ngày sinh',
                        'Chi tiết'
                    ]}
                    limit={this.limit}
                    page={this.page}
                    onPageChangeEvent={(evt) => {
                        if (evt.limitChange !== this.limit || evt.pageChange !== this.page) {
                            this.page = evt.pageChange;
                            this.limit = evt.limitChange;
                            window.history.pushState('', '', `?page=${this.page}&limit=${this.limit}`);
                        } else {
                            window.history.replaceState('', '', `?page=${this.page}&limit=${this.limit}`);
                        }
                    }} />
            </div>
        </div>;
    }

    constructor(props: any) {
        super(props);
        this.state = {
            action: undefined,
            isSelectedAll: false,
            idEdit: undefined as any
        }
        this.idsSelected = [];
        this.tableRef = React.createRef();
        this.firstNumOfKey = 0;
        this.requestMessage = React.createRef();
        let { page, limit } = Utils.getPageRequest();
        this.page = page; this.limit = limit;
    }
    componentDidMount() {
        this.tableRef.current?.reloadPage();
        window.history.replaceState('', '', `?page=${this.page}&limit=${this.limit}`);
    }
    async getPageUser(page: number, limit: number): Promise<any> {
        this.firstNumOfKey = (!this.firstNumOfKey as any + 0);
        let data = await this.requestMessage.current
            ?.sendRequest(
                () => { return AdminUserAPI.getAllUser({ page: page, limit: limit, isUnlimited: false }) },
                { hideWhenDone: true, hideWaiting: true, getFailed: true }
            );
        this.idsSelected = [];
        if (data !== undefined) {
            if (data.message.code === 0) {
                return {
                    data: data.data,
                    limit: Number(limit),
                    offset: data.message.data.offset,
                    page: data.message.data.page,
                    totalPage: data.message.data.totalPage,
                    totalRecord: data.message.data.totalRecord
                };
            } else if (data.message.code === SYSTEM_CONSTANTS.ERROR_REQUEST.PAGE_OUT_INDEX) {
                return await (this.getPageUser(data.message.data.totalPage, limit));
            }
        }
        return undefined;
    }
    fillData(user: AdminUserResult, index: any) {
        if (this.state.isSelectedAll) {
            let index = this.idsSelected.indexOf(user.id);
            if (index !== -1) this.idsSelected.splice(index, 1);
            this.idsSelected.push(user.id);
        }
        return <tr key={this.firstNumOfKey + '' + index} onClick={
            (evt) => {
                let checkbox = $('.user-checkbox', evt.currentTarget)[0];
                if ($(checkbox).find(evt.target as any).length === 0 && checkbox !== evt.target) {
                    checkbox.click();
                }
            }
        }
        >
            <td>{index + 1}</td> 
            <td><WCheckBox className="user-checkbox" onChange={(evt) => {
                let index = this.idsSelected.indexOf(user.id);
                if (index !== -1) this.idsSelected.splice(index, 1);
                evt.currentTarget.checked && this.idsSelected.push(user.id);
            }} checked={this.state.isSelectedAll} /></td>
            <td>
                <ImageError
                    src={(process.env.REACT_APP_ADMIN_USER_IMAGE_PATH || '') + user.id + '.jpg'}
                    err-src={(process.env.REACT_APP_ADMIN_USER_IMAGE_PATH || '') + 'default.jpg'} />
            </td>
            <td>{user.adminCode}</td>
            <td>{user.fullname}</td>
            <td>{user.gender === 0 ? 'Nam' : user.gender === 1 ? 'Nữ' : 'Khác'}</td>
            <td title={`Tạo bởi: ${user.createBy} - ${moment(user.createDate).calendar()}\nCập nhật: ${user.modifiedBy}-${moment(user.modifiedDate).calendar()}}`}>
                {user.modifiedBy}
            </td>
            <td>{moment(user.dateOfBirth).format('DD-MM-YYYY')}</td>
            <td className="text-center">
                <button className="btn btn-primary btn-sm" onClick={() => {
                    this.setState({ action: "view-detail-page", idEdit: user.id });
                    console.log(user.id);
                }}><EditSVG color="white" className="icon" /></button>
            </td>
        </tr>
    }
    async deleteUserSelected() {
        await this.requestMessage.current?.sendRequest(() => { return AdminUserAPI.deleteUsers(this.idsSelected) });
        let message = this.requestMessage.current?.state.message;
        let alertColor = this.requestMessage.current?.state.color;
        await this.tableRef.current?.reloadPage();
        this.requestMessage.current?.setMessage({ color: alertColor, message: message, isHide: false });
    }
}