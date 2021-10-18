import React from 'react'
import Header from '../../components/Header'
const Login = () => {
    return <div>
        <Header />
        <div>
            Home,Helix
        </div>
        <button onClick={() => { alert("点击了") }}>Login</button>
    </div>
}
export default Login