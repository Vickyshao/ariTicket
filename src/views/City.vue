<template>
    <div class="city-select">
        <!-- 搜索 -->
        <div class="search">
          <div class="search-container" :class="{'focus':focus_status || val.length > 0}">
            <span class="iconfont search-icon icon-sousuo"></span>
            <input class="fontSize28" type="text" @focus="fnFocus()" @blur="fnBlur()"  placeholder="输入您要查询的城市" v-model="val" ref="ipt">
            <span v-if="focus_status || val.length > 0" class="iconfont close-icon icon-qingchu" @click="clear"></span>
          </div>
          <span class="clear fontSize30" v-if="focus_status || val.length > 0" @click="cancel">取消</span>
        </div>
        <!-- 搜索结果 -->
        <div class="search-result" v-show="val !== ''">
          <ul>
            <li v-for="(item,index) in resultArr" @click="goHome(item.Name,item.Code)" v-if="item.Name">{{item.Name.split(val)[0]}}<span>{{val}}</span>{{item.Name.split(val)[1]}}</li>
          </ul>
        </div>
        <div class="big-box" v-show="val === ''">
          <!-- 国内国际城市切换 -->
          <div class="tab-container" v-if="false">
            <ul class="tab">
              <li :class="{'active': tab === 1}" @click="fnTab(1)"><span class="fontSize34">国内</span></li>
              <li :class="{'active': tab === 2}" @click="fnTab(2)"><span class="fontSize34">国际/地区</span></li>
            </ul>
          </div>
          <!-- 当前城市 -->
          <div class="city-container" ref="cityContainer">
              <div class="cur-city">
                <h3 class="fontSize26">当前定位城市</h3>
                <ul class="clearfix">
                  <li class="fontSize28" @click="goHome(curCity.name,curCity.code)"><span class="iconfont icon-mark icon-wodeweizhi"></span>{{curCity.name}}</li>
                </ul>
              </div>
              <div class="history-city">
                <h3 class="fontSize26">历史搜索</h3>
                <ul class="clearfix">
                  <li v-for="(item,index) in history_arr" class="fontSize28 fl" :data-code="item.code" @click="goHome(item.name,item.code)">{{item.name}}</li>
                </ul>
              </div>
              <div class="hot-city">
                <h3 class="fontSize26">热门城市</h3>
                <ul class="clearfix">
                  <li v-for="(item,index) in hot_arr" class="fontSize28 fl" :class="{'active':codeActive === item.Code }" :data-code="item.Code" @click="goHome(item.Name,item.Code)">{{item.Name}}</li>
                </ul>
              </div>
          </div>
          <!-- 字母筛选 -->
          <div class="letter">
            <ul>
              <li v-for="(item,index) in letter_arr" @click="jump(item,index)">
                <!-- <span v-if="curIndex === index">{{item}}</span> -->
                <span :class="{'show':curIndex === index}">{{item}}</span>
                <a class="fontSize24">{{item}}</a>
              </li>
            </ul>
          </div>
          <!-- 字母对应的城市   -->
          <div class="relative">
            <ul>
              <li v-for="(item,index) in all_city" :id="index">
                <h3 ><span class="fontSize32">{{index}}</span></h3>
                <div class="city-text" >
                    <p  class="fontSize28" v-for="(city,index) in item" :data-code="city.Code" @click="goHome(city.Name,city.Code)">{{city.Name}}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

    </div>
</template>
<script type="text/ecmascript-6">
import { mapState, mapMutations } from 'vuex';
  export default {
    name: 'city-select',
    data() {
      return{
        focus_status:false,//是否获取焦点
        val:'', //输入框的值
        tab:1,//国内 国际城市切换
        history_arr:[],//历史城市
//        hot_arr:[],
        letter_arr:['A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','W','X','Y','Z'],
        curIndex:null,//点击字母 旁边显示当前字母
        codeActive:'',//热门城市激活状态
//        curCity:'',//当前城市
        timer:null,//清楚定时器
        target:null,//判断开始城市开始结束城市
//        all_city:[],//所有城市存储
        resultArr:[],//搜索结果
        tempCity:'', //临时存放当前城市名
      }
    },
    computed:{
      ...mapState({
        hot_arr: state =>state.city.hot_arr,
        all_city:state =>state.city.all_city,
        curCity:state =>state.city.curCity
      })
    },
    created:function () {
      if(this.hot_arr.length===0||this.all_city.length===0){
        //首次或页面刷新时请求
        this.hotCity();       //热门城市
        this.allCity();       //所有城市
      }
//      如果刷新了 重新获取一下当前城市
      if(this.curCity.name===''){
        var map = new AMap.Map("containerMap", {
          resizeEnable: true,
          center: [116.397428, 39.90923],
          zoom: 13
        });
        //获取用户所在城市信息
        var This = this
        //实例化城市查询类
        var citysearch = new AMap.CitySearch();
        //自动获取用户IP，返回当前城市
        citysearch.getLocalCity(function(status, result) {
          if (status === 'complete' && result.info === 'OK') {
            if (result && result.city && result.bounds) {
              var cityinfo = result.city;
              var citybounds = result.bounds;
              var cityName=cityinfo.replace(/[市省]/g,'');
              This.tempCity=cityName;
              This.vague(cityName);
              //地图显示当前城市
              map.setBounds(citybounds);
            }
          } else {
            this.$store.commit('initCity');
          }
        });
      }
    },
    mounted () {
//      this.hotCity();
//      this.allCity();
      //判断路由参数是否存在
      if(this.$route.query.name){
        //热门城市城市中与路由参数一直的激活
        this.codeActive = this.$route.query.code
        //当前位置城市更新
//        this.curCity = decodeURIComponent(this.$route.query.name);
        //开始城市结束城市赋值
        this.target = this.$route.query.num
        //历史城市添加数据
        //decodeURIComponent(this.$route.query.Msg)  //将乱码转成中文
        //encodeURIComponent(cityName)//将中文转成乱码

        if(!this.getCookie('history')) {
          //设定cookie历史数据
          let obj = JSON.stringify({arr:this.history_arr})
          this.setCookie('history',obj)
        }
        this.history_arr = JSON.parse(this.getCookie('history')).arr;
        for(let i = 0 ; i < this.history_arr.length ; i++){
            if(this.$route.query.code === this.history_arr[i].code){
              return;
            }
        }
        if(this.history_arr.length === 6){
          //如果历史数据长度大于6要删除最后一条数据在添加
          this.history_arr.pop();
          this.history_arr.unshift({name:decodeURIComponent(this.$route.query.name),code:this.$route.query.code});
        }else{
          this.history_arr.unshift({name:decodeURIComponent(this.$route.query.name),code:this.$route.query.code});
        }
        //设定cookie历史数据
        let obj = JSON.stringify({arr:this.history_arr})
        this.setCookie('history',obj);
      }

    },
    methods: {
      ...mapMutations([
        'modalShow',
        'UPDATE_HOT_CITY',
        'UPDATE_ALL_CITY',
        'UPDATE_CUR_CITY'
      ]),
      // 输入框获取焦点
      fnFocus(){
        this.focus_status = true;
      },
      // 输入框失去焦点
      fnBlur(){
        this.focus_status = false;
      },
      //值改变的时候进项搜索
//      fnChange(event){
//        let This = this
//        clearTimeout(this.timer)
//        this.timer=setTimeout(function(){
//          This.vague(event.target.value)
//        },200)
//
//      },
      //模糊查询后天请求
      vague: async function (val) {
       // this.$store.commit('loadingShow','拼命加载中');
       let params = {
          keyword: val
       }
       const res = await this.$root.http.get('order/area', params,this);
       if(res.data.success){
          this.resultArr = res.data.data;
          if(val===this.tempCity&&val!=''&&res.data.data.length!=0){
            this.UPDATE_CUR_CITY({name:res.data.data[0].Name,code:res.data.data[0].Code});//给当前城市赋值
          }
       }else{
          this.$store.commit('modalShow',res.data.msg);
          return;
        }

     },
     //热门城市
      hotCity: async function () {
       this.$store.commit('loadingShow','拼命加载中');
       let params = {}
       const res = await this.$root.http.get('order/hotCity', params,this);

       if(res.data.success){
//        this.hot_arr = res.data.data;
//          console.log(this.hot_arr)
          this.UPDATE_HOT_CITY(res.data.data);
       }else{
          this.$store.commit('modalShow',res.data.msg);
          return;
        }

     },
     //所有城市
      allCity: async function () {
       this.$store.commit('loadingShow','拼命加载中');
       let params = {}
       const res = await this.$root.http.get('order/area', params,this);

       if(res.data.success){
         this.UPDATE_ALL_CITY(res.data.data);
//        this.all_city = res.data.data;
       }else{
          this.$store.commit('modalShow',res.data.msg);
          return;
        }

     },
      //清空输入框数据
      clear(){
       this.val = ''
       this.$refs.ipt.focus()
      },
      //清空输入框数据
      cancel(){
       this.val = ''
       this.focus_status = false;
      },
      //国内国际城市切换
      fnTab(num){
        this.tab = num;
      },
      // 跳转相应城市
      jump(id,index){
        this.curIndex = index;
        let anchor = document.getElementById(id);
        let H = this.$refs.cityContainer.offsetHeight;
        // console.log(anchor.offsetTop + H + 8);
       // document.body.scrollTop = anchor.offsetTop + H + 8
        $('html, body').animate({
          scrollTop: anchor.offsetTop + H + 8
        }, 0);
       let This = this
        setTimeout(function(){
          This.curIndex = null
        },500)
      },
      //跳转到首页
      goHome(cityName,cityCode){
        if(this.target==1||this.target=='1'){
          this.$store.commit('updateCity',{departCityName:cityName,departCityIataCode:cityCode});
        }
        else{
          this.$store.commit('updateCity',{arriveCityName:cityName,arriveCityIataCode:cityCode});
        }
        this.$router.push({ path: '/Home' })
        //, query: { name: encodeURIComponent(cityName),code:cityCode,num:this.target}
      }
    },
    watch:{
      val:function (val,oldVal) {
        let This = this
        clearTimeout(this.timer)
        this.timer=setTimeout(function(){
          This.vague(val);
        },200)
      }
    }
  }
</script>
<style >

  .city-select{
    position: relative;
    overflow:hidden;
    background:#fff;
  }
  /* 搜索 */
  .city-select .search{
    position:fixed;
    display:flex;
    width:7.5rem;
    height:1rem;
    background:linear-gradient(-90deg,rgba(79,176,251,1),rgba(44,124,249,1));
    overflow:hidden;
    z-index:2;
  }
   .city-select .search .search-container{
    flex:1;
    display:inline-block;
    margin:0.15rem 0.34rem;
    width:6.82rem;
    height:0.7rem;
    background:rgba(255,255,255,0.15);
    border-radius: 0.1rem;
    display:flex;
    align-content: center;
  }
  .city-select .search .search-container .search-icon{
    flex:0 0 0.3rem;
    display:inline-block;
    font-size:0.3rem;
    color:rgba(255,255,255,0.3);
    margin:0.2rem;
  }
  .search-container input{
    display:inline-block;
    outline: none;
    border:none;
    background-color:transparent;
    flex:0 0 5.6rem;
    width:5.6rem;
    height:0.37rem;
    color:rgba(255,255,255,1);
    line-height:0.37rem;
    margin:0.16rem 0rem;
  }
  .search-container .close-icon{
    display:inline-block;
    font-size:0.34rem;
    color:rgba(255,255,255,0.7);
    margin:0.2rem;
    margin-top:0.18rem;
  }
  .city-select .search .clear{
    flex:0 0 1.28rem;
    display:inline-block;
    width:1.28rem;
    height:1rem;
    color:rgba(255,255,255,1);
    line-height:1.06rem;
    text-align: center;
  }
  .city-select .search .focus{
    width:5.88rem;
    margin-right:0rem;
  }
  .city-select .search .focus input{
    flex:0 0 4.35rem;
    width:4.35rem;
  }
  input::-webkit-input-placeholder{
    color:rgba(255,255,255,0.47);
  }
  /* 搜索结果 */
  .big-box,.search-result{
    position:relative;
    margin-top:1rem;
    /*width:6.8rem;*/
  }
  .search-result{
    position:relative;
    margin:1rem 0.34rem 0rem;
  }
  .search-result li{
    color:#535353;
    height:1.02rem;
    line-height:1.02rem;
    border-bottom:0.02rem solid #EBEBEB;
    font-size:0.3rem;
  }
  .search-result li span{
    color:#2C7CF9;
    font-size:0.3rem;
  }
  /* 国际国内切换 */
  .tab-container{
    position:relative;

  }
  .tab-container .tab{
    display:flex;
  }
  .tab-container .tab li{
    flex:1;
    display:flex;
    align-items: center;
    height:1rem;
    text-align: center;
    font-weight:bold;
    color:rgba(83,83,83,1);
    border-bottom:0.02rem solid #EBEBEB;
  }
  .tab-container .tab li span{
    flex:1;
  }
  .tab-container .tab li:first-child span{
   display:block;
   height:0.57rem;
   border-right:0.02rem solid #EBEBEB;
  }
  .tab-container .tab li.active{
    /* border-bottom:0.02rem solid #2C7CF9; */
    box-shadow: 0px 0.04rem 0px 0px rgba(44,124,249,1)
  }
  .tab-container .tab li.active span{
   color:#2C7CF9;
  }
  /* 主要城市 */
  .city-container{
    position: relative;
    padding:0.26rem 0.67rem 0rem 0.33rem;
  }
  .city-container>div{
    margin-bottom:0.14rem;
  }
  .city-container>div h3{
    height:0.35rem;
    color:#A6A6A6;
    line-height:0.35rem;
  }
  .city-container>div ul{
    margin-top:0.18rem;
    width:6.5rem;
  }
  .city-container>div ul li{
    width:2rem;
    height:0.6rem;
    border:0.02rem solid #D3D3D3;
    border-radius: 0.09rem ;
    text-align:center;
    line-height:0.6rem;
    color:#595757;
    margin-right:0.25rem;
    margin-bottom:0.26rem;
    box-sizing: border-box;
  }
  .city-container>div ul li:nth-child(3n){
    margin-right:0;
  }
  .city-container .hot-city ul li.active{
    background:#F4F9FF;
    color:#2C7CF9;
    border:0.02rem solid  #2C7CF9;
  }
   .city-container .cur-city ul li{
     color:#2C7CF9;
   }
  .city-container>div ul li .icon-mark{
    display:inline-block;
    font-size:0.27rem;
    color:#2C7CF9;
  }
  /* 字符筛选 */
  .letter{
    position: fixed;
    right:0.1rem;
    top:2.1rem;
    z-index:5;
  }
  .letter ul{
    line-height: 0.4rem;
  }
  .letter ul li{
    position:relative;
  }
  .letter ul li a{
    display:inline-block;
    width:0.23rem;
    text-align:center;
    color:rgba(44,124,249,1);
    line-height:0.3rem;
    margin-left:0.9rem;
  }
  .letter ul li span{
    margin-top:-0.2rem;
    position:absolute;
    display:inline-block;
    width:0.75rem;
    height:0.7rem;
    background:rgba(44,124,249,1);
    opacity:0.9;
    border-radius: 0.09rem;
    text-align:center;
    font-size:0.48rem;
    color:#fff;
    line-height:0.7rem;
    transition: all 0.5s;
    opacity:0;
  }
  .letter ul li span.show{
    opacity:1;
  }

  .letter ul li span:before{
    box-sizing: content-box;
    width: 0px;
    height: 0px;
    position: absolute;
    top: 0.28rem;
    right:-0.15rem;
    padding:0;
    border-bottom:0.08rem solid transparent;
    border-top:0.08rem solid transparent;
    border-left:0.08rem solid rgba(44,124,249,1);
    border-right:0.08rem solid transparent;
    display: block;
    content:'';
    z-index: 12;
  }
  /* 字母对应相应的城市 */
  .relative{
    position:relative;
    margin-top:0.17rem;
  }
  .relative ul li h3{
    background:#F6F6F6;
    height:0.58rem;
  }
  .relative ul li h3 span{
    display:inline-block;
    margin-left:0.35rem;
    color:#595757;
    line-height:0.58rem;
  }
  .relative ul li .city-text{
    margin:0rem 0.35rem;
  }
  .relative ul li .city-text p{
    height:0.79rem;
    line-height:0.79rem;
    color:#595757;
    border-bottom:0.02rem solid #EBEBEB;
  }
  .relative ul li .city-text p:last-child{
     border:none;
  }

</style>
