import React, { Component } from 'react';
import GeneralButton from './GeneralButton';
import cartImage from './images/cart_icon.png';

class CartButton extends Component {
    render() {
        return (
            <GeneralButton buttonName='Кошик'
                           image={cartImage}
                           imageId='cart_image'
                           link='/cart'
            />
        );
    }
}

export default CartButton;