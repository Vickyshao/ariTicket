<template>
  <div class="orderDetail">
    <h2 v-title="'订单详情'"></h2>
    <div v-if="isCarryOut===2">
      <!--奖励积分提示  v-if="!detail.OrderStatus==='OS0002'&&!detail.OrderStatus==='OS0009'&&!detail.OrderStatus==='OS00010'&&!detail.OrderStatus==='OS00011'" -->
      <div v-if="detail.OrderStatus!='OS0009'&&detail.OrderStatus!='OS0010'&&detail.OrderStatus!='OS0011'" class="rewardPoints fontSize28 color53">
        您的本次行程可获得<span class="colorRed"> {{integralNum}} </span>
        积分！在航班起飞后<span class="colorRed">10</span>
        个工作日内计入到您的账户，请注意查收，感谢您的预订！
      </div>
      <section class="item color53">
        <p class="ml30 flexRow flexSpace mr30">
          <span class="fontSize34 fontBold">
            <em :class="{color53:detail.OrderStatus!=='OS0002'&&detail.OrderStatus!=='OS0001'}">
              <span v-if="detail.OrderStatus!=='OS0006'">{{detail.OrderStatusDesc}}</span>
              <span v-else>预订成功，出票中</span>
            </em>
          </span>
          <span v-if="detail.OrderStatus=='OS0002'||detail.OrderStatus=='OS0001'" class="timeReminder ml10">
            您还有<em class="colorRed fontBold">{{minite}}分{{second}}秒</em>
            完成支付，过时订单将被取消
          </span>
          <span @click="$store.commit('SHOW_PAYDETAIL',1)" v-if="detail.OrderStatus!=='OS0002'&&detail.OrderStatus!=='OS0001'" class="mr30">
            <em class="fontSize28 color53">
              订单总额：
              <span class="colorRed Arial fontSize34">￥{{orderTotailPrice}}</span>
              <i class="iconfont icon-xiangyou color97 fontSize24"></i>
            </em>
          </span>
        </p>
        <p class="flexRow ml30 fontSize28">订单编号：<span class="Arial ml20">{{detail.OrderId}}</span></p>
        <p class="flexRow ml30 fontSize28">下单时间：<span class="Arial ml20">{{detail.CreateTimeString}}</span></p>
      </section>
      <section class="item pt0">
        <v-flyDetail :flyItem="flyDetail"></v-flyDetail>
        <div class="ml30 btLine color53 fontSize28 ptpbtm mr30 lineHeight">
          <p class="fontSize28">乘机人：</p>
          <div v-for="item in tourists" class="mt10">
            <div class="flexRow fontBold">
              <span class="w90 textRight">{{item.TouristName}}</span>
              <em class="flexRow w590 flexSpace">
                <span v-if="item.TicketStatus!=0" class="ml30">( {{ticketStatusFun(item.TicketStatus)}} )</span>
                <!--<span v-if="item.TicketStatus===6" class="ml30">(已退票)</span>-->
                <span v-if="item.TicketStatus===8||item.TicketStatus===9||item.TicketStatus===10" class="colorBlue" @click="changeDetail">改签详情</span>
              </em>
            </div>
            <div class="flexcolumn">
              <em class="flexRow">
                <span v-if="item.PersonType==='ADT'" class="w90 textRight">成人票</span>
                <span v-if="item.PersonType==='CHD'" class="w90 textRight">儿童票</span>
                <span class="ml30">
                  <i v-if="item.PsptType===1">身份证</i>
                  <i v-if="item.PsptType===2">护照</i>
                  <i v-if="item.PsptType===4">港澳通行证</i>
                  <i v-if="item.PsptType===8">回乡证</i>
                  {{item.PsptId}}
                </span>
              </em>
              <em v-if="item.TicketCode!=''" class="flexRow">
                <span class="w90 textRight">票号</span>
                <span class="ml30">{{item.TicketCode}}</span>
                <!--<span v-if="item.TicketStatus===1" class="ml20">(出票中)</span>-->
              </em>
            </div>
          </div>
        </div>
        <div class="ml30 color53 fontSize28 ptpbtm mr30">
          <p class="fontSize28">联系人：</p>
          <div class="flexRow">
            <span class="color53 fontBold w90 textRight">{{detail.Contact}}</span>
            <div class="flexcolumn">
            <em class="flexRow">
              <span class="ml23 w120 textRight">手机号码</span>
              <span class="ml30">{{detail.ContactTel}}</span>
            </em>
            <em v-if="detail.ContactEmail" class="mt10 flexRow">
              <span class="ml23 w120 textRight">电子邮箱</span>
              <span class="ml30">{{detail.ContactEmail}}</span>
            </em>
        </div>
          </div>
        </div>
        <div v-if="detail.OrderStatus==='OS0002'||detail.OrderStatus==='OS0001'||detail.OrderStatus==='OS0-2'" class="orderCancelBtn fontSize30 colorBlue fontBold" @click="cancelOrder(1)">
          取消订单
        </div>
        <!--<div v-if="detail.OrderStatus==='OS0008'" class="orderCancelBtn fontSize30 colorBlue fontBold" @click="refundTicket">申请退票</div>-->
        <div v-if="detail.OrderStatus==='OS0008'" class="orderCancelBtn fontSize30 colorBlue fontBold flexRow flexSpace change">
          <em @click="refundTicket">申请退票</em>
          <em class="flexRow">
            <span class="lineEB"></span>
            <span style="margin-left: 35%" @click="refundChange">申请改签</span>
          </em>
        </div>
      </section>
      <section class="item flexRow lineHeight flexSpace" @click="retiredPopup(detail.RuleInfos)">
        <em class="color53 ml30 fontSize28 fontBold" >退改签规则/行李额说明</em>
        <i class="icon iconfont icon-xiangyou color97 mr30 font14"></i>
      </section>
      <section v-if="insurances.length>0" class="item insurance flexRow flexSpace fontSize28">
        <em class="color53 ml30 fontBold">保险信息</em>
        <div class="color53 mr30">
          <div v-for="item in insurances" class="h_line40">{{item.InsuranceName}}<span class="Arial">￥{{item.Cost}}</span>/人</div>
        </div>
      </section>
      <section :class="{marginBottom:isHasPay,mbMoreHeight:isHasPaySecond}" class="item notLine fontSize28">
        <!--补开发票  申请提交成功后显示-->
        <div v-if="detail.InvoiceTitle!==''&&detail.NeedInvoice!==1" class="contactCust flexRow flexSpace color53">
          <em class="fontSize28 w480">提交发票信息后，需联系客服<span class="colorRed">支付快递费用</span>才能寄送。</em>
          <em class="contactCustBtn fontSize28" @click="$store.state.modal.isCustom = true">联系客服</em>
        </div>
        <p class="flexRow flexSpace color53 ml30 fontBold">
          <span>报销凭证</span>
          <em v-if="detail.InvoiceTitle===''&&detail.OrderStatus==='OS0008'">
            <span class="mr20 colorBlue" @click="compInvoic">补开发票</span>
            <i class="icon iconfont icon-xiangyou color97 mr30 font14"></i>
          </em>
          <span v-if="detail.InvoiceTitle===''&&detail.OrderStatus!=='OS0008'" class="color53 mr30">不需要</span>
        </p>
        <div v-if="detail.InvoiceTitle!==''">
          <p v-if="ems!=''" class="flexRow flexSpace color53 ml30 mr30 btLine">
            <em>配送清单<span v-if="detail.BillType!=0" class="color97"><br>{{invoicType()}}</span></em>
            <em class="flexRow">
              <span v-if="detail.EmsType===2">普通快递</span>
              <span v-if="detail.EmsType===1">顺风快递</span>
              <span v-if="detail.EmsType===0">不需要快递</span>
              <span v-if="detail.EmsType!=0" class="ml20">{{emsAmount=ems?ems.GranRt:detail.EmsType===1?20:10}}元</span>
            </em>
          </p>
          <p class="flexRow flexSpace color53 ml30 mr30 btLine">
            <em>发票抬头</em>
            <em class="textRight">
              <span>{{detail.InvoiceTitle||'无'}}</span><br>
              <span class="Arial">{{detail.TFN}}</span>
            </em>
          </p>
          <p class="flexRow flexSpace color53 ml30 mr30">
            <em>配送地址</em>
            <em class="textRight w400">
              <span>{{detail.Address||'无'}}</span>
            </em>
          </p>
        </div>
      </section>
      <!--普通支付-->
      <section v-if="detail.OrderStatus==='OS0002'||detail.OrderStatus==='OS0001'" class="item orderPayFooter btline flexRow flexSpace">
        <div class="w450 ml30 flexRow flexSpace">
          <em>
            <span class="fontSize28">订单总额：</span>
            <span class="colorRed Arial">
              <span>￥</span>
              <span class="fontSize36">{{orderTotailPrice}}</span>
            </span>
          </em>
          <em class="moneyDetail" @click="$store.commit('SHOW_PAYDETAIL',2)">
            明细
          </em>
        </div>
        <div class="goPayBtn fontSize36" @click="goPay(detail.OrderId)">去支付</div>
      </section>
      <!--二次支付-->
      <!--二次支付的倒计时-->
      <p v-if="isHasPaySecond" class="timeLeft color53">
        您还有<em class="colorRed fontBold">{{secPayMinite}}分{{secPaySecond}}秒</em>完成支付，请尽快支付！
      </p>
      <section v-if="isHasPaySecond" class="item orderPayFooter flexRow flexSpace">
        <div class="w450 ml30 flexRow flexSpace">
          <em>
            <span class="fontSize28">待支付：</span>
            <span class="colorRed Arial">
              <span>￥</span>
              <span class="fontSize36">{{cost?cost:0}}</span>
            </span>
          </em>
          <!--<em class="moneyDetail" @click="$store.commit('SHOW_PAYDETAIL',2)">-->
            <!--明细-->
          <!--</em>-->
        </div>
        <div class="goPayBtn fontSize36" @click="payAgain()">去支付</div>
      </section>
      <!--订单明细-->
      <v-payDetail></v-payDetail>
      <!--退改签-->
      <v-retired></v-retired>
      <!--取消订单确认框-->
      <v-dialogbox>
        <em slot="confirm" class="confirm" @click="applyRefund(detail.OrderId)">确认</em>
      </v-dialogbox>
      <!--联系客服弹框-->
      <v-custom v-if="isCustom"></v-custom>
    </div>
  </div>
</template>
<script>
  import FlyDetail from "@/components/Details/flyDetail"
  import PayDetail from '@/components/Order/paymentDetails'
  import Retired from '@/components/Dialog/retired'
  import DialogBox from '@/components/Modal/dialogueBox'
  import custom from '@/components/Modal/custom.vue'
  import { mapState, mapMutations } from 'vuex'
  export default {
    data(){
      return {
        minite:'',
        second:'',
        secPayMinite:'',      //二次支付剩余分钟
        secPaySecond:'',      //二次支付剩余秒数
        orderID:'',
        emsAmount:0,
        integralNum:0,
        isCarryOut:1,         //是否请求完毕  1是未请求完毕，2是请求完毕
        isHasPay:false,       //是否有支付，如果有支付样式底部要留空
        isHasPaySecond:false, //二次支付是否有支付，如果有支付样式底部要留空
        costId:0,
        cost:0,
        // expiryTime:'2018-06-13 14:30:00',
        isShowFly:0,          //0代表不可以查看航班动态 1可以查看 已完成状态变为1
      }
    },
    components:{
      'v-flyDetail':FlyDetail,
      'v-payDetail':PayDetail,
      'v-retired':Retired,
      'v-dialogbox':DialogBox,
      'v-custom':custom
    },
    computed:{
      ...mapState({
        detail:state =>state.orderDetail.orderDetail.detail,          //基础信息
        insurances:state =>state.orderDetail.orderDetail.insurances,
        tourists:state =>state.orderDetail.orderDetail.tourists,      //乘机人
        trans:state =>state.orderDetail.orderDetail.trans,
        flyDetail:state =>state.orderDetail.orderDetail.flyDetail,
        ems:state =>state.orderDetail.orderDetail.ems,
        // insurances:state =>state.orderDetail.orderDetail.insurances,
        orderTotailPrice:state =>state.orderDetail.orderTotailPrice,
        isCustom: state =>state.modal.isCustom,
//        dialogNum:state =>state.modal.dialogNum
      }),
    },
    created:async function () {
      this.$store.commit('loadingShow','拼命加载中');
      let orderid=this.$route.query.OrderId;
      this.orderID=orderid
      const res=await this.$root.http.get('/member/detail', {orderId:orderid},this);
//      console.log('看下这里有舱位吗');
//      console.log(res.data.data);
      if(res){
        this.isCarryOut=2;
        if(res.data.data.detail.OrderStatus==='OS0008'){
          this.isShowFly=1;
        }
        const flydetail={
          departTime:res.data.data.detail.DepartTime,
          departDate:res.data.data.detail.DepartDate,
          departAirportName:res.data.data.detail.DepartAirportName,
          duration:res.data.data.detail.Duration,
          arriveTime:res.data.data.detail.ArriveTime,
          arriveDate:res.data.data.detail.ArriveDate,
          arriveAirportName:res.data.data.detail.ArriveAirportName,
          airlineCompany:res.data.data.detail.AirlineCompany,
          shareAirlineName:res.data.data.detail.ShareAirlineName,
          flightNo:res.data.data.detail.FlightNum,
          shareFlightNo:res.data.data.detail.ShareFlightNo,
          isShare:res.data.data.detail.IsShare,
          carrierLogo:res.data.data.detail.CarrierLogo,
          craftType:res.data.data.detail.CraftType,
          stopNum:res.data.data.detail.StopNum,
          mealFlag:res.data.data.detail.MealFlag,
          onTimeRate:res.data.data.detail.OnTimeRate,
          stopPointList:JSON.parse(res.data.data.detail.StopPointList),
          cabin:[{
            outTicketTime:res.data.data.detail.OutTicketTime,
            outTicketType:res.data.data.detail.OutTicketType
          }],
          isShowFlyStatus:this.isShowFly,                                     //是否可以看航班动态信息
          departAirportCode:res.data.data.detail.DepartAirportCode,           //出发机场三字码
          arriveAirportCode:res.data.data.detail.ArriveAirportCode,           //到达机场三字码
          departAirportTerminal:res.data.data.detail.DepartAirportTerminal,   //出发机场 航站楼
          arriveAirportTerminal:res.data.data.detail.ArriveAirportTerminal,   //到达机场 航站楼
        }
        const obj={
          detail:res.data.data.detail,
          insurances:res.data.data.insurances,
          tourists:res.data.data.tourists,
          trans:res.data.data.trans,
          flydetailInfo:flydetail,
          ems:res.data.data.ems
        }
//        console.log('再看这里呢');
//        console.log(obj);
        this.$store.commit('UPDATE_ORDERDETAIL',obj);//重新赋值

        this.integralNum=res.data.data.reward;
        this.$store.dispatch('OrderDetailTotailPrice');       //计算总价

        //如果是待支付状态 要改样式 底部留空
        if(this.detail.OrderStatus==='OS0002'||this.detail.OrderStatus==='OS0001'){
          this.isHasPay=true;
        }
      }
//      this.$router.push({path:'/OrderDetail'});
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
      var nows=new Date(this.detail.CreateTimeString.replace(/-/g,"/"));
      var min=nows.getTime()+30*60*1000;
      var newsDate=new Date(min);
      var lastmin=(min-(new Date()).getTime())/1000;
      setOverTime(lastmin,'minite','second');      //普通支付的倒计时

      //二次支付---------------------------------------------------/
      if(this.detail.OrderStatus==='OS0008'){
        const response=await this.$root.http.get('/order/getPay', {orderId:orderid},this);
        if(response){
          if(response.data.success){
            if(response.data.data.Cost){    //有支付信息时显示可以支付的dom 计算倒计时并显示
              this.isHasPaySecond=true;
              this.cost=response.data.data.Cost;
              this.costId=response.data.data.CostId;
              //执行函数并可传入参数为秒数 response.data.data.ExpiryTime
              var secDate=new Date(response.data.data.ExpiryTime);
              var secMin=secDate.getTime();
              // var newsDate=new Date(min);
              var lastSecMin=(secMin-(new Date()).getTime())/1000;
              setOverTime(lastSecMin,'secPayMinite','secPaySecond');      //二次支付的倒计时
            }
          }
        }
      }
    },
    methods:{
      //取消订单
      cancelOrder:async function (num) {
        this.$store.commit('updateDialogNum',1);     //普通消息框 带确认
        if(num===1){
          this.$store.commit('dialogBoxShow','确认要取消订单？');
        }
        else{
          this.$store.commit('dialogBoxShow','确认申请退票？');
        }
      },
      //去支付
      goPay:async function (orderId) {
//        console.log(orderId);
        this.$store.commit('loadingShow','拼命加载中');
        const res=await this.$root.http.get('/order/pay/'+orderId,'',this);
        if(res){
          window.location.href=res.data.data;
        }

//        window.open(''+res.data.data);
      },
      //二次支付 快递费用
      payAgain:async function(){
        this.$store.commit('loadingShow','拼命加载中');
        let param={
          costId:this.costId,
          returnUrl:window.location.href
        }
        console.log(param);
        const res=await this.$root.http.get('/order/payAgain/',param,this);
        console.log(res);
        if(res){
          if(res.data.success){
            window.location.href=res.data.data;
          }
          else{
            this.$store.dispatch('modalCountdown',res.data.msg); //带倒计时的消息框
          }
        }
      },
      //退改签规则
      retiredPopup:async function (ruleInfos) {
        let obj1={
          freeLuggage:this.detail.FreeLuggage,
          freeLuggageUnit:this.detail.FreeLuggageUnit
        }
        this.$store.commit('updateFreeLuggage',obj1);
        let obj={
          Data:JSON.parse(ruleInfos)
        };
//        console.log(obj.Data);
        this.$store.commit('UPDATE_RETIRED',obj);   //退改签页面绑定数据
        this.$store.commit('retiredShow');          //显示弹出层
      },
      //申请退票或取消
      applyRefund:async function (orderid) {
//        console.log('为什么进不来呢！');
//        console.log('订单号是多少;'+orderid);

        this.$store.commit('loadingShow','拼命加载中');
        const res=await this.$root.http.get('/cancelOrder/'+orderid);
        //如果取消成功了返回订单列表页
        if(res){
          if(res.data!=null){
            if(res.data.success){
//              console.log('成功了！');
              this.$store.commit('dialogBoxHide');
              this.$store.dispatch('modalCountdown',res.data.msg); //带倒计时的消息框
              location.reload();
            }
            else{
              this.$store.dispatch('modalCountdown',res.data.msg); //带倒计时的消息框
            }
          }
        }

      },
      //退票
      refundTicket:function () {
//        console.log('为什么不行呢');
        this.$router.push({path:'/RequestRefund',query:{OrderId:this.detail.OrderId}});
//        this.$router.push({path:'/RequestRefund'});
      },
      //申请改签
      refundChange:function(){
        this.$router.push({path:'/TicketChange',query:{OrderId:this.detail.OrderId}});
      },
      //跳转改签详情页
      changeDetail:function () {
        this.$router.push({path:'/ChangeOrderList',query:{OrderId:this.detail.OrderId}});
        // this.$router.push({path:'/ChangeOrderDetail',query:{OrderId:this.detail.OrderId}});
      },
      //各种状态返回文字
      ticketStatusFun:function (status) {
        let str='';
        switch (status){
          case 1:
            str='出票中';
            break;
          case 2:
            str='已出票';
            break;
          case 3:
            str='出票失败';
            break;
          case 4:
            str='审核中';
            break;
          case 5:
            str='审核超时';
            break;
          case 6:
            str='已退票';
            break;
          case 7:
            str='审核失败';
            break;
          case 8:
            str='改签中';
            break;
          case 9:
            str='改签已完成';
            break;
          case 10:
            str='改签已取消';
            break;
        }
        return str;
      },
      //报销凭证
      invoicType:function () {
        let str='';
        if(this.detail.BillType===1){
          str='行程单';
        }
        else if(this.detail.BillType===2){
          str='代订交通费发票';
        }
        else{
          str='行程单，代订交通费发票';
        }
        if(this.insurances.length>0){
          str+='，电子发票(保险发票)';
        }
        return str;
        // detail.BillType===1?'行程单':detail.BillType===2?'仅发票':'行程单+差额发票'
      },
      //补开发票 跳转
      compInvoic:function () {
        let obj={
          BillType:this.detail.BillType,
          len:this.insurances.length,
          orderId:this.orderID
          // url:window.location.href
        }
        this.setCookie('compInvoicCookie',JSON.stringify(obj));
        // this.$router.push({path:'/CompInvoicing'});
        this.$router.push({path:'/CompInvoicing'});
      }
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
  padding: 0.2rem 0;
}
.orderDetail .orderCancelBtn{
  border-top:0.02rem solid #ebebeb;
  text-align: center;
  height: 1rem;
  line-height: 1rem;
  margin-top: 0.2rem;
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
  /*border-top:0.02rem solid #ebebeb;*/
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
.item.mbMoreHeight{
  padding-bottom: 1.77rem;
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
  padding: 0.16rem 0.34rem;
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
  .contactCust{
    background: rgba(255, 253, 234, 1);
    padding:0.2rem 0.34rem;
    line-height: 0.4rem;
  }
  .contactCustBtn{
    width:1.62rem;
    height: 0.5rem;
    background:linear-gradient(to right,rgba(231, 70, 92, 1),rgba(255, 92, 92, 1));
    border-radius: 0.26rem;
    line-height: 0.5rem;
    text-align: center;
    color: #fff;
  }
  .w480{
    width:4.8rem;
  }
  .timeLeft{
    background:#FFFDEA;
    height: 0.7rem;
    line-height: 0.7rem;
    text-align: center;
    position: fixed;
    bottom:1rem;
    left: 0;
    width:7.5rem;
    font-weight: normal;
    box-shadow: 0 -0.06rem 0.06rem 0 rgba(0, 0, 0, 0.1);
  }
.orderDetail .orderPayFooter.btline{
  border-top:0.02rem solid #ebebeb;
}
</style>
