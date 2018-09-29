// import cookie from '@/common/js/base'
// import Vue from 'vue'
export default {
  state:{
    goCityData:{
      departCityName:'',   //出发城市
      arriveCityName:'',   //抵达城市
      departCityIataCode:'',
      arriveCityIataCode:''
    },
    isInit:true,
    historyList:[],
    date:{
      //出发日期
      departDateObj:{
        departDate:'',
        departShorthand:'',
        departDay:'',
        otherShorthand:''   //月 日
      },
      returnDateObj:{
        returnDate:'',
        returnShorthand:'',
        returnDay:'',
        returnDateOther:''
      }
    },
    returnCityData:{
      departCityName:'',   //出发城市
      arriveCityName:'',   //抵达城市
      departCityIataCode:'',
      arriveCityIataCode:''
    },
    reLoadBtn:false,
    bannerUrl:[],
    // shareUrl:''
  },
  mutations:{
    updateCity(state,city){
      var obj=Object.assign(state.goCityData,city);
      state.goCityData=obj;
      state.isInit=false;
    },
    initCity(state){
      if(!state.goCityData.departCityName){
        state.goCityData.departCityName='北京';
        state.goCityData.departCityIataCode='BJS';
      }
      // state.goCityData.arriveCityName='北京';
      // state.goCityData.arriveCityIataCode='BJS';
    },
    //切换去返
    citySwitch(state){
      var tempName=state.goCityData.departCityName,
          tempCode=state.goCityData.departCityIataCode;
      state.goCityData.departCityName=state.goCityData.arriveCityName;
      state.goCityData.arriveCityName=tempName;
      state.goCityData.departCityIataCode=state.goCityData.arriveCityIataCode;
      state.goCityData.arriveCityIataCode=tempCode;
      // console.log(state.goCityData.departCityIataCode);
    },
    //添加新的历史记录
    addHistoryCity(state,item){
      var obj={
        dptName:state.goCityData.departCityName,
        arvName:state.goCityData.arriveCityName,
        dptCode:state.goCityData.departCityIataCode,
        arvCode:state.goCityData.arriveCityIataCode
      }
      var isAdd=true;  //去重
      if(state.historyList.length>0){
        state.historyList.forEach(function (item) {
          if(item.dptCode===state.goCityData.departCityIataCode&&item.arvCode===state.goCityData.arriveCityIataCode){
            isAdd=false;
          }
        });
      }
      if(isAdd){
        state.historyList.unshift(obj);
      }
      if(state.historyList.length>3){
        state.historyList.pop();
      }

        },
    saveHistoryList(state, historyArr) {
        state.historyList = historyArr;
    },
    clearHistoryCity(state) {
        state.historyList = [];
    },
    upDepartDate(state, obj) {
        state.date.departDateObj = obj;
    },
    upReturnDate(state, obj) {
        state.date.returnDateObj = obj;
    },
    //返程参数  出发城市，到达城市传参
    UPDATE_RETURN_CityData(state, num) {
        if (num === 1 || num === '1') {
            //返程的参数赋值
            state.returnCityData.departCityName = state.goCityData.arriveCityName;
            state.returnCityData.departCityIataCode = state.goCityData.arriveCityIataCode;
            state.returnCityData.arriveCityName = state.goCityData.departCityName;
            state.returnCityData.arriveCityIataCode = state.goCityData.departCityIataCode;
        } else {
            //初使化为空
            state.returnCityData.departCityName = '';
            state.returnCityData.departCityIataCode = '';
            state.returnCityData.arriveCityName = '';
            state.returnCityData.arriveCityIataCode = '';
        }
    },
    //重新加载按钮显示
    UPDATE_RELOAD_SHOW(state){
      state.reLoadBtn=true;
    },
    //重新加载按钮隐藏
    UPDATE_RELOAD_HIDE(state){
      state.reLoadBtn=false;
    },
    //banner 图
    UPDATE_BANNER(state,url){
      state.bannerUrl=[];
      state.bannerUrl=url;
    }
  },

  getters: {
      // goCityData: state => state.goCityData
  },
  actions: {
    //出发城市 到达城市 出发日期 返程日期 返程的出发城市到达城市 从cookie取值 防刷新
    // initParam({commit, state,rootState}){
    //   //从cookie中取值 刷新用的
    //   if(Vue.cookie.getCookie('goCityCookie')){
    //     var goCity=JSON.parse(Vue.cookie.getCookie('goCityCookie'));
    //     commit('updateCity',goCity);
    //     console.log('我在action里边呀');
    //     console.log(goCity);
    //   }
    //   console.log('我在action里边呀');
    // }
  }
}
