<template>
  <section class="list">
    <!--设置页面标题-->
    <h2 v-title="'返程：'+returnDepartCityName+'-'+returnArriveCityName"></h2>
    <!--时间选择组件-->
    <!--<v-topdate v-if="!isReturnDate"></v-topdate>-->
    <div class="goCityInfo">
      <span class="goCityIcon ml30">去</span>
      <span class="ml20">{{departShorthand}}</span>
      <span class="pl10">|</span>
      <span class="pl10">{{showDetailInfo.departTime}}</span>
      <span class="pl10">{{departCityName}} ⇀ {{arriveCityName}}</span>
      <span class="ml30">{{goCompany}}{{goFlightNo}}</span>
    </div>
    <v-errorPage>
      <div slot="reload" class="reloadBtn fontSize34 boxCenter mt20" @click="reloadFly">重新加载</div>
    </v-errorPage>
    <v-flylist></v-flylist>
    <v-filter></v-filter>
  </section>
</template>

<script>
  //  import TopDate from '../components/list/returnTopDateSelect.vue';
  import FlyList from '../components/list/returnFlyList.vue';
  import Filter from '../components/list/returnFilter.vue';
  import { mapState, mapMutations } from 'vuex';
  import ErrorPage from '../components/Modal/errorPage.vue'
  export default {
    data(){
      return{
        goFlightNo:'',
        goCompany:''
      }
    },
    components:{
//      'v-topdate':TopDate,
      'v-flylist':FlyList,
      'v-filter':Filter,
      'v-errorPage':ErrorPage
    },
    computed:{
      ...mapState({
        isReturnDate:state =>state.list.isReturnDate,
        //去程
        departCityName:state =>state.search.goCityData.departCityName,
        arriveCityName:state =>state.search.goCityData.arriveCityName,
        departShorthand:state =>state.list.departDateList.departShorthand,
        showDetailInfo:state =>state.searchDetail.showDetailInfo,
        //返程
        returnDepartCityName:state =>state.search.returnCityData.departCityName,
        returnArriveCityName:state =>state.search.returnCityData.arriveCityName,

        departCityIataCode:state =>state.search.returnCityData.departCityIataCode, //出发城市三字码
        arriveCityIataCode:state =>state.search.returnCityData.arriveCityIataCode, //到达城市三字码
        returnDate:state =>state.search.date.returnDateObj.returnDate,             //返程日期
        cabin:state =>state.order.cabin
      })
    },
    methods:{
      ...mapMutations([
        'ERROR_HIDDEN',             //错误页隐藏
        'ERROR_SHOW',               //错误页显示
        'UPDATE_RELOAD_HIDE',
        'UPDATE_RELOAD_SHOW',
        'UPDATELOADING_RETURN',
        'INIT_FLIGHTS_RETURN',
//        'FILTER_FLIGHTS_RETURN',
        'UPDATE_FILTER_RETURN',
        'modalShow',
        'CLEAR_FLIGHTS_RETURN',
      ]),
      reloadFly:function () {
//        this.$router.push({path:'/ReturnList'});
        location.reload();   //强制刷新
      }
    },
    created:function () {
      if(this.getCookie('flightNumCookie')){
        this.goFlightNo=JSON.parse(this.getCookie('flightNumCookie'));
        this.goCompany=JSON.parse(this.getCookie('flightCompanyCookie'));
      }

//      console.log('我在这里，看到了吗');
      this.$store.commit('UPDATELOADING_RETURN',1);  //显示loading
      let num=1;
      let vm=this;
      vm.$store.commit('CLEAR_FLIGHTS_RETURN');  //先清空

      var flightsQueryFun=async function (n) {
        const params={
          orgCityCode:vm.departCityIataCode,
          dstCityCode:vm.arriveCityIataCode,
          departureDate:vm.returnDate,
          page:n
        }
        if(n===1){  //只有第一页的时候加载loading
          vm.$store.commit('loadingShow','拼命加载中');
        }
//        console.log(params);
        var response=await vm.$root.http.post('/queryResult',params,vm);
//        console.log(response);
        if(response){
          var obj=response.data;
          if(obj!=null&&obj.data!=null){
//            console.log('我看下这里的值');
//            console.log(obj.data);
            if(obj.success){
              vm.ERROR_HIDDEN();       //错误页隐藏
              vm.UPDATE_RELOAD_HIDE(); //重新加载隐藏
              //航班列表
              vm.$store.commit('INIT_FLIGHTS_RETURN',obj.data.flights);  //初使化
              //筛选条件
              var filter={
                airline:obj.data.filter.airline,
                orgAirport:obj.data.filter.orgAirport,
                dstAirport:obj.data.filter.dstAirport,
                craftType:obj.data.filter.craftType
              }
              vm.$store.commit('UPDATE_FILTER_RETURN',filter);
              if(obj.data.flights.length===20){
                num++;
                flightsQueryFun(num)
              }
              else{
                vm.$store.commit('UPDATELOADING_RETURN',2);  //隐藏loading
              }
            }
            else{
//                      vm.$store.commit('modalShow',obj.msg);
              if(obj.errorCode===905||obj.errorCode===904){
                vm.ERROR_SHOW('没有您要查询的航班了!');
                vm.$router.back(-1);
//              vm.UPDATE_RELOAD_SHOW();     //重新加载按钮显示
              }
            }
          }
          else{
//            console.log(obj);
            vm.ERROR_SHOW('没有您要查询的航班了!');
            vm.UPDATE_RELOAD_SHOW();     //重新加载按钮显示
          }
        }
      }
      flightsQueryFun(num);    //后台请求数据
//      this.$options.methods.loadReturnList.bind(this);    //重新加载航班列表
    }
  }
</script>
<style>
.goCityInfo{
  width:7.5rem;
  height:0.7rem;
  background:rgba(255,242,244,1);
  display: flex;
  flex-direction: row;
  align-items: center;
}
  .goCityIcon{
    width:0.4rem;
    height:0.4rem;
    background:rgba(241,62,86,1);
    color: #fff;
    border-radius: 50%;
    text-align: center;
    line-height: 0.4rem;
  }
</style>
