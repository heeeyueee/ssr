import React, { useEffect } from 'react'
import Header from './../../components/Header';
import { connect } from 'react-redux'
import { getHomeList } from './store/actions'

const Home = (props) => {

    useEffect(() => {
        if (!props.list.length) {
            props.getHomeList()
        }
    }, [])
    const getList = () => {
        const { list } = props
        return list.map((item) => { return <li key={item._id}>{item.amount}</li> })
    }
    return <div>
        <Header />
        <div>
            Home,{props.name}
        </div>
        {getList()}
        <button onClick={() => { alert("点击了") }}>button</button>
    </div>
}
const mapStateToProps = state => ({
    list: state.home.newsList,
    name: state.home.name
})
const mapDispatchToProps = dispatch => ({
    getHomeList() {
        dispatch(getHomeList(false))//客户端渲染传入false
    }

})
Home.loadData = (store) => {
    //这个函数负责在服务端渲染之前，把这个路由需要的数据提前加载好
    return store.dispatch(getHomeList(true))//只有这个是服务器渲染时在服务器端运行的传入true
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);
