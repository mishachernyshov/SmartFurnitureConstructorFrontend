import React, { Component } from 'react';
import axios from 'axios';
import {Button, Carousel, Form, Tabs, Tab, ListGroup} from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import i18next from 'i18next';

class FurnitureComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: -1,
            name: '',
            image: '',
            description: '',
            manufacturer: '',
            rating: 0,
            category: '',
            type: '',
            weight: 0,
            authorized: props.authStatus
        };

        props.interfaceLanguage();
    }

    componentWillMount = () => {
        this.getComponentInfo();
    }

    getComponentInfo = () => {
        const component_id = window.location.pathname.split('/').pop();

        axios(
            {
                method: 'get',
                url: `http://192.168.0.104:9595/api/component/${component_id}`
            }
        )
            .then(
                res => {
                    this.setState({
                        id: component_id,
                        name: res.data['name'],
                        image: res.data['image'],
                        description: res.data['description'],
                        manufacturer: res.data['manufacturer'],
                        rating: res.data['rating'],
                        category: res.data['category'],
                        type: res.data['type'],
                        weight: res.data['weight']
                    });
                }
            ).then(this.getComponentShops)
            .then(this.getRelatedConstructions)
            .then(this.getComponentReports);
    }

    getRelatedConstructions = () => {
        axios(
            {
                method: 'get',
                url: `http://192.168.0.104:9595/api/component_construction/${this.state.id}`
            }
        )
            .then(
                res => {
                    this.setState({
                        constructions: res.data
                    });
                }
            )
    }

    getComponentReports = () => {
        axios(
            {
                method: 'get',
                url: `http://192.168.0.104:9595/api/all_component_reports/${this.state.id}`
            }
        )
            .then(
                res => {
                    this.setState({
                        reports: res.data
                    });
                }
            )
    }

    sendReview = (event) => {
        event.preventDefault();
        const textbox = document.getElementById('report_text');
        axios(
            {
                method: 'post',
                url: 'http://192.168.0.104:9595/api/add_report_about_component/',
                headers: {
                    'Authorization': 'JWT ' + localStorage.getItem('sfc_token')
                },
                data: {
                    'component': this.state.id,
                    'text': textbox.value
                }
            }
        ).then(this.getComponentReports);
        textbox.value = '';
    }

    getComponentShops = () => {
        axios(
            {
                method: 'get',
                url: `http://192.168.0.104:9595/api/component_shops/${this.state.id}`
            }
        )
            .then(
                res => {
                    this.setState({
                        ...this.state,
                        shops: res.data
                    });
                }
            )
    }

    printRelatedConstructions = () => {
        let constructionsMarkup = [];
        if (this.state.constructions) {
            for (const [key, value] of Object.entries(this.state.constructions)) {
                constructionsMarkup.push(
                    <Carousel.Item interval={3000}>
                        <img
                            className='d-block w-100 '
                            src={'http://192.168.0.104:9595/images/' + value[0]}
                        />
                        <Carousel.Caption>
                            <h3 className='carousel_h3'>{key}</h3>
                        </Carousel.Caption>
                    </Carousel.Item>
                )
            }
        }
        return constructionsMarkup;
    }

    printReports = () => {
        let reportMarkup = [];
        let iterationCounter = 0;
        if (this.state.reports) {
            for (const k of this.state.reports['reports']) {
                reportMarkup.push(
                    <ListGroup.Item
                        variant={iterationCounter % 2 == 1 && 'secondary'}
                        className='characteristics-row'>
                        <div className='report-body'>
                            <div className='report-author'>
                                {k[0]}
                            </div>
                            <div className='item-characteristics-value'>
                                {
                                    i18next.t('date_format', { date:
                                            new Date (k[1].slice(0, 4), k[1].slice(5, 2) - 1, k[1].slice(8, 2)) })
                                }
                            </div>
                        </div>
                        <div>
                            {k[2]}
                        </div>
                    </ListGroup.Item>
                );
                iterationCounter++;
            }
        }
        return reportMarkup;
    }

    printShops = () => {
        let shopMarkup = [];
        let iterationCounter = 0;
        if (this.state.shops) {
            for (const [key, value] of Object.entries(this.state.shops)) {
                shopMarkup.push(
                    <ListGroup.Item variant={iterationCounter % 2 == 1 && 'secondary'}
                    className='shop-group'>
                        <div className='component-shop'>
                            <div className='component-shop-first-column'>
                                <div className='shop-name'>
                                    {key}
                                </div>
                                <div>
                                    <img src={'https://127.0.0.1:8000/images/' + value[0]}
                                    className='shop-logo' />
                                </div>
                            </div>
                            <div className='component-shop-second-column'>
                                <div>
                                    {this.props.t('catalog_item.price') + ': ' + value[2] + ' грн'}
                                </div>
                                <div>
                                    <a href={value[3]}>
                                        {this.props.t('catalog_item.good_in_shop')}
                                    </a>
                                </div>
                                <div>
                                    <a href={value[1]}>
                                        🏠 {this.props.t('catalog_item.homepage')}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </ListGroup.Item>
                );
                iterationCounter++;
            }
        }
        return shopMarkup;
    }

    render() {
        return (
            <div className='catalog-item-wrapper'>
                <div className='item-visualization'>
                    <div id='item-main-header'>
                        {this.state.name}
                    </div>
                    <div>
                        <img className='catalog-item-image' src={this.state.image} />
                    </div>
                    <div id='related_item-wrapper'>
                        <div className='item-additional-header'>
                            {this.props.t('catalog_item.related_constructions')}
                        </div>
                        <Carousel className='carousel_component related-item'>
                            {
                                this.printRelatedConstructions()
                            }
                        </Carousel>
                    </div>
                </div>

                <div className='item-main-info'>
                    <div className='item-main-info-header'>
                        {this.props.t('catalog_item.rating') + ': ' + this.state.rating}
                    </div>
                    <div id='item-description'>
                        {this.state.description}
                    </div>
                </div>

                <div className='item-additional-info'>
                    <Tabs defaultActiveKey='home' transition={false} id='noanim-tab-example'>
                        <Tab eventKey='home' title={this.props.t('catalog_item.characteristics')}>
                            <ListGroup variant='dark'>
                                <ListGroup.Item className='characteristics-row'>
                                    <div className='item-characteristics'>
                                        <div>{this.props.t('catalog_item.manufacturer')}</div>
                                        <div className='item-characteristics-value'>{this.state.manufacturer}</div>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item variant='secondary' className='characteristics-row'>
                                    <div className='item-characteristics'>
                                        <div>{this.props.t('catalog_item.category')}</div>
                                        <div className='item-characteristics-value'>{this.state.category}</div>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className='characteristics-row'>
                                    <div className='item-characteristics'>
                                        <div>{this.props.t('catalog_item.type')}</div>
                                        <div className='item-characteristics-value'>{this.state.type}</div>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item variant='secondary' className='characteristics-row'>
                                    <div className='item-characteristics'>
                                        <div>{this.props.t('catalog_item.weight')}</div>
                                        <div className='item-characteristics-value'>
                                            {
                                                localStorage.getItem('sfc-language') === 'ua' &&
                                                this.state.weight
                                            }
                                            {
                                                localStorage.getItem('sfc-language') === 'en' &&
                                                (this.state.weight / 453.59237).toFixed(3)
                                            }
                                        </div>
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Tab>
                        <Tab eventKey='profile' title={this.props.t('catalog_item.reports')}>
                            <div>
                                {
                                    this.printReports()
                                }
                            </div>
                            {
                                this.state.authorized &&
                                <Form onSubmit={this.sendReview} id='new-report-form'>
                                    <Form.Group controlId='exampleForm.ControlInput1'>
                                        <Form.Label>{this.props.t('catalog_item.reports')}</Form.Label>
                                        <Form.Control as='textarea' rows={3} id='report_text' />
                                    </Form.Group>

                                    <Button variant='dark' type='submit'>
                                        {this.props.t('catalog_item.send')}
                                    </Button>
                                </Form>
                            }
                        </Tab>
                        <Tab eventKey='contact' title={this.props.t('catalog_item.shops')}>
                            {
                                this.printShops()
                            }
                        </Tab>
                    </Tabs>
                </div>

            </div>
        );
    }
}

export default withTranslation()(FurnitureComponent);