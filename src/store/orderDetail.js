export default {
  state: {
    isPayDeatail:false,     //显示订单金额明细
    num:1,                  //1显示在TOP  2显示在BOTTOM
    orderDetail:{
      detail:{},
      insurances:[],
      tourists:[],
      trans:[],
      flyDetail:{},
      ems:{}
    },
    orderTotailPrice:0,
    changeDate:'',          //改签日期
  },
  mutations: {
    UPDATE_ORDERDETAIL(state, orderDetail) {
      state.orderDetail.detail = orderDetail.detail;
      state.orderDetail.insurances = orderDetail.insurances;
      state.orderDetail.tourists = orderDetail.tourists;
      state.orderDetail.trans = orderDetail.trans;
      state.orderDetail.flyDetail = orderDetail.flydetailInfo;
      state.orderDetail.ems = orderDetail.ems;
    },
    CLEAR_ORDERDETAIL(state) {
      state.orderDetail.detail = {};
      state.orderDetail.insurances = [];
      state.orderDetail.tourists = [];
      state.orderDetail.trans = [];
    },
    //显示金额明细
    SHOW_PAYDETAIL(state, n) {
      state.isPayDeatail = true;
      state.num = n;
    },
    //隐藏金额明细
    HIDDEN_PAYDETAIL(state) {
      state.isPayDeatail = false;
    },
    //订单明细 价格总额
    ORDER_DETAIL_PRICE(state, price) {
      state.orderTotailPrice = price;
    },
    //改签日期
    CHANGE_DATE(state, date) {
      state.changeDate = date;
    },
  },
  actions:{
    OrderDetailTotailPrice({commit, state}){
      let totalprice=0;
      // console.log('有值吗')
      // console.log(state.orderDetail.trans);
      state.orderDetail.trans.forEach(function (item) {
        totalprice+=item.GranRt;
      });
      if(state.orderDetail.insurances.length>0){
        state.orderDetail.insurances.forEach(function (item) {
          totalprice+=item.Amount;
        });
      }
      if(state.orderDetail.ems){
        totalprice+=state.orderDetail.ems.GranRt;
      }
      // return totalprice;
      commit('ORDER_DETAIL_PRICE',totalprice);
      // console.log(state.orderTotailPrice);
    }
  }
}
