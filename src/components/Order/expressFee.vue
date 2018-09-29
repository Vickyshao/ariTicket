<template>
  <div class="expressFee" v-if="isExpressFee">
    <div class="mask" v-if="isExpressFee" @click="HIDDEN_EXPRESSFEE"></div>
    <!--快递选择-->
    <ul v-if="listNum===1" class="fontSize30 fontBold">
      <li :class="{cur:expressFeeNum===1}" @click="selectedExpress(1)">顺风快递 <span class="Arial">￥20</span></li>
      <li :class="{cur:expressFeeNum===2}" @click="selectedExpress(2)">其他快递 <span class="Arial">￥10</span></li>
      <!--<li :class="{cur:expressFeeNum===0}" @click="selectedExpress(0)">不需要快递</li>-->
    </ul>
    <!--自愿退票-->
    <ul v-if="listNum===2" class="fontSize30">
      <li :class="{cur:voluntaryRefund===1}" @click="UPDATE_VoluntaryRefund(1)">改变行程计划，不想飞了</li>
      <li :class="{cur:voluntaryRefund===2}" @click="UPDATE_VoluntaryRefund(2)">填错名字、选错日期、选错航班</li>
      <li :class="{cur:voluntaryRefund===3}" @click="UPDATE_VoluntaryRefund(3)">舱位升级，申请全退（同一航空公司，同一供应商出票）</li>
      <li :class="{cur:voluntaryRefund===4}" @click="UPDATE_VoluntaryRefund(4)">海航金、银卡会员，申请全退</li>
    </ul>
    <!--非自愿退票-->
    <ul v-if="listNum===3" class="fontSize30">
      <li :class="{cur:involuntaryRefund===1}" @click="UPDATE_InVoluntaryRefund(1)">航班变动 </li>
      <li :class="{cur:involuntaryRefund===2}" @click="UPDATE_InVoluntaryRefund(2)">生病了无法乘机（需县级以上医院证明）</li>
      <li :class="{cur:involuntaryRefund===3}" @click="UPDATE_InVoluntaryRefund(3)">其他（降舱、迫降、超售、差错退款）已提供证明，申请全退（降舱和迫降需邮寄航司开具的证明原件、登机牌原件、旅客身份证复印件、行程单原件；超售需邮寄航司开具的证明原件）</li>
      <li :class="{cur:involuntaryRefund===4}" @click="UPDATE_InVoluntaryRefund(4)">前段航班变动，导致后段无法乘坐</li>
    </ul>
  </div>
</template>
<script>
  import { mapState, mapMutations } from 'vuex'
  export default {
    data() {
      return {}
    },
    computed: {
      ...mapState({
        isExpressFee:state =>state.order.isExpressFee,
        expressFeeNum:state =>state.order.expressFeeNum,
        listNum:state =>state.order.listNum,                        //1为快递 2自愿退票 3非自愿退票
        voluntaryRefund:state =>state.order.voluntaryRefund,        //自愿退票
        involuntaryRefund:state =>state.order.involuntaryRefund,        //非自愿退票
      }),
    },
    methods:{
      ...mapMutations([
        'HIDDEN_EXPRESSFEE',      //隐藏
        'UPDATE_EXPRESSFEE',      //快递
        'UPDATE_VoluntaryRefund', //自愿退出
        'UPDATE_InVoluntaryRefund',//非自愿退出
      ]),
      selectedExpress(num){
        this.UPDATE_EXPRESSFEE(num);                  //num=1 顺风 2普通 0不需要
        this.$store.dispatch('TotailPrice');            //计算总价
      }
    }
  }
</script>
<style>
.expressFee{
  width:7.5rem;
}
.expressFee .mask{
  display: block;
}
.expressFee ul{
  width:7.5rem;
  background: #fff;
  position: fixed;
  left: 0;
  bottom:0;
  z-index: 2000;
}
.expressFee li{
  padding: 0.22rem 0.34rem;
  line-height: 0.4rem;
  text-align: center;
  border-bottom: 0.02rem solid #ebebeb;
  color: #535353;
}
.expressFee li:last-child{
  border-bottom: none;
}
.expressFee li.cur{
  color:#fff;
  background:rgba(44,124,249,1);
}
</style>
