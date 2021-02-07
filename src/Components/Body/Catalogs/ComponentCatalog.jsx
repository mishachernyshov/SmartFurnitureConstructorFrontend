import React from 'react';
import { ListGroup, DropdownButton, Dropdown, Form } from 'react-bootstrap';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import BaseCatalog from './BaseCatalog';
import { withTranslation } from 'react-i18next';

class ComponentCatalog extends BaseCatalog {
    constructor(props) {
        super(props);

        this.state = {
            components: [],
            current_components: [],
            categories: [],
            manufacturers: [],
            ratings: []
        }

        props.interfaceLanguage();
    }

    componentWillMount = () => {
        this.getComponentsList();
    }

    getComponentsList = () => {
        axios(
            {
                method: 'get',
                url: 'http://192.168.0.104:9595/api/component/',
            }
        )
            .then(
                res => {
                    let filterContent = this.getFilterContent(res.data);
                    this.setState({
                        components: res.data,
                        current_components: res.data,
                        categories: [...filterContent.categories],
                        manufacturers: [...filterContent.manufacturers],
                        ratings: [...filterContent.ratings]
                    });
                }
            )
    }

    getFilterContent = (components) => {
        let filterContent = {
            categories: new Set(),
            manufacturers: new Set(),
            ratings: new Set()
        };
        for (let k of components) {
            filterContent.categories.add(k.category);
            filterContent.manufacturers.add(k.manufacturer);
            filterContent.ratings.add(k.rating);
        }
        return filterContent;
    }

    filterComponentCatalog = () => {
        let newCurrentComponentsList = [];
        const categoriesCheckboxes = this.getCheckedItemsArray(this.state.categories);
        const manufacturersCheckboxes = this.getCheckedItemsArray(this.state.manufacturers);
        const categoriesCheckboxesLength = categoriesCheckboxes.length;
        const manufacturersCheckboxesLength = manufacturersCheckboxes.length;
        const minRate = document.getElementById('component_rate_min').value;
        const maxRate = document.getElementById('component_rate_max').value;

        for (let k of this.state.components) {
            if ((!categoriesCheckboxesLength || categoriesCheckboxes.includes(k.category)) &&
                (!manufacturersCheckboxesLength || manufacturersCheckboxes.includes(k.manufacturer)) &&
                (k.rating >= minRate && k.rating <= maxRate)
            ) {
                newCurrentComponentsList.push(k);
            }
        }

        this.setState({
            ...this.state,
            current_components: newCurrentComponentsList
        });
    }

    setDropdownItem = (event) => {
        document.getElementById('component_sort_menu').innerText = event.target.text;
        this.catalogItemsSort(event.target.text, this.state.current_components);
        this.setState(this.state);
    }

    componentSearch = () => {
        const foundItems = super.itemSearch(this.state.components);

        this.setState({
            ...this.state,
            current_components: foundItems
        })
    }

    render() {
        return (
            <div>
                <div id='catalog-header'>
                    {this.props.t('component_catalog.catalog_name')}
                </div>
                <div className='catalog-wrapper'>
                    <div className='filter-menu-wrapper'>
                        <div>
                            {this.props.t('component_catalog.filtration')}
                        </div>
                        <ListGroup>
                            <ListGroup.Item>
                                <div>{this.props.t('component_catalog.category')}</div>
                                <Form>
                                    {
                                        this.state.categories.map(
                                            k => <Form.Check
                                                type='checkbox' label={k} id={k}
                                                onChange={this.filterComponentCatalog} />
                                        )
                                    }
                                </Form>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <div>{this.props.t('component_catalog.manufacturer')}</div>
                                <Form>
                                    {
                                        this.state.manufacturers.map(
                                            k => <Form.Check
                                                type='checkbox' label={k} id={k}
                                                onChange={this.filterComponentCatalog} />
                                        )
                                    }
                                </Form>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <div>{this.props.t('component_catalog.rating')}</div>
                                <div>
                                    <div>{this.props.t('component_catalog.min_rating_value')}</div>
                                    <input type='number' id='component_rate_min' min='1' max='10'
                                           defaultValue='1' onChange={this.filterComponentCatalog}
                                           onBlur={this.checkRatingValue}
                                    />
                                    <div>{this.props.t('component_catalog.max_rating_value')}</div>
                                    <input type='number' id='component_rate_max' min='1' max='10'
                                           defaultValue='10' onChange={this.filterComponentCatalog}
                                           onBlur={this.checkRatingValue}
                                    />
                                </div>
                            </ListGroup.Item>
                        </ListGroup>
                    </div>

                    <div className='catalog-body'>
                        <div className='catalog-navigation'>
                            <div className='catalog-search'>
                                <input className='form-control form-control-sm' type='text'
                                       id='componentCatalogSearchForm' onChange={this.componentSearch}
                                       placeholder={this.props.t('component_catalog.search_field_text')} aria-label='Search'/>
                            </div>

                            <div className='catalog-ordering'>
                                <div>{this.props.t('component_catalog.sorting')}</div>
                                <DropdownButton id='component_sort_menu' variant='secondary'
                                                className='catalog-sort-button'
                                                title={this.props.t('component_catalog.arbitrary_sorting_order')}>
                                    <Dropdown.Item id='component_sort_option1'
                                                   onClick={this.setDropdownItem}>
                                        {this.props.t('component_catalog.sorting_order_by_name')}
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey='component_sort_option2'
                                                   onClick={this.setDropdownItem}>
                                        {this.props.t('component_catalog.sorting_ascending_rating_order')}
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey='component_sort_option3'
                                                   onClick={this.setDropdownItem}>
                                        {this.props.t('component_catalog.sorting_descending_rating_order')}
                                    </Dropdown.Item>
                                </DropdownButton>
                            </div>
                        </div>
                        <div className='catalog-goods'>
                            <ListGroup>
                                {
                                    this.state.current_components.map(k =>
                                        <ListGroup.Item>
                                            <div className='catalog-good'>
                                                <div className='catalog-good-name'>
                                                    <NavLink to={'/component_catalog/' + k.id}
                                                             className='good-link-from-catalog'>
                                                        {k.name}
                                                    </NavLink>
                                                </div>
                                                <div className='catalog-good-image'>
                                                    <img className='catalog-image' src={k.image} />
                                                </div>
                                                <div className='catalog-good-parameters'>
                                                    <div>
                                                        {this.props.t(
                                                            'component_catalog.component_rating')}: {k.rating}
                                                    </div>
                                                    <div>
                                                        {this.props.t(
                                                            'component_catalog.component_manufacturer')}: {
                                                        k.manufacturer}
                                                    </div>
                                                </div>
                                                <div className='catalog-good-description'>
                                                    {k.description.substr(0, 500)}
                                                </div>

                                            </div>
                                        </ListGroup.Item>)
                                }
                            </ListGroup>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation()(ComponentCatalog);