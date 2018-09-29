<template>
  <section class="noOrder">
    <div class="pic boxCenter">
      <img src="./empty.png"/>
    </div>
    <p class="fontSize30">{{message}}</p>
    <!--按钮-->
    <slot name="goOrder"></slot>
  </section>
</template>

<script>
  // import { mapState, mapMutations } from 'vuex';
  export default {
    data(){
      return {

      }
    },
    props:['message']
//     computed:{
//       ...mapState({
//         errorMsg: state =>state.error.errorMsg,
//         isShowErr:state =>state.error.isShowErr,
//         reLoadBtn:state =>state.search.reLoadBtn,
// //      reLoadBtn1:state =>state.returnList.reLoadBtn
//       })
//     }
  }
</script>
<style scoped>
  .noOrder{
    width:7.5rem;
    height: 100%;
    background: #f8f8f8;
    padding: 3.86rem 0 5.6rem;
  }
  .noOrder .pic{
    width:1.94rem;
    /*height: 1.73rem;*/
    /*background: url("./cry.png");*/
    /*background-size: 100%;*/
    /*background-repeat: no-repeat;*/
  }
  .noOrder .pic img{
    width:100%;
    height: auto;
  }
  .noOrder p{
    text-align: center;
    color: #979797;
    line-height: 0.5rem;
    width: 5rem;
    margin: 0.16rem auto 0;
    font-size: 0.3rem;
  }

</style>
