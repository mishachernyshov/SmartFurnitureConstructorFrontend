import React, { Component } from 'react';
import {DropdownButton, Dropdown, Button, Carousel} from 'react-bootstrap';
import axios from 'axios';
import { withTranslation } from 'react-i18next';

class NewConstructionFromOldOnes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            components: [],
            constructions: [],
            selected_components: [],
            appropriateConstructions: [],
            almostAppropriateConstructions: []
        }

        props.interfaceLanguage();
    }

    getAllComponents() {
        axios(
            {
                method: 'get',
                url: 'http://192.168.0.104:9595/api/component/',
            }
        )
            .then(
                res => {
                    this.setState({
                        components: res.data,
                    });
                }
            )
    }

    getAllConstructions() {
        axios(
            {
                method: 'get',
                url: 'http://192.168.0.104:9595/api/assembled_construction/',
            }
        )
            .then(
                res => {
                    this.setState({
                        ...this.state,
                        constructions: res.data,
                    });
                }
            )
    }

    componentWillMount() {
        this.getAllComponents();
        this.getAllConstructions();
    }

    getConstructionComponents = (constructionId) => {
        axios(
            {
                method: 'get',
                url: `http://192.168.0.104:9595/api/construction_component/${constructionId}`,
            }
        )
            .then(
                res => {
                    const selectedComponentsNumber = this.state.selected_components.length;
                    let newButtonId = selectedComponentsNumber ?
                        this.state.selected_components[selectedComponentsNumber - 1][2] + 1 : 0;
                    let currentSelected_components = this.state.selected_components;
                    for (const [key, value] of Object.entries(res.data)) {
                        currentSelected_components.push([value[1], key, newButtonId++]);
                    }
                    this.setState({
                        selected_components: currentSelected_components
                    });
                }
            )
    }

    componentItemClick = (event) => {
        if (this.state) {
            const newItemId = parseInt(event.target.className);
            const newItemName = event.target.text;
            const selectedComponentsNumber = this.state.selected_components.length;
            const newButtonId = selectedComponentsNumber ?
                this.state.selected_components[selectedComponentsNumber - 1][2] + 1 : 0;
            let current_selected_components = this.state.selected_components;
            current_selected_components.push([newItemId, newItemName, newButtonId]);
            this.setState({
                selected_components: current_selected_components
            });
        }
    }

    constructionItemClick = (event) => {
        if (this.state) {
            const newItemId = parseInt(event.target.className);
            this.getConstructionComponents(newItemId);
        }
    }

    deleteFaultyComponent = (event) => {
        const componentForDeleting = event.currentTarget.attributes
            .getNamedItem('data-component_id').value;
        let componentForDeletingIndex = -1;
        let currentComponents = this.state.selected_components;
        for (let k in currentComponents) {
            if (currentComponents[k][2] == componentForDeleting) {
                componentForDeletingIndex = parseInt(k);
                break;
            }
        }
        currentComponents.splice(componentForDeletingIndex, 1);
        this.setState({selected_components: currentComponents});
    }

    getAppropriateConstructions = () => {
        let requestParams = new URLSearchParams();
        for (let k of this.state.selected_components) {
            requestParams.append('0', k[0])
        }
        axios(
            {
                method: 'get',
                url: 'http://192.168.0.104:9595/api/appropriate_construction/',
                params: requestParams
            }
        )
            .then(
                res => {
                    this.setState({
                        appropriateConstructions: res.data
                    });
                }
            )
        this.getAlmostAppropriateConstructions();
    }

    getAlmostAppropriateConstructions = () => {
        let requestParams = new URLSearchParams();
        for (let k of this.state.selected_components) {
            requestParams.append('0', k[0])
        }
        axios(
            {
                method: 'get',
                url: 'http://192.168.0.104:9595/api/almost_appropriate_construction/',
                params: requestParams
            }
        )
            .then(
                res => {
                    this.setState({
                        almostAppropriateConstructions: res.data
                    });
                }
            )
    }

    printConstructions = (constructionSet) => {
        let constructionsMarkup = [];
        if (constructionSet) {
            for (const [key, value] of Object.entries(constructionSet)) {
                constructionsMarkup.push(
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
        return constructionsMarkup;
    }

    printAppropriateConstructions = () => {
        this.printConstructions(this.state.appropriateConstructions);
    }

    printAlmostAppropriateConstructions = () => {
        this.printConstructions(this.state.almostAppropriateConstructions);
    }

    emptyChosenItems = () => {
        this.setState({
            selected_components: []
        })
    }

    render() {
        return (
            <div id='component-decomposition-wrapper'>
                <div id='component-decomposition-header'>
                    {this.props.t('matching_new_constructions.title')}
                </div>

                <div id='component-decomposition-choose-construction-menu'>
                    <div>
                        {this.props.t('matching_new_constructions.available_constructions')}
                    </div>
                    <div>
                        <DropdownButton id='dropdown-basic-button' variant='secondary'
                                        title={this.props.t(
                                            'matching_new_constructions.available_constructions_button')}>
                            {
                                this.state.constructions.map(k =>
                                    <Dropdown.Item className={k.id} onClick={this.constructionItemClick}>
                                        {k.name}
                                    </Dropdown.Item>
                                )
                            }
                        </DropdownButton>
                    </div>
                </div>

                <div id='component-decomposition-choose-component-menu'>
                    <div>
                        {this.props.t('matching_new_constructions.available_components')}
                    </div>
                    <div>
                        <DropdownButton id='dropdown-basic-button' variant='secondary'
                                        title={this.props.t('matching_new_constructions.available_components_button')}>
                            {
                                this.state.components.map(k =>
                                    <Dropdown.Item className={k.id} onClick={this.componentItemClick}>
                                        {k.name}
                                    </Dropdown.Item>
                                )
                            }
                        </DropdownButton>
                    </div>
                </div>


                <div id='component-decomposition-given-items'>
                    <div>
                        <div>
                            {this.props.t('matching_new_constructions.chosen_components_description_part1')}
                        </div>
                        <div>
                            {this.props.t('matching_new_constructions.chosen_components_description_part2')}
                        </div>
                        <div>
                            {this.props.t('matching_new_constructions.chosen_components_description_part3')}
                        </div>
                    </div>
                    <div id='item-buttons-container'>
                        {
                            this.state.selected_components.map(k =>
                                <Button data-component_id={k[2]} variant='secondary'
                                        onClick={this.deleteFaultyComponent}
                                        className='component-button-entity'>
                                    {k[1]}
                                </Button>
                            )
                        }
                    </div>
                </div>

                <div id='component-decomposition-button-group'>
                    <div>
                        <Button variant='danger' className='component-decomposition-button'
                                onClick={this.emptyChosenItems}>
                            {this.props.t('matching_new_constructions.clear')}
                        </Button>
                    </div>
                    <div>
                        <Button variant='success' className='component-decomposition-button'
                                onClick={this.getAppropriateConstructions}>
                            {this.props.t('matching_new_constructions.search')}
                        </Button>
                    </div>
                </div>

                <div id='component-decomposition-appropriate-results'>
                    {
                        this.state.appropriateConstructions.length > 0 &&
                        <div>
                            <div>
                                {this.props.t('matching_new_constructions.appropriate_constructions')}
                            </div>
                            <div>
                                <Carousel className='carousel_component'>
                                    {
                                        this.state.appropriateConstructions.map(k =>
                                            <Carousel.Item interval={3000}>
                                                <img
                                                    className='d-block w-100'
                                                    src={k.image}
                                                />
                                                <Carousel.Caption>
                                                    <h3 className='carousel_h3'>{k.name}</h3>
                                                </Carousel.Caption>
                                            </Carousel.Item>
                                        )
                                    }
                                </Carousel>
                            </div>
                        </div>
                    }
                </div>
                <div>
                    {
                        this.state.almostAppropriateConstructions.length > 0 &&
                        <div id='component-decomposition-almost-appropriate-results'>
                            <div>
                                {this.props.t('matching_new_constructions.almost_appropriate_constructions')}
                            </div>
                            <div>
                                <Carousel className='carousel_component'>
                                    {
                                        this.state.almostAppropriateConstructions.map(k =>
                                            <Carousel.Item interval={3000}>
                                                <img
                                                    className='d-block w-100'
                                                    src={k.image}
                                                />
                                                <Carousel.Caption>
                                                    <h3 className='carousel_h3'>{k.name}</h3>
                                                </Carousel.Caption>
                                            </Carousel.Item>
                                        )
                                    }
                                </Carousel>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default withTranslation()(NewConstructionFromOldOnes);