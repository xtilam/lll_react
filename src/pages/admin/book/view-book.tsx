import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import BookAPI, { BookAPIResult } from "../../../api/admin/book-api";
import GroupPermissionAPI, { GroupPermissionAPIResult } from "../../../api/admin/group-api";
import Utils from "../../../common/Utils";
import ImageError from "../../../components/image-error";
import WCheckBox from "../../../components/wcheckbox";
import WTable from "../../../components/wtable";
import SYSTEM_CONSTANTS from "../../../constants";
import AddSVG from "../../../logo-svg/add";
import CancelSVG from "../../../logo-svg/cancel";
import EditSVG from "../../../logo-svg/edit";
import AdminMessageRequest from "../../../page-component/admin/admin-message-request";

interface ViewBookState {
    action: undefined | 'view-detail-page',
    isSelectedAll: boolean,
}

export default class ViewBook extends React.Component<any, ViewBookState>{
    tableRef = React.createRef<WTable>();
    requestMessage = React.createRef<AdminMessageRequest>();
    firstNumOfKey: number = 0;
    idsSelected: number[] = [];
    page: number = 0;
    limit: number = 0;
    idSelected: number = 0;

    render() {
        return (
            <div id="main-view">
                {
                    this.state.action === 'view-detail-page'
                }
                <div style={this.state.action === undefined ? undefined : { display: 'none' }}>
                    <AdminMessageRequest ref={this.requestMessage} />
                    <div className="d-flex f-bar space-sm">
                        <Link to="/admin/book/add" className="btn btn-primary btn-sm"> <AddSVG className="icon" color="white" /> <span>Thêm Sách</span> </Link>
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
                            'Sách',
                            'Tên sách',
                            'ISBN',
                            'Tác giả',
                            'Thể loại',
                            'Cập nhật',
                            'Số lượng',
                            < div className="text-center" > Chi tiết</div>
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
            isSelectedAll: false,
        }
    }
    async deleteIdsSelected() {
        let result = await this.requestMessage.current?.sendRequest(() => { return GroupPermissionAPI.deleteGroups(this.idsSelected) });
        if (result) {
            this.tableRef.current?.reloadPage();
        }
    }
    showDetailPage(id: number) {
        this.idSelected = id;
        this.setState({ action: 'view-detail-page' });
    }
    fillData(data: BookAPIResult, index?: number | undefined) {
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
                let index = this.idsSelected.indexOf(data?.id as number);
                if (index !== -1) this.idsSelected.splice(index, 1);
                evt.currentTarget.checked && this.idsSelected.push(data?.id as number);
            }} checked={this.state.isSelectedAll} /></td>
            <td><ImageError className="no-round"
                src={`${process.env.REACT_APP_BOOK_IMAGE_PATH}${data.id}.jpg`}
                err-src={`${process.env.REACT_APP_BOOK_IMAGE_PATH}default.jpg`} /></td>
            <td>{data.title}</td>
            <td>{data.isbn}</td>
            <td>{data.authors?.map((item) => { return item.name }).join(', ')}</td>
            <td>{data.categories?.map((item) => { return item.category }).join(', ')}</td>
            <td title={`Cập nhât: ${data.modifiedBy} - ${moment(data.modifiedDate).calendar()}\nKhởi tạo: ${data.createBy} - ${moment(data.createDate).calendar()}`
            }>{data.modifiedBy}</td>
            <td>{data.quantity}</td>
            <td className="text-center">
                <Button color="primary" size="sm" onClick={() => { this.showDetailPage(data.id as number) }}>
                    <EditSVG color="white" className="icon" />
                </Button></td>
        </tr >;
    }
    componentDidMount() {
        window.history.replaceState('', '', `/admin/books?page=${this.page}&limit=${this.limit}`);
        this.tableRef.current?.getPage(this.page, this.limit);
    }
    async getPage(page: number, limit: number): Promise<any> {
        this.firstNumOfKey = (!this.firstNumOfKey as any + 0);
        let data = await this.requestMessage.current
            ?.sendRequest(
                () => { return BookAPI.getBooks({ page: page, limit: limit, unlimited: false }) },
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
                return await (this.getPage(data.message.data.totalPage, limit));
            }
        }
        return undefined;
    }
}