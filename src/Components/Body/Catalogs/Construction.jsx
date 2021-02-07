import React, { Component } from 'react';
import axios from 'axios';
import {Button, Carousel, Form, ListGroup, Modal, Tab, Tabs} from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import i18next from 'i18next';

class AssembledConstruction extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: -1,
            name: '',
            type: '',
            description: '',
            image: '',
            rating: 0,
            schema: '',
            assemble_instruction: '',
            authorized: props.authStatus,
            buyConstructionModal: false,
            currency: 1
        };
    }

    componentWillMount = () => {
        this.getConstructionInfo();
    }

    getConstructionInfo = () => {
        const construction_id = window.location.pathname.split('/').pop();

        axios(
            {
                method: 'get',
                url: `http://192.168.0.104:9595/api/assembled_construction/${construction_id}`
            }
        )
            .then(
                res => {
                    this.setState({
                        id: construction_id,
                        name: res.data['name'],
                        type: res.data['type'],
                        description: res.data['description'],
                        image: res.data['image'],
                        rating: res.data['rating'],
                        schema: res.data['schema'],
                        assemble_instruction: res.data['assemble_instruction']
                    });
                }
            )
            .then(this.getRelatedConstructions)
            .then(this.getConstructionReports);
    }

    getRelatedConstructions = () => {
        axios(
            {
                method: 'get',
                url: `http://192.168.0.104:9595/api/construction_component/${this.state.id}`
            }
        )
            .then(
                res => {
                    this.setState({
                        components: res.data
                    });
                }
            )
    }

    getConstructionReports = () => {
        axios(
            {
                method: 'get',
                url: `http://192.168.0.104:9595/api/all_construction_reports/${this.state.id}`
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

    printRelatedComponents = () => {
        let componentsMarkup = [];
        if (this.state.components) {
            for (const [key, value] of Object.entries(this.state.components)) {
                componentsMarkup.push(
                    <Carousel.Item interval={3000}>
                        <img
                            className='d-block w-100'
                            src={'http://192.168.0.104:9595/images/' + value[0]}
                        />
                        <Carousel.Caption>
                            <h3 className='carousel_h3'>{key}</h3>
                        </Carousel.Caption>
                    </Carousel.Item>
                )
            }
        }
        return componentsMarkup;
    }

    buyConstruction = () => {
        axios(
            {
                method: 'post',
                url: 'http://192.168.0.104:9595/api/add_to_cart/',
                headers: {
                    'Authorization': 'JWT ' + localStorage.getItem('sfc_token')
                },
                data: {
                    'construction': this.state.id
                }
            }
        );
        this.setState({
            buyConstructionModal: true
        })
    }

    handleSuccessBuyingClose = () => {
        this.setState({
            buyConstructionModal: false
        })
    }

    sendReview = (event) => {
        event.preventDefault();
        const textbox = document.getElementById('report_text');
        axios(
            {
                method: 'post',
                url: 'http://192.168.0.104:9595/api/add_report_about_construction/',
                headers: {
                    'Authorization': 'JWT ' + localStorage.getItem('sfc_token')
                },
                data: {
                    'construction': this.state.id,
                    'text': textbox.value
                }
            }
        ).then(this.getConstructionReports);
        textbox.value = '';
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
                            {this.props.t('catalog_item.related_components')}
                        </div>
                        <Carousel className='carousel_component related-item'>
                            {
                                this.printRelatedComponents()
                            }
                        </Carousel>
                        {
                            this.state.authorized &&
                            <div id='construction-schema-buttons'>
                                <Button variant='dark' onClick={this.buyConstruction}>
                                    {this.props.t('catalog_item.buy_schema')}
                                </Button>
                                <Button variant='dark'>
                                    {this.props.t('catalog_item.download_schema')}
                                </Button>
                            </div>
                        }
                    </div>
                </div>

                <div className='item-main-info'>
                    <div className='item-main-info-header'>
                        <div>
                            {this.props.t('catalog_item.type') + ': ' + this.state.type}
                        </div>
                        <div id='item-main-info-header-last-item'>
                            {this.props.t('catalog_item.rating') + ': ' + this.state.rating}
                        </div>
                    </div>
                    <div id='item-description'>
                        {this.state.description}
                    </div>
                </div>

                <div className='item-additional-info'>
                    <Tabs defaultActiveKey='home' transition={false} id='noanim-tab-example'>
                        <Tab eventKey='home' title={this.props.t('catalog_item.reports')}>
                            <div>
                                {
                                    this.printReports()
                                }
                            </div>
                            {
                                this.state.authorized &&
                                <Form onSubmit={this.sendReview} id='new-report-form'>
                                    <Form.Group controlId='exampleForm.ControlInput1'>
                                        <Form.Label>{this.props.t('catalog_item.write_reports')}</Form.Label>
                                        <Form.Control as='textarea' rows={3} id='report_text' />
                                    </Form.Group>

                                    <Button variant='dark' type='submit'>
                                        {this.props.t('catalog_item.send')}
                                    </Button>
                                </Form>
                            }
                        </Tab>
                    </Tabs>
                </div>
                <Modal show={this.state.buyConstructionModal}
                       onHide={this.handleSuccessBuyingClose} animation={true}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.props.t('catalog_item.schema_getting')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{this.props.t('catalog_item.schema_getting_message')}</Modal.Body>
                    <Modal.Footer>
                        <Button variant='success' onClick={this.handleSuccessBuyingClose}>
                            {this.props.t('catalog_item.ok')}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default withTranslation()(AssembledConstruction);