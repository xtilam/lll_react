import React from "react";
import { Button, ButtonGroup, Input, InputGroup, InputGroupAddon, Table } from "reactstrap";
import '../css-animation.scss';
import FirstSVG from "../logo-svg/first";
import LastSVG from "../logo-svg/last";
import NextSVG from "../logo-svg/next";
import PreviousSVG from "../logo-svg/previous";
import ReloadSVG from "../logo-svg/reload";
import './wtable.scss';
import Utils from "../common/Utils";

interface PageInfo {
    data: any[],
    page: number,
    limit: number,
    offset: number,
    totalRecord: number,
    totalPage: number
}

interface TableProps {
    headers: any[],
    page?: number
    limit?: number
    getPage: (page: number, limit: number) => (PageInfo | undefined | Promise<PageInfo | undefined>),
    fillData: (data: any, index?: number) => (JSX.Element)
    onPageChangeEvent?: (event: { pageChange: number, limitChange: number }) => any
}

interface TableState {
    pageData: PageInfo,
    limitValue?: number,
    pageValue?: number,
    isWaiting: boolean
}

export default class WTable extends React.Component<TableProps, TableState> {
    tableBody: React.RefObject<any>;
    constructor(props: TableProps) {
        super(props);
        let page = this.props.page || 1;
        let limit = this.props.limit || 5;
        this.state = { pageData: { data: [] } as any, pageValue: page, limitValue: limit, isWaiting: false };
        this.reloadPage = this.reloadPage.bind(this);
        this.tableBody = React.createRef();
        console.log('this is table constructor')
    }
    async getPage(page: number, limit: number) {
        this.setState(() => { return { isWaiting: true } });
        if(limit <= 0) limit = 1;
        let pageGet: PageInfo = this.props.getPage(page, limit) as PageInfo;
        if (pageGet instanceof Promise) {
            pageGet = await pageGet;
        }
        if (pageGet !== undefined) { 
            this.setState(() => {
                return {
                    pageData: pageGet,
                    limitValue: pageGet.limit,
                    pageValue: pageGet.page,
                    isWaiting: false
                }
            })
            this.props.onPageChangeEvent instanceof Function && this.props.onPageChangeEvent({ pageChange: pageGet.page, limitChange: pageGet.limit });
            return true;
        } else {
            this.setState(() => {
                return {
                    pageData: { data: [] } as any,
                    limitValue: limit,
                    pageValue: page,
                    isWaiting: false
                }
            });
            return false;
        }
    }
    async reloadPage() {
        await this.getPage(this.state.pageValue as number, this.state.limitValue as number);
    }
    render() {
        return (
                <div className={"table-view" + (this.state.isWaiting ? ' disabled' : '')}>
                <Table>
                    <thead>
                        <tr>{this.props.headers.map((e, index) => { return <th key={index}>{e}</th> })}</tr>
                    </thead>
                    <tbody ref={this.tableBody}>
                        {
                            this.state.pageData.data.map((inRow: any[], index: number) => {
                                return this.props.fillData(inRow, index);
                            })
                        }
                    </tbody>
                </Table >
                <div className="table-control d-flex justify-content-end align-items-center">
                    <InputGroup className="mr-auto" size="sm">
                        <InputGroupAddon addonType="prepend" >Giới hạn</InputGroupAddon>
                        <Input type="number" style={{ maxWidth: 80, textAlign: "center" }} value={this.state.limitValue}
                            onChange={(e) => { this.setState({ limitValue: (e.target.value) as any }) }}
                        />
                    </InputGroup>
                    <Button color="primary" size="sm" onClick={() => {
                        this.getPage(this.state.pageValue || 1, this.state.limitValue || 1);
                    }} title="Reload"><ReloadSVG className={'icon' + (this.state.isWaiting ? ' spin' : '')} color="white" /></Button>
                    <InputGroup size="sm">
                        <InputGroupAddon addonType="prepend">Trang</InputGroupAddon>
                        <Input className="text-center" type="number" min="1" style={{ maxWidth: 80 }} value={this.state.pageValue}
                            onChange={(e) => { this.setState({ pageValue: (e.target.value) as any }) }} />
                        <InputGroupAddon addonType="append">
                            <div className="input-group-text">{this.state.pageData.totalPage}</div>
                            <Button color="primary" onClick={this.reloadPage} >GO</Button>
                        </InputGroupAddon>
                    </InputGroup>

                    <span className="offset-info">{this.state.pageData.offset} - {
                        this.state.pageData.page === this.state.pageData.totalPage ?
                            this.state.pageData.totalRecord : (this.state.pageData.limit + this.state.pageData.offset)
                    } trong {this.state.pageData.totalRecord}</span>
                    <ButtonGroup>
                        <Button color="primary" title="Trang Đầu" size="sm"
                            onClick={() => {
                                this.setState({ pageValue: 1 });
                                setTimeout(() => { this.reloadPage() });
                            }}
                        ><FirstSVG className="icon" color="white" /></Button>
                        <Button color="primary" title="Trang Trước" size="sm"
                            onClick={() => {
                                this.setState({ pageValue: (this.state.pageValue as any - 1) || 1 });
                                setTimeout(() => { this.reloadPage() });
                            }}
                        ><PreviousSVG className="icon" color="white" /></Button>
                        <Button color="primary" title="Trang Sau" size="sm"
                            onClick={() => {
                                this.setState({ pageValue: (this.state.pageValue as any + 1) });
                                setTimeout(() => { this.reloadPage() });
                            }}
                        ><NextSVG className="icon" color="white" /></Button>
                        <Button color="primary" title="Trang Cuối" size="sm"
                            onClick={() => {
                                this.setState({ pageValue: 0 });
                                setTimeout(() => { this.reloadPage() });
                            }}
                        ><LastSVG className="icon" color="white" /></Button>
                    </ButtonGroup>
                </div>
            </div>
        )
    }
}