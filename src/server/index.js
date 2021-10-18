import express from 'express'
import { render } from './utils'
import { matchRoutes, renderRoutes } from "react-router-config";
import { getStore } from './../store/index';
import routes from '../Routes'
import proxy from 'express-http-proxy'
const app = express()
const port = 3000

app.use(express.static("public"))
//http://39.96.56.146:9000/records?userId=60f7df240752ba645efe0fba
app.use("/records", proxy('http://39.96.56.146:9000', {
    proxyReqPathResolver: function (req) {

        return '/records' + req.url
    }
}));
app.get('*', (req, res) => {
    const store = getStore()
    const matchedRoutes = matchRoutes(routes, req.path);
    const promises = []
    matchedRoutes.forEach(item => {
        if (item.route.loadData) {
            promises.push(item.route.loadData(store))
        }
    });
    Promise.all(promises).then(() => {
        res.send(render(req, store, routes))
    })

})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})