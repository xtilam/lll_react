import React from "react";
import { Dropdown } from "reactstrap";

interface propsDropdownCustom {
    dropdownToggle: JSX.Element
    dropdownMenu: JSX.Element;
}
export default class WDropdown extends React.Component<propsDropdownCustom, { isOpen: boolean }>{
    constructor(props: Readonly<propsDropdownCustom>) {
        super(props);
        this.state = { isOpen: false };
    }
    toggle(e: any) {
        console.log(e);
    }
    render() {
        return <Dropdown isOpen={this.state.isOpen} toggle={() => { this.setState((state) => { return { isOpen: !this.state.isOpen } }) }}>
            {this.props.dropdownToggle}
            {this.props.dropdownMenu}
        </Dropdown>
    }
}