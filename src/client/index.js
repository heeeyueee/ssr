import React from 'react'
import ReactDom from 'react-dom'
import routes from '../Routes'
import { BrowserRouter, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { getClientStore } from './../store/index';
const store = getClientStore()
const App = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                {routes.map(route => (
                    <Route {...route} />
                ))}
            </BrowserRouter>
        </Provider>
    )
}
ReactDom.hydrate(<App />, document.getElementById("root"))