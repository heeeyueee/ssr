import axios from 'axios'
const instance = axios.create({
    baseURL: "http://39.96.56.146:9000"
});
export default instance
