import React from "react";
import { Button, ButtonGroup, Col, Container, Input, InputGroup, InputGroupAddon, Row, Table } from "reactstrap";
import Utils from "../common/Utils";
import '../css-animation.scss';
import FirstSVG from "../logo-svg/first";
import LastSVG from "../logo-svg/last";
import NextSVG from "../logo-svg/next";
import PreviousSVG from "../logo-svg/previous";
import ReloadSVG from "../logo-svg/reload";
import './wtable.scss';

export interface WTablePageInfo {
    data: any[],
    page: number,
    limit: number,
    offset: number,
    totalRecord: number,
    totalPage: number
}

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
    page?: number
    limit?: number
    getPage: (page: number, limit: number) => (WTablePageInfo | undefined | Promise<WTablePageInfo | undefined>),
    fillData: (data: any, index: number) => (JSX.Element),
    onPageChangeEvent?: (event: { pageChange: number, limitChange: number }) => any,
    headers: any[]
}

interface TableState {
    pageData: WTablePageInfo,
    limitValue?: number,
    pageValue?: number,
    isWaiting: boolean
}

export default class WTable extends React.Component<TableProps, TableState> {
    tableBody: React.RefObject<any>;
    keyTable: string = Utils.randomString(10);

    constructor(props: TableProps) {
        super(props);
        let page = this.props.page || 1;
        let limit = this.props.limit || 5;
        this.state = { pageData: { data: [] } as any, pageValue: page, limitValue: limit, isWaiting: false };
        this.reloadPage = this.reloadPage.bind(this);
        this.tableBody = React.createRef();
        Utils.notSetStateWhenComponentUnmount(this)
    }

    async getPage(page: number, limit: number) {
        this.setState(() => { return { isWaiting: true } });
        if (limit <= 0) limit = 1;
        let pageGet: WTablePageInfo = this.props.getPage(page, limit) as WTablePageInfo;
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
        this.keyTable = Utils.randomString();
        await this.getPage(this.state.pageValue as number, this.state.limitValue as number);
    }
    render() {
        return (
            <div className={"table-view " + this.props.className + (this.state.isWaiting ? ' disabled' : '')} id={this.props.id}>
                <Table hover={true}>
                    <thead>
                        <tr>{this.props.headers.map((e, index) => { return <th key={index}>{e}</th> })}</tr>
                    </thead>
                    <tbody ref={this.tableBody} key={this.keyTable}>
                        {
                            this.state.pageData.data.map((inRow: any[], index: number) => {
                                return this.props.fillData(inRow, index);
                            })
                        }
                    </tbody>
                </Table >
                <Container fluid={true} className="table-control p-0">
                    <Row>
                        <Col md={'auto'} sm={12} className="d-flex mb-2 mx-sm-auto ml-md-0 mr-md-auto">
                            <div className="d-flex mx-auto m-md-0">
                                <InputGroup size="sm">
                                    <InputGroupAddon addonType="prepend" >Giới hạn</InputGroupAddon>
                                    <Input type="number" style={{ maxWidth: 80, textAlign: "center" }} value={this.state.limitValue}
                                        onChange={(e) => { this.setState({ limitValue: (e.target.value) as any }) }}
                                    />
                                </InputGroup>
                                <Button className="ml-4" color="primary" size="sm" onClick={() => {
                                    this.getPage(this.state.pageValue || 1, this.state.limitValue || 1);
                                }} title="Reload"><ReloadSVG className={'icon' + (this.state.isWaiting ? ' spin' : '')} color="white" /></Button>
                            </div>
                        </Col>
                        <Col md={'auto'} sm={12}>
                            <Container fluid={true} className="p-0">
                                <Row>
                                    <Col md={'auto'} sm={12} className="d-flex justify-content-center mb-2">
                                        <InputGroup size="sm" className="m-auto">
                                            <InputGroupAddon addonType="prepend">Trang</InputGroupAddon>
                                            <Input className="text-center" type="number" min="1" style={{ maxWidth: 80 }} value={this.state.pageValue}
                                                onChange={(e) => { this.setState({ pageValue: (e.target.value) as any }) }} />
                                            <InputGroupAddon addonType="append">
                                                <div className="input-group-text">{this.state.pageData.totalPage}</div>
                                                <Button color="primary" onClick={this.reloadPage} >GO</Button>
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </Col>
                                    <Col md={'auto'} sm={12} className="d-flex justify-content-center mb-2">
                                        <span className="offset-info">{this.state.pageData.offset} - {
                                            this.state.pageData.page === this.state.pageData.totalPage ?
                                                this.state.pageData.totalRecord : (this.state.pageData.limit + this.state.pageData.offset)
                                        } trong {this.state.pageData.totalRecord}</span>
                                    </Col>
                                    <Col md={'auto'} sm={12} className="d-flex justify-content-center mb-2 align-items-center">
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
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}