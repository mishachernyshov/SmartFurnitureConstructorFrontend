import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { withTranslation } from 'react-i18next';

const AuthorizationForm = (props) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [status, getStatus] = useState(true);
    const history = useHistory();

    const componentWillMount = () => {
        props.interfaceLanguage();
    }

    const routeChange = () =>{
        let path = 'component_catalog';
        history.push(path);
    }

    const handleForm = event => {
        event.preventDefault();
        let success = true;
        axios(
            {
                method: 'post',
                url: 'http://192.168.0.104:9595/auth/jwt/create/',
                data: {
                    'username': username,
                    'password': password
                }
            }
        )
            .then( res => {
                localStorage.setItem('sfc_token', res.data.access);
                localStorage.setItem('sfc_refresh', res.data.refresh);
                getStatus(true);
            })
            .catch( error => {
                const {data} = error.response;
                console.log(data);
                getStatus(false);
                success = false;
            }
        )
            .finally(k => {
                if (success) {
                    props.changeAuthState(true);
                    routeChange();
                }
            });
    }

    return (
        <div className='auth_container'>
            <div className='page_title'>
                {props.t('authentication.authorization')}
            </div>
            <Form onSubmit={handleForm}>
                <Form.Group controlId='loginFormUserName'>
                    <Form.Label>{props.t('authentication.login')}</Form.Label>
                    <Form.Control type='text'
                                  placeholder={props.t('authentication.login_log_in_placeholder')}
                                  onChange={event => setUsername(event.target.value)}
                                  required />
                </Form.Group>

                <Form.Group controlId='loginFormPassword'>
                    <Form.Label>{props.t('authentication.password')}</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder={props.t('authentication.password_log_in_placeholder')}
                        onChange={event => setPassword(event.target.value)}
                        required />
                </Form.Group>
                <Form.Text className='error-message' id='auth-incorrect'>
                    {
                        !status && props.t('authentication.error_message')
                    }
                </Form.Text>
                <Button variant='dark' type='submit' className='auth-button'>
                    {props.t('authentication.log_in')}
                </Button>
            </Form>
        </div>
    )
}

export default withTranslation()(AuthorizationForm);