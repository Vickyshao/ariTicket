<template>
  <div class="ticketChange">
    <h2 v-title="'申请改签'"></h2>
    <section class="refundFlyInfo fontSize30 item fontBold">
      <p>
        <span class="logoImg"><img :src="detail.CarrierLogo"></span>
        {{detail.AirlineCompany}}{{detail.FlightNum}} | {{detail.CraftType}}
      </p>
      <p>{{detail.DepartCityName}}{{detail.DepartAirportName}} ⇀ {{detail.ArriveCityName}}{{detail.ArriveAirportName}}</p>
      <p>{{dateShort}} {{dateDay}} {{detail.DepartTime}}~{{detail.ArriveTime}}</p>
    </section>
    <!--如何改签机票-->
    <ul class="item refundList">
      <li class="flexRow1 flexSpace" @click="$router.push({path:'/TicketStep'})">
        <em class="fontSize30">如何改签机票？</em>
        <em class="flexRow1">
          <i class="icon iconfont icon-xiangyou ml20"></i>
        </em>
      </li>
    </ul>
    <!--选择要改签的机票-->
    <ul class="item refundList passenger">
      <li>
        <em>选择要改签的机票</em>
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
    <!--选择改签方式-->
    <ul class="item refundList method">
      <li>
        <em>选择改签方式</em>
      </li>
      <li :class="{colorBlue:refundNum===1}" @click="methodSelected(1)">
        <em class="flexRow w390">
          因个人原因申请改期或升舱可能产生改签费
        </em>
        <em class="flexRow">
          <span>自愿改签</span>
          <i v-if="refundNum===1" class="icon iconfont icon-danxuankuangyixuan ml20"></i>
          <i class="icon iconfont icon-danxuankuangweixuan ml20" v-else></i>
        </em>
      </li>
      <li :class="{colorBlue:refundNum===2}" @click="methodSelected(2)">
        <em class="flexRow w390">
          因航班延误、机场关闭等原因，申请免费改期
        </em>
        <em class="flexRow">
          <span>非自愿改签</span>
          <i v-if="refundNum===2" class="icon iconfont icon-danxuankuangyixuan ml20"></i>
          <i class="icon iconfont icon-danxuankuangweixuan ml20" v-else></i>
        </em>
      </li>
    </ul>
    <!--改签日期,改签航班-->
    <ul class="item refundList">
      <!--改签日期-->
      <li class="flexRow1 flexSpace" @click="refundSelected(4)">
        <em class="fontSize28">改签日期
          <span v-if="changeDate" class="ml56 color53 fontBold">{{changeDate}}</span>
          <span class="grayInfo" v-else>请选择改签日期</span>
        </em>
        <!--<em class="flexRow1">-->
          <!--<span v-if="!changeDate" class="fontSize30">请选择</span>-->
          <!--<i class="icon iconfont icon-xiangyou ml20"></i>-->
        <!--</em>-->
      </li>
      <!--改签航班-->
      <li class="flexRow1 flexSpace" @click="chgFlyList">
        <div class="fontSize28 flexRow">改签航班
          <div class="ml56" v-if="flySelectedInfo.airlineCompany">
            <!--航班信息-->
            <v-flyinfo :flyinfo="flySelectedInfo"></v-flyinfo>
          </div>
          <!--默认提示信息-->
          <div class="grayInfo ml53" v-else>请选择改签航班</div>
        </div>
        <!--<div class="flexRow1">-->
          <!--<span v-if="!flySelectedInfo.airlineCompany" class="fontSize30">请选择</span>-->
          <!--<i class="icon iconfont icon-xiangyou ml20"></i>-->
        <!--</div>-->
      </li>
    </ul>
    <!--温馨提醒-->
    <div class="reminder color97 fontSize28">
      改签费用为预估，按航司实际退款金额为准。 提交改签申请后，客服将尽快受理并电话回复您，请保持手机畅通；具体改签航班于费用信息，以客服与您的电话沟通为准。
    </div>
    <!--申请改签-->
    <div class="refundBtn" @click="applyForFefund">申请改签</div>
    <!--退票确认框-->
    <v-dialogbox>
      <em slot="confirm" class="confirm oneBtn" @click="applyRefundTicket">好的</em>
    </v-dialogbox>
    <!--日期选择-->
    <date ref="dateSelected"></date>
  </div>
</template>
<script>
  import { mapState, mapMutations,mapActions } from 'vuex'
  // import ExpressFee from '@/components/Order/expressFee'
  import DialogBox from '@/components/Modal/dialogueBox'
  import { dateFormat } from '@/common/js/util.js'
  import date from '../components/Date/date.vue'
  // import ChgFlyList from '../components/Order/chgFlyList.vue'
  import FlyInfo from '../components/Order/flyInfo.vue'
  export default {
    data() {
      return {
        dateShort:'',               //日期 月日
        dateDay:'',                 //周几
        orderId:''
      }
    },
    computed: {
      ...mapState({
        voluntaryRefund:state =>state.order.voluntaryRefund,            //自愿退票
        involuntaryRefund:state =>state.order.involuntaryRefund,        //非自愿退票
        detail:state =>state.orderDetail.orderDetail.detail,            //基础信息
        tourists:state =>state.orderDetail.orderDetail.tourists,        //乘机人
        changeDate:state =>state.ticketChange.changeDate,               //改签日期
        isAllSelect:state =>state.ticketChange.isAllSelect,             //改签全选及全不选
        tourists1:state =>state.ticketChange.tourists1,                 //改签 乘机人(筛选后的)
        ticketCode:state =>state.ticketChange.ticketCode,               //改签 票号
        refundNum:state =>state.ticketChange.refundNum,                 //改签方式
        // selectedFly:state =>state.changeFlyList.selectedFly,            //选择的航班
        flySelectedInfo:state =>state.changeFlyList.flySelectedInfo,    //选择的航班
      }),
    },
    components:{
      // 'v-expressfee':ExpressFee,
      'v-dialogbox':DialogBox,
      // 'v-chgflylist':ChgFlyList,
      'v-flyinfo':FlyInfo,
      date
    },
    created:async function () {
      this.orderID=this.$route.query.OrderId;
      if(!this.detail.OrderId){
        this.$store.commit('loadingShow','拼命加载中');
        const res=await this.$root.http.get('/member/detail', {orderId:this.orderID},this);
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
      this.CLEAR_CHANGE_TOURIST();  //先清空
      let vm=this;
      this.tourists.forEach(function (item) {
        // let obj=Object.assign({},item,{isSelected:vm.ticketCode.indexOf(item.TicketCode)!=-1});//默认 如果有选中的显示是选中状态
        // vm.INIT_CHANGE_TOURIST(obj);
        // vm.tourists1.push(obj);
        if(item.TicketStatus===2||item.TicketStatus===10||item.TicketStatus===9){
          let obj=Object.assign({},item,{isSelected:vm.ticketCode.indexOf(item.TicketCode)!=-1});//默认 如果有选中的显示是选中状态
          vm.INIT_CHANGE_TOURIST(obj);
          // let obj=Object.assign({},item,{isSelected:false});
          // this.INIT_CHANGE_TOURIST(obj);
        }
      });
    },
    methods:{
      ...mapMutations([
        // 'UPDATE_EXPRESSFEE',      //快递
        // 'UPDATE_VoluntaryRefund', //自愿退出
        // 'UPDATE_InVoluntaryRefund',//非自愿退出
        // 'SHOW_EXPRESSFEE',
        'updateDialogNum',
        'CLEAR_CHANGE_TOURIST',       //清空乘机人列表
        'INIT_CHANGE_TOURIST',        //初使化乘机人列表
        'CHANGE_ISALLSELECTED',       //全选
        'CLEAR_CHANGE_TICKETCODE',    //清空票号
        'INIT_CHANGE_TICKETCODE',     //提取选中的票号
        'CHANGE_REFUNDNUM',           //改签方式
      ]),
      ...mapActions([
        'allSelected'
      ]),
      //弹出改签日期选择插件
      refundSelected:function (num) {
        this.$refs.dateSelected.showDate(num);
      },
      //全选 乘机人
      // allSelected:function (num) {
      //   if(num===1){
      //     this.isAllSelect=2;    //显示全不选
      //     this.tourists1.forEach(function (item) {
      //       item.isSelected=true;
      //     });
      //   }
      //   else{
      //     this.isAllSelect=1;    //显示全选
      //     this.tourists1.forEach(function (item) {
      //       item.isSelected=false;
      //     });
      //   }
      //
      // },
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
          // this.isAllSelect=2;
          this.CHANGE_ISALLSELECTED(2);
        }
        else{
          // this.isAllSelect=1;
          this.CHANGE_ISALLSELECTED(1);
        }
        //提取票号
        let vm=this;
        this.CLEAR_CHANGE_TICKETCODE();  //先清空票号
        // this.ticketCode=[];           //票号
        // this.touristSelct=[];         //乘机人
        this.tourists1.forEach(function (item) {
          if(item.isSelected){
            vm.INIT_CHANGE_TICKETCODE(item.TicketCode);
            // vm.ticketCode.push(item.TicketCode);
            // vm.touristSelct.push(item.TouristName);
          }
        });
      },
      //申请改签
      applyForFefund:async function () {
        //验证必填
        if(this.ticketCode.length===0){
          this.$store.dispatch('modalCountdown','请选择要改签的机票！'); //带倒计时的消息框
          return;
        }
        if(!this.changeDate){
          this.$store.dispatch('modalCountdown','请选择改签日期！'); //带倒计时的消息框
          return;
        }
        if(!this.flySelectedInfo.flightNo){
          this.$store.dispatch('modalCountdown','请选择改签航班！'); //带倒计时的消息框
          return;
        }
        //请求后台 提交申请
        this.$store.commit('loadingShow','拼命加载中');
        // let orderid=this.$route.query.OrderId;
        let param={
          OrderId:this.orderID,
          OrgCityCode:this.detail.DepartCityCode,
          DstCityCode:this.detail.ArriveCityCode,
          ChangeType:this.refundNum,
          ChangeDate:this.changeDate,
          FlightNum:this.flySelectedInfo.flightNo,
          TicketList:this.ticketCode
        }
        // console.log(param);
        const res=await this.$root.http.post('/order/changeApply', param,this);
        // console.log(res.data)
        if(res){
          if(res.data.success){
            this.updateDialogNum(3);                              //申请改签 的确认框
            this.$store.commit('dialogBoxShow','改签申请已提交');
            this.$store.dispatch('clearHistoryChange');           //数据还原为默认
          }
          else {
            this.$store.dispatch('modalCountdown',res.data.msg); //带倒计时的消息框
            return;
          }
        }
      },
      //申请改签 最终确认
      applyRefundTicket:function () {
        this.$store.commit('dialogBoxHide');
        this.$router.push({path:'/ChangeOrderList',query:{OrderId:this.orderID}});
      },
      //选择改签方式
      methodSelected:function (num) {
        this.CHANGE_REFUNDNUM(num);
        // this.refundNum=num;
        // //退票原因必须重选
        // this.UPDATE_VoluntaryRefund(0);
        // this.UPDATE_InVoluntaryRefund(0);
      },
      //航班选择跳转
      chgFlyList:function () {
        let param={
          orgditydode:this.detail.DepartCityCode,
          arrcitycode:this.detail.ArriveCityCode,
          dptdate:this.detail.DepartDate,
          airlinecode:this.detail.AirlineCode
        }
        this.$router.push({path:'/ChangeFlyList',query:param});
        // this.$router.push('/ChangeFlyList');
      }
    }
  }
</script>

<style scoped>
  .ticketChange{
    height: 12rem;
    overflow: scroll;
  }
  .ticketChange .item{
    background:rgba(255,255,255,1);
    margin-bottom: 0.2rem;
    color:#535353;
  }
  .ticketChange .refundFlyInfo{
    width:7.5rem;
    height:1.84rem;
    text-align: center;
    line-height: 0.46rem;
    padding-top: 0.24rem;
  }
  .ticketChange .logoImg{
    display: inline-block;
    width:0.24rem;
  }
  .ticketChange .refundList li{
    padding: 0.2rem 0;
    line-height: 0.46rem;
    border-bottom: 0.02rem solid #ebebeb;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.28rem;
    margin: 0 0.34rem;
  }
  .ticketChange .refundList li:last-child{
    border-bottom: none;
  }

  .ticketChange .refundList.passenger .iconfont{
    font-size: 0.46rem;
    vertical-align: middle;
  }
  .ticketChange .refundList.method .iconfont{
    font-size: 0.5rem;
    vertical-align: middle;
  }
  .ticketChange .refundList.method li{
    line-height: 0.4rem;
  }
  .ticketChange .icon-duoxuankuangyixuan,.ticketChange .icon-danxuankuangyixuan{
    color:#2C7CF9
  }
  .ticketChange .icon-duoxuankuangweixuan,.ticketChange .icon-danxuankuangweixuan{
    color:#d3d3d3;
  }
  .w390{
    width:3.9rem;
  }
  .ticketChange .icon-xiangyou{
    font-size: 0.14rem;
    color: #C1C2C3;
  }
  .ticketChange .reminder{
    line-height: 0.4rem;
    margin: 0.34rem;

  }
  .ticketChange .refundBtn{
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
  .ticketChange .refundReasons{
    width:3rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .ticketChange .w100{
    text-align: left;
  }
  .ml56{
    margin-left: 0.56rem;
  }
  .grayInfo{
    margin-left: 0.46rem;
    color: #D3D3D3;
  }
  .grayInfo.ml53{
    margin-left: 0.53rem;
  }

</style>
