//去程预订详情
export default {
  state: {
    showDetailInfo:{},       //DOM渲染用的  返程
    // goFlyInfo:{},//去程航班信息
    // backFlyInfo:{},//返程航班信息
  },
  mutations: {
    //更新预订详情
    UPDATE_DetailInfo(state,flightsList){
        // console.log(flightsList);
        state.showDetailInfo=flightsList;
    }
  }
}
