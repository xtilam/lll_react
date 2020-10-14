import { debug } from 'console';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import AdminAuthenticationProvider, { AdminAuthentication } from '../../contexts/admin-authencation';
import AdminOverrideWindowProvider, { AdminOverrideWindow } from '../../contexts/admin-overide-window';
import AdminHeader from '../../page-component/admin/admin-header';
import MenuTab from '../../page-component/admin/menu-tab';
import './admin-page.scss';
import AddAdminUser from './admin-user/add-user';
import AdminUserPage from './admin-user/admin-users-view';
import DetailAdminUser from './admin-user/detail-user';
import AddBook from './book/add-book';
import ViewBook from './book/view-book';
import AddGroupPermission from './group-permission/add-group-permisison';
import DetailGroupPermission from './group-permission/detail-group-permission';
import ViewGroupPermission from './group-permission/view-group-permission';
import AddPermission from './permission/add-permission';
import DetailPermission from './permission/detail-permission';
import ViewPermission from './permission/view-permission';

const menu = [
    {
        content: 'Tài khoản quản trị', items: [
            { content: 'Tài khoản', hrefLink: '/admin/admin-users' },
            { content: 'Chức năng', hrefLink: '/admin/permissions' },
            { content: 'Nhóm chức năng', hrefLink: '/admin/groups' }
        ]
    }, {
        content: 'Quản lí sách', items: [
            { content: 'Sách', hrefLink: '/admin/books' },
            { content: 'Nhà xuất bản', hrefLink: '/admin/book/publishers' },
            { content: 'Tác giả', hrefLink: '/admin/book/authors' },
            { content: 'Thê loại', hrefLink: '/admin/book/category' },
        ]
    }
]

export default class AdminPage extends React.Component<{}, { isHideScroll: boolean }> {
    isClearWindow = true;
    adminHeader = React.createRef<AdminHeader>();

    constructor(props: any) {
        super(props);
        this.state = { isHideScroll: false };
    }

    render() {
        this.isClearWindow = true;
        return (
            <AdminAuthenticationProvider>
                <AdminOverrideWindowProvider>
                    <AdminAuthentication.Consumer>
                        {({ isLogin }) => {
                            return isLogin
                                ? <div id="parent-layout">
                                    <AdminHeader minScreenResizeMenuTab={500} ref={this.adminHeader} />
                                    <div id='app-body' style={{ height: 'calc(100% - 35px)', width: '100%', position: 'relative' }}
                                        className={`d-inline-flex align-items-start`}>
                                        <MenuTab menu={menu} getAdminHeader={() => { return this.adminHeader.current as any }}></MenuTab>
                                        <div id='app-content'>
                                            <Switch>
                                                <Route key={Math.random()} exact path="/admin" component={AdminUserPage}></Route>
                                                <Route key={Math.random()} exact path="/admin/admin-users" component={AdminUserPage}></Route>
                                                <Route key={Math.random()} exact path="/admin/groups" component={ViewGroupPermission}></Route>
                                                <Route key={Math.random()} exact path="/admin/group/add" component={AddGroupPermission}></Route>
                                                <Route key={Math.random()} exact path="/admin/admin-user/detail" component={DetailAdminUser}></Route>
                                                <Route key={Math.random()} exact path="/admin/permissions" component={ViewPermission}></Route>
                                                <Route key={Math.random()} exact path="/admin/books" component={ViewBook}></Route>
                                                <Route exact path="/admin/book/add" component={AddBook}></Route>
                                                <Route exact path="/admin/admin-user/add" component={AddAdminUser}></Route>
                                                <Route exact path="/admin/permission/detail" component={DetailPermission}></Route>
                                                <Route exact path="/admin/group/detail" component={DetailGroupPermission}></Route>
                                                <Route exact path="/admin/permission/add" component={AddPermission}></Route>
                                                <Route exact path="/admin/groups" component={ViewGroupPermission}></Route>
                                            </Switch>
                                        </div>
                                        <AdminOverrideWindow.Consumer>
                                            {({ windows, clear }) => {
                                                if (this.isClearWindow) {
                                                    if(windows.length > 0) clear();
                                                    this.isClearWindow = false;
                                                    return null;
                                                } else {
                                                    if (windows.length > 0) {
                                                        return (
                                                            <div className="override-content">
                                                                {windows[0]}
                                                            </div>
                                                        )
                                                    }
                                                }
                                            }}
                                        </AdminOverrideWindow.Consumer>
                                    </div>
                                </div >
                                : <Redirect to="/admin/login"></Redirect>
                        }}
                    </AdminAuthentication.Consumer>
                </AdminOverrideWindowProvider>
            </AdminAuthenticationProvider>
        )
    }
}