import React from "react";
import { Link } from "react-router-dom";
import { Spring } from "react-spring/renderprops";
import { Col, Container, Row, Util } from "reactstrap";
import Utils from "../../common/Utils";
import ScreenProvider, { ScreenContext } from "../../contexts/screen-context";
import NextSVG from "../../logo-svg/next";
import PreviousSVG from "../../logo-svg/previous";
import AdminMessageRequest from "./admin-message-request";
import './menu-detail.scss';

interface DetailAdminPageProps {
    goBackAction: (
        /*Go back event*/((evt?: React.MouseEvent<any, MouseEvent>) => any)
        | /*Link redirect*/ string
    )
    menuConfig: {
        name: string,
        body: JSX.Element,
        callback?: () => any
    }[],
    interceptor?: (element: JSX.Element) => JSX.Element
}

interface DetailAdminPageState {
    viewAction: number,
    isDisable: boolean,
    indexTab: number,
}

export default class DetailAdminPage extends React.Component<DetailAdminPageProps, DetailAdminPageState>{
    adminMessageRequest = React.createRef<AdminMessageRequest>();
    static minWithMenuTab = 220;
    constructor(props: DetailAdminPageProps) {
        super(props);
        this.state = {
            isDisable: false,
            viewAction: 0,
            indexTab: 0
        }
    }
    getSize(size: number) {
        // menu width
        if (size >= 1000) size -= 220;

        let output: { maxItem: number, isShowMore: boolean } = {} as any;

        output.maxItem = size / DetailAdminPage.minWithMenuTab;
        let floor = Math.floor(output.maxItem);
        output.maxItem = floor + ((output.maxItem - floor > 0.6) as any);

        if (output.maxItem < 2) {
            if (this.props.menuConfig.length > 0) {
                output.maxItem = 2;
            } else {
                output.maxItem = 1;
            }
        } else if (output.maxItem > this.props.menuConfig.length) {
            output.maxItem = this.props.menuConfig.length + 1;
        }

        output.isShowMore = this.props.menuConfig.length >= output.maxItem;
        return output;
    }
    getValidIndex(indexTab: number, maxItemView: number) {
        let lengthTab = this.props.menuConfig.length;
        if (indexTab < 0) {
            indexTab = 0;
        } else if (indexTab > (lengthTab - maxItemView + 1)) {
            indexTab = lengthTab - maxItemView + 1;
        }
        return indexTab;
    }
    scrollAction(scrollDump: number, maxItemView: number) {
        let indexTab = this.state.indexTab + scrollDump;
        this.setState({ indexTab: this.getValidIndex(indexTab, maxItemView) });
    }
    render() {
        let idMenu = Utils.makeId(10);
        let { menuConfig, interceptor } = this.props;
        let { indexTab } = this.state;

        let btnGoBack = this.props.goBackAction instanceof Function
            ? <div children="Trở về" onClick={this.props.goBackAction} />
            : <Link to={this.props.goBackAction as string} className="text-white" children="Trở về" />
        return <div id={idMenu} className={`menu-select-layout m-auto ${this.state.isDisable ? 'disabled' : ''}`} style={{ height: '100%' }}>
            <div className="menu-select">
                <ScreenContext.Consumer>{({ screenInnerWidth }) => {
                    let config = this.getSize(screenInnerWidth);
                    let result: JSX.Element[] = [
                        <div key={-1} className="bg-danger text-white dbox-item" onClick={(evt) => {
                            let firstChild = evt.currentTarget.firstChild;
                            firstChild && (firstChild as any).click();
                        }}
                            children={btnGoBack}
                        />
                    ];
                    indexTab = this.getValidIndex(indexTab, config.maxItem);

                    for (let i = 0; i < (config.maxItem - 1); i++) {
                        result[i + 1] = <Spring
                            key={i + indexTab}
                            from={{ width: "0%" }}
                            to={{ width: "100%" }}
                            config={{ duration: config.maxItem > menuConfig.length ? 0 : 200 }}
                            delay={config.maxItem > menuConfig.length ? 0 : i * 50}
                        >
                            {(style) => {
                                return <div
                                    key={i + indexTab}
                                    style={style}
                                    className={`dbox-item ${this.state.viewAction === i + indexTab ? 'active' : ''}`}
                                    onClick={() => {
                                        this.setState({ viewAction: i + indexTab, indexTab: i + indexTab - Math.floor((config.maxItem - 1) / 2) });
                                        this.adminMessageRequest.current?.closeMessage();
                                    }}
                                    children={menuConfig[i + indexTab].name}
                                    title={menuConfig[i + indexTab].name}
                                />
                            }}
                        </Spring>
                    }
                    if (config.isShowMore) {
                        result.unshift(<div className={`scroll-btn ${indexTab < 1 ? 'disabled' : ''}`} key="-2"
                            onClick={() => this.scrollAction(-config.maxItem + 1, config.maxItem)}
                        ><PreviousSVG className="icon" color="white" /></div>)
                        result.push(<div className={`scroll-btn ${indexTab + config.maxItem > menuConfig.length ? 'disabled' : ''}`} key="-3"
                            onClick={() => this.scrollAction(config.maxItem - 1, config.maxItem)}
                        ><NextSVG className="icon" color="white" /></div>)
                    }
                    return result;
                }}</ScreenContext.Consumer>
            </div>
            <div className="child-content">
                <div className={`form-container`}>
                    <AdminMessageRequest ref={this.adminMessageRequest}
                        onBeforeSendRequest={() => this.setState(() => { return { isDisable: true } })}
                        callback_after_send_request={() => this.setState(() => { return { isDisable: false } })}
                    />
                    {(() => {
                        let menu = menuConfig[this.state.viewAction];
                        if (menu !== undefined) {
                            if (menu.callback instanceof Function) setTimeout(() => { (menu.callback as Function)() })
                            return interceptor instanceof Function ? interceptor(menu.body) : menu.body;
                        }
                        return null;

                    })()}
                </div>
            </div>
        </div>
    }
}