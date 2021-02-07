import React from 'react';
import { ListGroup, DropdownButton, Dropdown, Form } from 'react-bootstrap';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import BaseCatalog from './BaseCatalog';
import { withTranslation } from 'react-i18next';


class ConstructionCatalog extends BaseCatalog {
    constructor(props) {
        super(props);

        this.state = {
            constructions: [],
            current_constructions: [],
            types: [],
            ratings: []
        };
    }

    componentWillMount = () => {
        this.getConstructionsList();
    }

    getConstructionsList = () => {
        axios(
            {
                method: 'get',
                url: 'http://192.168.0.104:9595/api/assembled_construction/',
            }
        )
            .then(
                res => {
                    let filterContent = this.getFilterContent(res.data);
                    this.setState({
                        constructions: res.data,
                        current_constructions: res.data,
                        types: [...filterContent.types],
                        ratings: [...filterContent.ratings]
                    });
                }
            )
            .catch(e =>
                {
                    console.log(e.message)
                }
            )
    }

    getFilterContent = (components) => {
        let filterContent = {
            types: new Set(),
            ratings: new Set()
        };
        for (let k of components) {
            filterContent.types.add(k.type);
            filterContent.ratings.add(k.rating);
        }
        return filterContent;
    }

    filterConstructionCatalog = () => {
        let newCurrentConstructionList = [];
        const typeCheckboxes = this.getCheckedItemsArray(this.state.types);
        const typeCheckboxesLength = typeCheckboxes.length;
        const minRate = document.getElementById('component_rate_min').value;
        const maxRate = document.getElementById('component_rate_max').value;

        for (let k of this.state.constructions) {
            if ((!typeCheckboxesLength || typeCheckboxes.includes(k.type)) &&
                (k.rating >= minRate && k.rating <= maxRate)
            ) {
                newCurrentConstructionList.push(k);
            }
        }

        this.setState({
            ...this.state,
            current_constructions: newCurrentConstructionList
        });
    }

    setDropdownItem = (event) => {
        document.getElementById('component_sort_menu').innerText = event.target.text;
        this.catalogItemsSort(event.target.text, this.state.current_constructions);
        this.setState(this.state);
    }

    constructionSearch = () => {
        const foundItems = super.itemSearch(this.state.constructions);

        this.setState({
            ...this.state,
            current_constructions: foundItems
        })
    }

    render() {
        return (
            <div>
                <div id='catalog-header'>
                    {this.props.t('construction_catalog.catalog_name')}
                </div>
                <div className='catalog-wrapper'>
                    <div className='filter-menu-wrapper'>
                        <div>
                            {this.props.t('construction_catalog.filtration')}
                        </div>
                        <ListGroup>
                            <ListGroup.Item>
                                {this.props.t('construction_catalog.type')}
                                <Form>
                                    {
                                        this.state.types.map(
                                            k => <Form.Check
                                                type='checkbox' label={k} id={k}
                                                onChange={this.filterConstructionCatalog} />
                                        )
                                    }
                                </Form>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <div>{this.props.t('construction_catalog.rating')}</div>
                                <div>
                                    <div>{this.props.t('construction_catalog.min_rating_value')}</div>
                                    <input type='number' id='component_rate_min' min='1' max='10'
                                           defaultValue='1' onChange={this.filterConstructionCatalog}
                                           onBlur={this.checkRatingValue}
                                    />
                                    <div>{this.props.t('construction_catalog.max_rating_value')}</div>
                                    <input type='number' id='component_rate_max' min='1' max='10'
                                           defaultValue='10' onChange={this.filterConstructionCatalog}
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
                                       id='componentCatalogSearchForm' onChange={this.constructionSearch}
                                       placeholder={this.props.t('construction_catalog.search_field_text')}
                                       aria-label='Search'/>
                            </div>
                            <div className='catalog-ordering'>
                                <div>{this.props.t('construction_catalog.sorting')}</div>
                                <DropdownButton id='component_sort_menu' className='catalog-sort-button'
                                                title={this.props.t('component_catalog.arbitrary_sorting_order')}
                                                variant='dark'>
                                    <Dropdown.Item id='component_sort_option1'
                                                   onClick={this.setDropdownItem}>
                                        {this.props.t('construction_catalog.sorting_order_by_name')}
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey='component_sort_option2'
                                                   onClick={this.setDropdownItem}>
                                        {this.props.t('construction_catalog.sorting_ascending_rating_order')}
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey='component_sort_option3'
                                                   onClick={this.setDropdownItem}>
                                        {this.props.t('construction_catalog.sorting_descending_rating_order')}
                                    </Dropdown.Item>
                                </DropdownButton>
                            </div>
                        </div>
                        <div className='catalog-goods'>
                            <ListGroup>
                                {
                                    this.state.current_constructions.map(k =>
                                        <ListGroup.Item>
                                            <div className='catalog-good'>
                                                <div className='catalog-good-name'>
                                                    <NavLink to={'/construction_catalog/' + k.id}
                                                             className='good-link-from-catalog'>
                                                        {k.name}
                                                    </NavLink>
                                                </div>
                                                <div className='catalog-good-image'>
                                                    <img className='catalog-image' src={k.image} />
                                                </div>
                                                <div className='catalog-good-parameters'>
                                                    <div>
                                                        {this.props.t('construction_catalog.type')}: {k.type}
                                                    </div>
                                                    <div>
                                                        {this.props.t('construction_catalog.rating')}: {k.rating}
                                                    </div>
                                                </div>
                                                <div className='catalog-good-description'>
                                                    {k.description.substr(0, 500)}
                                                </div>
                                            </div>
                                        </ListGroup.Item>
                                    )
                                }
                            </ListGroup>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default withTranslation()(ConstructionCatalog);