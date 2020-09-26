
import React from 'react';
import authentication from '../admin-auth';

export const AdminAuthentication = React.createContext<AdminAuthenticationState>(undefined as any);

interface AdminAuthenticationState {
    isLogin: boolean
}

export let setLoginContext: (isLogin: boolean) => any;
export default class AdminAuthenticationProvider extends React.Component<{}, AdminAuthenticationState>{
    constructor(props: any) {
        super(props);
        this.state = {
            isLogin: authentication.isLogin(),
        }
        setLoginContext = (isLogin) => { this.setState({ isLogin: isLogin }) };
    }
    render() {
        return (
            <AdminAuthentication.Provider value={
                { isLogin: this.state.isLogin }
            }>
                {this.props.children}
            </AdminAuthentication.Provider>
        )
    }
}