<template>
  <div class="dialog">
    <div class="maska" @click="$store.commit('dialogHide')"></div>
    <div class="content">

      <div class="slot_box" v-if="dialogNum == 0">
        <slot name="title"></slot>
        <slot name="userName"></slot>
      </div>
      <div class="slot_box" v-if="dialogNum == 1">
        <slot name="titlea"></slot>
        <slot name="userNamea"></slot>
      </div>
      <div class="slot_box" v-if="dialogNum == 2">
        <slot name="titleb"></slot>
        <slot name="userNameb"></slot>
      </div>
      <!--dialogNum == 3 保险-->
      <div class="slot_box" v-if="dialogNum == 3">
        <slot name="titlec"></slot>
        <slot name="userNamec"></slot>
        <slot name="more"></slot>
      </div>
      <!--dialogNum == 4 积分抵扣说明-->
      <div class="slot_box" v-if="dialogNum == 4">
        <slot name="titled"></slot>
        <slot name="userNamed"></slot>
      </div>
      <!--关闭-->
      <div class="close_btn">
        <span class="colse iconfont icon-danchukuangguanbianniu" @click="$store.commit('dialogHide')"></span>
      </div>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
import { mapState, mapMutations } from 'vuex';
  export default {
    name: 'dialoga',
    computed:{
      ...mapState({
        dialogNum: state =>state.dialog.dialogNum
      })
    },
    mounted(){
//      console.log(this.dialogNum)
    },
     methods: {
      ...mapMutations([
        'dialogHide',
      ]),
    },
  }
</script>
<style lang="css">
 /* 模态框 */
  .dialog{
    position: fixed;
    z-index:4;
    left:0rem;
    top:0rem;
    bottom:0rem;
    right:0rem;
  }
   .dialog .maska{
    position: fixed;
    z-index:4;
    left:0rem;
    top:0rem;
    bottom:0rem;
    right:0rem;
    background:rgba(0,0,0,0.4);
  }
  .dialog .content{
    position:fixed;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
    z-index:5;
    width:6.82rem;
    padding:0.4rem 0.52rem;
    background:#fff;
    border-radius: 0.1rem ;

  }
  .dialog .content h3{
    color:#2C7CF9;
    height:0.42rem;
    line-height:0.42rem;
    text-align:center;
    margin-bottom:0.14rem;
    font-weight:bold;
    font-size:0.3rem;
  }
  .dialog .content ul{
   max-height:5.64rem;
    overflow-y:scroll;
  }
  .dialog .content ul li{
    color:#535353;
    line-height:0.4rem;
    font-size:0.28rem;
  }
  ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
    border-radius: 5px ;

  }
 .dialog .content ul::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    background:#DEEBFE;
    border-radius: 5px ;
  }
  .dialog .content ul::-webkit-scrollbar-track {/*滚动条里面轨道*/
      -webkit-box-shadow: inset 0 0 0px rgba(255,255,255,1);
      border-radius: 0;
      background: #ffffff;;
  }
  .close_btn{
    margin-top:0.4rem;
    text-align:center;
    position:fixed;
    bottom:-1.42rem;
    left:0.54rem;
    right:0.54rem;
  }
  .colse{
    display:inline-block;
    font-size:1.02rem;
    color:#fff;
  }
 .colse.iconfont{
   font-size: 1.02rem;
 }
 .dialog .icon-xiangyou{
   font-size: 0.11rem;
   color: #C1C2C3;
 }

</style>
