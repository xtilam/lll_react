import React from 'react';
import WDropdown from '../../components/wdropdown';
import { DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';
import { ScreenContext } from '../../contexts/screen-context';
import authentication from '../../admin-auth';

export default class AdminHeader extends React.Component<{ minScreenResizeMenuTab: number }> {
    constructor(props: any) {
        super(props);
    }
    render() {
        const size = 30;
        let userInfo = JSON.parse(window.localStorage['admin'] || "{}");
        return <header className="d-flex align-items-center space-sm">
            <ScreenContext.Consumer>
                {({ screenInnerWidth }) => { if (screenInnerWidth >= this.props.minScreenResizeMenuTab) { $('#menu-tab').removeClass('is-display') }; return undefined; }}
            </ScreenContext.Consumer>
            <button onClick={() => {
                $('#menu-tab').toggleClass('is-display');
            }}
                id="show-menu">Menu</button>
            <div className="mr-auto">Admin Page</div>
            <WDropdown
                dropdownToggle={
                    <DropdownToggle color="danger" size="sm" className="d-flex space-nm" style={{
                        borderRadius: 0,
                        height: 35,
                        padding: '2px 8px'
                    }}>
                        <span style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: "white",
                            lineHeight: `${size}px`,
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