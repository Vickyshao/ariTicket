import Vue from 'vue'
import Vuex from 'vuex'
import search from './search'
import dialog from './dialog'
import modal from './modal'
import duoPage from './duoPage'
import list from './list'
import returnList from './returnList'
import searchDetail from './searchDetail'
import returnSearchDetail from './returnSearchDetail'
import orderList from './orderList'
import orderDetail from './orderDetail'
import order from './order'
import error from './error'
import invoice from './invoice'
import city from './city'
import ticketChange from './ticketChange'
import changeFlyList from './changeFlyList'
import flightInfo from './flightInfo'

Vue.use(Vuex);
export default new Vuex.Store({
    modules: {
      search,                 //首页查询
      dialog,
      modal,
      duoPage,
      list,                   //预订列表页
      returnList,             //返程预订列表页
      searchDetail,           //预订详情页
      returnSearchDetail,     //返程预订详情页
      orderList,              //我的订单列表
      orderDetail,            //订单详情
      order,
      error,
      invoice,                //发票
      city,                   //城市选择
      ticketChange,           //机票改签
      changeFlyList,
      flightInfo,             //航班动态
    }
})
