import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { changeLoginStatus } from './store/actions';
const Header = (props) => {
    const handleLogin = () => {
        props.changeLoginStatus(true)
    }
    const handleLogout = () => {
        props.changeLoginStatus(false)
    }
    return <div>
        <Link to="/">首页</Link>
        <br />
        {
            props.status ? (<Fragment><Link to="/login">money数据</Link>
                <div onClick={handleLogout}>退出</div></Fragment>) : <div onClick={handleLogin}>登录</div>
        }
    </div>
}
const mapStateToProps = state => ({
    status: state.header.login

})
const mapDispatchToProps = dispatch => ({
    changeLoginStatus(status) {
        dispatch(changeLoginStatus(status))
    }

})
export default connect(mapStateToProps, mapDispatchToProps)(Header);