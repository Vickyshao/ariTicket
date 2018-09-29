export default {
  state: {
    changeDate:'',              //改签日期
    tourists1:[],               //筛选过后的乘机人
    ticketCode:[],              //提取的票号
    // touristSelct:[],            //选择的乘机人列表
    isAllSelect:1,              //1是全选 2是全不选
    refundNum:1,                //1为自愿改签 2非自愿改签
  },
  mutations: {
    //改签日期
    CHANGE_DATE(state, date) {
      state.changeDate = date;
    },
    //清空乘机人
    CLEAR_CHANGE_TOURIST(state){
      state.tourists1=[];
    },
    //初使化乘机人列表
    INIT_CHANGE_TOURIST(state,item){
      state.tourists1.push(item);
    },
    //全选、全不选
    CHANGE_ISALLSELECTED(state,num){
      state.isAllSelect=num;
    },
    //清空 票号
    CLEAR_CHANGE_TICKETCODE(state){
      state.ticketCode=[];
    },
    //提取选中的票号
    INIT_CHANGE_TICKETCODE(state,code){
      state.ticketCode.push(code);
    },
    //改签方式
    CHANGE_REFUNDNUM(state,num){
      state.refundNum=num;
    },
    //申请成功后 还原默认显示
    CLEAR_HISTORY_CHANGE(state){
      state.refundNum=1;    //改签方式默认为1
      state.changeDate='';  //改签日期为空
    }

    // //清空改签详情数据（改签详情页）
    // CLEAR_CHANGE_DETAIL(state) {
    //   state.orderDetail.detail = {};
    //   state.orderDetail.insurances = [];
    //   state.orderDetail.tourists = [];
    //   state.orderDetail.trans = [];
    // },
  },
  actions:{
    //申请改签页中的 全选/全不选切换 按钮
    allSelected({commit, state},num){
      if(num===1){
        state.isAllSelect=2;    //显示全不选
        state.tourists1.forEach(function (item) {
          item.isSelected=true;
        });
      }
      else{
        state.isAllSelect=1;    //显示全选
        state.tourists1.forEach(function (item) {
          item.isSelected=false;
        });
      }
    },
    //申请成功后 还原默认显示
    clearHistoryChange({commit, state}){
      commit('CLEAR_HISTORY_CHANGE');
      commit('CLEAR_SELECTED_FLY');
    }
  }
}
