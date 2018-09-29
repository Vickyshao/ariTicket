<template>
  <div class="filter">
    <!--loading-->
    <!--<div :class="{loadingShow:isShowLoading}" class="loadingMore">已查询{{showCityList.length}}个航班，正在查询更多航班信息...</div>-->
    <!--底部iconfont-->
    <ul class="footerFilter">
      <li @click="isShowPopup=true">
        <div v-if="!isHasFilter" class="defalt color97">
          <i class="icon iconfont icon-haoshi1"></i>
          <span>筛选</span>
        </div>
        <div class="seleted colorBlue" v-else>
          <i class="icon iconfont icon-haoshi1"></i>
          <span>筛选</span>
        </div>
      </li>
      <li @click="timeSort">
        <div v-if="!isTimeSelected" class="defalt color97">
          <i class="icon iconfont icon-haoshi"></i>
          <span>时间</span>
        </div>
        <div class="seleted colorBlue" v-else>
          <i class="icon iconfont icon-haoshi"></i>
          <span v-if="fromEarlyToLate">从早到晚</span>
          <span v-else>从晚到早</span>
        </div>
      </li>
      <!--<li @click="priceSort">-->
        <!--<div v-if="!isPriceSelected" class="defalt color97">-->
          <!--<i class="icon iconfont icon-jiage"></i>-->
          <!--<span>价格</span>-->
        <!--</div>-->
        <!--<div class="seleted colorBlue" v-else>-->
          <!--<i class="icon iconfont icon-jiage"></i>-->
          <!--<span v-if="fromLowToHigh">从低到高</span>-->
          <!--<span v-else>从高到低</span>-->
        <!--</div>-->
      <!--</li>-->
    </ul>
    <!--筛选弹出层-->
    <v-filterpoput :isShow="isShowPopup" v-on:listenEventFilter="receiveParamFilter"></v-filterpoput>
  </div>
</template>
<script>
  import FilterPoput from './filterPopup.vue'
  import { mapState, mapMutations } from 'vuex'
export default {
  data(){
    return{
      isTimeSelected:true,     //时间排序
      fromEarlyToLate:true,    //时间：是否是从早到晚
      isShowPopup:false,       //是否显示筛选弹出
      filterBtnHighlight:false,//筛选按钮 如果有筛选条件高亮显示
      // isPriceSelected:true,
      // fromLowToHigh:true,
    }
  },
  components:{
//    VFilterpoput,
    'v-filterpoput':FilterPoput
  },
  computed:{
    ...mapState({
      // isShowLoading:state =>state.changeFlyList.isShowLoading,
      showCityList:state =>state.changeFlyList.showCityList,
      isHasFilter:state =>state.changeFlyList.isHasFilter,
      // departDate:state =>state.list.departDateList.departDate,
    })
  },
  methods:{
    receiveParamFilter:function (obj) {
      this.isShowPopup=obj.isShowPopup;
      if(obj.btnHighlight){
        this.filterBtnHighlight=obj.btnHighlight;
      }
    },
    compare:function (prop,sort) {
      return function (obj1,obj2) {
         var val1=obj1[prop];
         var val2=obj2[prop];
         if(!isNaN(Number(val1))&&!isNaN(Number(val2))){
           val1=Number(val1);
           val2=Number(val2);
         }
         //升序
         var ascendingOrder=function (v1,v2) {
           if(v1<v2){
             return -1;
           }
           else if(v1>v2){
             return 1;
           }
           else {
             return 0;
           }
         }
         //降序
         var descendingOrder=function (v1,v2) {
           if(v1<v2){
             return 1;
           }
           else if(v1>v2){
             return -1;
           }
           else {
             return 0;
           }
         }

         var num;
         //sort=1升序 sort=2降序
         if(sort===1){
           num=ascendingOrder(val1,val2);
         }
         if(sort===2){
           num=descendingOrder(val1,val2);
         }
         return num;
      }
    },
    timeSort:function () {
      // this.isPriceSelected=false;  //价格为默认不选中
      if(this.isTimeSelected){
        this.fromEarlyToLate=!this.fromEarlyToLate;
      }
      else {
        //第一次单击的初使化为从早到晚
        this.isTimeSelected=true;
        this.fromEarlyToLate=true;
      }

      //时间排序 1升序  2降序
      if(this.fromEarlyToLate){
        var arr=this.showCityList.sort(this.$options.methods.compare.bind(this)('departTime',1));
        this.$store.commit('FILTER_FLIGHTS',arr);
      }
      else{
        var arr=this.showCityList.sort(this.$options.methods.compare.bind(this)('departTime',2));
        this.$store.commit('FILTER_FLIGHTS',arr);
      }
    },
    // priceSort:function () {
    //   this.isTimeSelected=false;
    //   if(this.isPriceSelected){
    //     this.fromLowToHigh=!this.fromLowToHigh;
    //   }
    //   else {
    //     //第一次单击的初使化为从低到高
    //     this.isPriceSelected=true;
    //     this.fromLowToHigh=true;
    //   }
    //   //价格排序 1升序  2降序
    //   if(this.fromLowToHigh){
    //     var arr=this.showCityList.sort(this.$options.methods.compare.bind(this)('price',1));
    //     this.$store.commit('FILTER_FLIGHTS',arr);
    //   }
    //   else{
    //     var arr=this.showCityList.sort(this.$options.methods.compare.bind(this)('price',2));
    //     this.$store.commit('FILTER_FLIGHTS',arr);
    //   }
    //
    // }
  },
  watch:{
    //如果时间改变了 筛选条件时间回到默认
    // departDate:function (val,oldval) {
    //   this.priceSort();  //默认价格排序
    // }
  }
}
</script>
<style scoped>
  .footerFilter{
    width:7.5rem;
    height:1rem;
    background:rgba(255,255,255,1);
    /*box-shadow: 0px -0.06px 0.06px 0px rgba(0,0,0,0.1);*/
    box-shadow: 0 -0.08rem 0.08rem 0 rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: row;
    align-items:center;
    position: fixed;
    bottom:1.1rem;
    left: 0px;
  }
  .footerFilter li{
    flex:1;
    text-align: center;
    /*width:2.5rem;*/
    /*text-align: center;*/
    /*line-height: 0.26rem;*/
  }
  .footerFilter li i{
    font-size: 0.6rem;
    display: block;
    height: 0.51rem;
    line-height: 0.6rem;
    margin-top: -0.08rem;
  }
  .footerFilter li i.icon-jiage{
    font-size: 0.48rem;
  }
  .footerFilter li i.icon-haoshi{
    font-size: 0.66rem;
  }
  .footerFilter li span{
    margin-top: 0.06rem;
    display: block;
  }

  /*加载更多*/
  .loadingMore{
    width:7.5rem;
    height: 1.2rem;
    background:linear-gradient(to right,rgba(44,124,249,1),rgba(79,176,251,1));
    position: fixed;
    bottom:0;
    left:0;
    z-index: 2;
    text-align: center;
    line-height: 1.2rem;
    color:#fff;
    font-size: 0.3rem;
    display: none;
  }
  .loadingShow{
    display: block;
  }
</style>
