# SSR

## 初始化

* 新建文件夹

  ```
  yarn init
  ```

* 安装服务器端框架express

  ```
  yarn add express
  ```

* 要在服务端运行react实现SSR，安装react、react-dom

  ```
  yarn add react react-dom
  ```

## webpack配置

> 因为node无法直接运行react，需要借助webpack

* 安装

  ```
  yarn add webpack
  ```

* 根目录下新建webpack配置文件webpack.server.js

  ```js
  const path = require("path")
  const nodeExternals = require("webpack-node-externals")
  module.exports = {
      target: "node",
      mode: "development",
      entry: "./src/index.js",
      output: {
          filename: "bundle.js",
          path: path.resolve(__dirname, "build")//打包后输出的目录
  
      },
      externals: [nodeExternals()],
      module: {
          rules: [
              {
                  test: /\.js?$/,
                  loader: 'babel-loader',
                  exclude: /node_modules/,
                  options: {
                      presets: ["react", "stage-0", ["env", {//babel 需要配置preset
                          targets: {
                              browsers: ["last 2 versions"]//兼容浏览器的最新两个版本
                          }
                      }]]
                  }
  
              }
          ]
      }
  
  }
  ```

* 打包命令

  ```
  ./node_modules/.bin/webpack --config webpack.server.js
  ```

  > 没有全局安装 webpack 找不到命令

* 配置出错 

  解决=>https://blog.csdn.net/weixin_39475476/article/details/88044803

## React编译运行

* 借助react-dom中的 renderToString方法实现

```js
const content = renderToString(<Home />)
app.get('/', (req, res) => {
    res.send(`<html><head>
    <title>ssr</title>
    </head>
    <body>
    ${content}
    </body></html>`)
})
```

## 自动更新

* webpack打包命令有--watch 支持自动观察入口文件的饿变更以及依赖更新打包

```
"./node_modules/.bin/webpack --config webpack.server.js --watch"
```

* 服务器自动重启安装nodemon

```js
yarn add nodemon
```

* 安装npm-run-all在一个窗口中并行执行两个任务

```
    "dev": "npm-run-all --parallel dev:**",
    "dev:start": "nodemon --watch build --exec node \"./build/bundle.js\"",
    "dev:build": "./node_modules/.bin/webpack --config webpack.server.js --watch"
```

## 同构

因为服务端只是渲染html标签等，js交互方面的代码仍要浏览器运行js

一套代码，在服务器端执行一次，在客户端再执行一次

```js
app.use(express.static("public"))
app.get('/', (req, res) => {
    res.send(`<html><head>
    <title>ssr</title>
    </head>
    <body>
    ${content}
    <script src="/index.js"></script>
    </body></html>`)
})
```

在服务端返回的html中加上 script标签请求要执行的静态文件，利用express的static方法让请求的静态文件的请求都去public文件夹

但我们的react代码也不能直接在浏览器上运行，也要经过webpack打包配置，所以基于客户端运行的代码进行打包成js(之前的前端模式)

* 在src目录下新建client文件夹

  ```js
  import React from 'react'
  import ReactDom from 'react-dom'
  import Home from '../containers/Home/index'
  ReactDom.hydrate(<Home />, document.getElementById("root"))
  ```

* 配置客户端的webpack配置文件 webpack.client.js

  去掉node的相关的配置，把入口文件和出口文件进行修改

  ```js
  const path = require("path")
  
  module.exports = {
      mode: "development",
      entry: "./src/client/index.js",
      output: {
          filename: "index.js",
          path: path.resolve(__dirname, "public")
  
      },
      module: {
          rules: [
              {
                  test: /\.js?$/,
                  loader: 'babel-loader',
                  exclude: /node_modules/,
                  options: {
                      presets: ["react", "stage-0", ["env", {
                          targets: {
                              browsers: ["last 2 versions"]
                          }
                      }]]
                  }
              }
          ]
      }
  
  }
  ```

  > 两个webpack配置文件太多相似 使用webpack-merge来合并复用

<img src="C:\Users\heeeyueee\AppData\Roaming\Typora\typora-user-images\image-20211014184635851.png" alt="image-20211014184635851" style="zoom:57%;" />

## 路由机制

<img src="C:\Users\heeeyueee\AppData\Roaming\Typora\typora-user-images\image-20211014185045234.png" alt="image-20211014185045234" style="zoom:57%;" />

> 图中是客户端渲染的机制

### StaticRouter

和浏览器中使用BrowserRouter不同，服务器端使用StaticRouter

* 安装 react-router-dom

  ```
  yarn add  react-router-dom
  ```

* 新建Routes.js文件来声明路由

  ```js
  export default (
      <div>
          <Route path="/" exact component={Home}></Route>
          <Route path="/login" exact component={Login}></Route>
      </div>
  )
  ```

* 客户端使用BrowserRouter

  和之前学习的一样

  ```js
  import { BrowserRouter } from 'react-router-dom'
  const App = () => {
      return (
          <BrowserRouter>
              {Routes}
          </BrowserRouter>
      )
  }
  ReactDom.hydrate(<App />, document.getElementById("root"))
  ```

* 服务端

  使用StaticRouter,因为react代码在服务端运行时无法知道浏览器的url的所以要通过req来知道路径匹配对应的路由

  **所以，只有在刷新直接url请求时才会触发服务器渲染，其他通过浏览器的history模式是不会发生请求的，也就不会发生SSR**

  ```js
      const content = renderToString((
          <StaticRouter location={req.path} context={{}}>
              {Routes}
          </StaticRouter>
      ))
  ```

  

## SSR框架与Redux的结合

node中间层来拼接页面和数据返回给浏览器，要负责node服务器的运维

### 异步数据客户端渲染

* 安装redux，react-redux

```js
yarn add redux react-redux react-thunk
```

* 各个主组件中都有各自的reducer

  目录结构

  ```js
  ---Home
     --store
       --index.js
       --reducer.js
       --actions.js
       --contants.js
  ```

  在主store中进行合并

  ```js
  const reducer = combineReducers({
      home: homeReducer
  })
  ```

  结合redux-thunk来保存异步数据等等……相当于复习了之前的redux

  至此，客户端的Redux保存数据完成

<img src="C:\Users\heeeyueee\AppData\Roaming\Typora\typora-user-images\image-20211015135456913.png" alt="image-20211015135456913" style="zoom:67%;" />

上面是客户端渲染，结合Redux获取异步网络请求到的数据

👉👉👉**服务端渲染要解决的问题要实现componentDidMount相似的功能来在服务端执行请求拿到数据再拼接到页面中**

### 异步数据服务器渲染： loadData方法及路由重构

 **react-router-dom官方教程：**  https://reactrouter.com/web/guides/server-rendering/data-loading

> 我们相信路由器能够适应应用程序的约束条件。主要的约束是您希望在呈现之前加载数据。React Router 导出默契路径静态函数，它在内部使用这个函数来匹配路由的位置。可以在服务器上使用此函数来帮助确定呈现之前的数据依赖关系。这种方法的要点依赖于一个静态路由配置，它既用于呈现路由，也用于在呈现之前进行匹配，以确定数据依赖关系。

* 在服务端通过Provider注入store之前进行操作，拿到异步的数据，并填充到store上

* 也是减少服务器负担，会根据用户访问的路径，来填充组件相应的异步数据，react-router-dom官网中有matchPath来帮助我们拿到路由对应要加载的组件

* matchPath只能匹配到最初的路径，考虑到多级嵌套路由，使用react-router-config中的 matchRoutes

  https://github.com/remix-run/react-router/tree/main/packages/react-router-config react-router-config官网

  ```js
  const matchedRoutes = matchRoutes(routes, req.path);
  //请求/根路径打印
  //[
  //  {
  //    route: {
  //      path: '/',
  //      component: [Object],
  //      exact: true,
  //      loadData: [Function (anonymous)],
  //      key: 'home'
  //    },
  //    match: { path: '/', url: '/', isExact: true, params: {} }
  //  }
  //]
  ```

* 从打印的信息中可以看到组件的loadData方法，这个函数正是负责在服务端渲染之前，把这个组件需要的数据提前加载好

  Home组件中

  ```js
  Home.loadData = (store) => {
      //这个函数负责在服务端渲染之前，把这个路由需要的数据提前加载好
      return store.dispatch(getHomeList())//返回promise
  }
  ```

* 让matchRoutes里面所有的组件对应的loadData方法执行一次

  因为是异步数据所以也改写了actions（返回promise）

  ```js
  const promises = []
      matchedRoutes.forEach(item => {
          if (item.route.loadData) {
              promises.push(item.route.loadData(store))
          }
      });
  ```

* 使用all方法执行所有要请求数据promise（store就会更新）,然后进行拼接

  ```js
   Promise.all(promises).then(() => {
          console.log(store.getState());
          const content = renderToString((
              <Provider store={store}>
                  <StaticRouter location={req.path} context={{}}>
                      {routes.map(route => (
                          <Route {...route} />
                      ))}
                  </StaticRouter>
              </Provider>
          ))
          res.send(`<html><head>
          <title>ssr</title>
          </head>
          <body>
          <div id="root">${content}</div>
          <script src="/index.js"></script>
          </body></html>`)
      })
  
  ```

* 对写法进行优化，store相关和返回的模板进行分离

### 数据的脱水和注水

发现刷新页面发现数据部分会先白屏再显示，是因为加载的是客户端的store在组件挂载之前（componentDidMount之前)仍是空的

**解决方法：让客户端的store初始State为服务器中store，这样store就不用再通过componentDidMount再一次加载数据**

* 服务端通过在window上添加state属性注水

  ```js
  <script>
          window.context={
              state:${JSON.stringify(store.getState())}
          }
   </script>
  ```

* 客户端的store脱水

  ```js
  export const getClientStore = () => {
      const defaultState = window.context.state
      return createStore(reducer, defaultState, applyMiddleware(thunk))
  }
  
  const store = getClientStore()
  ```

  👏👏👏注意componentDidMount中请求异步数据仍然要保留，因为SSR只是在刷新真正的url请求时才进行，如果第一次请求的页面没有异步的store数据还是得通过浏览器异步网络请求加载。但如果服务器端加载了，componentDidMount就可以不加载了

  ```js
  useEffect(() => {
          if (!props.list.length) {//条件判断
              props.getHomeList()
          }
      }, [])
  ```

  

## Node作为数据获取中间层

> ❌可以看到之前客户端在componentDidMount里面发出得请求都是直接发送到java等服务端，没有经过node中间层，这样出错了很难找到问题，所以我们让node中间层来做代理，让客户端得网络请求都通过node中间层获取

* 安装express-http-proxy 

  GitHub链接：https://github.com/villadora/express-http-proxy

  ```
  yarn add express-http-proxy
  ```

* 运行在node中间层的服务端渲染代码还是向真正的后端server请求数据，而客户端的请求都通过node中间层做代理

  通过使用express-http-proxy来添加一个代理中间件

  ```
  app.use("/records", proxy('http://39.96.56.146:9000', {
      proxyReqPathResolver: function (req) {
  
          return '/records' + req.url
      }
  }));
  ```

* 这样我们的dispatch时就要分为在node中间层做服务端渲染时和客户端渲染时请求

  下图是简写方法

  

<img src="C:\Users\heeeyueee\AppData\Roaming\Typora\typora-user-images\image-20211015212914280.png" alt="image-20211015212914280" style="zoom:67%;" />

要传入一个server参数来判断是不是服务器发请求

<img src="C:\Users\heeeyueee\AppData\Roaming\Typora\typora-user-images\image-20211015220749185.png" alt="image-20211015220749185" style="zoom:67%;" />

我们可以通过axios的instance创建两个不同的实例

```
 const request = server ? serverAxios : clientAxios
    return (dispatch) => {
        return request.get("/records?userId=60f7df240752ba645efe0fba")
            .then((res) => {
                const list = res.data
                dispatch(changeList(list))
            })
    }
```

### 优化写法使用withExtraArgument

https://github.com/reduxjs/redux-thunk#injecting-a-custom-argument

> 从字面意思就可以了解创建store添加react-thunk中间键的时候可以有额外的参数

服务端和客户端请求异步数据在创建store的时候就区分开来



