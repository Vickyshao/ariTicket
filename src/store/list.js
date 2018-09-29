//航班列表 去程
// import Vue from 'vue'
export default {
  state: {
    isReturnDate:false,    //是否有返程日期
    isShowLoading:false,
    isHasFilter:false,
    showCityList:[],       //DOM渲染用的  去程
    queryAllCityList:[],   //初使化  去程的 all
    filterList:{           //筛选
      airline:[],
      orgAirport:[],
      dstAirport:[],
      craftType:[]
    },
    //实时的 如果这个值改变了就会去请求一次后台
    departDateList:{
      departDate:'',
      departShorthand:'',
      departDay:'',
      otherShorthand:''
    }
  },
  mutations: {
    upDateListDepartDate(state,obj){
      state.departDateList=obj;
    },
    //更新出发日期
    UPDATEDATETIME(state,preOrNext){
      var oldDate = new Date(state.departDateList.departDate.replace(/-/g,"/")),
          newsDate='';
      if(preOrNext === 'pre'){
        newsDate=new Date(oldDate.getTime() - 3600 *24 *1000);
      }
      else if (preOrNext === 'next'){
        newsDate=new Date(oldDate.getTime() + 60 * 60 *24 * 1000);
      }
      //小于10补零
      var lower10=function (num) {
        return num < 10 ? '0' + num : num;
      };
      //周几
      var daysAway=function (start, end) {
        var startTime = start.getTime(),
          endTime = end.getTime(),
          str = "",
          weekDefine = ['日', '一', '二', '三', '四', '五', '六'];
        if (endTime - startTime < 1) {
          str = "今天"
        } else if (endTime - startTime == 24 * 60 * 60 * 1000) {
          str = "明天"
        } else if (endTime - startTime == 24 * 60 * 60 * 1000 * 2) {
          str = "后天";
        } else {
          str = "周" + weekDefine[end.getDay()];
        }
        return str;
      };
      var year=newsDate.getFullYear(),
          month=newsDate.getMonth()+1,
          dateStr=newsDate.getDate(),
          now=new Date();
      state.departDateList.departDate=year+'-'+lower10(month)+'-'+lower10(dateStr);
      state.departDateList.departShorthand=lower10(month)+'-'+lower10(dateStr);
      state.departDateList.otherShorthand=lower10(month)+'月'+lower10(dateStr)+'日';
      state.departDateList.departDay=daysAway(new Date(now.getFullYear(),now.getMonth(),now.getDate()),new Date(year,month-1,dateStr));
      // console.log(state.departDateList.departDate);
    },
    //是否显示loading
    UPDATELOADING(state,num){
      //Num=1 设置为true num=2 false
      if(num===1||num==='1'){
        state.isShowLoading=true;
      }
      else{
        state.isShowLoading=false;
      }
    },
    //给初使化航班信息列表赋值
    INIT_FLIGHTS(state,flightsList){
      flightsList.forEach(function (item) {
        state.queryAllCityList.push(item);
        state.showCityList.push(item);
      })
      // state.queryAllCityList=flightsList;
    },
    //筛选过后的航班数组
    FILTER_FLIGHTS(state,flightsList){
      state.showCityList=flightsList;
    },
    //点确定后 清空条件的响应 重新加载全部数据
    UPDATEASALL(state){
      state.showCityList=state.queryAllCityList;
    },
    //筛选条件列表
    UPDATE_FILTER(state,filter){
      state.filterList.airline=filter.airline;
      state.filterList.orgAirport=filter.orgAirport;
      state.filterList.dstAirport=filter.dstAirport;
      state.filterList.craftType=filter.craftType;
    },
    //是否有返程 状态更新 num:1 更新为true 2更新为false
    UPDATE_RETURN_STATE(state,num){
      if(num===1||num==='1'){
        state.isReturnDate=true;
      }
      else{
        state.isReturnDate=false;
      }
    },
    //清空 航班数据
    CLEAR_FLIGHTS(state){
      state.queryAllCityList=[];
      state.showCityList=[];
    },

    //num=1设置为true,2false
    ISHASFILTER(state,num){
      if(num===1){
        state.isHasFilter=true;
      }
      else{
        state.isHasFilter=false;
      }

    }

  },
  // getters: {
  //
  // },
  actions: {
    //如果没有选日期 默认为今天
    DefaultDate({commit, state}){
      var nowDate=new Date(),
        yy=nowDate.getFullYear(),
        mm=nowDate.getMonth()+1,
        dd=nowDate.getDate();
      mm=mm<10?'0'+mm:mm;
      dd=dd<10?'0'+dd:dd;
      var paramDate=yy+'-'+mm+'-'+dd;
      var textDate=mm+'月'+dd+'日';
      var textDate1=mm+'-'+dd;
      var textDay='今天';
      var obj={
        departDate:paramDate,
        departShorthand:textDate1,
        departDay:textDay,
        otherShorthand:textDate
      }
      commit('upDepartDate',obj);
      commit('upDateListDepartDate',obj);
    }
  }

}
