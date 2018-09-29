<template>
  <ul class="flyList">
    <li v-for="(item,index) in showCityList" class="flexRow center fontSize28 flexSpace" @click="flySelected(index,item)">
      <v-flyinfo :flyinfo="item"></v-flyinfo>
      <!--选择-->
      <section>
        <i v-if="cur===index" class="icon iconfont icon-danxuankuangyixuan"></i>
        <i class="icon iconfont icon-danxuankuangweixuan" v-else></i>
      </section>
    </li>
  </ul>
</template>
<script>
  import FlyInfo from './flyInfo.vue'
  import { mapState, mapMutations } from 'vuex'
  export default {
    data() {
      return {
        cur:-1
      }
    },
    components: {
      'v-flyinfo':FlyInfo
    },
    computed: {
      ...mapState({
        // queryAllCityList: state => state.changeFlyList.queryAllCityList,   //初使化
        showCityList: state => state.changeFlyList.showCityList,           //最终使用的 筛选过后的
      })
    },
    methods:{
      flySelected:function (index,item) {
        this.cur=index;
        this.$emit('flyInfoEvent',item);
      }
    }
  }
</script>
<style scoped>
  .flyList{
    padding-bottom: 2.2rem;
    border-bottom: none;
    padding: 0;
  }
  .flexRow.center{
    align-items: center;
    /*justify-content: center;*/
  }
  .flyList li{
    padding: 0.22rem 0.34rem;
    border-bottom: 0.02rem solid #ebebeb;
  }
  .flyList li:last-child{
    border-bottom: none;
  }
  .flyInfo img{
    width:100%;
    height: auto;
  }
  .flyInfo .flyLogo{
    width:0.24rem;
    display: inline-block;
  }
  .flyInfo .groupImg{
    width:0.15rem;
    display: inline-block;
    height: 0.57rem;
    margin: 0 0.26rem;
  }
  .flyList .icon-duoxuankuangyixuan,.flyList .icon-danxuankuangyixuan{
    color:#2C7CF9
  }
  .flyList .icon-duoxuankuangweixuan,.flyList .icon-danxuankuangweixuan{
    color:#d3d3d3;
  }


</style>
