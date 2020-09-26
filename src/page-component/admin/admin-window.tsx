import React from "react";
import { Button } from "reactstrap";
import ReloadSVG from "../../logo-svg/reload";
import './admin-window.scss';
export default class AdminWindow extends React.Component {
    render() {
        return (
            <div className="admin-window">
                <Button className="exit-btn" color="danger" size="sm" children={<ReloadSVG className="icon" color="red" />} />
                {this.props.children}
            </div>
        )
    }
}