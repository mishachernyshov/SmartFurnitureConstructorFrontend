import React, { Component } from 'react';
import GeneralButton from './GeneralButton';
import exitImage from './images/exit_icon.png';

class ExitButton extends Component {
    render() {
        return (
            <GeneralButton buttonName='Вихід'
                           image={exitImage}
                           imageId='exit_image'
                           link='#'
                           logOutRequest={this.props.logOutRequest}
                           onClickFunction={this.props.changeAuthState}
                           onClickFunctionParameters={[false]}
            />
        );
    }
}

export default ExitButton;