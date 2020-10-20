import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Button } from 'reactstrap';
import { APIResult } from '../../../api/declare';
import Utils from '../../../common/Utils';
import SYSTEM_CONSTANTS from '../../../constants';
import AddSVG from '../../../logo-svg/add';
import CancelSVG from '../../../logo-svg/cancel';
import AdminMessageRequest from '../../../page-component/admin/admin-message-request';
import TableListAdmin from '../../../page-component/admin/table-select';

export interface BaseViewConfig<T> {
    urlPage: string,
    headers: (string | JSX.Element)[],
    addPage?: {
        textButton: string,
        link: string,
    };
    deleteAction?: {
        textButton: string,
        deleteMethod: (ids: any[]) => Promise<any>
    };
}
export default abstract class BaseCrudView<T> extends React.Component {
    tableAdmin = React.createRef<TableListAdmin<T>>();
    requestMessage = React.createRef<AdminMessageRequest>();
    config: BaseViewConfig<T> = {} as any;
    page: number = 0;
    limit: number = 0;

    abstract getId(data: T): any;
    abstract fillData(data: T, unselectClass: string): JSX.Element;
    abstract getPageAPIMethod(page: number, limit: number): Promise<APIResult>;
    abstract subRender(): JSX.Element | null;
    abstract configure(): BaseViewConfig<T>;

    render() {
        const { addPage, deleteAction, headers } = this.config
        return <div id="main-view">
            <div>
                <AdminMessageRequest ref={this.requestMessage} />
                {this.subRender()}
                <div className="d-flex f-bar space-sm">
                    {addPage && <Link to={addPage.link} className="btn btn-primary btn-sm"> <AddSVG className="icon" color="white" /> <span>{addPage.textButton}</span> </Link>}
                    {deleteAction && <Button color="danger" size="sm" onClick={this.deleteSelected.bind(this)}> <CancelSVG className="icon" color="white" /> <span>{deleteAction.textButton}</span> </Button>}
                </div>
                <TableListAdmin<T> ref={this.tableAdmin}
                    fillData={(data, unselectClass) => <Fragment>
                        {this.fillData(data, unselectClass)}
                    </Fragment>
                    }
                    getPage={this.getPage.bind(this)}
                    headers={headers}
                    pageInfo={{
                        limit: this.limit,
                        page: this.page
                    }}
                    onPageChange={(evt) => {
                        if (evt.limitChange !== this.limit || evt.pageChange !== this.page) {
                            this.page = evt.pageChange;
                            this.limit = evt.limitChange;
                            window.history.pushState('', '', `?page=${this.page}&limit=${this.limit}`);
                        } else {
                            window.history.replaceState('', '', `?page=${this.page}&limit=${this.limit}`);
                        }
                    }}
                    getId={this.getId}
                />
            </div>
        </div>;
    }
    constructor(props: any, config: {
        headers: (string | JSX.Element)[],
        config: BaseViewConfig<T>,
    }) {
        super(props);
        const { page, limit } = Utils.getPageRequest();
        this.config = this.configure();
        this.page = page;
        this.limit = limit;
    }
    componentDidMount() {
        this.tableAdmin.current?.reloadPage();
        window.history.replaceState('', '', `?page=${this.page}&limit=${this.limit}`);
    }

    async getPage(page: number, limit: number): Promise<any> {
        const resultReq = await this.requestMessage.current
            ?.sendRequest(
                () => this.getPageAPIMethod(page, limit),
                { hideWhenDone: true, hideWaiting: true, getFailed: true }
            );
        if (resultReq === undefined) return

        const { message: { data: messageData, code: codeError }, data } = resultReq;

        if (codeError === 0) {
            return {
                data: data,
                limit: Number(limit),
                offset: messageData.offset,
                page: messageData.page,
                totalPage: messageData.totalPage,
                totalRecord: messageData.totalRecord
            };
        } else if (codeError === SYSTEM_CONSTANTS.ERROR_REQUEST.PAGE_OUT_INDEX) {
            return await (this.getPage(messageData.totalPage, limit));
        }

    }

    async deleteSelected() {
        if (!this.config.deleteAction) return

        const { deleteMethod } = this.config.deleteAction
        const { current: requestMessage } = this.requestMessage;
        const { current: tableAdmin } = this.tableAdmin;


        if (!requestMessage) return;
        if (!tableAdmin) return;

        if (!await requestMessage.sendRequest(() => deleteMethod(tableAdmin.idsSelect))) return;
        const { color: alertColor, message } = requestMessage.state;
        await tableAdmin.reloadPage();

        requestMessage.setMessage({ color: alertColor, message: message, isHide: false });
    }
}