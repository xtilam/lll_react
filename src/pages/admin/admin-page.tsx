import React from 'react';
import './admin-page.scss';
import AdminHeader from '../../layouts/admin/admin-header';
import MenuTab from '../../layouts/admin/menu-tab';
import authentication from '../../admin-auth';
import { Redirect } from 'react-router-dom';

const menu = [
    {
        content: 'Tài khoản quản trị', hrefLink: '/admin/admin-user'
    }
]

export default class AdminPage extends React.Component {
    render() {
        if (authentication.isLogin()) {
            return <div id="parent-layout">
                <AdminHeader minScreenResizeMenuTab={800} />
                <div id='app-body' style={{ height: 'calc(100% - 35px)', width: '100%', position: 'relative' }} className="d-inline-flex align-items-start">
                    <MenuTab menu={menu}></MenuTab>
                    <div id='app-content'>
                        
                    </div>
                </div>
                <div className='disable-content'></div>
            </div >
        } else {
            return <Redirect to='/admin/login'></Redirect>
        }
    }
}