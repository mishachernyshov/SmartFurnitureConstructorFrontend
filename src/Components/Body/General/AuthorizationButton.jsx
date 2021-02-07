import React from "react";
import GeneralButton from './GeneralButton';
import authorizationImage from './images/authorization_ico.png';

class AuthorizationButton extends GeneralButton {
    render() {
        return (
            <GeneralButton buttonName='Авторизація'
                           image={authorizationImage}
                           imageId='authorization_image'
                           link='/authorization'
            />
        );
    }
}

export default AuthorizationButton;