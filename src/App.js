import './App.css';
import Header from './Components/Header/Header';
import React, {useState} from 'react';
import RegistrationForm from './Components/Body/Authentication/RegistrationForm';
import AuthorizationForm from './Components/Body/Authentication/AuthorizationForm';
import ComponentCatalog from './Components/Body/Catalogs/ComponentCatalog'
import Component from './Components/Body/Catalogs/Component'
import ConstructionCatalog from './Components/Body/Catalogs/ConstructionCatalog'
import Construction from './Components/Body/Catalogs/Construction'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import NewConstructionFromOldOnes from './Components/Body/NewConstructionFromOldOnes/NewConstructionFromOldOnes';
import LanguageButton from './Components/Body/General/ChangeLanguageButton';
import RegistrationButton from './Components/Body/General/RegistrationButton';
import AuthorizationButton from './Components/Body/General/AuthorizationButton';
import ExitButton from './Components/Body/General/ExitButton';
import CartButton from './Components/Body/General/CartButton';
import AdminButton from './Components/Body/General/AdminButton';
import Cart from './Components/Body/General/Cart';
import i18next from 'i18next';
import axios from 'axios';

function App() {
    const specifyCurrentLanguage = () => {
        let usedLanguage = localStorage.getItem('sfc-language');
        if (!usedLanguage) {
            localStorage.setItem('sfc-language', 'ua');
            usedLanguage = 'ua';
        }
        i18next.changeLanguage(usedLanguage);
    }

    const verifyUser = (authFunction) => {
        let current_access_token = localStorage.getItem('sfc_token');
        if (!current_access_token) {
            authFunction(false);
            return;
        }
        axios(
            {
                method: 'post',
                url: 'http://192.168.0.104:9595/auth/jwt/verify/',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    'token': localStorage.getItem('sfc_token')
                }
            }
        )
            .then(() => {
                authFunction(true)
            })
            .catch(
                (e) => {
                    authFunction(false)
                }
            )
    }

    const refreshJWT = () => {
        axios(
            {
                method: 'post',
                url: 'http://192.168.0.104:9595/auth/jwt/refresh/',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    'refresh': localStorage.getItem('sfc_refresh')
                }
            }
        )
            .then(res => {
                localStorage.setItem('sfc_token', 'None')
                return res.data['access'];
            })
    }

    const [authorized, setAuthorized] = useState(false);

    verifyUser(setAuthorized);
    specifyCurrentLanguage();

  return (
      <div>
          <div>
              <LanguageButton />
              <BrowserRouter>
                  <Route component={() =>
                      <Header
                          interfaceLanguage=
                              {specifyCurrentLanguage} />}
                         path='/' />
                  <div id='app-wrapper'>
                      <Route exact component={() =>
                          <RegistrationForm
                              interfaceLanguage=
                                  {specifyCurrentLanguage} />}
                             path='/registration' />
                      <Route exact component={() =>
                          <AuthorizationForm
                              changeAuthState={setAuthorized}
                              interfaceLanguage=
                                  {specifyCurrentLanguage} />}
                             path='/authorization' />
                      <Route exact component={() =>
                          <ComponentCatalog
                              interfaceLanguage=
                                  {specifyCurrentLanguage} />}
                             path='/component_catalog' />
                      <Route component={() =>
                          <Component authStatus={authorized}
                                     interfaceLanguage=
                                         {specifyCurrentLanguage} />}
                             path='/component_catalog/:id' />
                      <Route exact component={() =>
                          <ConstructionCatalog
                              interfaceLanguage=
                                  {specifyCurrentLanguage} />}
                             path='/construction_catalog' />
                      <Route component={() =>
                          <Construction
                              authStatus={authorized}
                              interfaceLanguage=
                                  {specifyCurrentLanguage} />}
                             path='/construction_catalog/:id' />
                      <Route exact path='/' >
                          <Redirect to='/component_catalog' />
                      </Route>
                      <Route exact component={() =>
                          <NewConstructionFromOldOnes
                              interfaceLanguage=
                                  {specifyCurrentLanguage} />}
                             path='/new_construction_from_old_ones' />
                      {
                          !authorized &&
                          <Route exact
                                 component={AuthorizationButton}
                                 path='' />
                      }
                      {
                          !authorized &&
                          <Route exact
                                 component={RegistrationButton}
                                 path='' />
                      }
                      {
                          authorized &&
                          <Route exact
                                 component={CartButton}
                                 path='' />
                      }
                      {
                          authorized &&
                          <Route exact component={() =>
                              <ExitButton
                                  changeAuthState={setAuthorized}
                                  logOutRequest={refreshJWT} />}
                                 path='' />}
                      {
                          authorized &&
                          <Route exact
                                 component={AdminButton}
                                 path='' />
                      }
                      <Route exact component={() =>
                          <Cart interfaceLanguage=
                                    {specifyCurrentLanguage} />}
                             path='/cart' />
                  </div>
              </BrowserRouter>
          </div>
      </div>
  );
}

export default App;