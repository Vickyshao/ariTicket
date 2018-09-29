<template>
  <div class="loading" v-show="isLoading">
    <div class="maska"></div>
    <div class="content">
      <section class="loadingBox">
        <div></div>
        <div></div>
        <div></div>
      </section>
      <p class="fongSize30">{{msgLoading}}</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapState, mapMutations } from 'vuex';
  export default {
    name: 'modala',
    computed:{
      ...mapState({
        isLoading: state =>state.modal.isLoading,
        msgLoading: state => state.modal.msgLoading
      })
    },
    mounted(){

    },
    methods: {
      ...mapMutations([
        'loadingShow',
        'loadingHide'
      ]),
    },

  }
</script>
<style lang="css">
  /* 模态框 */
  .loading{
    position: fixed;
    z-index:4;
    left:0rem;
    top:0rem;
    bottom:0rem;
    right:0rem;
  }
  .loading .maska{
    position: fixed;
    z-index:4;
    left:0rem;
    top:0rem;
    bottom:0rem;
    right:0rem;
    background:rgba(0,0,0,0.4);
  }
  .loading .content{
    position:fixed;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
    z-index:5;
    width:1.8rem;
    height: 1.8rem;
    /*line-height: 1.8rem;*/
    text-align: center;
    background:#fff;
    border-radius: 0.15rem ;

  }
  .loading .content p{
    color:#535353;
    height:0.42rem;
    line-height:0.42rem;
    text-align:center;
    margin-bottom:0.14rem;
    font-weight:bold;
    font-size:15px;
    margin-top: 0.3rem;
  }
  .show{
    display: block;
  }
  .loadingBox{
    /*display: flex;*/
    flex-direction: row;
    width:100%;
    display: flex;
    margin-top: 0.4rem;
    /*margin-left: 0.06rem;*/
    justify-content: center;
    align-items: center;
  }
  /*以下是*/
  @-webkit-keyframes scale {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 1; }

    45% {
      -webkit-transform: scale(0.1);
      transform: scale(0.1);
      opacity: 0.7; }

    80% {
      -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 1; } }
  @keyframes scale {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 1; }

    45% {
      -webkit-transform: scale(0.1);
      transform: scale(0.1);
      opacity: 0.7; }

    80% {
      -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 1; } }

  .loadingBox > div:nth-child(0) {
    -webkit-animation: scale 0.75s 0s infinite cubic-bezier(.2, .68, .18, 1.08);
    animation: scale 0.75s 0s infinite cubic-bezier(.2, .68, .18, 1.08); }
  .loadingBox > div:nth-child(1) {
    -webkit-animation: scale 0.75s 0.12s infinite cubic-bezier(.2, .68, .18, 1.08);
    animation: scale 0.75s 0.12s infinite cubic-bezier(.2, .68, .18, 1.08); }
  .loadingBox > div:nth-child(2) {
    -webkit-animation: scale 0.75s 0.24s infinite cubic-bezier(.2, .68, .18, 1.08);
    animation: scale 0.75s 0.24s infinite cubic-bezier(.2, .68, .18, 1.08); }
  .loadingBox > div:nth-child(3) {
    -webkit-animation: scale 0.75s 0.36s infinite cubic-bezier(.2, .68, .18, 1.08);
    animation: scale 0.75s 0.36s infinite cubic-bezier(.2, .68, .18, 1.08); }
  .loadingBox > div {
    background-color: #2C7CF9;
    width: 0.2rem;
    height: 0.2rem;
    border-radius: 100%;
    margin: 2px;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    display: inline-block; }
</style>
