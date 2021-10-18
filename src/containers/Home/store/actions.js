import { CHANGE_LIST } from './contants'

const changeList = (list) => ({
    type: CHANGE_LIST,
    list
})
export const getHomeList = () => {
    return (dispatch, getState, axiosInstance) => {
        return axiosInstance.get("/records?userId=60f7df240752ba645efe0fba")
            .then((res) => {
                const list = res.data
                dispatch(changeList(list))
            })
    }
}