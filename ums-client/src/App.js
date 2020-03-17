import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter, Route } from 'react-router-dom';
import Secured from './Secured';
import './App.css';
import Welcome from "./Welcome";

const TITLE = 'UMS';

/**
 * This provides a router to the welcome page, profile view, and
 * edit users page. It is the application root.
 *
 * @author J.R. Diehl
 * @version 0.1
 */
class App extends Component {
    render() {
        return (
            <>
                <Helmet>
                    <title>{ TITLE }</title>
                </Helmet>
                <BrowserRouter basename={process.env.PUBLIC_URL}>
                  <div>
                    <Route exact path="/" render={(props) =>
                        <Welcome />
                    } />
                    <Route path='/profile' render={(props) =>
                        <Secured />
                    } />
                    <Route path='/users' render={(props) =>
                        <Secured />
                    } />
                  </div>
                </BrowserRouter>
            </>
        );
    }
}
export default App;
