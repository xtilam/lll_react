import React from 'react';
import WDropdown from '../../components/wdropdown';
import { DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../../contexts/global-context';

export default class AdminHeader extends React.Component<{ minScreenResizeMenuTab: number }> {
    constructor(props: any) {
        super(props);
    }
    render() {
        const size = 30;
        console.log('re render')
        return <header className="d-inline-flex align-items-center">
            <GlobalContext.Consumer>
                {({ screenInnerWidth }) => { if(screenInnerWidth >= this.props.minScreenResizeMenuTab){ $((window as any).menu).removeClass('is-display') }; return undefined; }}
            </GlobalContext.Consumer>
            <button onClick={() => {
                $((window as any).menu).toggleClass('is-display');
            }}
                id="show-menu">Menu</button>
            <div className="mr-auto">Admin Page</div>
            <WDropdown
                dropdownToggle={
                    <DropdownToggle color="danger" style={{
                        height: size,
                        width: size,
                        borderRadius: size

                    }}></DropdownToggle>
                }
                dropdownMenu={
                    <DropdownMenu right>
                        <DropdownItem>Tài khoản của bạn</DropdownItem>
                        <DropdownItem>
                            <Link to="/admin/logout">Đăng xuất</Link>
                        </DropdownItem>
                    </DropdownMenu>
                }
            ></WDropdown>
        </header>;
    }
}