import successImage from './images/success.png'
import { Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const FinishRegistration = () => {
    return (
        <div>
            <div>
                <img src={successImage} />
            </div>
            <div>
                Реєстрацію успішно завершено. Тепер Ви маєте можливість авторизуватися
            </div>
            <div>
                <NavLink to='/authorization' >
                    <Button variant='primary'>Авторизуватися</Button>
                </NavLink>
            </div>
        </div>
    );
}

export default FinishRegistration;