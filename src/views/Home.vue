<template>
  <section class="home" ref="home">
    <!--轮播图组件-->
    <banner></banner>
    <!--出发城市-->
    <section class="citySelect cityLayer boxCenter">
      <div :class="{exchange:isExchange}" class="cityBox pl34 textLeft fontSize36 city start" @click="citySelected(1)">{{goCityData.departCityName}}</div>
      <!--切换-->
      <div v-if="goCityData.arriveCityName!=''" class="cityTabBtn" @click="citySwitch">
        <i class="icon iconfont icon-jiaohuan colorBlue"></i>
      </div>
      <div v-else class="cityTabBtn">
        <i class="icon iconfont icon-jiaohuan colorBlue"></i>
      </div>
      <!--如果没选 就显示目的地-->
      <div v-if="goCityData.arriveCityName!=''" :class="{exchange:isExchange}" class="cityBox block pr34 textRight fontSize36 city arrived" @click="citySelected(2)">{{goCityData.arriveCityName}}</div>
      <div class="cityBox block pr34 textRight fontSize36 city arrived w150 colorD3" @click="citySelected(2)" v-else>目的地</div>
    </section>
    <!--日期选择-->
    <section class="citySelect boxCenter mt20">
      <div class="cityBox pl34 textLeft fontSize36" @click="dateSelect(1)">
        <span>{{date.departDateObj.otherShorthand}}</span>
        <span class="tomorrow color97 fontSize24 pl10">{{date.departDateObj.departDay}}</span>
      </div>
      <div class="line"></div>
      <!--返程日期-->
      <div class="cityBox pl34" @click="dateSelect(2)">
          <span v-if="date.returnDateObj.returnShorthand===''" class="color97 fontSize30">返程日期 &nbsp(选填)</span>
          <em v-else>
            <span class="fontSize36 bold">{{date.returnDateObj.returnShorthand}}</span>
            <span class="color97 fontSize24 pl10">{{date.returnDateObj.returnDay}}</span>
          </em>
      </div>
      <span v-show="date.returnDateObj.returnShorthand!=''" class="fr returnDateDel mr20" @click="dateDel"><i class="icon iconfont icon-qingchu"></i> </span>

    </section>
    <section class="queryBtn fontSize36 boxCenter" @click="queryBtnClick">查询</section>
    <div class="containerMap"></div>
    <!--更多服务-->
    <v-serveList></v-serveList>
    <!--历史查询城市-->
    <section class="historyQuery">
      <ul>
        <li class="color53" v-for="item in historyList" @click="historyUpdateCity(item)">
          <span :hstDptcode="item.dptCode">{{item.dptName}}</span>
          ⇀
          <span :hstArvCode="item.arvCode">{{item.arvName}}</span>
        </li>
      </ul>
      <div v-show="historyList.length>0" class="clearHistory colorBlue fr" @click="fnClearHistory">清除记录</div>
    </section>
    <!--底部导航-->
    <ul class="footer color53">
      <li @click="$store.state.modal.isCustom = true">
        <i class="icon iconfont icon-lianxikefu"></i>
        <span>联系客服</span>
      </li>
      <li @click="myOrderList">
        <i class="icon iconfont icon-wodedingdan"></i>
        <span>我的订单</span>
      </li>
    </ul>
    <date ref="child"></date>
    <!--联系客服弹框-->
    <v-custom v-if="isCustom"></v-custom>
  </section>
</template>
<script>
  import banner from '../components/Home/banner.vue';
  import date from '../components/Date/date.vue';
  import serveList from '@/components/Home/serveList.vue';
  import custom from '@/components/Modal/custom.vue';
  import { mapState, mapMutations } from 'vuex';
  export default{
    data(){
      return {
        //去程
        goData:{
          initDate:true      //是否初使化
        },
        isExchange:false,
        //初使化城市为当前城市 ip
        curCity:'',
        curCode:''
      }
    },
    components:{
      banner,
      date,
      'v-serveList':serveList,
      'v-custom':custom
    },
    computed:{
      ...mapState({
        goCityData: state =>state.search.goCityData,
        historyList: state =>state.search.historyList,
        isReturnDate:state =>state.list.isReturnDate,
        date:state =>state.search.date,
        returnDate:state =>state.search.date.returnDateObj.returnDate,
        queryAllCityList:state =>state.list.queryAllCityList,
        orderList:state =>state.orderList.orderList,                      //我的订单列表
        isCustom: state =>state.modal.isCustom,
        returnCityData:state =>state.search.returnCityData,
        returnDateObj:state =>state.search.date.returnDateObj,
        departDateList:state =>state.list.departDateList,
        departDateObj:state =>state.search.date.departDateObj,
        isInit:state =>state.search.isInit,                                //是否是初使化
      })
    },
    created:async function(){
      //如果cookie有效期过了 清空cookie的日期
      if(this.getCookie('departDateCookie')){
        let goDepartDate=JSON.parse(this.getCookie('departDateCookie'));
//        console.log('cookie日期');
//        console.log(goDepartDate);
        var cookieDate = new Date(goDepartDate.departDate.replace(/-/g,"/"));
        var now=new Date();
        let n=new Date(cookieDate.getFullYear(),cookieDate.getMonth(),cookieDate.getDate()).getTime()-new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime();
        if(n<0){
          // this.$router.push({path:'/Home'});
          //如果缓存里的日期小于今天的日期 清空缓存日期
          let obj={
            departDate:'',
            departShorthand:'',
            departDay:'',
            otherShorthand:''   //月 日
          }
          let departDate=JSON.stringify(obj);
          this.setCookie('departDateCookie',departDate);          //出发日期
        }
        //如果列表里的时间为空 出发日期初使化为今天，否则为列表中的时间

      }
      if(this.departDateList.departDate===''){
//          this.$options.methods.initDepartDate.bind(this)();
//        console.log('这里为什么又走了一遍')
        this.$store.dispatch('DefaultDate');     //默认今天
      }
      else{
        this.$store.commit('upDepartDate',this.departDateList);
      }
      //-------初使化城市为当前城市 开始
      if(this.isInit&&this.goCityData.departCityIataCode===''){
        this.$store.commit('initCity');
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
              This.vague(cityinfo.replace(/[市省]/g,''))
              //地图显示当前城市
              map.setBounds(citybounds);
            }
          } else {
            this.$store.commit('initCity');
          }
        });
      }
      //初使化城市为当前城市 结束----/

      //首页存一下分享自定义链接
//      let url=location.href;
//      let shareUrl=JSON.stringify(url);
//      this.setCookie('shareUrlCookie',shareUrl);               //分享 参数链接


      //初使化历史记录
    if(this.getCookie('historyCookie')){
      var cookieHistory=JSON.parse(this.getCookie('historyCookie'));
      this.$store.commit('saveHistoryList',cookieHistory.arr);
      var showArr=cookieHistory.arr;
    }

    },
    methods:{
      ...mapMutations([
        'citySwitch',
        'addHistoryCity',
        'clearHistoryCity',
        'updateCity',
        'upDateListDepartDate',
        'UPDATEORDERLIST',
        'UPDATE_RELOAD_SHOW',   //重新加载按钮
        'UPDATE_RELOAD_HIDE',
        'ERROR_HIDDEN',         //错误页隐藏
        'ERROR_SHOW',           //错误页显示
        'UPDATE_CUR_CITY',      //当前城市 存起来
      ]),
      citySelected:function (num) {
        if(num==1||num=='1'){
          this.$router.push({ path: '/City', query: { name: encodeURIComponent(this.goCityData.departCityName),code:this.goCityData.departCityIataCode,num:1} });

        }
        else{
          this.$router.push({ path: '/City', query: { name: encodeURIComponent(this.goCityData.arriveCityName),code:this.goCityData.arriveCityIataCode,num:2} });
        }
      },
      //清空历史城市
      fnClearHistory:function () {
        this.$store.commit('clearHistoryCity');
        var obj=JSON.stringify({arr:this.historyList})
        this.setCookie('historyCookie',obj);
      },
      //点击查询
      queryBtnClick:function () {
        //验证三个参数 非空
        if(this.goCityData.arriveCityIataCode===''){
          this.$store.dispatch('modalCountdown','请选择目的地！'); //带倒计时的消息框
          return;
        }
        console.log('看这');
        if(this.goCityData.departCityIataCode===''){
          this.$store.dispatch('modalCountdown','出发地不能为空！'); //带倒计时的消息框
          return;
        }
        if(this.departDateObj.departDate===''){
          this.$store.dispatch('modalCountdown','出发日期不能为空！'); //带倒计时的消息框
          return;
        }
        //如果存在切换城市 那么出发城市与到达城市换一下
        if(this.isExchange){
          this.$store.commit('citySwitch');
        }

        this.$store.commit('addHistoryCity');
        var obj=JSON.stringify({arr:this.historyList})
        this.setCookie('historyCookie',obj);
        this.$store.commit('upDateListDepartDate',this.departDateObj);        //更新列表中的时间

        //跳转到列表页
        this.$router.push({path:'/List'});
        //返程信息 如果返程日期不为空 设置和个真假值并给返程参数赋值
        if(this.returnDate!=''){
          this.$store.commit('UPDATE_RETURN_STATE',1);    //如果返程日期不为空 更新全局状态为真
          this.$store.commit('UPDATE_RETURN_CityData',1);   //给返程赋值 出发城市与到达城市
        }
        else{
          this.$store.commit('UPDATE_RETURN_STATE',2);    //如果返程日期为空 更新全局状态为假
          this.$store.commit('UPDATE_RETURN_CityData',2);   //给返程赋值 出发城市与到达城市初使为空
        }

        //存cookie的值
        this.saveData();

      },
      //点击历史记录更新城市选择
      historyUpdateCity:function (item) {
        this.$store.commit('updateCity',{departCityName:item.dptName,arriveCityName:item.arvName,departCityIataCode:item.dptCode,arriveCityIataCode:item.arvCode});
      },
      //弹出日期选择插件
      dateSelect:function (n) {
        let obj={
          returnDate:'',
          returnShorthand:'',
          returnDay:''
        }
        this.$store.commit('upReturnDate',obj);
        this.$refs.child.showDate(n);
      },
      //删除返程日期
      dateDel:function () {
        var obj={
          returnDate:'',
          returnShorthand:'',
          returnDay:''
        }
        this.$store.commit('upReturnDate',obj);
      },
//      initDepartDate:function () {
//        var nowDate=new Date(),
//          yy=nowDate.getFullYear(),
//          mm=nowDate.getMonth()+1,
//          dd=nowDate.getDate();
//        mm=mm<10?'0'+mm:mm;
//        dd=dd<10?'0'+dd:dd;
//        var paramDate=yy+'-'+mm+'-'+dd;
//        var textDate=mm+'月'+dd+'日';
//        var textDate1=mm+'-'+dd;
//        var textDay='今天';
//        var obj={
//          departDate:paramDate,
//          departShorthand:textDate1,
//          departDay:textDay,
//          otherShorthand:textDate
//        }
//        this.$store.commit('upDepartDate',obj);
//      },
      //我的订单
      myOrderList:async function () {
        this.$router.push({path:'/OrderList'});
      },
      //切换城市
      citySwitch:function () {
        this.isExchange=!this.isExchange;
//
      },
      //模糊查询后天请求
      vague: async function (val) {
        this.$store.commit('loadingShow','拼命加载中');
        let params = {
          keyword: val
        }
        const res = await this.$root.http.get('order/area', params,this);
        if(res){
          if(res.data!=null&&res.data.length!=0){
            if(res.data.success){
              this.curCity = res.data.data[0].Name;
              this.curCode = res.data.data[0].Code;
              this.$store.state.search.goCityData.departCityName = res.data.data[0].Name;
              this.$store.state.search.goCityData.departCityIataCode = res.data.data[0].Code;
              this.UPDATE_CUR_CITY({name:res.data.data[0].Name,code:res.data.data[0].Code});
            }else{
              this.$store.commit('modalShow',res.data.msg);
              return;
            }
          }
        }
      },
    },
  }



</script>
<style>
  .pl34{
    padding-left: 0.34rem;
  }
  .pr34{
    padding-right: 0.34rem;
  }
  .banner,.citySelect{
    width:7.5rem;
  }
  .banner{
    height: 3rem;
  }
  .citySelect{
    height: 1.1rem;
    background: #fff;
    display: flex;
    flex-direction: row;
    align-items:center;
    width:7.5rem;
  }

  .citySelect .cityBox{
    width:3.45rem;
    color: #2F2E2E;
    height: 0.36rem;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .citySelect .cityBox.colorD3{
    color: #D3D3D3;
  }
  .citySelect.cityLayer{
    position: relative;
  }
  .citySelect .cityBox.city{
    width:3.45rem;
    position: absolute;
    top:0.34rem;
    transition: all 0.2s linear ;
  }
  /*.citySelect .cityBox.city.w150{*/
    /*width:1.5rem;*/
  /*}*/
  .citySelect .cityBox.city.start{
    left:0rem;
  }
  .citySelect .cityBox.city.arrived{
    left:4rem;
  }
  .citySelect .cityBox.city.start.exchange{
    left:4rem;
    text-align: right;
    padding-right: 0.34rem;
    display: block;
  }
  .citySelect .cityBox.city.arrived.exchange{
    left:0rem;
    text-align: left;
    padding-left: 0.34rem;
  }
  .citySelect .textLeft,.citySelect .textRight{
    font-weight:bold;
  }
  .citySelect .cityBox em{
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .citySelect .cityBox em .bold{
    font-weight:bold;
  }
  .citySelect .cityTabBtn{
    width:0.58rem;
    margin: 0 auto;
  }
  .citySelect .cityTabBtn .icon{
    font-size: 0.58rem;
  }
  .citySelect .line{
    border-left:0.02rem solid #ebebeb;
    margin-left: 0.09rem;
    height: 0.53rem;
  }
  .queryBtn{
    width:6.82rem;
    height: 1rem;
    background:linear-gradient(to right,rgba(44,124,249,1),rgba(79,176,251,1));
    border-radius: 0.12rem;
    line-height: 1rem;
    text-align: center;
    color: #fff;
    margin-top: 0.35rem;
  }
  .historyQuery{
    margin-top: 3.15rem;
    display: flex;
    flex-direction: row;
    width:7.5rem;
    align-items:center;
    position: fixed;
    left: 50%;
    bottom:1.5rem;
    margin-left: -3.75rem;
  }
  .historyQuery ul{
    display: flex;
    flex-direction: row;
    width:6.18rem;
  }
  .historyQuery li{
    margin: 0 0.28rem;
    font-size: 0.24rem;
  }
  .historyQuery .clearHistory{
    width:1.05rem;
  }
  .footer{
    width:100%;
    height:1.2rem;
    background:rgba(255,255,255,1);
    box-shadow: 0 -0.08rem 0.08rem 0 rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: row;
    align-items:center;
    position: fixed;
    bottom:0px;
    left: 0px;
  }
  .footer li{
    width:50%;
    /*margin:0 1.3rem;*/
    text-align: center;
    height: 0.83rem;
    line-height: 0.4rem;
    display: flex;
    flex-direction: column;
  }
  .footer li i{
    font-size: 0.5rem;
  }
  .footer li span{
    margin-top: 0.06rem;
    display: block;
  }
  .returnDateDel{
    padding-right: 0.1rem;
  }
  .returnDateDel .icon{
    color: #dfdfdf;
  }
  @media (max-width: 320px) {
    .footer li{
      width:1.15rem;
      margin:0 1.2rem;
    }
    .historyQuery .clearHistory{
      width:1.2rem;
    }
    .historyQuery li{
      margin: 0 0.25rem;
    }
    .returnDateDel{
      padding-right: 0.1rem;
    }
  }
  .cityBox.block{
    display: block;
  }
  .containerMap{
    width:7.5rem;
    height: 1rem;
  }
</style>


