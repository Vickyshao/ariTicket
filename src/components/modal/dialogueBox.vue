<template>
  <div class="dialogueBox" v-if="isDialogBox">
    <!--带确认的消息框-->
    <div class="maska"></div>
    <!--普通的dialogNum=1-->
    <div v-if="dialogNum===1" class="content color53">
      <p class="fontSize36 fontBold">
        {{dialogMsg}}
      </p>
      <div class="dialogBtn flexRow fontSize36">
        <em class="color97" @click="dialogBoxHide">取消</em>
        <slot name="confirm"></slot>
      </div>
    </div>
    <!--退票dialogNum=2-->
    <div v-if="dialogNum===2" class="content refundContent color53">
      <div class="refundDialog fontBold fontSize34">
        <!--<p>{{dialogMsg}}</p>-->
        <p>核对退票信息<br>提交退票后无法撤销</p>
      </div>
      <!--选择的信息-->
      <slot name="selectInfo"></slot>
      <div class="dialogBtn flexRow fontSize36">
        <em class="color97" @click="dialogBoxHide">取消</em>
        <slot name="confirm"></slot>
      </div>
    </div>
    <!--普通的dialogNum=3 有一个按钮的提示框-->
    <div v-if="dialogNum===3" class="content color53">
      <p class="fontSize36 fontBold dialogMsg3">
        {{dialogMsg}}
      </p>
      <div class="dialogBtn flexRow fontSize36">
        <!--<em class="color97" @click="dialogBoxHide">取消</em>-->
        <slot name="confirm"></slot>
      </div>
    </div>
    <!--普通的dialogNum=4 取消也自定义-->
    <div v-if="dialogNum===4" class="content color53">
      <p class="fontSize36 fontBold">
        {{dialogMsg}}
      </p>
      <div class="dialogBtn flexRow fontSize36">
        <!--<em class="color97" @click="dialogBoxHide">取消</em>-->
        <slot name="cancel"></slot>
        <slot name="confirm"></slot>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import { mapState, mapMutations } from 'vuex';
  export default {
    name: 'modala',
    data(){
      return{
//        newsMsg:[]
      }
    },
    computed:{
      ...mapState({
        isDialogBox: state =>state.modal.isDialogBox,
        dialogMsg: state => state.modal.dialogMsg,
        dialogNum:state => state.modal.dialogNum
      })
    },
    created(){
//      this.newsMsg=this.dialogMsg.split("\n");
    },
    methods: {
      ...mapMutations([
        'dialogBoxShow',
        'dialogBoxHide',
      ]),
    },

  }
</script>
<style lang="css">
  /* 模态框 */
  .dialogueBox{
    position: fixed;
    z-index:4;
    left:0rem;
    top:0rem;
    bottom:0rem;
    right:0rem;
  }
  .dialogueBox .maska{
    position: fixed;
    z-index:4000;
    left:0rem;
    top:0rem;
    bottom:0rem;
    right:0rem;
    background:rgba(0,0,0,0.4);
  }
  .dialogueBox .content{
    position:fixed;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
    z-index:5000;
    width:6.82rem;
    padding-top:0.29rem;
    background:#fff;
    border-radius: 0.1rem ;
  }

  .dialogueBox .content p{
    color:#535353;
    line-height:0.42rem;
    text-align:center;
    margin-bottom:0.14rem;
    margin: 1.08rem 0;
  }
  .dialogueBox .content.refundContent{
    padding-top:0px;
    border-radius: 0 0 0.1rem 0.1rem;
  }
  .dialogueBox .content.refundContent p{
    margin:0px;
  }
  /*.dialogueBox .content .dialogBtn{*/

  /*}*/
  .dialogueBox .content .dialogBtn em{
    width:3.41rem;
    height: 1.12rem;
    line-height: 1.12rem;
    text-align: center;
    border-top:0.02rem solid #d3d3d3;
  }
  .dialogueBox .content .dialogBtn em.oneBtn{
    width:7.5rem;
  }
  .dialogueBox .content .dialogBtn em.confirm{
    background:linear-gradient(90deg,rgba(231,70,92,1),rgba(255,92,92,1));
    color: #fff;
    border: none;
  }
  .show{
    display: block;
  }
  .dialogueBox .refundDialog{
    width:6.82rem;
    /*height:1.48rem;*/
    background:rgba(255,253,233,1);
    padding: 0.3rem 0.34rem 0.22rem;
    font-size: 0.34rem;
    text-align: center;
  }
  .dialogueBox .content p.dialogMsg3{
    width:4.5rem;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }
</style>
