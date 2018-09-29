<template>
  <div class="requestRefund">
    <h2 v-title="'申请退票'"></h2>
    <section class="refundFlyInfo fontSize30 item fontBold">
      <p>{{detail.DepartAirportName}} ⇀ {{detail.ArriveAirportName}}</p>
      <p>{{dateShort}} {{dateDay}} {{detail.DepartTime}}~{{detail.ArriveTime}}</p>
    </section>
    <!--选择要退票的乘机人-->
    <ul class="item refundList passenger">
      <li>
        <em>选择要退票的乘机人</em>
        <em v-if="isAllSelect===1" class="colorBlue" @click="allSelected(1)">全选</em>
        <em v-if="isAllSelect===2" class="colorBlue" @click="allSelected(2)">全不选</em>
      </li>
      <li v-for="item in tourists1" :class="{colorBlue:item.isSelected}" @click="selectedTourists(item)">
        <em class="flexRow1">
          <span class="fontBold w100">{{item.TouristName}}</span>
          <span class="ml10">票号<i class="pl10">{{item.TicketCode}}</i> </span>
        </em>
        <em>
          <i v-if="item.isSelected" class="icon iconfont icon-duoxuankuangyixuan"></i>
          <i class="icon iconfont icon-duoxuankuangweixuan" v-else></i>
        </em>
      </li>

    </ul>
    <!--选择退票方式-->
    <ul class="item refundList method">
      <li>
        <em>选择退票方式</em>
      </li>
      <li :class="{colorBlue:refundNum===1}" @click="methodSelected(1)">
        <em class="flexRow w390">
          因行程改变或下单失误等个人原因退票
        </em>
        <em class="flexRow">
          <span>自愿退票</span>
          <i v-if="refundNum===1" class="icon iconfont icon-danxuankuangyixuan ml20"></i>
          <i class="icon iconfont icon-danxuankuangweixuan ml20" v-else></i>
        </em>
      </li>
      <li :class="{colorBlue:refundNum===2}" @click="methodSelected(2)">
        <em class="flexRow w390">
          因航班取消无法乘机；<br>提供医院证明无法乘
        </em>
        <em class="flexRow">
          <span>非自愿退票</span>
          <i v-if="refundNum===2" class="icon iconfont icon-danxuankuangyixuan ml20"></i>
          <i class="icon iconfont icon-danxuankuangweixuan ml20" v-else></i>
        </em>
      </li>
    </ul>
    <!--选择退票原因-->
    <ul class="item refundList">
      <li class="flexRow1 flexSpace" @click="refundSelected">
        <em class="fontSize30">选择退票原因</em>
        <em class="flexRow1">
          <span v-if="voluntaryRefund||involuntaryRefund" class="fontSize30 refundReasons textRight">{{refundReasonsArr1[voluntaryRefund-1]||refundReasonsArr2[involuntaryRefund-1]}}</span>
          <span class="fontSize30" v-else>请选择</span>
          <i class="icon iconfont icon-xiangyou ml20"></i>
        </em>
      </li>
    </ul>
    <!--温馨提醒-->
    <div class="reminder color53 mt10">
      退款费用为预估，按航司实际退款金额为准。 如已取纸质机票，请携带有效证件至机场退票窗口办理退票。
    </div>
    <!--申请退票-->
    <div class="refundBtn" @click="applyForFefund">申请退票</div>
    <!--退票原因选择-->
    <v-expressfee></v-expressfee>
    <!--退票确认框-->
    <v-dialogbox>
      <div slot="selectInfo" class="mt20 mb20 fontSize30">
        <p>
          {{detail.AirlineCompany}} {{detail.FlightNum}}
          <span v-for="name in touristSelct">{{name}}</span>
        </p>
        <p v-if="totailPrice!==-1">预估可退总额：<span class="Arial colorRed fontBold">￥{{totailPrice!==-1?totailPrice:''}}</span></p>
      </div>
      <!--<em slot="cancel" class="color97" @click="refundCancelBtn">取消</em>-->
      <em slot="confirm" class="confirm" @click="applyRefundTicket">确认</em>
    </v-dialogbox>
  </div>
</template>
<script>
  import { mapState, mapMutations } from 'vuex'
  import ExpressFee from '@/components/Order/expressFee'
  import DialogBox from '@/components/Modal/dialogueBox'
  import { dateFormat } from '@/common/js/util.js'
  export default {
    data() {
      return {
        refundNum:1,                //1为自愿退票 2非自愿退票
        refundReasonsArr1:[         //自愿退票原因
          '改变行程计划，不想飞了',
          '填错名字、选错日期、选错航班',
          '舱位升级，申请全退（同一航空公司，同一供应商出票）',
          '海航金、银卡会员，申请全退'
        ],
        refundReasonsArr2:[        //非自愿退票原因
          '航班变动',
          '生病了无法乘机（需县级以上医院证明）',
          '其他（降舱、迫降、超售、差错退款）已提供证明，申请全退（降舱和迫降需邮寄航司开具的证明原件、登机牌原件、旅客身份证复印件、行程单原件；超售需邮寄航司开具的证明原件）',
          '前段航班变动，导致后段无法乘坐'
        ],
        tourists1:[],
        ticketCode:[],              //提取的票号
        touristSelct:[],            //选择的乘机人列表
        dateShort:'',               //日期 月日
        dateDay:'',                 //周几
        isAllSelect:1,              //1是全选 2是全不选
        totailPrice:-1               //退款金额
      }
    },
    computed: {
      ...mapState({
        voluntaryRefund:state =>state.order.voluntaryRefund,            //自愿退票
        involuntaryRefund:state =>state.order.involuntaryRefund,        //非自愿退票
        detail:state =>state.orderDetail.orderDetail.detail,            //基础信息
        tourists:state =>state.orderDetail.orderDetail.tourists,        //乘机人
      }),
    },
    components:{
      'v-expressfee':ExpressFee,
      'v-dialogbox':DialogBox
    },
    created:async function () {
      if(!this.detail.OrderId){
        this.$store.commit('loadingShow','拼命加载中');
        let orderid=this.$route.query.OrderId;
        this.orderID=orderid
        const res=await this.$root.http.get('/member/detail', {orderId:orderid},this);
        if(res){
          const obj={
            detail:res.data.data.detail,
            insurances:res.data.data.insurances,
            tourists:res.data.data.tourists,
            trans:res.data.data.trans,
//            flydetailInfo:flydetail,
            ems:res.data.data.ems
          }
//          console.log('再看这里呢');
//          console.log(obj);
          this.$store.commit('UPDATE_ORDERDETAIL',obj);//重新赋值
        }
      }
      //时间换算 dateFormat
      let dateObj=dateFormat(this.detail.DepartDate);
      this.dateShort=dateObj.DateShort;
      this.dateDay=dateObj.DateDay;
      //乘机人列表
      this.tourists1=[];
      let vm=this;
      this.tourists.forEach(function (item) {
        if(item.TicketStatus===2||item.TicketStatus===10||item.TicketStatus===9){
          let obj=Object.assign({},item,{isSelected:false});
          vm.tourists1.push(obj);
        }
      });
    },
    methods:{
      ...mapMutations([
        'UPDATE_EXPRESSFEE',      //快递
        'UPDATE_VoluntaryRefund', //自愿退出
        'UPDATE_InVoluntaryRefund',//非自愿退出
        'SHOW_EXPRESSFEE',
        'updateDialogNum'
      ]),
      //弹出退票原因选择框
      refundSelected:function () {
        //1是自愿退票原因 2非自愿退票原因
        if(this.refundNum===1){
          this.SHOW_EXPRESSFEE(2);      //1是自愿退票原因
        }
        else{
          this.SHOW_EXPRESSFEE(3);      //2非自愿退票原因
        }
      },
      //全选 乘机人
      allSelected:function (num) {
        if(num===1){
          this.isAllSelect=2;    //显示全不选
          this.tourists1.forEach(function (item) {
            item.isSelected=true;
          });
        }
        else{
          this.isAllSelect=1;    //显示全选
          this.tourists1.forEach(function (item) {
            item.isSelected=false;
          });
        }

      },
      //选择 乘机人 单个
      selectedTourists:function (item) {
        item.isSelected=!item.isSelected;
        let selectLen=0;
        this.tourists1.forEach(function (item) {
          if(item.isSelected){
            selectLen++;
          }
        });
        if(selectLen===this.tourists1.length){
          this.isAllSelect=2;
        }
        else{
          this.isAllSelect=1;
        }
      },
      //申请退票
      applyForFefund:async function () {
        //提取票号
        let vm=this;
        this.ticketCode=[];           //票号
        this.touristSelct=[];         //乘机人
        this.tourists1.forEach(function (item) {
          if(item.isSelected){
            vm.ticketCode.push(item.TicketCode);
            vm.touristSelct.push(item.TouristName);
          }
        });
        //验证必填
        if(this.ticketCode.length===0){
          this.$store.dispatch('modalCountdown','请选择乘机人！'); //带倒计时的消息框
          return;
        }
        if(!this.voluntaryRefund&&!this.involuntaryRefund){
          this.$store.dispatch('modalCountdown','请选择退票原因！'); //带倒计时的消息框
          return;
        }
        //获取退款金额  只有自愿退款时才可以
        if(this.refundNum===1){
          let parms={
            orderId:this.detail.OrderId,
            ticketCodeList:this.ticketCode,
          }
          const res=await this.$root.http.post('/order/refundFee', parms,this);
          if(res){
            if(res.data.success){
              this.totailPrice=res.data.data;
              this.updateDialogNum(2);      //申请退票 的确认框  退款金额成功了再显示确认框
              this.$store.commit('dialogBoxShow','');
            }
            else{
              this.$store.dispatch('modalCountdown',res.data.msg); //带倒计时的消息框
            }
          }
        }
        else{
          this.totailPrice=-1;
          this.updateDialogNum(2);      //申请退票 的确认框   非自愿的
          this.$store.commit('dialogBoxShow','');
        }
      },
      //申请退票 最终确认
      applyRefundTicket:async function () {
        //退票原因 api/order/refund
        let refundReason=this.refundReasonsArr1[this.voluntaryRefund-1]||this.refundReasonsArr2[this.involuntaryRefund-1];
        let parms={
          orderId:this.detail.OrderId,
          refundType:this.refundNum,
          refundReason:refundReason,
          ticketCodeList:this.ticketCode,
          attachmentList:[]
        }
//        console.log(parms);
        this.$store.commit('loadingShow','退票中');
        const res=await this.$root.http.post('/order/refund', parms,this);
//        console.log(res);
        if(res){
          if(res.data.success){
            this.$store.commit('dialogBoxHide');
            this.$store.dispatch('modalCountdown',res.data.msg); //带倒计时的消息框
            this.$router.push({path:'/OrderDetail',query:{OrderId:this.detail.OrderId}});
          }
          else{
            this.$store.commit('dialogBoxHide');
            this.$store.dispatch('modalCountdown',res.data.msg); //带倒计时的消息框
          }
        }

      },
      //选择退票方式
      methodSelected:function (num) {
        this.refundNum=num;
        //退票原因必须重选
        this.UPDATE_VoluntaryRefund(0);
        this.UPDATE_InVoluntaryRefund(0);
      }
    }
  }
</script>
<style>
.requestRefund .item{
  background:rgba(255,255,255,1);
  margin-bottom: 0.2rem;
  color:#535353;
}
.requestRefund .refundFlyInfo{
  width:7.5rem;
  height:1.28rem;
  text-align: center;
  line-height: 0.46rem;
  padding-top: 0.19rem;
}
.requestRefund .refundList li{
  padding: 0.2rem 0;
  line-height: 0.46rem;
  border-bottom: 0.02rem solid #ebebeb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.28rem;
  margin: 0 0.34rem;
}
.requestRefund .refundList li:last-child{
  border-bottom: none;
}

.requestRefund .refundList.passenger .iconfont{
  font-size: 0.46rem;
  vertical-align: middle;
}
.requestRefund .refundList.method .iconfont{
  font-size: 0.5rem;
  vertical-align: middle;
}
.requestRefund .refundList.method li{
  line-height: 0.4rem;
}
.requestRefund .icon-duoxuankuangyixuan,.requestRefund .icon-danxuankuangyixuan{
  color:#2C7CF9
}
.requestRefund .icon-duoxuankuangweixuan,.requestRefund .icon-danxuankuangweixuan{
  color:#d3d3d3;
}
.w390{
  width:3.9rem;
}
.requestRefund .icon-xiangyou{
  font-size: 0.14rem;
  color: #C1C2C3;
}
.requestRefund .reminder{
  line-height: 0.38rem;
  margin: 0 0.34rem;
}
.requestRefund .refundBtn{
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
.requestRefund .refundReasons{
  width:3rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.requestRefund .w100{
  text-align: left;
}
</style>
