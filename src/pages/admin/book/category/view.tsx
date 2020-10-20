import React, { Fragment } from "react";
import { Button } from "reactstrap";
import CategoryAPI, { CategoryAPIResult } from "../../../../api/admin/category-book-api";
import { APIResult } from "../../../../api/declare";
import { AdminOverrideWindow } from "../../../../contexts/admin-overide-window";
import EditSVG from "../../../../logo-svg/edit";
import BaseCrudView, { BaseViewConfig } from "../../base/base-view";

export default class ViewCategoryBook extends BaseCrudView<CategoryAPIResult>{
    getId(data: CategoryAPIResult) {
        return data.id
    }
    fillData(data: CategoryAPIResult, unselectClass: string): JSX.Element {
        return <Fragment>
            <td>{data.categoryCode}</td>
            <td>{data.category}</td>
            <td className="text-center">
                <AdminOverrideWindow.Consumer>
                    {({ }) => {
                        return <Button size='sm' color='primary' className={unselectClass}
                            onClick={() => {
                                const detailPage = null;
                                // TODO: render detail page
                            }}
                            children={<EditSVG className="icon" color="white" />}
                        />
                    }}
                </AdminOverrideWindow.Consumer>
            </td>
        </Fragment>
    }
    getPageAPIMethod(page: number, limit: number): Promise<APIResult<any, any>> {
        return CategoryAPI.getAllCategory({ page: page, limit: limit, unlimited: false })
    }
    subRender(): JSX.Element | null {
        return null
    }
    configure(): BaseViewConfig<CategoryAPIResult> {
        return {
            headers: [
                'Mã thể loại',
                'Tên thể loại',
                <div className="text-center">Chi tiết</div>
            ],
            urlPage: '/admin/book/category/list',
            addPage: {
                textButton: 'Thêm thể loại',
                link: '/admin/book/category/add'
            },
            deleteAction: {
                deleteMethod: CategoryAPI.deleteCategories,
                textButton: 'Xóa'
            }
        }
    }

}