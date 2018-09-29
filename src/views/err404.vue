<template>
  <section class="error404">
    <div class="pic boxCenter">
      <img src="../assets/images/404.png"/>
    </div>
    <!--<p class="fontSize30">出现错误！</p>-->

    <!--<div class="reloadBtn fontSize34 boxCenter mt20" @click="backUp">返回首页</div>-->
  </section>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  export default {
    data(){
      return {

      }
    },
    methods:{
//      backUp:function () {
//        this.$router.push({path:'/Home'});
//      }
    }
  }
</script>
<style>
  .error404{
    width:7.5rem;
    height: 100%;
    /*background: #fff;*/
    /*padding: 3.86rem 0 6rem;*/
    margin-top: 3rem;
  }
  .error404 .pic{
    width:4.38rem;
    /*height: 1.73rem;*/
    /*background: url("./cry.png");*/
    /*background-size: 100%;*/
    /*background-repeat: no-repeat;*/
  }
  .error404 .pic img{
    width:100%;
    height: auto;
  }
  .error404 p{
    text-align: center;
    color: #B3D2FF;
    line-height: 0.6rem;

  }
  .reloadBtn{
    width:2.5rem;
    height: 0.7rem;
    border:0.02rem solid #2C7CF9;
    line-height: 0.7rem;
    text-align: center;
    color: #2C7CF9;
    border-radius: 0.3rem;
    margin-top: 0.3rem;
    /*display: none;*/
  }

</style>
