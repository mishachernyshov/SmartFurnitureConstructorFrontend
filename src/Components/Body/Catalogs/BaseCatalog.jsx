import React, { Component } from 'react';

class BaseCatalog extends Component {

    getCheckedItemsArray = (arr) => {
        let resultArray = [];
        for (let k of arr) {
            if (document.getElementById(k).checked) {
                resultArray.push(k);
            }
        }
        return resultArray;
    }

    setDefaultRateValue = (pageElement) => {
        if (pageElement.value < 1) {
            pageElement.value = 1;
        } else if (pageElement.value > 10) {
            pageElement.value = 10;
        }
    }

    checkRatingValue = () => {
        const minRate = document.getElementById('component_rate_min');
        const maxRate = document.getElementById('component_rate_max');
        this.setDefaultRateValue(minRate);
        this.setDefaultRateValue(maxRate);
    }

    catalogItemsSort = (sortType, sortObject) => {
        if (sortType === this.props.t('component_catalog.sorting_order_by_name')) {
            sortObject.sort(this.nameComparator);
        } else if (sortType === this.props.t('component_catalog.sorting_ascending_rating_order')) {
            sortObject.sort(this.rateAscendingComparator);
        } else if (sortType === this.props.t('component_catalog.sorting_descending_rating_order')) {
            sortObject.sort(this.rateDescendingComparator);
        }
    }

    setDropdownItem = (event) => {
        document.getElementById('component_sort_menu').innerText = event.target.text;
        this.catalogItemsSort(event.target.text, this.state.current_components);
        this.setState(this.state);
    }

    rateAscendingComparator = (object1, object2) => {
        return object1.rating - object2.rating;
    }

    rateDescendingComparator = (object1, object2) => {
        return object2.rating - object1.rating;
    }

    nameComparator = (object1, object2) => {
        const name1 = object1.name;
        const name2 = object2.name;
        if (name1 > name2) {
            return 1;
        } else if (name1 === name2) {
            return 0;
        }
        return -1;
    }

    itemSearch(itemArray) {
        let text = document.getElementById('componentCatalogSearchForm')
            .value.toLowerCase();
        let foundItems = [];
        for (let k of itemArray) {
            if (k.name.toLowerCase().search(text) !== -1) {
                foundItems.push(k);
            }
        }

        this.catalogItemsSort(document.getElementById('component_sort_menu').innerText, foundItems);

        return foundItems;
    }
}

export default BaseCatalog;