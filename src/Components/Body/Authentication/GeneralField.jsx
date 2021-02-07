import React, { Component } from 'react';

export default class GeneralField extends Component {
    static defaultProps = {
        fieldName: 'field name',
        fieldType: 'text'
    }

    render() {
        return (
            <input type={this.props.fieldType} placeholder={this.props.fieldName} />
        )
    }
}