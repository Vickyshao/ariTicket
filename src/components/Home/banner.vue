<template>
  <div class="swiper-container">
    <div class="swiper-wrapper">
      <a class="swiper-slide" v-for="item in bannerUrl" :title="item.Title" :href="item.Href" :target="item.Href?'_blank':''" :style="{ backgroundImage: 'url(' + item.ImgUrl + ')' }">
        <!--<p class="text"><span>“飞”享0元购，积分兑机票，省到家！</span></p>-->
      </a>
    </div>
    <div class="swiper-pagination swiper-pagination-white">

    </div>
  </div>
</template>

<script>
  import Swiper from 'swiper';
  import 'swiper/dist/css/swiper.min.css';
  import { mapState, mapMutations } from 'vuex';
  export default {
    data(){
      return {
//        bannerUrl:[],
      }
    },
    computed:{
      ...mapState({
        bannerUrl: state =>state.search.bannerUrl,
      })
    },
//    props: ['listImg'],
    async mounted() {

      //轮播图
      if(this.bannerUrl.length<1){
        let vm=this;
        let scrollBanner=async function () {
          let res=await vm.$root.http.get('/order/scroll','',vm);
          if(res){
            if(res.data.success){
              vm.$store.commit('UPDATE_BANNER',res.data.data);
//            vm.bannerUrl=res.data.data;
//            vm.bannerUrl[0]=vm.bannerUrl[0]+'?t=20180409';
            }
          }
        }
        await scrollBanner();   //轮播图
      }
//      console.log(this.bannerUrl.length);
      if(this.bannerUrl.length>1){
//        console.log('我轮播了');
        this.$nextTick(function () {
          var swiper = new Swiper('.swiper-container', {
            pagination: {
              el:'.swiper-pagination',
              clickable:true
            },
            paginationClickable: true,
            loop: true,
//          speed: 300,
            autoplay: {
              delay:3000,
              disableOnInteraction:false,
              stopOnLast: false,
            },
//        onTouchEnd: function() {
//          swiper.startAutoplay()
//        },
            autoplayDisableOnInteraction:false
          });
          if(swiper.slides.length<=3){
            swiper.destroy();
          }
        })
      }
    }
  }
</script>

<style>
  .swiper-container {
    width: 7.5rem;
    height: 3rem;

  }
  .swiper-wrapper {
    width: 100%;
    height: 100%;
  }
  .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 100%;
    height: 100%;

  }
  .swiper-slide img {
    width: 100%;
    height: 100%;
  }
  .swiper-pagination-bullet {
    width:0.0833rem;
    height: 0.0833rem;
    display: inline-block;
    background: #7c5e53;
  }
  .swiper-wrapper .text{
    position:absolute;
    left:0rem;
    bottom:0rem;
    background:rgba(0,0,0,0.3);
    z-index:5 !important;
    width:100%;
    height:0.8rem;
  }
  .swiper-wrapper .text span{
    display:inline-block;
    font-size:0.4rem;
    color:#fff;
    font-weight:bold;
    margin-left:0.34rem;
    line-height:0.8rem;
  }
</style>
