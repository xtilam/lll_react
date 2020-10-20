import moment from "moment";
import React, { Fragment } from "react";
import { Button } from "reactstrap";
import BookAPI, { BookAPIResult } from "../../../api/admin/book-api";
import { APIResult } from "../../../api/declare";
import ImageError from "../../../components/image-error";
import { AdminOverrideWindow } from "../../../contexts/admin-overide-window";
import EditSVG from "../../../logo-svg/edit";
import DetailAdminUser from "../admin-user/detail-user";
import BaseCrudView, { BaseViewConfig } from "../base/base-view";

export default class ViewBook extends BaseCrudView<BookAPIResult>{
    configure(): BaseViewConfig<BookAPIResult> {
        return {
            urlPage: '/admin/book',
            addPage: { link: '/admin/book/add', textButton: 'Thêm sách' },
            // deleteAction: {textButton: 'Xóa', deleteMethod: (ids)=>BookAPI.
            headers: [
                'Sách',
                'Tên sách',
                'ISBN',
                'Tác giả',
                'Thể loại',
                'Cập nhật',
                'Số lượng',
                'Hành động'
            ]
        }
    }

    getId(data: BookAPIResult) {
        return data.id
    }
    fillData(data: BookAPIResult, unselectClass: string): JSX.Element {
        return <Fragment>
            <td><ImageError className="no-round"
                src={`${process.env.REACT_APP_BOOK_IMAGE_PATH}${data.id}.jpg`}
                err_src={`${process.env.REACT_APP_BOOK_IMAGE_PATH}default.jpg`} /></td>
            <td>{data.title}</td>
            <td>{data.isbn}</td>
            <td>{data.authors?.map((item) => { return item.name }).join(', ')}</td>
            <td>{data.categories?.map((item) => { return item.category }).join(', ')}</td>
            <td title={`Cập nhât: ${data.modifiedBy} - ${moment(data.modifiedDate).calendar()}\nKhởi tạo: ${data.createBy} - ${moment(data.createDate).calendar()}`
            }>{data.modifiedBy}</td>
            <td>{data.quantity}</td>
            <td className="text-center">
                <AdminOverrideWindow.Consumer>
                    {({ addWindow, removeWindow }) => {
                        return <Button color="primary" size="sm" onClick={() => {
                            const overrideWindow = addWindow(<DetailAdminUser
                                goBack={{
                                    action: () => removeWindow(overrideWindow),
                                    id: data.id
                                }} />)
                        }}>
                            <EditSVG color="white" className="icon" />
                        </Button>
                    }}
                </AdminOverrideWindow.Consumer>
            </td>
        </Fragment>
    }
    getPageAPIMethod(page: number, limit: number): Promise<APIResult<any, any>> {
        return BookAPI.getBooks({ page: page, limit: limit, unlimited: false })
    }
    subRender(): JSX.Element | null {
        return null
    }
}