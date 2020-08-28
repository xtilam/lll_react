import { render } from "@testing-library/react"
import React from "react"
import authentication from "../../admin-auth"

export default class AdminLogout extends React.Component{
    componentDidMount(){
        authentication.logout();
    }
    render(){
        return <div></div>;
    }
}