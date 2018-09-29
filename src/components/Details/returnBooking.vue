<template>
  <div>
    <ul class="booking">
      <li v-for="item in showDetailInfo.cabin">
        <div class="book_main">
          <div class="amount">
            <span class="yang fontSize24">¥</span><span class="fontSize36 money">{{item.adultPrice}}</span>
          </div>
          <p class="limit fontSize24">不可订<span v-if="item.applicableTravelerCategory===2">儿童、</span>婴儿</p>
          <!--舱位 折扣 退改签规则-->
          <div class="collection">
            {{item.cabinClassName}}
            <span>{{item.discount>=10?'全价':item.discount+'折'}}</span>
            <span class="return fontSize24">| 退改签规则 </span>
            <!--<span class="miles fontSize24">| 150%里程累计</span>-->
            <span @click="retiredPopup(item)" class="info iconfont icon-xinxitishi"></span>
          </div>
          <!--积分抵扣最高可省-->
          <div v-if="showDetailInfo.deducted!=0" class="collection mt10">
            <span @click="integralDetail" class="integral color97 fontSize24">
              积分抵扣最高可省<span class="colorRed">{{showDetailInfo.deducted}}</span>元
            </span>
            <!--<span @click="integralDetail" class="info iconfont icon-xinxitishi"></span>-->
          </div>
        </div>
        <div class="book_num" >
          <p @click="bookingClick(item)" class="tickets fontSize30" :class="{active:item.seatStatus==='>9'}">订票</p>
          <p v-if="item.seatStatus!='>9'" class="num fontSize24">剩{{item.seatStatus}}张</p>
        </div>
      </li>
    </ul>
    <!--退改签-->
    <v-retired></v-retired>
    <!--积分抵扣说明-->
    <v-dialog v-if="dialog && dialogNum === 4">
      <h3 class="fongSize30" slot="titled">积分抵扣说明</h3>
      <ul slot="userNamed">
        <li>积分兑换比例为{{rate}}</li>
        <li>现您账户中剩余<span class="colorRed">{{score}}</span>积分</li>
      </ul>
    </v-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
import FlyStatus from '@/components/Details/flyStatus'
import Retired from '@/components/Dialog/retired'
import Dialog from '@/components/Dialog/dialog';
import { mapState, mapMutations } from 'vuex';
  export default {
    name: 'booking',
    data() {
      return{
        rate:'',
        score:''
      }
    },
    computed:{
      ...mapState({
        isReturnDate:state =>state.list.isReturnDate,                 //是否有返程
        showDetailInfo:state =>state.returnSearchDetail.showDetailInfo,     //预订详情信息
        goCityData:state =>state.search.goCityData,                   //去程列表
        returnCityData:state =>state.search.returnCityData,           //返程出发城市参数
        goCabin:state =>state.order.cabin,
        departDate:state =>state.list.departDateList.departDate,      //去程日期
        returnDate:state =>state.search.date.returnDateObj.returnDate,//返程日期
        dialogNum: state =>state.dialog.dialogNum,                                  //积分抵扣说明
        dialog: state =>state.dialog.dialogFlag,
      })
    },
    created:async function () {
      //请求用户 获取用户剩余积分
      let res=await this.$root.http.post('/scoreRule','',this);
      if(res){
        if(res.data!=null&&res.data.length!=0){
          this.rate=res.data.rate;
          this.score=res.data.score;
        }
      }
    },
    methods:{
      ...mapMutations([
//        'UPDATELOADING_RETURN',
//        'INIT_FLIGHTS_RETURN',
//        'FILTER_FLIGHTS_RETURN',
//        'UPDATE_FILTER_RETURN'
      ]),
      bookingClick:async function (cabin) {
        let vm=this;
//        console.log('为啥不动了');
        //存cookie
        var returnSessionId=JSON.stringify(cabin.sessionId);
        this.setCookie('returnSessionIdCookie',returnSessionId);

        var returnSolution=JSON.stringify(cabin.solution);
        this.setCookie('returnSolutionCookie',returnSolution);

        var returnCabinCode=JSON.stringify(cabin.cabinCode);
        this.setCookie('returnCabinCodeCookie',returnCabinCode);
//        console.log('我是返程的');
//        console.log(cabin);
        //返程程数据判断是否过期，没过期就存储
        var isBack=false;
        const params={
          sessionId:cabin.sessionId,
          orgCityCode:vm.returnCityData.departCityIataCode,
          dstCityCode:vm.returnCityData.arriveCityIataCode,
          departureDate:vm.returnDate
        }
//        console.log(params);
        vm.$store.commit('loadingShow','拼命加载中');
        var res=await vm.$root.http.post('/refundRuleQuery',params,vm);

        if(res.data!=null){
          if(res.data.success){
            vm.$store.commit('UPDATE_CABIN_RETURN',cabin);  //存返程数据
          }
          else {
            //如果过期了 重新加载航班列表需要重新选择
            if(res.data.errorCode===909){
                isBack=true;
//              this.$store.commit('modalShow','抱歉！返程航班舱位或价格已变动，请重新选择！');
//              setTimeout(function () {
//                vm.$router.push({path:'/List'});      //重新请求返程航班列表页
//              },2000);

//              return;
            }
          }
        }
        else{
          setTimeout(function () {
            vm.$store.commit('modalShow','出错了，请再试一次！');      //重新请求返程航班列表页
          },2000);
          return;
        }

        //去程数据判断是否过期，没过期就存储
        const goParams={
          sessionId:vm.goCabin.sessionId,
          orgCityCode:vm.goCityData.departCityIataCode,
          dstCityCode:vm.goCityData.arriveCityIataCode,
          departureDate:vm.departDate
        }
//        console.log(goParams);
        vm.$store.commit('loadingShow','拼命加载中');
        var res1=await vm.$root.http.post('/refundRuleQuery',goParams,vm);

        if(res1.data!=null){
          if(!res1.data.success){
            //如果过期了 重新加载航班列表需要重新选择
            if(res1.data.errorCode===909){
              isBack=true;
//              this.$store.commit('modalShow','抱歉！返程航班舱位或价格已变动，请重新选择！');
//              setTimeout(function () {
//                vm.$router.push({path:'/List'});      //重新请求返程航班列表页
//              },2000);
//              return;
            }
          }
        }
        else{
          vm.$store.commit('modalShow','出错了，请再试一次！');      //重试
          setTimeout(function () {
            vm.$store.commit('modalHide');
          },2000);
          return;
        }

        //有一个过期 就返回运程航班列表页
        if(isBack){
          this.$store.commit('modalShow','资源已过期！请重新选择航班！');
          setTimeout(function () {
            vm.$store.commit('modalHide');   //信息框消失
            vm.$router.push({path:'/List'});      //重新请求航班列表页
          },3000);
        }
        else{
          this.$router.push({path:'/Order'});
        }
      },
      //退改签 弹出
      retiredPopup:async function (item) {
        //去程数据存储
        var vm=this;
        let obj={
          freeLuggage:item.freeLuggage,
          freeLuggageUnit:item.freeLuggageUnit
        }
        this.$store.commit('updateFreeLuggage',obj);
        const params={
          sessionId:item.sessionId,
          orgCityCode:vm.returnCityData.departCityIataCode,
          dstCityCode:vm.returnCityData.arriveCityIataCode,
          departureDate:vm.returnDate
        }
        console.log(params);
        vm.$store.commit('loadingShow','拼命加载中');
        var res=await vm.$root.http.post('/refundRuleQuery',params,vm);
        if(res.data===null||res.data.length===0){
          vm.$store.commit('modalShow','出错了，请再试一次！');      //重试
          setTimeout(function () {
            vm.$store.commit('modalHide');
          },2000);
          return;
        }
        else{
          if(res.data.success){
            let obj={
              Data:res.data.data,
//              Category:Category
            }
            vm.$store.commit('UPDATE_RETIRED',obj);
            console.log(res.data.data);
            console.log('走到这了吗');
//            console.log(vm.retiredObj);
            vm.$store.commit('retiredShow');
          }
          else {
            //如果过期了 重新加载航班列表需要重新选择
            if(res.data.errorCode===909){
              vm.$store.commit('modalShow','资源已过期，建议重新选择航班！');      //重试
              setTimeout(function () {
                vm.$store.commit('modalHide');
              },2000);
              return;
            }
          }
        }
      },
      //积分抵扣说明
      integralDetail:function () {
        this.$store.commit('dialogShow',4);   //显示积分抵扣说明弹出层
      }
    },
    components:{
      'v-retired':Retired,
      'v-dialog': Dialog,
    }
  }
</script>

<style>
  .booking li{
    position: relative;
    display:flex;
    flex-direction: row;
    margin:0rem 0.34rem;
    padding-top:0.21rem;
    padding-bottom:0.2rem;
    border-bottom:0.02rem solid #EBEBEB;
    align-items: center;
  }
  .booking .book_main{
    flex:1;
  }
  .book_main .amount span{
    display:inline-block;
    color:#DA343D;
    font-weight:bold;
    line-height:0.49rem;
  }
  .book_main .amount .money{
    margin-left:0.04rem;
  }
  .book_main .limit{
    color:#979797;
    line-height:0.4rem;
  }
  .book_main .collection{
    line-height:0.4rem;
  }
  .book_main .collection .type{
    font-weight:bold;
    color:#535353;
  }
  .book_main .collection .return,.book_main .collection .miles{
    color:#7D7D7D;
  }
  .book_main .collection .info{
    display:inline-block;
    color:#979797;
    font-size:0.28rem;
    position: relative;
    top:0.02rem;
    left:0.08rem;
  }
  .booking .book_num{
    flex:0 0 1.2rem;
    width:1.2rem;
  }
  .booking .book_num .tickets{
    width:1.2rem;
    height:0.56rem;
    background:linear-gradient(rgba(231,70,92,1),rgba(255,92,92,1));
    border-radius: 0.1rem 0.1rem 0px 0px ;
    text-align:center;
    line-height:0.56rem;
    font-weight:bold;
    color:#fff;
  }
  .booking .book_num .active{
    width:1.2rem;
    height:0.7rem;
    border-radius: 0.1rem 0.1rem 0.1rem 0.1rem ;
    line-height:0.7rem;
  }
  .booking .book_num .num{
    width:1.2rem;
    height:0.42rem;
    text-align:center;
    line-height:0.42rem;
    color:#F13E56;
    font-weight:bold;
    border:0.02rem solid #F13E56;
    border-radius: 0px 0px 0.1rem 0.1rem;
    /*margin-left: 0.02rem;*/
  }
</style>
;
