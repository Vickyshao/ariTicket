<template>
  <div>
    <ul class="booking">
      <li v-for="item in showDetailInfo.cabin">
        <div class="book_main">
          <div class="amount">
            <span class="yang fontSize24">¥</span><span class="fontSize36 money">{{item.adultPrice}}</span>
          </div>
          <p class="limit fontSize24">
            不可订<span v-if="item.applicableTravelerCategory===2">儿童、</span>婴儿
          </p>
          <div class="collection">
            <span class="type fontSize24 color53">
              {{item.cabinClassName}}
              <span>{{item.discount>=10?'全价':item.discount+'折'}}</span>
            </span>
            <span class="return fontSize24">| 退改签规则 </span>
            <!--<span class="miles fontSize24">| 150%里程累计</span>-->
            <span @click="retiredPopup(item)" class="info iconfont icon-xinxitishi"></span>
          </div>
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
    computed:{
      ...mapState({
        queryAllCityList:state =>state.returnList.queryAllCityList,   //初使化
        showCityList:state =>state.returnList.showCityList,           //最终使用的 筛选过后的
        filterList:state =>state.returnList.filterList,               //筛选列表
        isReturnDate:state =>state.list.isReturnDate,                 //是否有返程
        showDetailInfo:state =>state.searchDetail.showDetailInfo,     //预订详情信息
        //去程航班城市三字码与出发日期
        departCityIataCode1:state =>state.search.goCityData.departCityIataCode,
        arriveCityIataCode1:state =>state.search.goCityData.arriveCityIataCode,
        departDate:state =>state.list.departDateList.departDate,
        //请求返程航班列表需要的参数
        departCityIataCode:state =>state.search.returnCityData.departCityIataCode, //出发城市三字码
        arriveCityIataCode:state =>state.search.returnCityData.arriveCityIataCode, //到达城市三字码
        returnDate:state =>state.search.date.returnDateObj.returnDate,                   //返程日期
        retiredObj:state =>state.order.retiredObj,
        dialogNum: state =>state.dialog.dialogNum,                                  //积分抵扣说明
        dialog: state =>state.dialog.dialogFlag,
      })
    },
    methods:{
      ...mapMutations([
        'UPDATELOADING_RETURN',
        'INIT_FLIGHTS_RETURN',
//        'FILTER_FLIGHTS_RETURN',
        'UPDATE_FILTER_RETURN',
        'modalShow',
        'CLEAR_FLIGHTS_RETURN',
        'UPDATE_RELOAD_SHOW',       //重新加载按钮
        'UPDATE_RELOAD_HIDE',
        'ERROR_HIDDEN',             //错误页隐藏
        'ERROR_SHOW',               //错误页显示
        'UPDATE_RELOAD_HIDE_RETURN',
        'UPDATE_RELOAD_SHOW_RETURN'
      ]),
      bookingClick:function (cabin) {
        let vm=this;
//        console.log('为啥不动了');
        //存cookie
        var goSessionId=JSON.stringify(cabin.sessionId);
        this.setCookie('goSessionIdCookie',goSessionId);

        var goSolution=JSON.stringify(cabin.solution);
        this.setCookie('goSolutionCookie',goSolution);

        var goCabinCode=JSON.stringify(cabin.cabinCode);
        this.setCookie('goCabinCodeCookie',goCabinCode);

        //把航班舱位信息存入cookie
//        let cabin1=JSON.stringify(cabin);
//        this.setCookie('cabinCookie',cabin1);

        //再判断有没有返程的
        if(vm.isReturnDate){
//          console.log('返程出发城市三字码：'+vm.departCityIataCode);
//          console.log('返程到达城市三字码：'+vm.arriveCityIataCode);
//          console.log('返程日期：'+vm.returnDate);
          vm.$router.push({path:'/ReturnList'});
        }
        //如果没有返程 加载下单页 这时要请求一个接口 如果超过有效30分钟 重新加载去程列表
        else{
//          console.log('我要跳了啊');
          vm.$router.push({path:'/Order'});
        }
      },
      //退改签规则 item.sessionId,
      retiredPopup:async function (item) {
        console.log('我是退改签');
        console.log(item);
        var vm=this;
        let obj={
          freeLuggage:item.freeLuggage,
          freeLuggageUnit:item.freeLuggageUnit
        }
        this.$store.commit('updateFreeLuggage',obj);
        const params={
          sessionId:item.sessionId,
          orgCityCode:vm.departCityIataCode1,
          dstCityCode:vm.arriveCityIataCode1,
          departureDate:vm.departDate
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
              Category:item.applicableTravelerCategory
            }
            vm.$store.commit('UPDATE_RETIRED',obj);
            console.log(res.data.data);
            console.log('走到这了吗');
            console.log(vm.retiredObj);
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
    line-height:0.33rem;
  }
  .book_main .amount .money{
    margin-left:0.04rem;
  }
  .book_main .limit{
    color:#979797;
    line-height:0.33rem;
  }
  .book_main .collection{
    line-height:0.33rem;
  }
  .book_main .collection .type{
    font-weight:bold;
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
    background:linear-gradient(to right,rgba(231,70,92,1),rgba(255,92,92,1));
border-radius: 10px ;
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
  .booking .integral{
    color:#7d7d7d;
    border: 0.02rem solid #d4d4d4;
    padding: 0.07rem 0.14rem;
    line-height: 0.4rem;
    border-radius: 0.08rem;
  }
</style>
