import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';

class ChangeLanguageButton extends Component {
    changeLanguage = () => {
        let usedLanguage = localStorage.getItem('sfc-language');
        if (usedLanguage === 'ua') {
            usedLanguage = 'en';
        } else {
            usedLanguage = 'ua';
        }
        localStorage.setItem('sfc-language', usedLanguage);
        this.props.i18n.changeLanguage(usedLanguage);
        document.getElementById('language_btn').innerText =
            usedLanguage.toUpperCase();
    }

    render() {
        let languageName = localStorage.getItem('sfc-language').toUpperCase();
        return (
            <Button variant='dark' onClick={this.changeLanguage}
                    id='language_btn'>
                {languageName}
            </Button>
        )
    }
}

export default withTranslation()(ChangeLanguageButton)