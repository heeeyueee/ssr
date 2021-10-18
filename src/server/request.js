import axios from 'axios'
const createInstance = (req) => axios.create({
    baseURL: "http://39.96.56.146:9000",
    headers: {
        cookie: req.get("cookie") || ""
    }
});
export default createInstance
