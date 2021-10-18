import React from 'react'
import { Route } from 'react-router-dom'
import Home from './containers/Home'
import Login from './containers/Login/index';
import App from './App'
export default [{
    path: "/",
    component: App,
    routes: [{
        path: "/",
        component: Home,
        exact: true,
        loadData: Home.loadData,
        key: "home",
    },
    {
        path: "/login",
        component: Login,
        key: "login"

    }]

}]

