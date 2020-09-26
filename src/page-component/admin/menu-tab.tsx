import React from "react";
import { Link } from "react-router-dom";

interface MenuItem {
    content: JSX.Element | string,
    hrefLink?: string
}
interface MenuType {
    items: (MenuType | MenuItem)[]
    content: JSX.Element | string
}
interface MenuTabProps {
    menu: (MenuType | MenuItem)[]
}
interface MenuTabState {}
let count = 0;

export default class MenuTab extends React.Component<MenuTabProps, MenuTabState> {
    menu: React.RefObject<any>;
    constructor(props: Readonly<MenuTabProps>){
        super(props);
        this.menu = React.createRef();
    }
    renderItem(itemMenu: MenuType | MenuItem): JSX.Element {
        if ((itemMenu as Object).hasOwnProperty('items')) {
            return <li key={++count}>
                <MenuDropDown title={(itemMenu as MenuType).content}>
                    { (itemMenu as MenuType).items.map(item => { return this.renderItem(item) }) }
                </MenuDropDown>
            </li >;
        } else {
            return <li key={++count}>
                <Link to={(itemMenu as MenuItem).hrefLink ?? '#'}>
                    <div className="item-menu">
                        {(itemMenu as MenuItem).content}
                    </div>
                </Link>
            </li>
        }

    }
    render() {
        count = 0;
        return <div id="menu-tab" ref={this.menu}>
            <ul>{this.props.menu.map(item => { return this.renderItem(item); })}</ul>            
        </div>
    }
}

class MenuDropDown extends React.Component<{ title: JSX.Element | string }, { isCollapsed: boolean }> {
    
    constructor(props: Readonly<{ title: string | JSX.Element }>) {
        super(props);
        this.state = {
            isCollapsed: false
        }
    }
    
    render() {
        return <ul>
            <div className="item-menu" onClick={() => { this.setState(state => { return { isCollapsed: !this.state.isCollapsed } }) }}>{this.props.title}</div>
            {this.state.isCollapsed && this.props.children}
        </ul >
    }
}