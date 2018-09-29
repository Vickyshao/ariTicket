<template>
  <div id="app">
    <router-view/>
    <v-modal></v-modal>
    <v-loading></v-loading>
  </div>
</template>

<script type="text/ecmascript-6">
import Modal from '@/components/Modal/modal'
import Loading from '@/components/Modal/loading'
import { mapState, mapMutations } from 'vuex';
import wx from 'weixin-js-sdk'
export default {
  name: 'App',
  data(){
    return{
//      url:'http://flights.bthhotels.com/home'
      getSignature:true
    }
  },
  created:function () {
//    if(this.getCookie('shareUrlCookie')){
//      let url=JSON.parse(this.getCookie('shareUrlCookie'));
////      console.log(location.href);
//      console.log('这里的链接是：'+url);
//      if(url==='http://flights.bthhotels.com/Home'||url==='http://flights.bthhotels.com'){
//        this.weixinShare();                                      //默认首页分享
//      }
//    }

    if(this.$store.state.list.departDateList.departDate===''){
      this.getData();   //重新获取cookie的值
//      this.weixinShare();                                      //默认首页分享
//      console.log('为什么走这里');
    }
  },
  watch: {
    async '$route' (to, from) {
      let url=location.href;
//      console.log('这回是啥'+url);
//      let url='http://flights.bthhotels.com'+to.path;
//      let shareUrl=JSON.stringify(url);
//      this.setCookie('shareUrlCookie',shareUrl);               //分享 参数链接
//      console.log(to.path);
      this.weixinShare();    //跳转链接分享
    }
  },
  mounted:function () {
//    console.log('看这里，看过来：'+location.href);
    this.weixinShare();    //跳转链接分享
  },
  methods:{
    ...mapMutations([
      'modalShow'
    ]),
//    微信分享自定义
    weixinShare:async function () {
//      let url=JSON.parse(this.getCookie('shareUrlCookie'));
        let url=location.href;
//      let url='http://flights.bthhotels.com/index.html';
//      console.log(this.getSignature);
//      if(this.getSignature){
//        url=JSON.parse(this.getCookie('shareUrlCookie'));
//      }
//      else{
//        url='http://flights.bthhotels.com/index.html';
//      }
//      console.log('当前链接是：'+url);
      let param={
        url:url
      }
      let res=await this.$root.http.post('/share',param,this);
//      console.log(res);
      if(res){
        if(res.data.data!=null&&res.data.success){
          wx.config({
            debug: false,
            appId: res.data.data.AppId,
            timestamp: res.data.data.Timestamp,
            nonceStr: res.data.data.Noncestr,
            signature: res.data.data.Signature,
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo']
            // 所有要调用的 API 都要加到这个列表中
          });
          wx.ready(function() {
//            console.log('成功了');
            wx.onMenuShareAppMessage({
              title:res.data.data.customParam.title,
              link:res.data.data.customParam.link,
              imgUrl:res.data.data.customParam.imgUrl,
              success: function () {
//                alert('发送成功!');
              },
              fail:function () {
//                alert('分享失败');
              },
              cancel: function () {
                // 用户取消分享后执行的回调函数
              }
            });
            wx.onMenuShareTimeline(res.data.data.customParam);
            wx.onMenuShareQQ(res.data.data.customParam);
            wx.onMenuShareWeibo(res.data.data.customParam);
          });
          wx.error(function (res) {
//            this.getSignature=false;
//            this.weixinShare();
          })
        }
      }
    }
  },
  components: {
    'v-modal':Modal,
    'v-loading':Loading
  }
}

</script>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
}
</style>
