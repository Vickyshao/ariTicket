<template>
    <div class="detail-page">
          <v-detailPage :flyItem="showDetailInfo" :flyPage="1">
            <div slot="go" class="go_back">
              <span class="go fontSize24">去</span>
              <span class="time fontSize30 Arial">{{departDateList.departShorthand}}</span>
              <span class="day fontSize30">{{departDateList.departDay}}</span>
            </div>
          </v-detailPage>
          <v-errorPage>
            <div slot="reload" class="reloadBtn fontSize34 boxCenter mt20" @click="backList">返回</div>
          </v-errorPage>
          <v-booking></v-booking>
    </div>
</template>
<script type="text/ecmascript-6">
import DetailPage from '@/components/Details/flyDetail'
import Booking from '@/components/Details/booking'
import ErrorPage from '../components/Modal/errorPage.vue'
import { mapState, mapMutations } from 'vuex';
  export default {
    name: 'detail-page',
    data() {
      return{
        flyDetail:{

        },

//        newsDuration:''
      }
    },

    computed:{
      ...mapState({
        showDetailInfo:state =>state.searchDetail.showDetailInfo,      //预订详情信息
        isReturnDate:state =>state.list.isReturnDate,
        departDateList:state =>state.list.departDateList,//去程的日期
        goFlyDetailInfo:state =>state.searchDetail.showDetailInfo,        //去程航班信息
        departCityIataCode:state =>state.search.goCityData.departCityIataCode,//出发城市三字码
        arriveCityIataCode:state =>state.search.goCityData.arriveCityIataCode,//到达城市三字码
        departDate:state =>state.list.departDateList.departDate,              //出发日期
      })
    },
    created:async function () {
      //请求航班信息与舱位信息
      let flightNo;
      if(this.getCookie('flightNumCookie')){
        flightNo=JSON.parse(this.getCookie('flightNumCookie'));
      }
      var params={
        orgCityCode:this.departCityIataCode,
        dstCityCode:this.arriveCityIataCode,
        departureDate:this.departDate,
        flightNum:flightNo
      }
      //响应参数
      var response=await this.$root.http.post('/queryResult',params,this);
      if(response){
        var obj=response.data;
        if(obj!=null&&response.data.data!=null){
          if(obj.success){
//            console.log(obj);
            //选择的航班信息重新赋值 对象重置
            this.$store.commit('UPDATE_DetailInfo',obj.data);
            this.saveData();    //存一下航班信息 cookie
            if(obj.data.cabin.length===0){
              this.$store.commit('UPDATE_RELOAD_SHOW');  //显示返回按钮
              this.$store.commit('ERROR_SHOW','舱位不足，请点返回按钮换一个航班试试，谢谢！');//错误页显示
            }
          }
        }
        //否则重新加载航班列表
        else{
//          this.$store.commit('modalShow','航班数据已更新,请重新选择！');
          this.$store.dispatch('modalCountdown','航班数据已更新,请重新选择！'); //带倒计时的消息框

          //跳转到航班预订详情页
          this.$router.push({path:'/List'});
        }
      }
    },
    mounted () {
    },
    methods: {
      //点返回按钮 跳转到航班列表页
      backList:function () {
        this.$store.commit('ERROR_HIDDEN');       //错误页隐藏
        this.$store.commit('UPDATE_RELOAD_HIDE'); //返回按钮隐藏
        this.$router.push({path:'/List'});
      }
    },
    components: {
      'v-detailPage': DetailPage,
      'v-booking':Booking,
      'v-errorPage':ErrorPage
    }
  }
</script>
<style >
  .detail-page{
    position: relative;
    overflow:hidden;
  }
  .go_back{
    display: none;
  }
  .show{
    display: block;
  }
  .detail-page .error{
    padding: 2rem 0 5rem;
  }
</style>
