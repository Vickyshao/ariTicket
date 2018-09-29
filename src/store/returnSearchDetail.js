//返程预订详情
export default {
  state: {
    showDetailInfo:{},       //DOM渲染用的  返程
  },
  mutations: {
    //更新预订详情
    UPDATE_RETURNDETAILINFO(state,flightsList){
      state.showDetailInfo=flightsList;
    }
  }
}
