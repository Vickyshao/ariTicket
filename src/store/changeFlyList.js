//改签航班列表
export default {
  state: {
    // isReturnDate:false,    //是否有返程日期
    isShowLoading:false,
    isHasFilter:false,
    showCityList:[],       //DOM渲染用的  去程
    queryAllCityList:[],   //初使化  去程的 all
    filterList:{           //筛选
      // airline:[],
      orgAirport:[],
      dstAirport:[],
      craftType:[]
    },
    flySelectedInfo:{}
  },
  mutations: {
    //是否显示loading
    CHANGE_UPDATELOADING(state,num){
      //Num=1 设置为true num=2 false
      if(num===1||num==='1'){
        state.isShowLoading=true;
      }
      else{
        state.isShowLoading=false;
      }
    },
    //给初使化航班信息列表赋值
    CHANGE_INIT_FLIGHTS(state,flightsList){
      flightsList.forEach(function (item) {
        state.queryAllCityList.push(item);
        state.showCityList.push(item);
      })
      // state.queryAllCityList=flightsList;
    },
    //筛选过后的航班数组
    CHANGE_FILTER_FLIGHTS(state,flightsList){
      state.showCityList=flightsList;
    },
    //点确定后 清空条件的响应 重新加载全部数据
    CHANGE_UPDATEASALL(state){
      state.showCityList=state.queryAllCityList;
    },
    //筛选条件列表
    CHANGE_UPDATE_FILTER(state,filter){
      // state.filterList.airline=filter.airline;
      state.filterList.orgAirport=filter.orgAirport;
      state.filterList.dstAirport=filter.dstAirport;
      state.filterList.craftType=filter.craftType;
    },
    //清空 航班数据
    CHANGE_CLEAR_FLIGHTS(state){
      state.queryAllCityList=[];
      state.showCityList=[];
    },

    //num=1设置为true,2false
    CHANGE_ISHASFILTER(state,num){
      if(num===1){
        state.isHasFilter=true;
      }
      else{
        state.isHasFilter=false;
      }

    },
    // 选中的航班列表
    CHANGE_FLYSELECTEDINFO(state,obj){
      state.flySelectedInfo=obj;
    },
    //清空选中的航班对象
    CLEAR_SELECTED_FLY(state){
      for(var key in state.flySelectedInfo){
        delete state.flySelectedInfo[key];
      }
    }

  },
  actions: {
    //如果没有选日期 默认为今天
    // DefaultDate({commit, state}){
    //
    // }
  }

}

