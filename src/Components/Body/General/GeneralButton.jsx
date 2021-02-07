import React, { Component } from 'react';
import { OverlayTrigger, Tooltip, Image } from "react-bootstrap";
import { NavLink, Router } from "react-router-dom";

class GeneralButton extends Component {
    render() {
        return (
            /*<OverlayTrigger
                key={'left'}
                placement={'left'}
                overlay={
                    <Tooltip id='tooltip-left'>
                        <strong>{this.props.buttonName}</strong>
                    </Tooltip>
                }
                className='left-nav-sidebar'
            >
                <NavLink to={this.props.link}>
                    <Image src={this.props.image} id={this.props.imageId}
                           className='auth-btn'/>
                </NavLink>
            </OverlayTrigger>*/
            <NavLink to={this.props.link}>
                <Image src={this.props.image} id={this.props.imageId}
                       className='auth-btn' onClick={() => {
                           if (this.props.href) {
                               document.location.href = this.props.href;
                           }
                           if (this.props.onClickFunction && this.props.onClickFunctionParameters
                           && this.props.logOutRequest) {
                               this.props.onClickFunction(...this.props.onClickFunctionParameters);
                               this.props.logOutRequest();
                           }
                       }
                   }
                />
            </NavLink>
        );
    }
}

export default GeneralButton;