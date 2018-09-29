export default {
  state: {
    orderList:[]
  },
  mutations: {
    UPDATEORDERLIST(state,myOrder) {
      myOrder.forEach(function (item) {
        state.orderList.push(item);
      })
    },
    CLEAR_ORDERLIST(state){
      state.orderList=[];
    }
  }
}
