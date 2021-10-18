import { CHANGE_LOGIN_STATUS } from './contants'

export const changeLoginStatus = (status) => ({
    type: CHANGE_LOGIN_STATUS,
    status
})