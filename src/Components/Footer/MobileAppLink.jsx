import React, { Component } from 'react';
import PlayMarketImage from './images/google-play-badge-ru.png';

export default class MobileAppLink extends Component {
    static defaultProps = {
        image: PlayMarketImage,
        address: 'link address'
    }

    render() {
        return (
            <a href={this.props.address}>
                <img src={this.props.image} id={'play_market_link'}
                     alt={'Play Market'} />
            </a>
        )
    }
}