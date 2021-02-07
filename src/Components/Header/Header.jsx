import React, { Component } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import headerLogoImage from './images/sfc_logo.gif';
import { NavLink } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

class Header extends Component {
    constructor(props) {
        super(props);

        props.interfaceLanguage();
    }

    render () {
        return (
            <Navbar bg='dark' variant='dark' id='header'>
                <Navbar.Brand href='#home' id='logo' >
                    <img
                        alt=""
                        src={headerLogoImage}
                        width='90px'
                        height='55px'
                        className='d-inline-block align-top'
                    />

                </Navbar.Brand>
                <Nav variant='dark' activeKey='1'>
                    <NavDropdown title={
                        <span className='header-link'>
                            {this.props.t('header_items.catalog')}
                        </span>}
                                 id='nav-dropdown' className='header-nav-item'>
                        <NavDropdown.Item>
                            <NavLink to='/component_catalog' className='header-dropnav-item'>
                                {this.props.t('header_items.components')}
                            </NavLink>
                        </NavDropdown.Item>
                        <NavDropdown.Item>
                            <NavLink to='/construction_catalog' className='header-dropnav-item'>
                                {this.props.t('header_items.assembled_constructions')}
                            </NavLink>
                        </NavDropdown.Item>
                    </NavDropdown>
                    {/*<Nav.Item>
                        <Nav.Link>
                            <NavLink to='/constructor' className='header-link'>
                                {headerItemNames[1][0]}
                            </NavLink>
                        </Nav.Link>
                    </Nav.Item>*/}
                    <Nav.Item>
                        <Nav.Link>
                            <NavLink to='/new_construction_from_old_ones' className='header-link'>
                                {this.props.t('header_items.matching_new_components')}
                            </NavLink>
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            </Navbar>
        )
    }
}

export default withTranslation()(Header)