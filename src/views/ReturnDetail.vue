<template>
    <div class="detail-page">
          <v-detailPage :flyItem="showDetailInfo" :flyPage="1">
            <div slot="go" class="go_back">
              <span class="back fontSize24">返</span>
              <span class="time fontSize30 Arial">{{returnDateOther}}</span>
              <span class="day fontSize30">{{returnDay}}</span>
              <!--<span class="iconfont icon-shichang"></span>-->
              <!--<span class="time_len fontSize24 Arial">{{newsDuration}}</span>-->
            </div>
          </v-detailPage>
          <v-booking></v-booking>
    </div>
</template>

<script type="text/ecmascript-6">
import DetailPage from '@/components/Details/flyDetail'
import Booking from '@/components/Details/returnBooking'
import { mapState, mapMutations } from 'vuex';
  export default {
    name: 'detail-page',
    data() {
      return{
        flyDetail:{

        },
        newsDuration:''
      }
    },

    computed:{
      ...mapState({
        showDetailInfo:state =>state.returnSearchDetail.showDetailInfo,      //预订详情信息
        isReturnDate:state =>state.list.isReturnDate,
        returnDateOther:state =>state.search.date.returnDateObj.returnDateOther,//返程日期
        returnDay:state =>state.search.date.returnDateObj.returnDay,            //返程周几
        departCityIataCode:state =>state.search.returnCityData.departCityIataCode, //出发城市三字码
        arriveCityIataCode:state =>state.search.returnCityData.arriveCityIataCode, //到达城市三字码
        returnDate:state =>state.search.date.returnDateObj.returnDate,                   //返程日期
      })
    },
    created:async function () {
      let flightNo;
      if(this.getCookie('ReturnFlightNumCookie')){
        flightNo=JSON.parse(this.getCookie('ReturnFlightNumCookie'));
      }
      var params={
        orgCityCode:this.departCityIataCode,
        dstCityCode:this.arriveCityIataCode,
        departureDate:this.returnDate,
        flightNum:flightNo
      }
//      console.log('需要传的参数：');
//      console.log(params);
      //响应参数
      var response=await this.$root.http.post('/queryResult',params,this);
      if(response){
        var obj=response.data;
        if(obj!=null&&response.data.data!=null){
          if(obj.success){
//            console.log(obj);
            //选择的航班信息重新赋值 对象重置
            this.$store.commit('UPDATE_RETURNDETAILINFO',obj.data);
            if(obj.data.cabin.length===0){
              this.$store.commit('UPDATE_RELOAD_SHOW');  //显示返回按钮
              this.$store.commit('ERROR_SHOW','舱位不足，请点返回按钮换一个航班试试，谢谢！');//错误页显示
            }
          }
        }
        //否则重新加载航班列表
        else{
          this.$store.commit('modalShow','航班数据已更新,请重新选择！');
          //跳转到航班预订详情页
          this.$router.push({path:'/ReturnList'});
        }
      }

      //时长 h:m
//      var duration=this.showDetailInfo.duration.split(':');
//      var h=duration[0].substr(0,1)==='0'?duration[0].substr(1):duration[0];
//      this.newsDuration=h+'h'+duration[1]+'m';
    },
    mounted () {

    },
    methods: {

    },
    components: {
      'v-detailPage': DetailPage,
      'v-booking':Booking,
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


</style>
