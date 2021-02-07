import React, { Component } from 'react';
import GeneralField from './GeneralField'

export default class UsernameField extends Component {
    static defaultProps = {
        fieldName: 'Ім\'я користувача'
    }

    render() {
        return (
            <GeneralField fieldType='text' fieldName={this.props.fieldName} />
        )
    }
}