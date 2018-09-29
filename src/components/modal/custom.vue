<template>
  <div class="custom_modal">
    <div class="maska" @click="$store.state.modal.isCustom = false"></div>
    <div class="content">
      <h3>400 820 3333*9</h3>
      <ul>
        <li class="first-child" @click="$store.state.modal.isCustom = false">
          <a href="javascript:;">取消</a>
        </li>
        <li class="last-child">
          <a href="tel:4008203333,9" @click="$store.state.modal.isCustom = false">呼叫</a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
 import { mapState, mapMutations } from 'vuex';
  export default {
    name: 'modala',
    computed:{
      ...mapState({
        isCustom: state =>state.modal.isCustom,
      })
    },
  }
</script>
<style lang="css">
 /* 模态框 */
  .custom_modal{
    position: fixed;
    z-index:4;
    left:0rem;
    top:0rem;
    bottom:0rem;
    right:0rem;
  }
  .custom_modal .maska{
    position: fixed;
    z-index:4;
    left:0rem;
    top:0rem;
    bottom:0rem;
    right:0rem;
    background:rgba(0,0,0,0.4);
  }
  .custom_modal .content{
    position:fixed;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
    z-index:8;
    width:6.82rem;
    /*height:3.64rem;*/
    background:#fff;
    border-radius: 0.1rem ;
    color: #535353;
  }
  .custom_modal .content h3{
    color:#000;
    font-size:0.36rem;
    font-weight:bold;
    height:0.5rem;
    /*border-bottom:0.02rem solid #EBEBEB;*/
    text-align:center;
    line-height:0.5rem;
    margin: 1.07rem 0;
  }
  .custom_modal .content ul{
    display:flex;
    flex-direction:row;
  }
  .custom_modal .content ul li{
   flex:1;
   box-sizing:border-box;
   text-align:center;
   height:1.12rem;
  }
  .custom_modal .content ul li.first-child{
   border-top:0.02rem solid #EBEBEB;
  }
 .custom_modal .content ul li.last-child{
   background:linear-gradient(90deg,rgba(231,70,92,1),rgba(255,92,92,1));
 }
  .custom_modal .content ul li a{
   display:inline-block;
   line-height:1.12rem;
   font-size:0.36rem;
   color:#979797;
  }
 .custom_modal .content ul li.last-child a{
   color:#fff;
 }

</style>
