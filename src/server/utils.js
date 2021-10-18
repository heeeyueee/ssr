import { renderToString } from 'react-dom/server'
import { StaticRouter, Route } from 'react-router-dom'
import React from 'react'
import { Provider } from 'react-redux'
import { renderRoutes } from 'react-router-config';

export const render = (req, store, routes) => {
    // const store = getStore()
    //中间进行操作，那到异步的数据，并填充到store上
    //但需要根据用户访问的路径，来填充组件相应的异步数据
    //如果访问/login，我们就填充login组件所需要的内容
    //这就需要填充改编路由
    //然后根据路由的路径，往store里面加数据
    //利用 routes.some方法要找到用户请求路由要加载的组件存到matchRoutes数组中，然后再加载组件的loadData方法改变store
    //[ { path: '/login', component: [Function: Login], key: 'login' } ]
    //matchPath只能匹配到最初的路径，考虑到多级嵌套路由，使用react-router-config中的 matchRoutes
    // const matchedRoutes = matchRoutes(routes, req.path);
    // routes.some(route => {
    //     // use `matchPath` here
    //     const match = matchPath(req.path, route);
    //     if (match) matchRoutes.push(route);

    // });
    //让matchRoutes里面所有的组件对应的loadData方法执行一次
    //因为是异步数据，所以要通过promise来拿到结果
    // const promises = []
    // matchedRoutes.forEach(item => {
    //     if (item.route.loadData) {
    //         promises.push(item.route.loadData(store))
    //     }
    // });
    const content = renderToString((
        <Provider store={store}>
            <StaticRouter location={req.path} context={{}}>
                {/* {routes.map(route => (
                    <Route {...route} />
                ))} */}
                {/* 多级路由改用renderRoutes方法 */}
                <div>
                    {renderRoutes(routes)}
                </div>
            </StaticRouter>
        </Provider>
    ))
    return `<html><head>
        <title>ssr</title>
        </head>
        <body>
        <div id="root">${content}</div>
        <script>
        window.context={
            state:${JSON.stringify(store.getState())}
        }
        </script>
        <script src="/index.js"></script>
        </body></html>`

}

