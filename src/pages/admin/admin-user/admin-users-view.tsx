import moment from 'moment';
import React, { Fragment } from "react";
import AdminUserAPI, { AdminUserResult } from "../../../api/admin/admin-api";
import { APIResult } from '../../../api/declare';
import ImageError from "../../../components/image-error";
import { AdminOverrideWindow } from '../../../contexts/admin-overide-window';
import EditSVG from '../../../logo-svg/edit';
import BaseCrudView, { BaseViewConfig } from '../base/base-view';
import DetailAdminUser from './detail-user';

export default class AdminUserPage extends BaseCrudView<AdminUserResult> {
    configure(): BaseViewConfig<AdminUserResult> {
        return {
            addPage: { textButton: 'Thêm Tài khoản', link: '/admin/admin-user/add' },
            deleteAction: { textButton: 'Xóa', deleteMethod: (ids) => AdminUserAPI.deleteUsers(ids) },
            urlPage: '/admin/admin-user',
            headers: [
                'TK',
                'Tên TK',
                'Tên',
                'Giới tính',
                'Cập nhật',
                'Ngày sinh',
                <div className='text-center'>Chi tiết</div>
            ]
        }
    }
    subRender(): JSX.Element | null {
        return null;
    }
    getId(data: AdminUserResult) {
        return data.id
    }
    fillData(data: AdminUserResult, unselectClass: string): JSX.Element {
        return <Fragment>
            <td>
                <ImageError
                    src={(process.env.REACT_APP_ADMIN_USER_IMAGE_PATH || '') + data.id + '.jpg'}
                    err_src={(process.env.REACT_APP_ADMIN_USER_IMAGE_PATH || '') + 'default.jpg'} />
            </td>
            <td>{data.adminCode}</td>
            <td>{data.fullname}</td>
            <td>{data.gender === 0 ? 'Nam' : data.gender === 1 ? 'Nữ' : 'Khác'}</td>
            <td title={`Tạo bởi: ${data.createBy} - ${moment(data.createDate).calendar()}\nCập nhật: ${data.modifiedBy}-${moment(data.modifiedDate).calendar()}}`}>
                {data.modifiedBy}
            </td>
            <td>{moment(data.dateOfBirth).format('DD-MM-YYYY')}</td>
            <td className="text-center">
                <AdminOverrideWindow.Consumer>
                    {({ addWindow, removeWindow }) => {
                        return <button className={`btn btn-primary btn-sm ${unselectClass}`} onClick={() => {
                            const editWindow = addWindow(<DetailAdminUser goBack={{
                                action: () => {
                                    removeWindow(editWindow)
                                    window.history.replaceState('', '', `${this.config.urlPage}?page=${this.page}&limit=${this.limit}`)
                                },
                                id: data.id
                            }} />)
                        }}><EditSVG color="white" className="icon" /></button>
                    }}
                </AdminOverrideWindow.Consumer>
            </td>
        </Fragment>
    }
    getPageAPIMethod(page: number, limit: number): Promise<APIResult<any, any>> {
        return AdminUserAPI.getAllUser({ page: page, limit: limit, isUnlimited: false })
    }
}