import React from "react";
import { Redirect } from "react-router-dom";
import authentication from "../../admin-auth";

export default class AdminLogout extends React.Component<any, any>{
    constructor(props: any) {
        super(props);
        this.state = {
            redirect: false
        }
    }
    async componentDidMount() {
        await authentication.logout();
        this.setState({redirect: true});
    }
    render() {
        return this.state.redirect ? <Redirect to="/admin/login"></Redirect> : <div>Logout ...</div>;
    }
}