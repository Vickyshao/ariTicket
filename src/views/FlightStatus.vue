<template>
  <div class="flightStatus">
    <!--航空信息-->
    <section class="item">
      <div class="flightCompany">
        <em class="pic">
          <img :src="flyInfo.flyImg" />
        </em>
        <em class="fontSize32 fontBold">{{flyCompany}}航空</em>
        <em v-if="flyInfo.isShare===1" class="ml30 fontSize22">
          <span class="color97">共享航班：</span>
          {{flyInfo.shareFlyCompany}} {{flyInfo.shareFlyNo}}
        </em>
      </div>
      <!--状态: 计划 起飞 延误 到达-->
      <v-flystatus :statusInfo="statusInfo"></v-flystatus>
      <!--航班信息 明细-->
      <div class="flightDetail">
        <!--机场-->
        <section class="flexRow flexSpace">
          <div>
            <p class="fontSize24 color97 lineHeight34">PEK</p>
            <p class="fontSize30 color53 lineHeight40">{{flightInfo.FlightDepAirport}} {{flightInfo.FlightHTerminal}}</p>
          </div>
          <v-flystop :flyIcon="0"></v-flystop>
          <div class="textRight">
            <p class="fontSize24 color97 lineHeight34">PEK</p>
            <p class="fontSize30 color53 lineHeight40">{{flightInfo.FlightArrAirport}} {{flightInfo.FlightTerminal}}</p>
          </div>
        </section>
        <!--预计时间-->
        <section class="flexRow flexSpace mt20">
          <div>
            <p v-if="flightInfo.FlightState==='起飞'||flightInfo.FlightState==='到达'" class="fontSize24 color97 lineHeight34">实际起飞</p>
            <p class="fontSize24 color97 lineHeight34" v-else>预计起飞</p>
            <p class="fontSize50 color53 lineHeight70 Arial fontBold">{{departTm}}</p>
          </div>
          <div class="textRight">
            <p v-if="flightInfo.FlightState==='到达'" class="fontSize24 color97 lineHeight34">实际到达</p>
            <p class="fontSize24 color97 lineHeight34" v-else>预计到达</p>
            <p class="fontSize50 color53 lineHeight70 Arial fontBold">{{arriveTm}}</p>
          </div>
        </section>
        <!--计划时间-->
        <section class="flexRow flexSpace mt20">
          <div>
            <p class="fontSize24 color97 lineHeight34">计划起飞</p>
            <p class="fontSize24 color97 lineHeight34">{{flightInfo.FlightDeptimePlanDate?flightInfo.FlightDeptimePlanDate.substring(0,flightInfo.FlightDeptimePlanDate.length-3):'--'}}</p>
            <!--<p class="fontSize50 color53 lineHeight70 Arial">06:30</p>-->
          </div>
          <div class="cBox color53">{{flyInfo.isMeal===1?'有餐食':'无餐食'}}</div>
          <div class="textRight">
            <p class="fontSize24 color97 lineHeight34">计划到达</p>
            <p class="fontSize24 color97 lineHeight34">{{flightInfo.FlightArrtimePlanDate?flightInfo.FlightArrtimePlanDate.substring(0,flightInfo.FlightArrtimePlanDate.length-3):'--'}}</p>
            <!--<p class="fontSize50 color53 lineHeight70 Arial">10:30</p>-->
          </div>
        </section>
        <!--值机/登机口/行李转盘-->
        <section class="flexRow flexSpace mt20">
          <div class="w236">
            <p class="fontSize24 color97 lineHeight34">值机柜台</p>
            <p class="fontSize32 color53 lineHeight40 Arial">{{flightInfo.CheckinTable?flightInfo.CheckinTable:'--'}}</p>
          </div>
          <div class="lineBox">
            <p class="fontSize24 color97 lineHeight34">登机口</p>
            <p class="fontSize32 color53 lineHeight40 Arial">{{flightInfo.BoardGate?flightInfo.BoardGate:'--'}}</p>
          </div>
          <div class="w236 textRight">
            <p class="fontSize24 color97 lineHeight34">行李转盘</p>
            <p class="fontSize32 color53 lineHeight40 Arial">{{flightInfo.BaggageID?flightInfo.BaggageID:'--'}}</p>
          </div>
        </section>
      </div>
    </section>
    <!--出发地与天气-->
    <section class="item mt20 weather">
      <!--出发地-->
      <section class="flexRow flexSpace borderBtm">
        <div>
          <p class="fontSize24 color97 lineHeight34">出发地</p>
          <p class="fontSize30 color53 lineHeight40">{{flightInfo.FlightDep?flightInfo.FlightDep:''}}</p>
        </div>
        <div class="textRight">
          <p class="fontSize24 color97 lineHeight34">出发机场</p>
          <p class="fontSize30 color53 lineHeight40">{{flightInfo.FlightDepAirport?flightInfo.FlightDepAirport:''}}</p>
        </div>
      </section>
      <!--天气-->
      <section class="flexRow flexSpace pt44">
        <div class="flexRow weatherPic">
          <i class="iconfont" :class="weatherPic[depNum]"></i>
          <em class="fontSize26 lineHeight34 ml10 mt5">
            <span>{{depWeather[0]}}</span><br>
            <span v-if="depWeather[4]?depWeather[4].indexOf('/')!=-1:false">{{depWeather[4]?depWeather[4].split('/')[0]:''}}°/{{depWeather[4]?depWeather[4].split('/')[1]:''}}°</span>
            <span v-if="depWeather[4]?depWeather[4].indexOf('/')===-1:false&&depWeather[4]!==''">{{depWeather[4]}}°</span>
            <span v-if="!depWeather[4]">--</span>
          </em>
        </div>
        <div class="wBox">
          <p class="fontSize24 color97 lineHeight34">能见度</p>
          <p class="fontSize30 color53 lineHeight40 fontBold">{{depWeather[1]?depWeather[1]+'m':'--'}}</p>
        </div>
        <div class="wBox">
          <p class="fontSize24 color97 lineHeight34">风力</p>
          <p class="fontSize30 color53 lineHeight40 fontBold">{{depWeather[2]?depWeather[2]:'--'}}</p>
        </div>
        <div class="wBox">
          <p class="fontSize24 color97 lineHeight34">PM2.5</p>
          <p class="fontSize30 color53 lineHeight40 fontBold">{{depWeather[3]?depWeather[3]+' '+weatherPm(depWeather[3]):'--'}}</p>
        </div>
      </section>
    </section>
    <!--到达地与天气-->
    <section class="item mt20 weather">
      <!--到达地-->
      <section class="flexRow flexSpace borderBtm">
        <div>
          <p class="fontSize24 color97 lineHeight34">到达地</p>
          <p class="fontSize30 color53 lineHeight40">{{flightInfo.FlightArr}}</p>
        </div>
        <div class="textRight">
          <p class="fontSize24 color97 lineHeight34">到达机场</p>
          <p class="fontSize30 color53 lineHeight40">{{flightInfo.FlightArrAirport}}</p>
        </div>
      </section>
      <!--天气-->
      <section class="flexRow flexSpace pt44">
        <div class="flexRow weatherPic">
          <i class="iconfont" :class="weatherPic[arrNum]"></i>
          <em class="fontSize26 lineHeight34 ml10 mt5">
            <span>{{arrWeather[0]}}</span><br>
            <span v-if="arrWeather[4]?arrWeather[4].indexOf('/')!=-1:false">{{arrWeather[4]?arrWeather[4].split('/')[0]:''}}°/{{arrWeather[4]?arrWeather[4].split('/')[1]:''}}°</span>
            <span v-if="arrWeather[4]?arrWeather[4].indexOf('/')===-1:false&&arrWeather[4]!==''">{{arrWeather[4]?arrWeather[4]:''}}°</span>
            <span v-if="!arrWeather[4]">--</span>
          </em>
        </div>
        <div class="wBox">
          <p class="fontSize24 color97 lineHeight34">能见度</p>
          <p class="fontSize30 color53 lineHeight40 fontBold">{{arrWeather[1]?arrWeather[1]+'m':'--'}}</p>
        </div>
        <div class="wBox">
          <p class="fontSize24 color97 lineHeight34">风力</p>
          <p class="fontSize30 color53 lineHeight40 fontBold">{{arrWeather[2]?arrWeather[2]:'--'}}</p>
        </div>
        <div class="wBox">
          <p class="fontSize24 color97 lineHeight34">PM2.5</p>
          <p class="fontSize30 color53 lineHeight40 fontBold">{{arrWeather[3]?arrWeather[3]+' '+weatherPm(arrWeather[3]):'--'}}</p>
        </div>
      </section>
    </section>
    <!--机型、机龄-->
    <section class="item mt20 weather">
      <!--出发地-->
      <section class="flexRow flexSpace">
        <div>
          <!--<p class="fontSize24 color97 lineHeight34">空客 AIRBUSA330-323E</p>-->
          <p v-if="flightInfo.generic!==''" class="fontSize30 color53 lineHeight40">机型：{{flightInfo.generic}}</p>
          <p v-if="flightInfo.FlightDuration" class="fontSize22 color53 lineHeight34 mt10">
            飞行时长<span v-if="parseInt(flightInfo.FlightDuration)>=60">{{parseInt(parseInt(flightInfo.FlightDuration)/60)}}小时</span>
            <span v-if="parseInt(flightInfo.FlightDuration)%60!==0">{{parseInt(parseInt(flightInfo.FlightDuration)%60)}}分钟</span>/飞行里程{{flightInfo.distance?flightInfo.distance+'km':''}}
          </p>
          <p v-if="flightInfo.FlightYear!==''" class="fontSize22 color53 lineHeight34">机龄：<span>{{flightInfo.FlightYear}}年</span></p>
        </div>
        <div class="textRight">
          <em class="pic">
            <img :src="flyInfo.flyImg" />
          </em>
        </div>
      </section>
    </section>
  </div>
</template>
<script>
  import FlyStatus from "@/components/Order/flyStatus"
  import FlyStop from '@/components/Details/flyStatus'
  import { mapState } from 'vuex';
  export default {
    data(){
      return {
        flightInfo:{},
        flyCompany:'',
        depWeather:[],      //出发城市 天气
        arrWeather:[],      //到达城市 天气
        statusInfo:{},
        departTm:'',        //预计起飞时间
        arriveTm:'',        //预计到达时间
        weatherPic:['icon-qing','icon-mai','icon-yu','icon-yin','icon-xue','icon-feng',''],       //天气小图标
        depNum:0,           //出发地 天气小图标
        arrNum:0,           //到达地 天气小图标
      }
    },
    components:{
      'v-flystatus':FlyStatus,
      'v-flystop':FlyStop
    },
    computed:{
      ...mapState({
        flyInfo:state =>state.flightInfo.flyInfo,      //
      })
    },
    created:async function () {
      //航班动态 接口调试
      let param={
        fnum:this.$route.query.fnum,
        date:this.$route.query.date
      }
      const response=await this.$root.http.get('/vari/flight', param,this);
      if(response){
        let vm=this;
        //取出发地与到达地一致数据
        response.data.forEach(function (item,index) {
          if(vm.flyInfo.departAirportCode===item.FlightDepcode&&vm.flyInfo.arriveAirportCode===item.FlightArrcode){
            vm.flightInfo=item;
          }
        })
        // this.flightInfo=response.data[0];
        this.flyCompany=this.flightInfo.FlightCompany?this.flightInfo.FlightCompany.substring(0,this.flightInfo.FlightCompany.indexOf('航空')):'';
        this.depWeather=this.flightInfo.DepWeather?this.flightInfo.DepWeather.split('|'):'';
        this.arrWeather=this.flightInfo.ArrWeather?this.flightInfo.ArrWeather.split('|'):'';
        this.statusInfo={
          FlightState:this.flightInfo.FlightState,                      //状态
          FlightDeptimeDate:this.flightInfo.FlightDeptimeDate,          //实际起飞时间
          FlightArrtimeReadyDate:this.flightInfo.FlightArrtimeReadyDate,//预计到达时间
          FlightArrtimeDate:this.flightInfo.FlightArrtimeDate,          //实际到达时间
          FlightArrtimePlanDate:this.flightInfo.FlightArrtimePlanDate,  //计划到达时间
          OntimeRate:this.flightInfo.OntimeRate,                        //准点率
          FlightDuration:this.flightInfo.FlightDuration,                //时长
        }
        //预计起飞时间 / 预计到达时间 如果是起飞与到达 显示实际起飞时间
        let depTime,arrTime;
        if(this.flightInfo.FlightState==='起飞'){
          depTime=this.flightInfo.FlightDeptimeDate?this.flightInfo.FlightDeptimeDate.split(' ')[1].split(':'):'';
          if(this.flightInfo.FlightArrtimeReadyDate){
            arrTime=this.flightInfo.FlightArrtimeReadyDate?this.flightInfo.FlightArrtimeReadyDate.split(' ')[1].split(':'):'';
          }
          else{
            arrTime=this.flightInfo.FlightArrtimePlanDate?this.flightInfo.FlightArrtimePlanDate.split(' ')[1].split(':'):'';
          }
        }
        else if(this.flightInfo.FlightState==='到达'){
          depTime=this.flightInfo.FlightDeptimeDate?this.flightInfo.FlightDeptimeDate.split(' ')[1].split(':'):'';
          arrTime=this.flightInfo.FlightArrtimeDate?this.flightInfo.FlightArrtimeDate.split(' ')[1].split(':'):'';
        }
        else {
          if(this.flightInfo.FlightDeptimeReadyDate&&this.flightInfo.FlightArrtimeReadyDate){
            depTime=this.flightInfo.FlightDeptimeReadyDate?this.flightInfo.FlightDeptimeReadyDate.split(' ')[1].split(':'):'';
            arrTime=this.flightInfo.FlightArrtimeReadyDate?this.flightInfo.FlightArrtimeReadyDate.split(' ')[1].split(':'):'';
          }
          else {
            depTime=this.flightInfo.FlightDeptimePlanDate?this.flightInfo.FlightDeptimePlanDate.split(' ')[1].split(':'):'';
            arrTime=this.flightInfo.FlightArrtimePlanDate?this.flightInfo.FlightArrtimePlanDate.split(' ')[1].split(':'):'';
          }
        }
        if(depTime[0]&&depTime[1]){
          this.departTm=depTime[0]+':'+depTime[1];  //预计起飞时间
        }
        else {
          this.departTm='--';
        }
        if(arrTime[0]&&arrTime[1]){
          this.arriveTm=arrTime[0]+':'+arrTime[1];  //预计到达时间
        }
        else{
          this.arriveTm='--'
        }

        //天气小图标显示
        let weatherShowPic=function (wObj,num) {
          if(wObj?wObj.indexOf('晴')!==-1:false){
            vm[num]=0
          }
          else if(wObj?wObj.indexOf('霾')!==-1:false){
            vm[num]=1
          }
          else if(wObj?wObj.indexOf('雨')!==-1||wObj.indexOf('雹')!==-1:false){
            vm[num]=2
          }
          else if(wObj?wObj.indexOf('云')!==-1||wObj.indexOf('阴')!==-1||wObj.indexOf('雾')!==-1:false){
            vm[num]=3
          }
          else if(wObj?wObj.indexOf('雪')!==-1:false){
            vm[num]=4
          }
          else if(wObj?wObj.indexOf('风')!==-1:false){
            vm[num]=5
          }
          else if(wObj){
            vm[num]=3
          }
          else{
            vm[num]=6
          }
        }
        weatherShowPic(this.depWeather[0],'depNum');      //出发地 天气
        weatherShowPic(this.arrWeather[0],'arrNum');      //到达地 天气
      }
    },
    methods:{
      //预计起飞时间
      // departTm:function () {
      //   if(this.flightInfo){
      //     let time=this.flightInfo.FlightDeptimeReadyDate?this.flightInfo.FlightDeptimeReadyDate.split(' ')[1].split(':'):'';
      //     let allTm=time[0]+':'+time[1];
      //     return allTm;
      //   }
      // },
      //预计到达时间
      // arriveTm:function () {
      //   if(this.flightInfo){
      //     let time=this.flightInfo.FlightArrtimeReadyDate?this.flightInfo.FlightArrtimeReadyDate.split(' ')[1].split(':'):'';
      //     let allTm=time[0]+':'+time[1];
      //     return allTm;
      //   }
      // },
      weatherPm(pm){
        let str='';
        if(pm>0&&pm<50){
          str='优'
        }
        else if(pm>50&&pm<100){
          str='良'
        }
        else if(pm>100&&pm<150){
          str='轻度污染'
        }
        else if(pm>150&&pm<200){
          str='中度污染'
        }
        else if(pm>200&&pm<300){
          str='重度污染'
        }
        else if(pm>300){
          str='严重污染'
        }
        else{
          str=''
        }
        return str;
      }
    }
  }
</script>
<style scoped>

  .flightStatus img{
    width:100%;
    height: auto;
  }
  .flightStatus{
    background: #2C7CF9;
    padding: 0.34rem;
    min-height: 13.33rem;
  }
  .flightStatus .item{
    background: #fff;
    border-radius: 0.1rem;
    color: #535353;
  }
  .flightStatus .flightCompany{
    padding: 0.26rem 0.34rem 0.3rem;
    line-height: 0.4rem;
  }
  .flightStatus .pic{
    width:0.3rem;
    display: inline-block;
    vertical-align: top;
    margin-top: 0.04rem;
  }

  /*航班信息 具体内容*/
  .lineHeight34{
    line-height: 0.34rem;
  }
  .lineHeight40{
    line-height: 0.4rem;
  }
  .lineHeight70{
    line-height: 0.7rem;
  }
  .flightStatus .flexSpace{
    align-items: center;
  }
  .flightStatus .flightDetail{
    padding: 0.4rem 0.3rem;
  }
  .flightStatus .cBox{
    width:1.18rem;
    height: 0.44rem;
    line-height: 0.44rem;
    text-align: center;
    border-radius: 0.22rem;
    border: 0.02rem solid #ebebeb;
  }
  .flightStatus .lineBox{
    width:2.36rem;
    text-align: center;
    border-left: 0.02rem solid #ebebeb;
    border-right: 0.02rem solid #ebebeb;
  }
  .w236{
    width:2.36rem;
  }
  /*天气*/
  .flightStatus .item.weather{
    padding: 0.26rem 0.3rem 0.52rem;
  }
  .borderBtm{
    border-bottom: 0.02rem solid #ebebeb;
    padding-bottom: 0.12rem;
  }
  .icon-hangbandongtai{
    font-size:0.8rem;
    color: #FFD100;
  }
  .pt44{
    padding-top: 0.44rem;
  }
  .wBox{
    /*width:1.32rem;*/
    flex:1;
    border-left: 0.02rem solid #ebebeb;
    text-align: center;
  }
  .weatherPic{
    /*align-items: center;*/
    margin-top: -0.05rem;
    width:1.7rem;
    margin-right: 0.2rem;
  }
  .weatherPic .iconfont{
    font-size: 0.8rem;
    color: #378CFA;
    margin-top: -0.05rem;
  }
  .weatherPic .iconfont.icon-qing{
    color: #FFD100;
  }
</style>
