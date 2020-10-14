import React from 'react';
import WDropdown from '../../components/wdropdown';
import { DropdownToggle, DropdownItem, DropdownMenu, Button } from 'reactstrap';
import { ScreenContext } from '../../contexts/screen-context';
import authentication from '../../admin-auth';
import MenuSVG from '../../logo-svg/menu';
import MenuTab from './menu-tab';
import { AdminUserResult } from '../../api/admin/admin-api';

export default class AdminHeader extends React.Component<{ minScreenResizeMenuTab: number }> {
    isSmallScreen = true;
    constructor(props: any) {
        super(props);
    }
    toggleMenu() {
        $('#menu-tab').toggleClass('is-display');
    }
    render() {
        const size = 30;
        let userInfo = ((): AdminUserResult => {
            try {
                return JSON.parse(window.localStorage['admin']);
            } catch (error) {
                return {} as any;
            }
        })();
        return <header className="d-flex align-items-center space-sm">
            <ScreenContext.Consumer>
                {({ screenInnerWidth }) => {
                    if (screenInnerWidth >= this.props.minScreenResizeMenuTab) {
                        $('#menu-tab').removeClass('is-display');
                        this.isSmallScreen = false;
                    } else {
                        this.isSmallScreen = true;
                    }
                    return null;
                }}
            </ScreenContext.Consumer>
            <Button size="sm" className="mr-3" onClick={this.toggleMenu.bind(this)}
                id="show-menu"><MenuSVG className="px-1" height="18px" fill="white" /></Button>
            <div className="mr-auto">Admin Page</div>
            <WDropdown
                dropdownToggle={
                    <DropdownToggle color="primary" size="sm" className="d-flex space-nm" style={{
                        borderRadius: 0,
                        height: 35,
                        padding: '2px 8px'
                    }}>
                        <span className="d-none d-sm-block" style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: "white",
                            lineHeight: `${size}px`
                        }}>{userInfo.fullname}</span>
                        <img style={{
                            width: size,
                            height: size,
                            borderRadius: 999,
                            boxShadow: '0 0 9px #888'
                        }}
                            src={`${process.env.REACT_APP_ADMIN_USER_IMAGE_PATH}${userInfo.id}.jpg`}
                            onError={() => { return `${process.env.REACT_APP_ADMIN_USER_IMAGE_PATH}default.jpg` }}
                        />
                    </DropdownToggle>
                }
                dropdownMenu={
                    <DropdownMenu right>
                        <DropdownItem>Tài khoản của bạn</DropdownItem>
                        <DropdownItem onClick={() => { authentication.logout() }}>Đăng xuất</DropdownItem>
                    </DropdownMenu>
                }
            ></WDropdown>
        </header>;
    }
}