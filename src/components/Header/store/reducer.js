import { CHANGE_LOGIN_STATUS } from "./contants"

const defaultState = {
    login: true
}
export default (state = defaultState, action) => {
    switch (action.type) {
        case CHANGE_LOGIN_STATUS:
            return {
                ...state,
                login: action.status
            }
        default:
            return state
    }

}