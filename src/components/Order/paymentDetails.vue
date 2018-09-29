<template>
  <section v-if="isPayDeatail" class="payDetail">
    <div @click="HIDDEN_PAYDETAIL" class="mask" :class="{show:isPayDeatail}"></div>
    <div class="detailContent" :class="{top:num==1,bottom:num==2}">
      <ul class="fontSize28 ml30 mr30 color53">
        <li v-for="item in trans">
          <em>{{item.Desp}}</em>
          <em class="flexRow">
            <span>×{{item.Count}}人</span>
            <span class="w100 textRight Arial colorRed ml20 fontBold">￥{{item.GranRt}}</span>
          </em>
        </li>
      </ul>
      <!--保险-->
      <ul class="fontSize28 ml30 mr30 color53" v-if="insurances.length>0">
        <li v-for="item1 in insurances">
          <em>{{item1.InsuranceName}}</em>
          <em class="flexRow">
            <span>×{{item1.Count}}人</span>
            <span class="w100 textRight Arial colorRed ml20 fontBold">￥{{item1.Amount}}</span>
          </em>
        </li>
      </ul>
      <div v-if="ems" class="courier ml30 mr30 color53 fontSize28 line flexRow flexSpace">
        <em v-if="detail.EmsType===2">普通快递：</em>
        <em v-if="detail.EmsType===1">顺风快递：</em>
        <em class="flexRow">
          <span>×1份</span>
          <span class="w100 textRight Arial colorRed ml20">￥{{ems.GranRt}}</span>
        </em>
      </div>
      <div v-if="num==1" class="courier ml30 mr30 fontSize28 flexRow flexSpace">
        <em class="color53 fontBold">总金额：</em>
        <em class="flexRow">
          <span></span>
          <span class="w100 textRight Arial colorRed ml20 fontBold">￥{{orderTotailPrice}}</span>
        </em>
      </div>
    </div>
  </section>
</template>
<script>
  import { mapState, mapMutations } from 'vuex'
export default {
  data(){
    return{

    }
  },
  computed:{
    ...mapState({
      isPayDeatail:state =>state.orderDetail.isPayDeatail,
      trans:state =>state.orderDetail.orderDetail.trans,
      num:state =>state.orderDetail.num,
      insurances:state =>state.orderDetail.orderDetail.insurances,
      ems:state =>state.orderDetail.orderDetail.ems,
      detail:state =>state.orderDetail.orderDetail.detail,
      orderTotailPrice:state =>state.orderDetail.orderTotailPrice
    }),
  },
  methods:{
    ...mapMutations([
      'SHOW_PAYDETAIL',
      'HIDDEN_PAYDETAIL'
    ]),
  }
}
</script>
<style scoped>
.payDetail{

}

.payDetail .detailContent{
  width:7.5rem;
  background: #fff;
  /*height: 4rem;*/
  overflow: scroll;
  left: 0;
  position: fixed;
  z-index: 3000;
}
.payDetail .detailContent.top{
  top:0;
}
.payDetail .detailContent.bottom{
  bottom:1.07rem;
}
ul,.courier{
  border-bottom:0.02rem solid #ebebeb;
  padding: 0.2rem 0;
  line-height: 0.5rem;
}
.payDetail li{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  line-height: 0.5rem;
}
.w100{
  width:1rem;
  text-align: right;
}
.noline{
  border:none;
}
.mask.show{
  display: block;
}
.payDetail .mask{
  z-index: 1;
}
</style>
