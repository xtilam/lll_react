import moment from "moment";
import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import PermissionAPI, { PermissionAPIResult } from "../../../api/admin/permission-api";
import { APIResult } from "../../../api/declare";
import Utils from "../../../common/Utils";
import WCheckBox from "../../../components/wcheckbox";
import WTable from "../../../components/wtable";
import SYSTEM_CONSTANTS from "../../../constants";
import { AdminOverrideWindow } from "../../../contexts/admin-overide-window";
import AddSVG from "../../../logo-svg/add";
import CancelSVG from "../../../logo-svg/cancel";
import EditSVG from "../../../logo-svg/edit";
import AdminMessageRequest from "../../../page-component/admin/admin-message-request";
import BaseCrudView, { BaseViewConfig } from "../base/base-view";
import DetailPermission from "./detail-permission";

export default class ViewPermission extends BaseCrudView<PermissionAPIResult>{
    getId(data: PermissionAPIResult) {
        return data.id
    }
    fillData(data: PermissionAPIResult, unselectClass: string): JSX.Element {
        return <Fragment>
            <td>{data.code}</td>
            <td>{data.name}</td>
            <td title={`Cập nhât: ${data.modifiedBy} - ${moment(data.modifiedDate).calendar()}\nKhởi tạo: ${data.createBy} - ${moment(data.createDate).calendar()}`
            }>{data.modifiedBy}</td>
            <td className="text-center">
                <AdminOverrideWindow.Consumer>
                    {({ addWindow, removeWindow }) => {
                        return <Button color="primary" size="sm" onClick={() => {
                            const detailPage = addWindow(<DetailPermission
                                goBack={{
                                    action: () => removeWindow(detailPage),
                                    id: data.id,
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
        return PermissionAPI.getAllPermission({ page: page, limit: limit, isUnlimited: false })
    }
    subRender(): JSX.Element | null {
        return null
    }
    configure(): BaseViewConfig<PermissionAPIResult> {
        return {
            headers: [
                'Mã CN',
                'Tên CN',
                'Cập nhật',
                <div className="text-center">Chi tiết</div>
            ],
            urlPage: '/admin/permissions',
            addPage: {
                textButton: 'Thêm chức năng',
                link: '/admin/permission/add'
            },
            deleteAction: {
                textButton: 'Xóa',
                deleteMethod: PermissionAPI.deletePermissions
            }
        }
    }
    /*
    render() {
        return (
            <div id="main-view">
                {
                    this.state.action === 'view-detail-page' && <DetailPermission goBack={{
                        action: () => { this.setState({ action: undefined }) },
                        id: this.idSelected,
                        oldLocation: window.location.href
                    }} />
                }
                <div style={this.state.action === undefined ? undefined : { display: 'none' }}>
                    <AdminMessageRequest ref={this.requestMessage} />
                    <div className="d-flex f-bar space-sm">
                        <Link to="/admin/permission/add" className="btn btn-primary btn-sm"> <AddSVG className="icon" color="white" /> <span>Thêm chức năng</span> </Link>
                        <Button color="danger" size="sm" onClick={this.deleteIdsSelected.bind(this)}> <CancelSVG className="icon" color="white" /> <span>Xóa</span> </Button>
                    </div>
                    <WTable ref={this.tableRef} getPage={this.getPage.bind(this)}
                        fillData={this.fillData.bind(this)}
                        headers={[
                            '#',
                            <WCheckBox className="cc" checked={this.state.isSelectedAll} onChange={(evt) => {
                                let isSelectedAll = evt.currentTarget.checked;
                                this.setState({ isSelectedAll: isSelectedAll });
                                $('tr > td:nth-child(2) > .id-checkbox > input[type="checkbox"]', this.tableRef.current?.tableBody.current)
                                    .each((index, e: any) => {
                                        e.checked !== isSelectedAll && e.click();
                                    });
                            }} />,
                            'Mã CN',
                            'Tên CN',
                            'Cập nhật',
                            <div className="text-center">Chi tiết</div>
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
            </div>
        )
    }
    constructor(props: any) {
        super(props);
        this.firstNumOfKey = 0;
        let { page, limit } = Utils.getPageRequest();
        this.page = page; this.limit = limit;
        this.state = {
            action: undefined,
            isSelectedAll: false
        }
    }
    async deleteIdsSelected() {
        let result = await this.requestMessage.current?.sendRequest(() => { return PermissionAPI.deletePermissions(this.idsSelected) });
        if (result) {
            this.tableRef.current?.reloadPage();
        }
    }
    showDetailPage(id: number) {
        this.idSelected = id;
        this.setState({ action: 'view-detail-page' });
    }
    fillData(data: PermissionAPIResult, index?: number | undefined) {
        return <tr key={`${this.firstNumOfKey}${index}`} onClick={
            (evt) => {
                let checkbox = $('.id-checkbox', evt.currentTarget)[0];
                if ($(checkbox).find(evt.target as any).length === 0 && checkbox !== evt.target) {
                    checkbox.click();
                }
            }
        }>
            <td>{index}</td>
            <td><WCheckBox className="id-checkbox" onChange={(evt) => {
                let index = this.idsSelected.indexOf(data.id);
                if (index !== -1) this.idsSelected.splice(index, 1);
                evt.currentTarget.checked && this.idsSelected.push(data?.id);
            }} checked={this.state.isSelectedAll} /></td>
            <td>{data.code}</td>
            <td>{data.name}</td>
            <td title={`Cập nhât: ${data.modifiedBy} - ${moment(data.modifiedDate).calendar()}\nKhởi tạo: ${data.createBy} - ${moment(data.createDate).calendar()}`
            }>{data.modifiedBy}</td>
            <td className="text-center">
                <Button color="primary" size="sm" onClick={() => { this.showDetailPage(data.id) }}>
                    <EditSVG color="white" className="icon" />
                </Button></td>
        </tr >;
    }
    componentDidMount() {
        window.history.replaceState('', '', `/admin/permissions?page=${this.page}&limit=${this.limit}`);
        this.tableRef.current?.getPage(this.page, this.limit);
    }
    async getPage(page: number, limit: number): Promise<any> {
        this.firstNumOfKey = (!this.firstNumOfKey as any + 0);
        let data = await this.requestMessage.current
            ?.sendRequest(
                () => { return PermissionAPI.getAllPermission({ page: page, limit: limit, isUnlimited: false }) },
                { hideWhenDone: true, hideWaiting: true, getFailed: true }
            );
        console.log(page, limit);
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
                return await (this.getPage(data.message.data.totalPage, limit));
            }
        }
        return undefined;
    }
    */
}