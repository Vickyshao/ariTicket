<template>
  <div class="orderDetail">
    <h2 v-title="'改签详情'"></h2>
    <div v-if="isCarryOut===2">
      <!--订单状态-->
      <section class="item changeBtm0 color53">
        <p class="topStatus ml30 flexRow flexSpace mr30">
          <span class="fontSize34 fontBold">
            {{ChangeStatus(changeInfo.ChangeStatus)}}
          </span>
          <span v-if="changeInfo.ChangeStatus===2||changeInfo.ChangeStatus===3" class="mr30">
            <em class="fontSize28 color53">
              已支付差额：
              <!--<span class="colorRed Arial fontSize34 fontBold">￥{{orderTotailPrice}}</span>-->
              <span class="colorRed Arial fontSize34 fontBold">￥{{changeInfo.TotalPrice}}</span>
            </em>
          </span>
        </p>
        <!--温馨提示-->
        <div class="rewardPoints fontSize28 color53 flexRow flexSpace" @click="changeProcess">
          <em v-if="changeInfo.ChangeStatus===1" class="mr20">
            请务必在<em class="colorRed fontBold">{{minite}}分{{second}}秒</em>内完成支付，超时后交易将被关闭；超时后，需重新联系客服确认改签航班信息及费用；支付成功后，改签结果将以短信的形式通知您。
          </em>
          <em v-if="changeInfo.ChangeStatus===0" class="mr20">
            请等待客服处理改签申请
          </em>
          <em v-if="changeInfo.ChangeStatus===2" class="mr20">
            改签费用已支付，待出票
          </em>
          <em v-if="changeInfo.ChangeStatus===3" class="mr20">
            改签成功，已出票
          </em>
          <em v-if="changeInfo.ChangeStatus===99" class="mr20">
            改签已取消
          </em>
          <i class="iconfont icon-xiangyou color97 fontSize24"></i>
        </div>
      </section>
      <!--航班信息 状态一-->
      <section v-if="changeInfo.ChangeStatus===0||changeInfo.ChangeStatus===99" class="refundFlyInfo flexcolumn fontSize28 item fontBold">
        <em>
          <span class="logoImg"><img src="http://m.tuniucdn.com/fb2/t1/G1/M00/74/55/Cii9EFZ4IsSICnHKAABdnk_QLFwAABGQwBslu0AAF22067_w40_h40_c1_t0.png"></span>
          {{changeInfo.AirlineCompany}}{{changeInfo.FlightNum}} | {{changeInfo.CraftType}}
        </em>
        <em>{{changeInfo.DepartCityName}}{{changeInfo.DepartAirportName}} ⇀ {{changeInfo.ArriveCityName}}{{changeInfo.ArriveAirportName}}</em>
        <em>{{dateShort}} {{dateDay}} {{changeInfo.DepartTime}} ~ {{changeInfo.ArriveTime}}</em>
        <!--<p>{{detail.DepartCityName}}{{detail.DepartAirportName}} ⇀ {{detail.ArriveCityName}}{{detail.ArriveAirportName}}</p>-->
        <!--<p>{{dateShort}} {{dateDay}} {{detail.DepartTime}}~{{detail.ArriveTime}}</p>-->
      </section>
      <section class="item pt0">
        <!--航班信息 状态二-->
        <v-flyDetail v-if="changeInfo.ChangeStatus===1||changeInfo.ChangeStatus===2||changeInfo.ChangeStatus===3" :flyItem="flydetail"></v-flyDetail>
        <!--<div>你好啊</div>-->
      </section>
      <section class="item" :class="{changeBtm0:changeInfo.ChangeStatus===0||changeInfo.ChangeStatus===99}">
        <!--乘机人-->
        <div v-if="true" class="ml30 color53 fontSize28 ptpbtm mr30">
          <div class="fontSize28 lineHeight40">乘机人：</div>
          <div v-for="item in details" class="flexRow mt20 alignStart">
            <span class="fontBold w90">{{item.TouristName}}</span>
            <div class="flexcolumn">
              <em class="flexRow">
                <span v-if="item.PersonType==='ADT'" class="ml23 w90 textRight">成人票</span>
                <span v-if="item.PersonType==='CHD'" class="ml23 w90 textRight">儿童票</span>
                <span class="ml30">
                  <i v-if="item.PsptType===1">身份证</i>
                  <i v-if="item.PsptType===2">护照</i>
                  <i v-if="item.PsptType===4">港澳通行证</i>
                  <i v-if="item.PsptType===8">回乡证</i>
                  {{item.PsptId}}
                </span>
              </em>
              <!--原票号-->
              <em v-if="changeInfo.ChangeStatus===0||changeInfo.ChangeStatus===99" class="mt10 flexRow">
                <span class="ml23 w90 textRight">原票号</span>
                <span class="ml30">{{item.TicketCode}}</span>
              </em>
              <!--新票号-->
              <em v-if="changeInfo.ChangeStatus===3" class="mt10 flexRow">
                <span class="ml23 w90 textRight">新票号</span>
                <span class="ml30">{{item.TicketCodeNew}}</span>
              </em>
            </div>
          </div>
        </div>
        <!--改签日期,改签方式-->
        <section v-if="changeInfo.ChangeStatus===0||changeInfo.ChangeStatus===99" class="ml30 mr30">
          <p class="changeDateStyle color53 fontSize28">
            <em>改签日期：</em>
            <em class="ml56">{{changeInfo.ChangeDate}}</em>
          </p>
          <p class="changeDateStyle color53 fontSize28">
            <em>改签方式：</em>
            <em class="ml56">{{changeInfo.ChangeType===1?'自愿改签':'非自愿改签'}}</em>
          </p>
        </section>
      </section>
      <section v-if="changeInfo.ChangeStatus===1" class="item orderPayFooter flexRow flexSpace">
        <div class="w450 ml30 flexRow flexSpace">
          <em>
            <span class="fontSize28">补全差价：</span>
            <span class="colorRed Arial">
              <span>￥</span>
              <!--<span class="fontSize36">{{orderTotailPrice}}</span>-->
              <span class="fontSize36">{{payInfo[0].Cost}}</span>
            </span>
          </em>
          <!--<em class="moneyDetail" @click="$store.commit('SHOW_PAYDETAIL',2)">-->
            <!--明细-->
          <!--</em>-->
        </div>
        <div class="goPayBtn fontSize36" @click="goToPay(payInfo[0].CostId)">去支付</div>
      </section>
      <v-dialogbox>
        <em slot="confirm" class="confirm oneBtn" @click="promptBox">确定</em>
      </v-dialogbox>
    </div>
  </div>
</template>
<script>
  import FlyDetail from "@/components/Details/flyDetail"
  import PayDetail from '@/components/Order/paymentDetails'
  import Retired from '@/components/Dialog/retired'
  import DialogBox from '@/components/Modal/dialogueBox'
  import { dateFormat } from '@/common/js/util.js'
  import { mapState, mapMutations } from 'vuex'
  export default {
    data(){
      return {
        minite:'',
        second:'',
        dateShort:'',
        dateDay:'',
        // orderID:'',
        emsAmount:0,
        integralNum:0,
        isCarryOut:1,
        changeInfo:{},
        flydetail:{},
        details:[],
        payInfo:[],
        isShowFly:0,          //0代表不可以查看航班动态 1可以查看 已完成状态变为1
      }
    },
    components:{
      'v-flyDetail':FlyDetail,
      'v-payDetail':PayDetail,
      'v-retired':Retired,
      'v-dialogbox':DialogBox
    },
    computed:{
//       ...mapState({
//         // detail:state =>state.orderDetail.orderDetail.detail,          //基础信息
//         // insurances:state =>state.orderDetail.orderDetail.insurances,
//         // tourists:state =>state.orderDetail.orderDetail.tourists,      //乘机人
//         // trans:state =>state.orderDetail.orderDetail.trans,
//         // flyDetail:state =>state.orderDetail.orderDetail.flyDetail,
//         // ems:state =>state.orderDetail.orderDetail.ems,
//         // insurances:state =>state.orderDetail.orderDetail.insurances,
//         // orderTotailPrice:state =>state.orderDetail.orderTotailPrice
// //        dialogNum:state =>state.modal.dialogNum
//       }),
    },
    created:async function () {
      this.$store.commit('loadingShow','拼命加载中');
      let applyId=this.$route.query.applyId;
      console.log(applyId)
      // this.orderID=orderid
      const res=await this.$root.http.get('/order/changeInfo', {applyId:applyId},this);
      if(res){
        if(res.data.success){
          this.isCarryOut=2;
          if(res.data.data.changeInfo.ChangeStatus===2||res.data.data.changeInfo.ChangeStatus===3){
            this.isShowFly=1;
          }
          this.changeInfo=res.data.data.changeInfo;
          this.details=res.data.data.details;
          this.payInfo=res.data.data.payInfo;
          this.flydetail={
            departTime:res.data.data.changeInfo.DepartTime,
            departDate:res.data.data.changeInfo.DepartDate,
            departAirportName:res.data.data.changeInfo.DepartAirportName,
            duration:res.data.data.changeInfo.Duration,
            arriveTime:res.data.data.changeInfo.ArriveTime,
            arriveDate:res.data.data.changeInfo.ArriveDate,
            arriveAirportName:res.data.data.changeInfo.ArriveAirportName,
            airlineCompany:res.data.data.changeInfo.AirlineCompany,
            shareAirlineName:res.data.data.changeInfo.ShareAirlineName,
            flightNo:res.data.data.changeInfo.FlightNum,
            shareFlightNo:res.data.data.changeInfo.ShareFlightNo,
            isShare:res.data.data.changeInfo.IsShare,
            carrierLogo:res.data.data.changeInfo.CarrierLogo,
            craftType:res.data.data.changeInfo.CraftType,
            stopNum:res.data.data.changeInfo.StopNum,
            mealFlag:res.data.data.changeInfo.MealFlag,
            onTimeRate:res.data.data.changeInfo.OnTimeRate,
            stopPointList:JSON.parse(res.data.data.changeInfo.StopPointList),
            flyPage:1,
            isShowFlyStatus:this.isShowFly,                                         //是否可以看航班动态信息
            departAirportCode:res.data.data.changeInfo.DepartAirportCode,           //出发机场三字码
            arriveAirportCode:res.data.data.changeInfo.ArriveAirportCode,           //到达机场三字码
            departAirportTerminal:res.data.data.changeInfo.DepartAirportTerminal,   //出发机场 航站楼
            arriveAirportTerminal:res.data.data.changeInfo.ArriveAirportTerminal,   //到达机场 航站楼
          };
          // console.log(this.flydetail);
        }
      }

      //时间换算 dateFormat
      let dateObj=dateFormat(this.changeInfo.DepartDate);
      this.dateShort=dateObj.DateShort;
      this.dateDay=dateObj.DateDay;

      //30分钟倒计时
      var vm=this;
      function setOverTime(Num,m,s){
//        var dataTime = this.$refs.timer;
        //这边我只考虑60S以上的，没有再去判断了。
        if(Num>0){
          vm[m]=parseInt(Num/60);   //分
          vm[s]=parseInt(Num%60);   //秒
        }
        else {
          vm[m]=0;   //分
          vm[s]=0;   //秒
        }

//        dataTime.innerHTML = parseInt(Num/60)+'分'+parseInt(Num%60)+'秒';
        //添加定时器
        var saveTime = setInterval(function(){
          Num--;
          overTime(Num);
        },1000);
        async function overTime(num){
          if(num>0){
            var mins = parseInt(num/60)
            var seconds = parseInt(num%60);
            if(mins>=0){
              vm[m]=mins;   //分
              vm[s]=seconds;   //秒
            }
          }
          else {
            clearInterval(saveTime);
          }
        }

      }
      //执行函数并可传入参数为秒数
      if(this.payInfo){
        var secDate=new Date(this.payInfo[0].ExpiryTime);
        var secMin=secDate.getTime();
        // var newsDate=new Date(min);
        var lastSecMin=(secMin-(new Date()).getTime())/1000;
        setOverTime(lastSecMin,'minite','second');      //二次支付的倒计时
      }


    },
    methods:{
      //状态显示文字
      ChangeStatus:function (status) {
        let str='';
        switch (status){
          case 0:
            str='改签中，请等待...';
            break;
          case 1:
            str='改签中，确定航班待支付';
            break;
          case 2:
            str='待出票';
            break;
          case 3:
            str='改签成功';
            break;
          case 99:
            str='改签已取消';
            break;
        }
        return str;
      },
      //取消订单
      // cancelOrder:async function (num) {
      //   this.$store.commit('updateDialogNum',1);     //普通消息框 带确认
      //   if(num===1){
      //     this.$store.commit('dialogBoxShow','确认要取消订单？');
      //   }
      //   else{
      //     this.$store.commit('dialogBoxShow','确认申请退票？');
      //   }
      // },
      //去支付
        goToPay:async function (costId) {
          let isNotExpiryTime=new Date(this.payInfo[0].ExpiryTime).getTime()-new Date().getTime()>0;
          if(isNotExpiryTime){
            this.$store.commit('loadingShow','拼命加载中');
            let url=window.location.href;
            let param={
              costId:costId,
              returnUrl:url
            }
            const res=await this.$root.http.get('/order/payAgain',param,this);
            if(res){
              if(res.data.success){
                window.location.href=res.data.data;
              }
              else{
                this.$store.dispatch('modalCountdown',res.data.msg); //带倒计时的消息框
              }
            }
          }
          else{
            this.$store.commit('updateDialogNum',3);
            this.$store.commit('dialogBoxShow','支付已超时，请联系客服，客服电话：400 820 3333*9');
          }

        },
        changeProcess:function () {
          this.$router.push({path:'/ChangeProcess',query:{OrderId:this.details[0].ApplyId}});
        },
        //支付已超时的提示框关闭
        promptBox:function () {
          this.$store.commit('dialogBoxHide');       //关闭提示框
        }
//       //退改签规则
//       retiredPopup:async function (ruleInfos) {
//         let obj1={
//           freeLuggage:this.detail.FreeLuggage,
//           freeLuggageUnit:this.detail.FreeLuggageUnit
//         }
//         this.$store.commit('updateFreeLuggage',obj1);
//         let obj={
//           Data:JSON.parse(ruleInfos)
//         };
// //        console.log(obj.Data);
//         this.$store.commit('UPDATE_RETIRED',obj);   //退改签页面绑定数据
//         this.$store.commit('retiredShow');          //显示弹出层
//       },
//       //申请退票或取消
//       applyRefund:async function (orderid) {
// //        console.log('为什么进不来呢！');
// //        console.log('订单号是多少;'+orderid);
//
//         this.$store.commit('loadingShow','拼命加载中');
//         const res=await this.$root.http.get('/cancelOrder/'+orderid);
//         //如果取消成功了返回订单列表页
//         if(res){
//           if(res.data!=null){
//             if(res.data.success){
// //              console.log('成功了！');
//               this.$store.commit('dialogBoxHide');
//               this.$store.dispatch('modalCountdown',res.data.msg); //带倒计时的消息框
//               location.reload();
//             }
//             else{
//               this.$store.dispatch('modalCountdown',res.data.msg); //带倒计时的消息框
//             }
//           }
//         }
//
//       },
//       //退票
//       refundTicket:function () {
// //        console.log('为什么不行呢');
//         this.$router.push({path:'/RequestRefund',query:{OrderId:this.detail.OrderId}});
// //        this.$router.push({path:'/RequestRefund'});
//       }
    },

  }
</script>
<style scoped>
  .font14{
    font-size: 0.14rem;
  }
  .w590{
    width:5.9rem;
  }
  .flexRow{
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .flexSpace{
    justify-content: space-between;
    align-items: center;
  }
  .orderDetail .item{
    width:7.5rem;
    background: #fff;
    padding: 0.25rem 0;
    margin-bottom: 0.2rem;
  }
  .orderDetail .item.changeBtm0{
    padding-bottom: 0;
    margin-bottom: 0;
  }
  .orderDetail .item p{
    line-height: 0.4rem;
    padding: 0.1rem 0;
  }
  .orderDetail .timeReminder{
    width:5.64rem;
    height:0.44rem;
    color:rgba(83,83,83,1);
    line-height:0.48rem;
    display: block;
    background:rgba(255,253,233,1);
    border-radius: 0.08rem;
    padding-left: 0.12rem;
  }
  .orderDetail .item.pt0{
    padding-top: 0px;
    padding-bottom: 0;
  }
  .orderDetail .item .btLine{
    border-bottom: 0.02rem solid #ebebeb;
  }
  .orderDetail .item .ptpbtm{
    padding: 0 0 0.2rem 0;
  }
  .orderDetail .orderCancelBtn{
    border-top:0.02rem solid #ebebeb;
    text-align: center;
    height: 1rem;
    line-height: 1rem;
  }
  .orderDetail .orderCancelBtn.change em{
    width:50%;
    text-align: center;
  }
  .orderDetail .item.lineHeight{
    height: 0.9rem;
    line-height: 0.9rem;
    padding: 0;
  }
  .orderDetail .orderPayFooter{
    border-top:0.02rem solid #ebebeb;
    border-bottom: none;
    padding: 0px;
    height: 1.07rem;
    line-height: 1.07rem;
    margin-bottom: 0px;
    position: fixed;
    bottom: 0;
    left: 0;
    width:7.5rem;
    z-index: 2;
  }
  .item.notLine{
    border: none;
  }
  .goPayBtn{
    width:2.4rem;
    height:1.07rem;
    background:linear-gradient(rgba(231,70,92,1),rgba(255,92,92,1));
    line-height: 1.07rem;
    text-align: center;
    color: #fff;
  }
  .w450{
    width:4.5rem;
  }
  .moneyDetail{
    width:0.78rem;
    height:0.4rem;
    background:rgba(255,255,255,1);
    border-radius: 0.05rem;
    border:0.02rem solid #2C7CF9;
    line-height: 0.4rem;
    text-align: center;
    color: #2C7CF9;
  }
  .item.insurance{
    min-height: 0.9rem;
  }
  .h_line40{
    line-height: 0.4rem;
  }
  .item.marginBottom{
    padding-bottom: 1.07rem;
  }
  .ml23{
    margin-left: 0.23rem;
  }
  .flexcolumn{
    display: flex;
    flex-direction: column;
  }
  .w400{
    width:4rem;
  }
  .w120{
    width:1.2rem;
  }
  .w90{
    width:0.9rem;
    word-break:break-all;
  }
  .orderDetail .integral{
    /*background: #fffde9;*/
    padding: 0.2rem 0.34rem;
    line-height: 0.5rem;
    border-bottom:0.02rem solid #ebebeb;
    border-top:0.02rem solid #ebebeb;
    /*font-size: 0.28rem;*/
    color: #979797;
    /*color:#C0191F;*/
  }
  .rewardPoints{
    width:7.5rem;
    padding: 0.26rem 0.34rem;
    background:rgba(255,253,233,1);
    line-height: 0.4rem;
  }
  .lineHeight{
    line-height: 0.4rem;
  }
  .lineEB{
    height: 0.57rem;
    width:0;
    border-left: 0.02rem solid #ebebeb;
    margin-top: 0.2rem;
  }
  .flexRight{
    justify-content: flex-end;
  }
  .orderDetail .item p.changeDateStyle{
    height: 0.92rem;
    line-height: 0.92rem;
    border-top:0.02rem solid #ebebeb;
    padding: 0;
  }
  .refundFlyInfo{
    width:7.5rem;
    height:1.84rem;
    text-align: center;
    padding-top: 0.24rem;
    line-height: 0.46rem;
  }
  .logoImg{
    display: inline-block;
    width:0.24rem;
  }
  .orderDetail .item p.topStatus{
    padding: 0 0 0.25rem;
  }
  .ml56{
    margin-left: 0.56rem;
  }
  .alignStart{
    align-items: flex-start;
  }
</style>
