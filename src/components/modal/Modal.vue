<template>
  <div class="modal" v-if="modal">
    <div class="maska" @click="$store.commit('modalHide')"></div>
    <div class="content">
      <p class="fongSize30 wordBreak">{{msg}}</p>
    </div>
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
 /* 模态框 */
  .modal{
    position: fixed;
    z-index:4;
    left:0rem;
    top:0rem;
    bottom:0rem;
    right:0rem;
  }
  .modal .maska{
    position: fixed;
    z-index:4;
    left:0rem;
    top:0rem;
    bottom:0rem;
    right:0rem;
    background:rgba(0,0,0,0.4);
  }
  .modal .content{
    position:fixed;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
    z-index:8;
    width:5.74rem;
    padding:0.29rem 0.54rem 0.36rem;
    background:#fff;
    border-radius: 0.1rem ;

  }
  .modal .content p{
    color:#535353;
    /*height:0.42rem;*/
    line-height:0.42rem;
    text-align:center;
    /*margin-bottom:0.14rem;*/
    font-weight:bold;
    font-size:15px;
  }
  .show{
    display: block;
  }
  .wordBreak{
    word-break:break-all;
  }
</style>
