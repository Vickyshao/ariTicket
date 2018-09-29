<template>
  <div class="serveList">
    <ul>
      <li>
        <a href="https://booking.01zhuanche.com/car.html#/channel_rujia " target="_blank">
          <span class="iconfont icon-jiesongji"></span>
          <p>接送机</p>
        </a>
      </li>
      <li>
        <a href="http://www.variflight.com/h5checkin/?AE71649A58c77=&id=10326 " target="_blank">
          <span class="iconfont icon-zaixianxuanzuo"></span>
          <p>在线选座</p>
        </a>
      </li>
      <li>
        <a href="http://www.variflight.com/h5?AE71649A58c77=&token=ee27029c6f56ef16dd06bec558cbabfe" target="_blank">
          <span class="iconfont icon-hangbandongtai"></span>
          <p>航班动态</p>
        </a>
      </li>
      <li>
        <a href="https://homeinns.izuche.com" target="_blank">
          <span class="iconfont icon-bianjiezuche"></span>
          <p>便捷租车</p>
        </a>
      </li>
      <li>
        <a href="https://m.cct.cn/bourne/guoneilvyou/all/?refkey=rj " target="_blank">
          <span class="iconfont icon-guoneiyou"></span>
          <p>国内游</p>
        </a>
      </li>
      <li>
        <a href="http://trains.bthhotels.com/" target="_blank">
          <span class="iconfont icon-huochepiao"></span>
          <p>火车票</p>
        </a>
      </li>
    </ul>
  </div>
</template>
<script type="text/ecmascript-6">
 import { mapState, mapMutations } from 'vuex';
  export default {
    name: 'modala',
    computed:{
      ...mapState({
        modal: state =>state.modal.modal,
        msg: state => state.modal.msg
      })
    },
    mounted(){

    },
     methods: {
      ...mapMutations([
        'modalShow',
        'modalHide',
      ]),
    },

  }
</script>
<style lang="css">
 .serveList{
    padding:0.44rem 0.34rem 2rem;
 }
 .serveList ul{
  display:flex;
  flex-dirction:row;
  justify-content:center;
 }
 .serveList ul li{
  flex:1;
  text-align:center;
 }
 .serveList ul li span{
  display:inline-block;
  font-size:0.8rem;
 }
 .serveList ul li .icon-jiesongji{
  color:#FE9B14;
 }
 .serveList ul li .icon-zaixianxuanzuo{
   color:#EE8DEF;
 }
 .serveList ul li .icon-hangbandongtai{
  color:#FE7376;
 }
 .serveList ul li .icon-bianjiezuche{
  color:#8D89E0;
 }
 .serveList ul li .icon-guoneiyou{
  color:#36D1E0;
 }
 .serveList ul li .icon-huochepiao{
  color:#97D630;
 }
 .serveList ul li p{
  margin-top:0.09rem;
  font-size:0.24rem;
  line-height:0.33rem;
  color:#535353;
 }
</style>
