import React, { useState } from 'react';
import {Form, Button, Modal} from 'react-bootstrap';
import axios from 'axios';
import { withTranslation } from 'react-i18next';

const RegistrationForm = (props) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState(false);

    const componentWillMount = () => {
        props.interfaceLanguage();
    }

    const handleForm = event => {
        event.preventDefault();
        let errorCount = 0;
        axios(
            {
                method: 'post',
                url: 'http://192.168.0.104:9595/auth/users/',
                data: {
                    'username': username,
                    'password': password,
                    're_password': password
                }
            }
        ).catch( error => {
                const {data} = error.response;
                console.log(data);
                errorCount++;
            }
        ).finally (k => {
                if (!errorCount) {
                    setSuccess(true);
                }
            }
        );
    }

    const handleSuccessModalClose = () => {
        setSuccess(false);
    }

    return (
        <div className='auth_container'>
            <div className='page_title'>
                {props.t('authentication.registration')}
            </div>
            <Form onSubmit={handleForm}>
                <Form.Group controlId='registerFormUserName'>
                    <Form.Label>{props.t('authentication.login')}</Form.Label>
                    <Form.Control type='text'
                                  placeholder={props.t('authentication.login_register_placeholder')}
                                  onChange={event => setUsername(event.target.value)}
                                  required />
                    <Form.Text className='error-message'>

                    </Form.Text>
                </Form.Group>

                <Form.Group controlId='registerFormPassword'>
                    <Form.Label className='auth-labels'>{props.t('authentication.password')}</Form.Label>
                    <Form.Text className='auth-tip'>
                        <div>
                            {props.t('authentication.password_requirements')}
                        </div>
                    </Form.Text>
                    <Form.Control
                        type='password'
                        placeholder={props.t('authentication.password_register_placeholder')}
                        onChange={event => setPassword(event.target.value)}
                        className='auth-control'
                        required />
                    <Form.Text className='error-message'>

                    </Form.Text>
                </Form.Group>

                <Form.Group controlId='registerFormRepeatPassword'>
                    <Form.Label>{props.t('authentication.re_password')}</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder={props.t('authentication.re_password_placeholder')}
                        required />
                </Form.Group>
                <Form.Text className='error-message'>

                </Form.Text>

                <Button variant='dark' type='submit' className='auth-button'>
                    {props.t('authentication.register')}
                </Button>
            </Form>
            <Modal show={success}
                   onHide={handleSuccessModalClose} animation={true}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.t('authentication.successful_register_title')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{props.t('authentication.successful_register_message')}</Modal.Body>
                <Modal.Footer>
                    <Button variant='success' onClick={handleSuccessModalClose}>
                        {props.t('authentication.successful_register_confirmation')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default withTranslation()(RegistrationForm);