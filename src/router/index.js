import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import City from '@/views/City'
import Detail from '@/views/Detail'
import Order from '@/views/Order'
import List from '@/views/List'
import ReturnList from '@/views/ReturnList'
import ReturnDetail from '@/views/ReturnDetail'
import OrderList from '@/views/OrderList'
import OrderDetail from '@/views/OrderDetail'
import SeleAddress from '@/views/SeleAddress'
import AddAddress from '@/views/AddAddress'
import EditorAddress from '@/views/EditorAddress'
import NewInvoice from '@/views/NewInvoice'
import EditorInvoice from '@/views/EditorInvoice'
import AddMan from '@/views/AddMan'
import EditorMan from '@/views/EditorMan'
import Error from '@/views/err404'
import TicketNotes from '@/views/TicketNotes'
import InsuranceContract from '@/views/InsuranceContract'
import RequestRefund from '@/views/RequestRefund'
import LithiumBattery from '@/views/LithiumBattery'
import CreditRules from '@/views/CreditRules'
import PurchaseTicket from '@/views/PurchaseTicket'
import TicketChange from '@/views/TicketChange'
import ChangeFlyList from '@/views/ChangeFlyList'
import ChangeOrderList from '@/views/ChangeOrderList'
import ChangeOrderDetail from '@/views/ChangeOrderDetail'
import ChangeProcess from '@/views/ChangeProcess'
import TicketStep from '@/views/TicketStep'
import CompInvoicing from '@/views/CompInvoicing'
import FlightStatus from '@/views/FlightStatus'
Vue.use(Router)

// const router={
//
// };
// // 全局配置
// router.beforeEach((to, from, next) => {
//   // Change doc title
//   document.title = to.meta.title || 'Unknow title'
//   document.querySelector('meta[name="keywords"]').setAttribute('content', 'keywords')
//   document.querySelector('meta[name="description"]').setAttribute('content', 'description')
// })
export default new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        redirect: '/Home',
      },
      {
        path: '/Home',
        name: 'home',
        component: Home,
      },
      {
        path: '/City',
        name: 'city',
        component: City
      },
      //预订详情页
      {
        path: '/Detail',
        name: 'detail',
        component: Detail
      },
      //下单页
      {
        path: '/Order',
        name: 'order',
        component: Order
      },
      //去程或单程预订列表页
      {
        path: '/List',
        name: 'list',
        component: List
      },
      //返程预订列表页
      {
        path:'/ReturnList',
        name:'returnlist',
        component:ReturnList
      },
      //返程预订详情页
      {
        path:'/ReturnDetail',
        name:'returndetail',
        component:ReturnDetail
      },
      //我的订单列表
      {
        path:'/OrderList',
        name:'orderlist',
        component:OrderList
      },
      {
        path:'/OrderDetail',
        name:'orderdetail',
        component:OrderDetail
      },
      {
        path: '/SeleAddress',
        name: 'seleAddress',
        component: SeleAddress
      },
      {
        path: '/AddAddress',
        name: 'addAddress',
        component: AddAddress
      },
      {
        path: '/EditorAddress',
        name: 'editorAddress',
        component: EditorAddress
      },
      {
        path: '/AddMan',
        name: 'addMan',
        component: AddMan
      },
      {
        path: '/EditorMan',
        name: 'editorMan',
        component: EditorMan
      },

      {
        path:'/NewInvoice',
        name:'newInvoice',
        component: NewInvoice
      },
      {
        path:'/EditorInvoice',
        name:'editorInvoice',
        component: EditorInvoice
      },
      {
        path:'/Error',
        name:'error',
        component: Error
      },
      {
        path:'/TicketNotes',
        name:'ticketNotes',
        component: TicketNotes
      },
      {
        path:'/InsuranceContract',
        name:'insuranceContract',
        component: InsuranceContract
      },
      //申请退票
      {
        path:'/RequestRefund',
        name:'requestRefund',
        component: RequestRefund
      },
      {
        path:'/LithiumBattery',
        name:'lithiumBattery',
        component:LithiumBattery
      },
      {
        path:'/CreditRules',
        name:'creditRules',
        component:CreditRules
      },
      {
        path:'/PurchaseTicket',
        name:'purchaseTicket',
        component:PurchaseTicket
      },
      //申请改签
      {
        path:'/TicketChange',
        name:'ticketChange',
        component:TicketChange
      },
      //改签航班列表
      {
        path:'/ChangeFlyList',
        name:'changeFlyList',
        component:ChangeFlyList
      },
      //改签列表
      {
        path:'/ChangeOrderList',
        name:'changeOrderList',
        component:ChangeOrderList
      },
      //改签详情
      {
        path:'/ChangeOrderDetail',
        name:'changeOrderDetail',
        component:ChangeOrderDetail
      },
      //改签流程
      {
        path:'/ChangeProcess',
        name:'changeProcess',
        component:ChangeProcess
      },
      //改签操作步骤
      {
        path:'/TicketStep',
        name:'ticketStep',
        component:TicketStep
      },
      //补开发票
      {
        path:'/CompInvoicing',
        name:'compInvoicing',
        component:CompInvoicing
      },
      //航班动态
      {
        path:'/FlightStatus',
        name:'flightStatus',
        component:FlightStatus
      }
    ]
})
