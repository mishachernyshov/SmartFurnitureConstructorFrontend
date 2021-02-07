import React, { Component } from 'react';
import GeneralField from './GeneralField'

export default class UsernameField extends Component {
    static defaultProps = {
        fieldName: 'Пароль'
    }

    render() {
        return (
            <GeneralField fieldType='password' fieldName={this.props.fieldName} />
        )
    }
}