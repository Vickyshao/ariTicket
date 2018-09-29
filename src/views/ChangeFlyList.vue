<template>
  <section class="changeFlyList">
    <!--航班列表-->
    <v-chgflylist v-on:flyInfoEvent="getFlyInfo"></v-chgflylist>
    <v-errorPage v-if="showCityList.length===0"></v-errorPage>
    <!--确定-->
    <div class="refundBtn" @click="certainFly">确定</div>
    <v-filter></v-filter>
  </section>
</template>
<script>
  import Filter from '../components/Order/filter.vue'
  import ChgFlyList from '../components/Order/chgFlyList.vue'
  import ErrorPage from '../components/Modal/errorPage.vue'
  import { mapState, mapMutations } from 'vuex';
  export default {
    data() {
      return {
        flyInfo:{}
      }
    },
    components: {
      'v-filter': Filter,
      'v-chgflylist':ChgFlyList,
      'v-errorPage':ErrorPage
    },
    computed:{
      ...mapState({
        queryAllCityList:state =>state.changeFlyList.queryAllCityList,   //初使化
        showCityList:state =>state.changeFlyList.showCityList,           //最终使用的 筛选过后的
        filterList:state =>state.changeFlyList.filterList,                  //筛选列表
      })
    },
    created:function () {
      //请求航班列表
      // this.$store.commit('CHANGE_UPDATELOADING',1);  //显示loading

      // let num=1;
      var vm=this;
      this.$store.commit('CHANGE_CLEAR_FLIGHTS');  //先清空

      var flightsQueryFun=async function() {
        let param={
          OrgCityCode:vm.$route.query.orgditydode,
          DstCityCode:vm.$route.query.arrcitycode,
          DepartureDate:vm.$route.query.dptdate,
          AirlineIataCode:vm.$route.query.airlinecode
        }
        vm.$store.commit('loadingShow','拼命加载中');
        const response=await vm.$root.http.post('/order/airlineListForChange', param,vm);
        if(response){
          var obj=response.data;
          if(obj!=null&&obj.data!=null){
            if(obj.success){
              vm.ERROR_HIDDEN();       //错误页隐藏
              vm.UPDATE_RELOAD_HIDE(); //重新加载隐藏
              //航班列表
              vm.$store.commit('CHANGE_INIT_FLIGHTS',obj.data.airportInfo);  //初使化
//          vm.$store.commit('FILTER_FLIGHTS',obj.data.flights);
              //筛选条件
              var filter={
                // airline:obj.data.filter.airline,
                orgAirport:obj.data.orgAirport,
                dstAirport:obj.data.dstAirport,
                craftType:obj.data.craftType
              }
              vm.$store.commit('CHANGE_UPDATE_FILTER',filter);
            }
            else{
              vm.$store.commit('CHANGE_UPDATELOADING',2);  //隐藏loading
              if(obj.errorCode===905||obj.errorCode===904){
                this.$store.dispatch('modalCountdown',obj.msg); //带倒计时的消息框
                vm.ERROR_SHOW('没有可改签的航班!');
                // vm.UPDATE_RELOAD_SHOW();     //重新加载按钮显示
              }
            }
          }
          else{
//            vm.$store.dispatch('modalCountdown',obj.msg);
            vm.$store.commit('CHANGE_UPDATELOADING',2);  //隐藏loading
            vm.ERROR_SHOW('没有可改签的航班!');
            // vm.UPDATE_RELOAD_SHOW();     //重新加载按钮显示
          }
        }
      //  如果没有数据返回错误提示页
        if(vm.queryAllCityList.length===0){
          // vm.$store.commit('CHANGE_UPDATELOADING',2);  //隐藏loading
          vm.ERROR_SHOW('没有符合条件的航班!');
        }

      }
      flightsQueryFun();    //后台请求数据
    },
    methods:{
      ...mapMutations([
        'UPDATE_RELOAD_SHOW',   //重新加载按钮
        'UPDATE_RELOAD_HIDE',
        'ERROR_HIDDEN',         //错误页隐藏
        'ERROR_SHOW',           //错误页显示
        'CHANGE_FLYSELECTEDINFO',//存选中的航班信息
      ]),
      //接收子组件选中的航班
      getFlyInfo:function (item) {
        this.flyInfo=item;
      },
      //确定航班时 接收到的航班信息赋值给全局
      certainFly:function () {
        this.CHANGE_FLYSELECTEDINFO(this.flyInfo);      //存选中的航班信息
        this.$router.go(-1);                            //返回上一页
      }
    }
  }
</script>
<style scoped>
  .changeFlyList{
    background: #fff;
    min-height: 12rem;
  }
  /*确定*/
  .changeFlyList .refundBtn{
    width:7.5rem;
    height:1.1rem;
    background:linear-gradient(90deg,rgba(231,70,92,1),rgba(255,92,92,1));
    line-height: 1.1rem;
    text-align: center;
    color:#fff;
    font-size: 0.36rem;
    position: fixed;
    left: 0;
    bottom:0;
  }
  .error{
    padding: 1.6rem 0 4rem;
  }

</style>
