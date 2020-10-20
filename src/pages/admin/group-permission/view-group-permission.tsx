import moment from "moment";
import React, { Fragment } from "react";
import { Button } from "reactstrap";
import GroupPermissionAPI, { GroupPermissionAPIResult } from "../../../api/admin/group-api";
import PermissionAPI from "../../../api/admin/permission-api";
import { APIResult } from "../../../api/declare";
import { AdminOverrideWindow } from "../../../contexts/admin-overide-window";
import EditSVG from "../../../logo-svg/edit";
import BaseCrudView, { BaseViewConfig } from "../base/base-view";
import DetailPermission from "../permission/detail-permission";
import DetailGroupPermission from "./detail-group-permission";


export default class ViewGroupPermission extends BaseCrudView<GroupPermissionAPIResult>{
    configure(): BaseViewConfig<GroupPermissionAPIResult> {
        return {
            headers: ['Tên Nhóm',
                'Mã nhóm',
                'Cập nhật',
                <div className="text-center">Chi tiết</div>
            ],
            urlPage: '/admin/permissions',
            addPage: {
                textButton: 'Thêm nhóm',
                link: '/admin/permission/add'
            },
            deleteAction: {
                textButton: 'Xóa',
                deleteMethod: PermissionAPI.deletePermissions
            }
        }
    }
    getId(permission: GroupPermissionAPIResult) {
        return permission.id
    }
    fillData(permission: GroupPermissionAPIResult, unselectClass: string): JSX.Element {
        return <Fragment>
            <td>{permission.name}</td>
            <td>{permission.groupCode}</td>
            <td title={`Cập nhât: ${permission.modifiedBy} - ${moment(permission.modifiedDate).calendar()}\nKhởi tạo: ${permission.createBy} - ${moment(permission.createDate).calendar()}`
            }>{permission.modifiedBy}</td>
            <td className="text-center">
                <AdminOverrideWindow.Consumer>
                    {({ addWindow, removeWindow }) => {
                        return <Button color="primary" size="sm" className={unselectClass} onClick={() => {
                            const detailPage = addWindow(<DetailGroupPermission
                                goBack={{
                                    action: () => {
                                        removeWindow(detailPage)
                                        window.history.replaceState('', '', `${this.config.urlPage}?page=${this.page}&limit=${this.limit}`)
                                    },
                                    id: permission.id,
                                    oldLocation: `${this.config.urlPage}?page=${this.page}&limit=${this.limit}`
                                }}
                            />)
                        }}>
                            <EditSVG color="white" className="icon" />
                        </Button>
                    }}
                </AdminOverrideWindow.Consumer>
            </td>
        </Fragment>
    }
    getPageAPIMethod(page: number, limit: number): Promise<APIResult<any, any>> {
        return GroupPermissionAPI.getAllGroup({ page: page, limit: limit, isUnlimited: false })
    }
    subRender(): JSX.Element | null {
        return null
    }
}