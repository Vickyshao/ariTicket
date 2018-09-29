<template>
  <section class="error" v-if="isShowErr">
    <div class="pic boxCenter">
      <img src="./cry.png"/>
    </div>
    <p class="fontSize30">{{errorMsg}}</p>
    <!--重新加载按钮-->
    <slot v-if="reLoadBtn" name="reload"></slot>
    <!--&lt;!&ndash;返程的重新加载按钮&ndash;&gt;-->
    <!--<slot v-if="reLoadBtn1" name="reload"></slot>-->
  </section>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
  data(){
    return {

    }
  },
  computed:{
    ...mapState({
      errorMsg: state =>state.error.errorMsg,
      isShowErr:state =>state.error.isShowErr,
      reLoadBtn:state =>state.search.reLoadBtn,
//      reLoadBtn1:state =>state.returnList.reLoadBtn
    })
  }
}
</script>
<style scoped>
.error{
  width:7.5rem;
  height: 100%;
  background: #fff;
  padding: 3.86rem 0 6rem;
}
.error .pic{
  width:1.62rem;
  /*height: 1.73rem;*/
  /*background: url("./cry.png");*/
  /*background-size: 100%;*/
  /*background-repeat: no-repeat;*/
}
.error .pic img{
  width:100%;
  height: auto;
}
.error p{
  text-align: center;
  color: #B3D2FF;
  line-height: 0.5rem;
  width: 5rem;
  margin: 0 auto;
}
.reloadBtn{
  width:2.5rem;
  height: 0.7rem;
  border:0.02rem solid #2C7CF9;
  line-height: 0.7rem;
  text-align: center;
  color: #2C7CF9;
  border-radius: 0.3rem;
  /*display: none;*/
}

</style>
