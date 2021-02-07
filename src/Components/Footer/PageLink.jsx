import React, { Component } from 'react';

export default class PageLink extends Component {
    static defaultProps = {
        text: 'link text',
        address: 'link address'
    }

    render() {
        return (
            <a href={this.props.address}>
                {this.props.text}
            </a>
        )
    }
}