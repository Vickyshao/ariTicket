<template>
  <div v-if="flyItem.flightNo" class="flyDetail" :class="{paddingBtm:flyPage&&flyPage===1||!flyItem.cabin||flyItem.cabin[0].outTicketTime===0}">
    <div class="fly_continer color53">
      <slot v-if="isReturnDate" name="go"></slot>
      <!--航司信息----------------------------->
      <!--可以查看航班动态信息的 flyItem.isShowFlyStatus===1 -->
      <div v-if="isNotExpired&&flyItem.isShowFlyStatus===1" class="flexRow flexSpace" @click="seeFlightInfo">
        <div class="airFlexBox">
          <div class="airlines oldAir color53">
            <img :src="flyItem.carrierLogo" alt="">
            <span class="fontSize28">
          <span>{{flyItem.airlineCompany}}{{flyItem.flightNo}}</span>
          <span class="pl5 pr5 colorD3">|</span>
          <span>{{flyItem.craftType}}</span>
        </span>
            <!--<span class="fontSize28">{{isReturnDate ? backFlyInfo.shareAirlineName:goFlyInfo.shareAirlineName}}{{isReturnDate ? backFlyInfo.shareAirline:goFlyInfo.shareAirline}}{{isReturnDate ? backFlyInfo.craftType:goFlyInfo.craftType}}</span>-->
          </div>
          <!--实际承运-->
          <div v-if="flyItem.isShare!=0" class="airlines share color53">
            <img style="display: inline-block; vertical-align:top;margin: 0.02rem 0 0 0.05rem;" src="./path.png"/>
            <span class="fontSize28 pr10 colorBlue">实际承运</span>
            <!--<img :src="flyItem.carrierLogo" alt="">-->
            <span class="fontSize28">
          <span>{{flyItem.shareAirlineName}}{{flyItem.shareFlightNo}}</span>
              <!--<span class="pl5 pr5 colorD3">|</span>-->
              <!--<span>{{flyItem.craftType}}</span>-->
        </span>
            <!--<span class="fontSize28">{{isReturnDate ? backFlyInfo.shareAirlineName:goFlyInfo.shareAirlineName}}{{isReturnDate ? backFlyInfo.shareAirline:goFlyInfo.shareAirline}}{{isReturnDate ? backFlyInfo.craftType:goFlyInfo.craftType}}</span>-->
          </div>
        </div>
        <i class="iconfont icon-xiangyou color97 fontSize24 mt22 ml20"></i>
      </div>
      <!--不可以查看航班动态信息的-->
      <div class="flexRow flexSpace" v-else>
        <div class="airFlexBox">
          <div class="airlines oldAir color53">
            <img :src="flyItem.carrierLogo" alt="">
            <span class="fontSize28">
          <span>{{flyItem.airlineCompany}}{{flyItem.flightNo}}</span>
          <span class="pl5 pr5 colorD3">|</span>
          <span>{{flyItem.craftType}}</span>
        </span>
            <!--<span class="fontSize28">{{isReturnDate ? backFlyInfo.shareAirlineName:goFlyInfo.shareAirlineName}}{{isReturnDate ? backFlyInfo.shareAirline:goFlyInfo.shareAirline}}{{isReturnDate ? backFlyInfo.craftType:goFlyInfo.craftType}}</span>-->
          </div>
          <!--实际承运-->
          <div v-if="flyItem.isShare!=0" class="airlines share color53">
            <img style="display: inline-block; vertical-align:top;margin: 0.02rem 0 0 0.05rem;" src="./path.png"/>
            <span class="fontSize28 pr10 colorBlue">实际承运</span>
            <!--<img :src="flyItem.carrierLogo" alt="">-->
            <span class="fontSize28">
          <span>{{flyItem.shareAirlineName}}{{flyItem.shareFlightNo}}</span>
              <!--<span class="pl5 pr5 colorD3">|</span>-->
              <!--<span>{{flyItem.craftType}}</span>-->
        </span>
            <!--<span class="fontSize28">{{isReturnDate ? backFlyInfo.shareAirlineName:goFlyInfo.shareAirlineName}}{{isReturnDate ? backFlyInfo.shareAirline:goFlyInfo.shareAirline}}{{isReturnDate ? backFlyInfo.craftType:goFlyInfo.craftType}}</span>-->
          </div>
        </div>
        <!--<i class="iconfont icon-xiangyou color97 fontSize24 mt22 ml20"></i>-->
      </div>
      <div class="fly_main">
          <div class="start_city">
            <div class="fly_time Arial">{{flyItem.departTime}}</div>
            <div class="fly_date fontSize24 Arial">{{flyItem.departDate}}</div>
            <div class="fly_city fontSize30">{{flyItem.departAirportName}} {{flyItem.departAirportTerminal?flyItem.departAirportTerminal:''}}</div>
          </div>
          <div class="long_time" :class="{'active':'经停判断标识'}">
            <div class="h_m fontSize24" >{{showDuration(flyItem.duration)}}</div>
            <v-flystatus :flyIcon="flyItem.stopNum"></v-flystatus>
            <div v-if="" class="stop fontSize24">
              <span v-for="item in flyItem.stopPointList">{{item.stopCityName}}</span>
              <!--{{flyItem.stopInformation}}-->
              <!--<p v-for="stpList in flyItem.stopPointList">-->
                <!--{{stpList.stopCityName}}-->
              <!--</p>-->
            </div>
          </div>
          <div class="start_city">
            <div class="fly_time Arial">{{flyItem.arriveTime}}</div>
            <div class="fly_date fontSize24 Arial">{{flyItem.arriveDate}}</div>
            <div class="fly_city fontSize30">{{flyItem.arriveAirportName}} {{flyItem.arriveAirportTerminal?flyItem.arriveAirportTerminal:''}}</div>
          </div>
      </div>
      <div class="meals color53 fontBold fontSize28">
        <span>{{meal=flyItem.mealFlag==='1'?"有餐":"无餐"}}</span>
        <span class="pl5 pr5 colorD3">|</span>
        <span>准点率{{flyItem.onTimeRate}}</span>
      </div>
    </div>
    <!--出票时长-->
    <section v-if="(!flyPage||flyPage!=1)&&flyItem.cabin">
      <div v-if="flyItem.cabin[0].outTicketType===1" class="outTicket fontSize28">预计支付成功后<span class="fontBold">{{flyItem.cabin[0].outTicketTime||0}}分钟内</span>出票</div>
      <div v-if="flyItem.cabin[0].outTicketType===2" class="outTicket fontSize28">预计起飞前<span class="fontBold">{{flyItem.cabin[0].outTicketTime||0}}分钟内</span>出票</div>
    </section>
  </div>
</template>
<script type="text/ecmascript-6">
import FlyStatus from '@/components/Details/flyStatus'
import { mapState } from 'vuex'
  export default {
    name: 'flyDetail',
    data() {
      return{
         meal:''
//        showDuration:'',
//        duration:''
      }
    },
    components:{
      'v-flystatus':FlyStatus,
    },
    props:['flyItem','flyPage'],
    computed:{
      ...mapState({
        isReturnDate:state =>state.list.isReturnDate,
        duration:state =>state.searchDetail.showDetailInfo.duration
      }),
      isNotExpired:function () {
        let depDate=new Date(this.flyItem.departDate.replace(/-/g,"/")).getTime();
        // let depDate=new Date('2018-06-21'.replace(/-/g,"/")).getTime();
        if((depDate+24*3600*1000-(new Date().getTime()))>0){
          return true;
        }
        else {
          return false;
        }
      }
    },

    methods:{
      showDuration:function(duration){
        var dt=(this.flyItem.duration||'').split(':');
        var h=dt[0].substr(0,1)==='0'?dt[0].substr(1):dt[0];
        return h+'小时'+dt[1]+'分';
      },
      //查看航班动态信息
      seeFlightInfo:function () {
        console.log(this.flyItem);
        let obj={
          flyImg:this.flyItem.carrierLogo,
          shareFlyCompany:this.flyItem.shareAirlineName?this.flyItem.shareAirlineName:'',
          isMeal:this.flyItem.mealFlag==='1'?"有餐食":"无餐食",
          isShare:this.flyItem.isShare,
          shareFlyNo:this.flyItem.shareFlightNo,
          departAirportCode:this.flyItem.departAirportCode,       //出发城市三字码
          arriveAirportCode:this.flyItem.arriveAirportCode,       //到达城市三字码
        }
        console.log(obj);
        this.$store.commit('UPDATE_FLIGHTINFO',obj);   //飞常准接口没有返回的，在这里存一下
        this.$router.push({path:'/FlightStatus',query:{fnum:this.flyItem.flightNo,date:this.flyItem.departDate}});
      }
    },
    created:function () {
//      console.log('这是什么:'+this.flyPage);
    }
  }
</script>

<style>
  .mt22{
    margin-top: 0.22rem;
  }
  .flexSpace{
    align-items: center;
  }
  .flyDetail{
    position: relative;
    background:linear-gradient(to right,rgba(44,124,249,1),rgba(79,176,251,1));
    padding:0.3rem 0.34rem 0;
  }
  .fly_continer{
    background:rgba(255,255,255,1);
    box-shadow: 0rem 0rem 0.1rem 0rem rgba(0,0,0,0.1) ;
    border-radius: 0.1rem ;
    display:flex;
    /* justify-content: center; */
    align-items: center;
    flex-direction: column;
  }
  .flyDetail .outTicket{
    color: #fff;
    text-align: center;
    line-height: 0.4rem;
    padding: 0.11rem 0 0.12rem;
  }
  /* 去反样式表 */
  .flyDetail .go_back{
    display:flex;
    align-items: center;
    margin-top:0.25rem;
    width:2.6rem;
    justify-content: space-between;
    /*border: 1px solid #f00;*/
  }
  .flyDetail .go_back span{
      display:inline-block;
  }
  .flyDetail .go_back .go{
    flex: 0 0 0.4rem;
    /*width:0.4rem;*/
    height:0.4rem;
    background:#F13E56;
    border-radius:0.4rem 0.4rem;
    color:#fff;
    text-align:center;
    line-height:0.4rem;
    /*margin-right:0.14rem;*/
  }
  .flyDetail .go_back .back{
    flex: 0 0 0.4rem;
    width:0.4rem;
    height:0.4rem;
    background:#52C773;
    border-radius:0.4rem 0.4rem;
    color:#fff;
    text-align:center;
    line-height:0.4rem;
    /*margin-right:0.14rem;*/
  }
  .flyDetail .go_back .time{
    flex: 0 0 0.78rem;
    /*width:0.78rem;*/
    color:#535353;
    font-weight:bold;
    /*margin-right:0.08rem;*/
  }
  .flyDetail .go_back .day{
    flex: 0 0 0.6rem;
    /*width:0.6rem;*/
    color:#535353;
    font-weight:bold;
    /*margin-right:0.43rem;*/
  }
  .flyDetail .go_back .icon-shichang{
    font-size:0.2rem;
    color:#979797;
    margin-right:0.05rem;
  }
  .flyDetail .go_back .time_len{
    color:#979797;
  }
  /* 起飞城市 */
  .fly_main{
    display:flex;
    margin-top:0.1rem;
    flex-direction: row;
  }
  .fly_main .start_city{
    text-align:center;
  }
  .fly_main .fly_time{
    font-size:0.5rem;
    font-weight:bold;
    color:#535353;
    line-height:0.7rem;
  }
  .fly_main .fly_date{
    font-weight:bold;
    color:#979797;
    line-height:0.33rem;
    margin-top:0.04rem;
  }
  .fly_main .fly_city{
    font-weight:bold;
    color:#535353;
    line-height:0.42rem;
    margin-top:0.08rem;
  }
  /* 飞行时间 */
  .fly_main .long_time{
    flex:0 0 2.73rem;
    width:2.73rem;
    text-align:center;
    margin-top:0.38rem;
  }
  .fly_main .long_time.active{
    margin-top:0.4rem;
  }
  .fly_main .long_time .h_m,.fly_main .long_time .stop{
    font-weight:bold;
    color:#979797;
    line-height:0.33rem;
  }

  /* 航空公司 */
  .airlines{
    margin-top:0.22rem;
    /*margin-bottom:0.25rem;*/
  }
  .airlines.oldAir{
    margin-left: -0.05rem;
  }
  .airlines.share{
    position: relative;
    margin-top: 0.15rem;
  }

  .airlines img{
    display:inline-block;
    width: 0.3rem;
    /*height:0.21rem;*/
    margin-right:0.04rem;
    /*background:red;*/
    vertical-align: top;
    margin-top: 0.05rem;
  }

  .airlines span{
    font-weight:bold;
    line-height:0.4rem;
  }
  .meals{
    margin: 0.1rem 0 0.2rem;
  }
  .flyDetail.paddingBtm{
    padding-bottom: 0.3rem;
  }
  .airFlexBox{
    display: flex;
    flex-direction: column;
    align-items: left;
  }
</style>
