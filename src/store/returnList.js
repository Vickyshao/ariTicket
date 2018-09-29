//航班列表 返程
export default {
  state: {
    isShowLoading:false,
    isHasFilter:false,
    showCityList:[],       //DOM渲染用的  返程
    queryAllCityList:[],   //初使化  返程的 all
    filterList:{           //筛选
      airline:[],
      orgAirport:[],
      dstAirport:[],
      craftType:[]
    },
    reLoadBtn:false
  },
  mutations: {
    //是否显示loading
    UPDATELOADING_RETURN(state,num){
      //Num=1 设置为true num=2 false
      if(num===1||num==='1'){
        state.isShowLoading=true;
      }
      else{
        state.isShowLoading=false;
      }
    },
    //给初使化航班信息列表赋值
    INIT_FLIGHTS_RETURN(state,flightsList){
      flightsList.forEach(function (item) {
        state.queryAllCityList.push(item);
        state.showCityList.push(item);
      })
    },
    //筛选过后的航班数组
    FILTER_FLIGHTS_RETURN(state,flightsList){
      state.showCityList=flightsList;
    },
    //点确定后 清空条件的响应 重新加载全部数据
    UPDATEASALL_RETURN(state){
      state.showCityList=state.queryAllCityList;
    },
    //筛选条件列表
    UPDATE_FILTER_RETURN(state,filter){
      state.filterList.airline=filter.airline;
      state.filterList.orgAirport=filter.orgAirport;
      state.filterList.dstAirport=filter.dstAirport;
      state.filterList.craftType=filter.craftType;
    },
    //清空 航班数据
    CLEAR_FLIGHTS_RETURN(state){
      state.queryAllCityList=[];
      state.showCityList=[];
    },
    //重新加载按钮显示
    UPDATE_RELOAD_SHOW_RETURN(state){
      state.reLoadBtn=true;
    },
    //重新加载按钮隐藏
    UPDATE_RELOAD_HIDE_RETURN(state){
      state.reLoadBtn=false;
    },
    //num=1设置为true,2false
    ISHASFILTER_RETURN(state,num){
      if(num===1){
        state.isHasFilter=true;
      }
      else{
        state.isHasFilter=false;
      }

    }
  },
  getters: {

  },
  action: {

  }

}
