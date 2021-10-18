import React, { useEffect } from 'react'
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
        dispatch(getHomeList())//客户端渲染传入false
    }

})
Home.loadData = (store) => {
    //这个函数负责在服务端渲染之前，把这个路由需要的数据提前加载好
    return store.dispatch(getHomeList())//只有这个是服务器渲染时在服务器端运行的传入true
    //使用react-thunk的withExtraArgument方法后就不需要传参了，直接在store创建的时候改变
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);
