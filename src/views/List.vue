<template>
  <section class="list">
    <!--设置页面标题-->
    <h2 v-if="!isReturnDate" v-title="departCityName+'-'+arriveCityName"></h2>
    <h2 v-else v-title="'去程：'+departCityName+'-'+arriveCityName"></h2>
    <!--时间选择组件-->
    <v-topdate v-if="!isReturnDate"></v-topdate>
    <v-errorPage>
      <div slot="reload" class="reloadBtn fontSize34 boxCenter mt20" @click="reloadFly">重新加载</div>
    </v-errorPage>
    <v-flylist></v-flylist>
    <v-filter></v-filter>
  </section>
</template>
<script>
  import TopDate from '../components/list/topDateSelect.vue';
  import FlyList from '../components/list/flyList.vue';
  import Filter from '../components/list/filter.vue';
  import ErrorPage from '../components/Modal/errorPage.vue'
  import { mapState, mapMutations } from 'vuex';
  export default {
    data(){
      return{
      }
    },
    components:{
      'v-topdate':TopDate,
      'v-flylist':FlyList,
      'v-filter':Filter,
      'v-errorPage':ErrorPage
    },
    computed:{
      ...mapState({
        isReturnDate:state =>state.list.isReturnDate,
        departCityName:state =>state.search.goCityData.departCityName,
        arriveCityName:state =>state.search.goCityData.arriveCityName,
        goCityData: state =>state.search.goCityData,
        departDateList:state =>state.list.departDateList,
        departDate:state =>state.list.departDateList.departDate,
        queryAllCityList:state =>state.list.queryAllCityList,   //初使化
        showCityList:state =>state.list.showCityList,           //最终使用的 筛选过后的
        filterList:state =>state.list.filterList,               //筛选列表
        reLoadBtn:state =>state.search.reLoadBtn ,              //重新加载按钮是否显示
      })
    },
    created:function () {
      //请求航班列表
      this.$store.commit('UPDATELOADING',1);  //显示loading
      let num=1;
      var vm=this;
      this.$store.commit('CLEAR_FLIGHTS');  //先清空

      var flightsQueryFun=async function (n) {
        const params={
          orgCityCode:vm.goCityData.departCityIataCode,
          dstCityCode:vm.goCityData.arriveCityIataCode,
          departureDate:vm.departDate,
          page:n
        }
//        console.log(params);
        if(n===1){  //只有第一页的时候加载loading
          vm.$store.commit('loadingShow','拼命加载中');
        }
        var response=await vm.$root.http.post('/queryResult',params,vm);
        if(response){
          var obj=response.data;
          if(obj!=null&&obj.data!=null){
            if(obj.success){
              vm.ERROR_HIDDEN();       //错误页隐藏
              vm.UPDATE_RELOAD_HIDE(); //重新加载隐藏
              //航班列表
              vm.$store.commit('INIT_FLIGHTS',obj.data.flights);  //初使化
//          vm.$store.commit('FILTER_FLIGHTS',obj.data.flights);
              //筛选条件
              var filter={
                airline:obj.data.filter.airline,
                orgAirport:obj.data.filter.orgAirport,
                dstAirport:obj.data.filter.dstAirport,
                craftType:obj.data.filter.craftType
              }
              vm.$store.commit('UPDATE_FILTER',filter);
              if(obj.data.flights.length===20){
                num++;
                flightsQueryFun(num,1);
              }
              else{
                vm.$store.commit('UPDATELOADING',2);  //隐藏loading
              }
            }
            else{
              vm.$store.commit('UPDATELOADING',2);  //隐藏loading
              if(obj.errorCode===905||obj.errorCode===904){
                vm.ERROR_SHOW('没有您要查询的航班了!');
                vm.UPDATE_RELOAD_SHOW();     //重新加载按钮显示
              }
            }
          }
          else{
//            vm.$store.dispatch('modalCountdown',obj.msg);
            vm.$store.commit('UPDATELOADING',2);  //隐藏loading
            vm.ERROR_SHOW('没有您要查询的航班了!');
            vm.UPDATE_RELOAD_SHOW();     //重新加载按钮显示
          }
        }
      }
      flightsQueryFun(num);    //后台请求数据
    },
    methods:{
      ...mapMutations([
        'UPDATE_RELOAD_SHOW',   //重新加载按钮
        'UPDATE_RELOAD_HIDE',
        'ERROR_HIDDEN',         //错误页隐藏
        'ERROR_SHOW'            //错误页显示
      ]),
      reloadFly:function () {
//        console.log('重新加载');
        //请求航班列表
//        this.$router.push({path:'/List'});
        location.reload();   //强制刷新
      }
    }
  }

</script>
<style>

</style>
