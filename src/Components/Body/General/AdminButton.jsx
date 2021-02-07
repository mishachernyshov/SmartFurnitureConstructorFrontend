import React, { Component } from 'react';
import GeneralButton from './GeneralButton';
import adminImage from './images/admin_ico.png';

class AdminButton extends Component {
    render() {
        return (
            <GeneralButton buttonName='Адміністрування'
                           image={adminImage}
                           imageId='admin_image'
                           link='#'
                           href='http://192.168.0.104:9595/admin/'
            />
        );
    }
}

export default AdminButton;