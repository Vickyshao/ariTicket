<template>
  <ul class="flyInfo">
    <h2 v-title="'返程：'+departCityName+'-'+arriveCityName"></h2>
    <li v-for="item in showCityList" class="flyList" @click="openDetail(item.flightNo)">
      <section class="flyLeft ml30 textLeft">
        <div class="flyTop">
          <div class="departInfo">
            <span class="fontSize40 Arial color53 fontBold">{{item.departTime}}</span>
            <span class="fontSize24 color79 fontBold">{{item.orgAirportShortName}}{{item.departAirportTerminal}}</span>
          </div>
          <div class="flystatus">
            <v-flystatus :flyIcon="item.stopNum" class="ml20 mr20"></v-flystatus>
            <div v-if="" class="stop fontSize24 fontBold">{{item.stopInformation}}</div>
          </div>
          <div class="returnInfo">
            <span class="fontSize40 Arial color53 fontBold arriveTime">
              {{item.arriveTime}}
              <em v-if="diffDays(item.departDate,item.arriveDate)!=0" class="addDay fontSize24">+{{diffDays(item.departDate,item.arriveDate)}}天</em>
            </span>
            <span class="fontSize24 color79 fontBold">{{item.dstAirportShortName}}{{item.arriveAirportTerminal}}</span>
          </div>
        </div>
        <div class="flyBottom mt10">
          <div class="pic">
            <img :src="item.carrierLogo" />
          </div>
          <span class="fontBold">{{item.airlineCompany}}{{item.flightNo}}<span v-if="item.isShare!=0" class="pl10 colorBlue">共享</span><span class="pl10 pr10">|</span>{{item.craftType}}</span>
        </div>
      </section>
      <section class="flyRight mr30 textRight">
      <span class="colorRed1">
        <em class="fontSize24">￥</em>
        <em class="fontSize36 fontBold">{{item.price}}</em>
      </span>
      <span class="color79 fontBold fontSize24">{{item.cabinClassName}}</span>
      <!--<span>{{item.cabinClassName}}</span><br>-->
      <span v-if="item.seatStatus!='>9'" class="ticketNum colorRed1 mt5">{{item.seatStatus}}张</span>
      </section>
    </li>
  </ul>
</template>

<script>
  import FlyStatus from '@/components/Details/flyStatus'
  import { mapState, mapMutations } from 'vuex'
  import { dateDiff } from '@/common/js/util.js'          //计算两个日期相关天数
  export default {
    data(){
      return{

      }
    },
//    props:['flylist','flyCity','flyNum'],
    computed:{
      ...mapState({
        departCityName:state =>state.search.returnCityData.departCityName,  //出发城市
        arriveCityName:state =>state.search.returnCityData.arriveCityName,  //到达城市
        queryAllCityList:state =>state.returnList.queryAllCityList,   //初使化
        showCityList:state =>state.returnList.showCityList,           //最终使用的 筛选过后的
        //返程
        departCityIataCode:state =>state.search.returnCityData.departCityIataCode, //出发城市三字码
        arriveCityIataCode:state =>state.search.returnCityData.arriveCityIataCode, //到达城市三字码
        departDate:state =>state.search.date.returnDateObj.returnDate                   //返程日期
      })
    },
    components:{
      'v-flystatus':FlyStatus
    },
    methods:{
      openDetail:async function (flightNo) {
        //航班号存 cookie里面
        let flightNum=JSON.stringify(flightNo);
        this.setCookie('ReturnFlightNumCookie',flightNum);
        //跳转到航班预订详情页
        this.$router.push({path:'/ReturnDetail'});
      },
      //计算两个日期相关天数
      diffDays:function (start,end) {
        return dateDiff(start,end);
      }
    }
  }
</script>
<style>
  .flyInfo{
    padding-bottom: 1.4rem;
  }
  .flyInfoMarginTop{
    margin-top: 1.1rem;
  }
  .flyList{
    width:7.5rem;
    /*height:1.8rem;*/
    background:rgba(255,255,255,1);
    margin-bottom: 0.2rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    line-height: 0.4rem;
    padding: 0.26rem 0 0.22rem;
  }
  .flyList .flyLeft{
    width:5.4rem;
  }
  .flyList .flyRight{
    width:1.3rem;
  }
  .flyTop{
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .departInfo{
    text-align: center;
  }
  .ticketNum{
    width:0.6rem;
    height:0.36rem;
    background:rgba(255,245,244,1);
    border-radius: 0.05rem;
    line-height: 0.36rem;
    text-align: center;
  }
  .flyBottom{
    display: flex;
    flex-direction: row;
    align-items: center;
    color: #979797;
  }
  .flyBottom .pic{
    width:0.3rem;
    margin-right: 0.08rem;
    /*height: 0.3rem;*/
  }
  .flyBottom .pic img{
    display: inline-block;
    vertical-align: top;
    margin-top: 0.05rem;
  }
  .flystatus{
    text-align: center;
    line-height: 0.3rem;
    color:#797979;
  }
  .returnInfo,.departInfo,.flyList .flyRight{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .arriveTime{
    position: relative;
  }
  .arriveTime .addDay{
    position: absolute;
    right: -0.6rem;
    top:-0.1rem;
  }
  .flyList .flyRight{
    width:1.4rem;
    align-items:flex-end;
  }
</style>
