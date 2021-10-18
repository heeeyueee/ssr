import axios from 'axios'
import { CHANGE_LIST } from './contants'
import clientAxios from '../../../client/request'
import serverAxios from '../../../server/request'

const changeList = (list) => ({
    type: CHANGE_LIST,
    list
})
export const getHomeList = (server) => {
    const request = server ? serverAxios : clientAxios
    return (dispatch) => {
        return request.get("/records?userId=60f7df240752ba645efe0fba")
            .then((res) => {
                const list = res.data
                dispatch(changeList(list))
            })
    }
}