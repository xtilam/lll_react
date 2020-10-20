import React, { Fragment } from "react";
import { Button } from "reactstrap";
import AuthorAPI, { AuthorAPIResult } from "../../../../api/admin/author-api";
import { APIResult } from "../../../../api/declare";
import { AdminOverrideWindow } from "../../../../contexts/admin-overide-window";
import EditSVG from "../../../../logo-svg/edit";
import BaseCrudView, { BaseViewConfig } from "../../base/base-view";

export default class ViewAuthorBook extends BaseCrudView<AuthorAPIResult>{
    getId(author: AuthorAPIResult) {
        return author.id
    }
    fillData(author: AuthorAPIResult, unselectClass: string): JSX.Element {
        return <Fragment>
            <td>{author.authorCode}</td>
            <td>{author.name}</td>
            <td className={`text-center ${unselectClass}`}>
                <AdminOverrideWindow.Consumer
                    children={() => <Button size='sm' color='primary' onClick={() => {

                    }}>
                        <EditSVG color="white" className="icon" />
                    </Button>}
                />
            </td>
        </Fragment>
    }
    getPageAPIMethod(page: number, limit: number): Promise<APIResult<any, any>> {
        return AuthorAPI.getAll({ page: page, limit: limit, unlimited: false })
    }
    subRender(): JSX.Element | null {
        return null
    }
    configure(): BaseViewConfig<any> {
        return {
            headers: [
                'Mã tác giả',
                'Tên tác giả',
                <div className="text-center">Chi tiết</div>
            ],
            urlPage: '/admin/book/category/view',
            addPage: {
                link: '/admin/book/category/add',
                textButton: 'Thêm thể loại', 
            },
            deleteAction: {
                deleteMethod: AuthorAPI.deleteAuthors,
                textButton: 'Xóa'
            }
        }
    }

}