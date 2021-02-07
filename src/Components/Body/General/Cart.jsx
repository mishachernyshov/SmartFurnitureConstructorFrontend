import React, { Component } from 'react';
import {Button, ListGroup, Modal} from "react-bootstrap";
import axios from "axios";
import deleteImage from './images/delete_ico.png';
import { withTranslation } from "react-i18next";

class Cart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            goods: [],
            price: 2,
            showSuccessConfirmation: false
        }

        props.interfaceLanguage();
    }

    componentWillMount = () => {
        this.getCartContent();
    }

    getCartContent = () => {
        axios(
            {
                method: 'get',
                url: 'http://192.168.0.104:9595/api/cart_content/',
                headers: {
                    'Authorization': 'JWT ' + localStorage.getItem('sfc_token')
                }
            }
        )
            .then(res => {
                this.setState({
                    goods: res.data
                });
            }
        )
            .then(this.getExchangeRates)
    }

    getExchangeRates = () => {
        axios(
            {
                method: 'get',
                url: `https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5`
            }
        )
            .then(
                res => {
                    this.setState({
                        price: res.data[0]['buy']
                    });
                }
            )
    }

    deleteGoodFromCart = (event) => {
        const goodId = parseInt(event.target.id);
        let currentCartContent = this.state.goods;
        for (const [key, value] of Object.entries(this.state.goods)) {
            if (value[1] == goodId) {
                delete currentCartContent[key];
                break;
            }
        }
        this.setState({
            goods: currentCartContent
        })
    }

    printCartContent = () => {
        let cartContentMarkup = [];
        let totalSum = 0;
        let iterationCounter = 0;
        let usedLanguage = localStorage.getItem('sfc-language');
        let currentPrice = 1;
        if (usedLanguage === 'ua') {
            currentPrice = parseFloat(this.state.price).toFixed(2);
        }
        for (const [key, value] of Object.entries(this.state.goods)) {
            totalSum += currentPrice * value[0];
            cartContentMarkup.push(
                <ListGroup.Item variant={iterationCounter % 2 == 1 && 'secondary'}
                                id={value[1] + '-cart_table_row'}>
                    <div className='cart-content-table'>
                        <div className='cart-good-name'>
                            {key}
                        </div>
                        <div className='cart-good-quantity'>
                            <input type='number' min='1' id={value[1] + '_cart_good'}
                                   defaultValue={value[0]} onChange={this.changeGoodCount}
                            />
                        </div>
                        <div className='cart-good-price'>
                            <div>
                                {currentPrice + ' ' + this.props.t('cart.currency')}
                            </div>
                        </div>
                        <div className='cart-good-sum'>
                            <div id={value[1] + '_cart_price'}>
                                {currentPrice * value[0] + ' ' + this.props.t('cart.currency')}
                            </div>
                        </div>
                        <div className='cart-good-delete'>
                            <img className='cart-delete-good-image' id={value[1] + '_cart_good_remove'}
                                 onClick={this.deleteGoodFromCart} src={deleteImage} />
                        </div>
                    </div>
                </ListGroup.Item>
            );
            iterationCounter++;
        }
        let totalHtml = document.getElementById('total_sum');
        if (totalHtml) {
            totalHtml.innerText = totalSum.toFixed(2).toString()
        }
        return cartContentMarkup;
    }

    changeGoodCount = (event) => {
        const goodId = parseInt(event.target.id);
        const currentInputBox = document.getElementById(goodId + '_cart_good');
        let usedLanguage = localStorage.getItem('sfc-language');
        let currentPrice = 1;
        if (usedLanguage === 'ua') {
            currentPrice = parseFloat(this.state.price).toFixed(2);
        }
        const newPriceValue = parseFloat(currentInputBox.value) *
            currentPrice;
        document.getElementById(goodId + '_cart_price').innerText =
            (newPriceValue).toString() + ' ' + this.props.t('cart.currency');
        let totalHtml = document.getElementById('total_sum');
        totalHtml.innerText = (parseFloat(totalHtml.innerText) - event.target.defaultValue *
            currentPrice + newPriceValue).toFixed().toString();
        currentInputBox.defaultValue = currentInputBox.value;
    }

    emptyCart = () => {
        axios(
            {
                method: 'post',
                url: 'http://192.168.0.104:9595/api/empty_cart/',
                headers: {
                    'Authorization': 'JWT ' + localStorage.getItem('sfc_token')
                }
            }
        ).then(
            res => {
                this.getCartContent();
            }
        )
    }

    makeChangeRequest = (new_values) => {
        axios(
            {
                method: 'post',
                url: 'http://192.168.0.104:9595/api/cart_content/',
                headers: {
                    'Authorization': 'JWT ' + localStorage.getItem('sfc_token')
                },
                data: {
                    'new_values': new_values
                }
            }
        ).then(
            res => {
                this.getCartContent();
                this.setState({
                        showSuccessConfirmation: true
                    }
                )
            }
        )
    }

    commitChanges = () => {
        let arrayToSend = [];
        for (const [key, value] of Object.entries(this.state.goods)) {
            try {
                arrayToSend.push(
                    {
                        'initial_count': value[0],
                        'requested_count': parseInt(
                            document.getElementById(value[1] + '_cart_good').value),
                        'construction_id': value[1]
                    }
                )
            } catch (exception) {
                console.log(exception.message);
            }
        }
        this.makeChangeRequest(arrayToSend);
    }

    handleClose = () => {
        this.setState({
                showSuccessConfirmation: false
            }
        )
    }

    render() {
        return (
            <div>
                <div id='cart-header'>
                    {this.props.t('cart.title')}
                </div>
                <div>
                    <div>
                        <ListGroup.Item variant='dark'>
                            <div className='cart-content-table'>
                                <div className='cart-good-name'>{this.props.t('cart.name')}</div>
                                <div className='cart-good-quantity'>{this.props.t('cart.count')}</div>
                                <div className='cart-good-price'>{this.props.t('cart.unit_of_goods_price')}</div>
                                <div className='cart-good-sum'>{this.props.t('cart.sum')}</div>
                                <div className='cart-good-delete'>{this.props.t('cart.delete')}</div>
                            </div>
                        </ListGroup.Item>
                    </div>
                    <div>
                        {
                            this.printCartContent()
                        }
                    </div>
                    <div className='cart-content-table' id='cart-navigation-section'>
                        <div>
                            <div className='cart-good-name' id='cart-general-sum'>
                                <div><b>{this.props.t('cart.total')}:</b></div>
                                <div id='total_sum'></div>
                                <div>{this.props.t('cart.currency')}</div>
                            </div>
                        </div>
                        <div>
                            <Button variant="danger" onClick={this.emptyCart} className='cart-good-price'>
                                {this.props.t('cart.empty')}
                            </Button>
                        </div>
                        <div>
                            <Button variant="info" className='cart-good-sum' onClick={this.commitChanges}>
                                {this.props.t('cart.confirm')}
                            </Button>
                        </div>
                        <div>
                            <Button variant="success" className='cart-good-delete'>
                                {this.props.t('cart.pay')}
                            </Button>
                        </div>
                    </div>
                </div>
                <Modal show={this.state.showSuccessConfirmation}
                       onHide={this.handleClose} animation={true}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.props.t('cart.confirm_title')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{this.props.t('cart.confirm_message')}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={this.handleClose}>
                            {this.props.t('cart.confirm_confirmation')}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default withTranslation()(Cart);