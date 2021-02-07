import React, { Component } from 'react';
import GeneralButton from './GeneralButton';
import registrationImage from './images/registration_ico.png';

class RegistrationButton extends Component {
    render() {
        return (
            <GeneralButton buttonName='Реєстрація'
                           image={registrationImage}
                           imageId='registration_image'
                           link='/registration'
            />
        );
    }
}

export default RegistrationButton;