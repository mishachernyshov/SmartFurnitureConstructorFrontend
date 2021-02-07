import React, { Component } from 'react';
import PageLink from './PageLink';
import PlayMarketLink from './MobileAppLink'
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import headerLogoImage from "../Header/images/sfc_logo.gif";
import PlayMarketImage from './images/google-play-badge-ru.png'

const footerLinksFilling = (pageLinkItems) => {
    let itemArray = []
    for (const [key, value] of Object.entries(pageLinkItems)) {
        itemArray.push(
            <PageLink text={key} address={value}/>
        )
    }
    return itemArray;
}

export default class Footer extends Component {

    render() {
        //let footerLinks = footerLinksFilling(pageLinks);

        return (
            /*<div>
                <div>
                    Copyright © 2020 SmartFurnitureConstructor
                </div>
                {footerLinks}
                <PlayMarketLink />
            </div>*/
            <Nav className="justify-content-center" activeKey="/home" id='footer'>
                <Nav.Item>
                    <Nav.Link eventKey="disabled" disabled>
                        Copyright © 2020 SmartFurnitureConstructor
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/home">Про нас</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-1">Контакти</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-2">API</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-2">
                        <img src={PlayMarketImage} id={'play_market_link'}
                             alt={'Play Market'} />
                    </Nav.Link>
                </Nav.Item>
            </Nav>
        )
    }
}