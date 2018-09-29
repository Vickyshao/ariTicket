<template>
  <section class="topDateSelect fontSize30">
    <div class="dateArrowClick">
      <div v-if="departDay==='今天'" class="dateArrow gray ml30">
        <i class="icon iconfont icon-xiangzuo mr10"></i>
        <span>前一天</span>
      </div>
      <div class="dateArrow ml30" @click="beforeDayClick" v-else>
        <i class="icon iconfont icon-xiangzuo mr10"></i>
        <span>前一天</span>
      </div>
      <div class="dateSelectBox colorBlue">
        <i class="icon iconfont icon-rili ml20"></i>
        <div class="departStyle" @click="dateSelect(3)"><span>{{departDateList.departShorthand}}</span> <span>{{departDateList.departDay}}</span></div>
        <i class="icon iconfont icon-zhankai mr20"></i>
      </div>
      <div v-if="isMaxDate" class="dateArrow mr30 textRight gray">
        <span>后一天</span>
        <i class="icon iconfont icon-xiangyou ml10"></i>
      </div>
      <div class="dateArrow mr30 textRight" @click="afterDayClick" v-else>
        <span>后一天</span>
        <i class="icon iconfont icon-xiangyou ml10"></i>
      </div>
    </div>
    <date ref="listDate"></date>
  </section>
</template>
<script>
  import date from '../Date/date.vue';
  import { mapState, mapMutations } from 'vuex';
  export default {
    data(){
      return{
        isMaxDate:false
      }
    },
    components:{
      date
    },
    computed:{
      ...mapState({
        goCityData: state =>state.search.goCityData,
        departDateList:state =>state.list.departDateList,
        departDate:state =>state.list.departDateList.departDate,
        queryAllCityList:state =>state.list.queryAllCityList,   //初使化
        showCityList:state =>state.list.showCityList,           //最终使用的 筛选过后的
        filterList:state =>state.list.filterList,               //筛选列表
        departDay:state =>state.list.departDateList.departDay   //周几

      })
    },
    created:function () {
      if(this.departDate===''){
        this.$store.dispatch('DefaultDate');            //默认为今天
      }
      this.isMaxDateTime();                             //判断时间是否超出了范围
    },
    methods:{
      ...mapMutations([
        'upDateListDepartDate',
        'UPDATEDATETIME',
        'UPDATELOADING',
        'INIT_FLIGHTS',
        'FILTER_FLIGHTS',
        'UPDATE_FILTER',
        'UPDATE_RELOAD_SHOW',   //重新加载按钮
        'UPDATE_RELOAD_HIDE',
        'ERROR_HIDDEN',         //错误页隐藏
        'ERROR_SHOW'            //错误页显示
      ]),
      //弹出日期选择插件
      dateSelect:function (n) {
        this.$refs.listDate.showDate(n);
      },
      //前一天
      beforeDayClick:function () {
        this.$store.commit('UPDATEDATETIME','pre');
        this.isMaxDateTime();                             //判断时间是否超出了范围
      },
      //后一天
      afterDayClick:function () {
        this.$store.commit('UPDATEDATETIME','next');
        this.isMaxDateTime();                             //判断时间是否超出了范围
      },
      //是否超出了时间限制
      isMaxDateTime:function () {
        //如果超出了最大时间限制 后一天不可点
        let depDate = new Date(this.departDate.replace(/-/g,"/"));
        if(depDate.getTime()>new Date().getTime()+360*24*60*60*1000){
          // this.$store.dispatch('modalCountdown','抱歉，时间选择超出了范围！'); //带倒计时的消息框
          this.isMaxDate=true;
        }
        else{
          this.isMaxDate=false;
        }
      }
    },
    watch:{
      //日期改变后请求后台 航班列表
      departDate:function (val,old) {
        //出发日期 重新存cookie
        var departDate=JSON.stringify(this.departDateList);
        this.setCookie('departDateCookie',departDate);          //出发日期

//        console.log('改变后的值：'+val);
        //请求航班列表
        this.$store.commit('UPDATELOADING',1);  //显示loading
        let num=1;
        var vm=this;
        this.$store.commit('CLEAR_FLIGHTS');  //先清空

        var flightsQueryFun=async function (n) {
          const params={
            orgCityCode:vm.goCityData.departCityIataCode,
            dstCityCode:vm.goCityData.arriveCityIataCode,
            departureDate:val,
            page:n
          }
          if(n===1){  //只有第一页的时候加载loading
            vm.$store.commit('loadingShow','拼命加载中');
//            console.log('我是第一页')
          }
//          console.log(params);
          var response=await vm.$root.http.post('/queryResult',params,vm);
//          console.log(response);
          if(response){
            var obj=response.data;
            if(obj!=null||obj.data!=null){
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
                  flightsQueryFun(num)
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
//              console.log(obj);
              vm.ERROR_SHOW('没有您要查询的航班了!');
              vm.UPDATE_RELOAD_SHOW();     //重新加载按钮显示
            }
          }
        }
        flightsQueryFun(num);    //后台请求数据
      }
    }
  }

</script>
<style>
  .topDateSelect{
    /*width:7.5rem;*/
    width:100%;
    height:1.1rem;
    background:linear-gradient(to right, rgba(44,124,249,1),rgba(79,176,251,1));
    display: flex;
    flex-direction: row;
    justify-content:space-between;
    align-items:center;
    color: #fff;
    position: fixed;
    top:0;
    left:0;
    z-index: 3;
  }
  .topDateSelect .dateArrow{
    width:1.4rem;
    font-size: 0.3rem;
    /*border: 1px solid #f00;*/
  }
  .topDateSelect .dateArrow.gray{
    color: rgba(255,255,255,.3);
  }
  .topDateSelect i{
    font-size: 0.23rem;
    line-height: 0.64rem;
  }
  .topDateSelect .dateSelectBox{
    width:3.51rem;
    height:0.64rem;
    background:rgba(255,255,255,1);
    border-radius: 0.12rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    line-height: 0.64rem;
  }
  .departStyle{
    /*height: 0.3rem;*/
    font-size: 0.28rem;
  }
  .dateArrowClick{
    width:7.5rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
  }
</style>
