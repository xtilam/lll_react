import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import Utils from "../../common/Utils";
import { ScreenContext } from "../../contexts/screen-context";
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
    viewIndex: number,
    isDisable: boolean,
    isShowMore: boolean,
}

export default class DetailAdminPage extends React.Component<DetailAdminPageProps, DetailAdminPageState>{
    adminMessageRequest = React.createRef<AdminMessageRequest>();
    static minWithMenuTab = 180;
    constructor(props: DetailAdminPageProps) {
        super(props);
        this.state = {
            isDisable: false,
            viewIndex: 0,
            isShowMore: false,
        }
    }
    getMaxItemInScreen(size: number) {
        // menu width
        if (size >= 1000) size -= 220;

        let maxItem: number;

        maxItem = size / DetailAdminPage.minWithMenuTab;
        let floor = Math.floor(maxItem);
        maxItem = floor + ((maxItem - floor > 0.6) as any);

        if (maxItem < 1) {
            return 1;
        } else if (maxItem > this.props.menuConfig.length) {
            maxItem = this.props.menuConfig.length + 1;
        }
        return maxItem;
    }
    render() {
        let idMenu = Utils.randomString(10);
        let { menuConfig, interceptor } = this.props;

        let btnGoBack = this.props.goBackAction instanceof Function
            ? <div children="Trở về" onClick={this.props.goBackAction} />
            : <Link to={this.props.goBackAction as string} className="text-white" children="Trở về" />
        return <div id={idMenu} className={`menu-select-layout m-auto ${this.state.isDisable ? 'disabled' : ''}`} style={{ height: '100%' }}>

            <ScreenContext.Consumer>{({ screenInnerWidth }) => {
                const { menuTab, startRenderIndex } = getMenuTab.bind(this)();
                const popupShowMore = getPopupShowMore.bind(this)(startRenderIndex);

                return <Fragment>
                    <div className="menu-select">{menuTab}</div>
                    {
                        popupShowMore !== null
                        && popupShowMore.length > 0
                        && <div className="popup-show-more">{popupShowMore}</div>
                    }
                </Fragment>
                
                function getPopupShowMore(this: DetailAdminPage, startRenderIndex: number) {
                    if (!this.state.isShowMore) return null;
                    if (startRenderIndex >= this.props.menuConfig.length) return [];

                    const result: JSX.Element[] = [] as any[];
                    if (startRenderIndex < 0) {
                        startRenderIndex = 1;
                        result.push(<div key={-2}>{btnGoBack}</div>);
                    }
                    for (let i = startRenderIndex; i < menuConfig.length; i++) {
                        result.push(<div key={i}
                            className={this.state.viewIndex === i ? 'active' : ''}
                            onClick={() => this.setState({ isShowMore: false, viewIndex: i })}
                        >{menuConfig[i].name}</div>)
                    }

                    return result;
                }

                function getMenuTab(this: DetailAdminPage) {
                    let maxItemRender = this.getMaxItemInScreen(screenInnerWidth);
                    const result: JSX.Element[] = [];
                    const goBackTab = <div key={-2} className="bg-danger text-white dbox-item" onClick={(evt) => {
                        let firstChild = evt.currentTarget.firstChild;
                        firstChild && (firstChild as any).click();
                    }}
                        children={btnGoBack}
                    />

                    if (menuConfig.length !== 0) {
                        let isRenderShowMore: boolean = true;
                        if (maxItemRender > 1) {
                            result.push(goBackTab);
                            if (maxItemRender > menuConfig.length) {
                                isRenderShowMore = false;
                                --maxItemRender; // 1 Tab quay về
                            } else {
                                // 1 của tab xem thêm và 1 của tab bị chiếm vị trí 1 tab trờ về
                                maxItemRender -= 3;
                            }

                            for (let i = 0; i < maxItemRender; i++) {
                                result.push(<div
                                    key={i}
                                    className={`dbox-item ${this.state.viewIndex === i ? 'active' : ''}`}
                                    onClick={() => {
                                        this.setState({ viewIndex: i, isShowMore: false });
                                        this.adminMessageRequest.current?.closeMessage();
                                    }}
                                    children={menuConfig[i].name}
                                    title={menuConfig[i].name}
                                />)
                            }
                        } else {
                            maxItemRender = -1;
                            isRenderShowMore = false;
                        }

                        if (isRenderShowMore) {
                            result.push(<div
                                key={-9}
                                className={`dbox-item ${this.state.viewIndex >= maxItemRender ? 'active' : ''}`}
                                onClick={() => {
                                    const { isShowMore } = this.state;
                                    this.setState({ isShowMore: !isShowMore });
                                    if (!isShowMore) Utils.nextClick(() => this.setState({ isShowMore: false }));
                                }}
                                children={'Xem thêm'}
                                title={'Xem thêm'}
                            />)
                        }
                    } else {
                        result.push(btnGoBack)
                    }
                    return { menuTab: result, startRenderIndex: maxItemRender }
                }
            }}</ScreenContext.Consumer>
            <div className="child-content">
                <div className={`form-container`}>
                    <AdminMessageRequest ref={this.adminMessageRequest}
                        onBeforeSendRequest={() => this.setState(() => { return { isDisable: true } })}
                        onCompleteSendRequest={() => this.setState(() => { return { isDisable: false } })}
                    />
                    {(() => {
                        let menu = menuConfig[this.state.viewIndex];
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