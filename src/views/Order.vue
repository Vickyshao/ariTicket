<template>
    <div class="duo_page">
       <h2 v-title="'填写订单'"></h2>
        <!-- 预定说明 -->
        <!--<div class="instructions">-->
          <!--&lt;!&ndash;<p class="fontSize28">您预订的是特价机票产品，仅可购买成人票，不提供全额行程单，提供行程单+差额发票，此航班价格剩余票数：9张，请尽快预订。</p>&ndash;&gt;-->
        <!--<p class="mt20 mb20"></p>-->
        <!--</div>-->
        <!-- 去程机票详情 -->
        <div class="go_trip">
          <!-- 机票详情 -->
          <v-flyDetail :flyItem="goFlyDetailInfo">
            <div slot="go" class="go_back">
              <span class="go fontSize24">去</span>
              <span class="time fontSize30 Arial">{{departDateList.departShorthand}}</span>
              <span class="day fontSize30">{{departDateList.departDay}}</span>
              <!--<span class="iconfont icon-shichang"></span>-->
              <!--<span class="time_len fontSize24 Arial">{{newsDuration1}}</span>-->
            </div>
          </v-flyDetail>
          <!-- 全价经济舱 -->
          <div class="tank_type">
            <div class="tank_main">
              <h3 class="fontSize30">{{cabin.cabinClassName}}</h3>
              <div class="ticket_type">
                <ul>
                  <li>
                    <span class="text fontSize28">成人票</span><span class="yang fontSize28">¥</span><span class="Arial fontSize28 price">{{cabin.adultPrice}}</span>
                  </li>
                  <li>
                    <span class="text fontSize28">儿童票</span><span class="yang fontSize28">¥</span><span class="Arial fontSize28 price">{{cabin.childPrice}}</span>
                  </li>
                </ul>
              </div>
              <div class="ticket_type fuel">
                <ul>
                  <li>
                    <span class="text fontSize28">机建+燃油</span>
                    <span class="yang fontSize28">¥</span><span class="Arial fontSize28 price">{{cabin.adultTax}}+</span><span class="yang fontSize28">¥</span><span class="Arial fontSize28 price">{{cabin.adultFuel}}</span>
                  </li>
                  <li>
                    <span class="text fontSize28">机建+燃油</span>
                    <span class="yang fontSize28">¥</span><span class="Arial fontSize28 price">{{cabin.childTax}}+</span><span class="yang fontSize28">¥</span><span class="Arial fontSize28 price">{{cabin.childFuel}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <!-- 退改签规则 -->
          <div class="rules fontSize30" @click="retiredPopup(1)">
            退改签规则/行李额说明
            <span class="iconfont icon-xinxitishi"></span>
          </div>
        </div>
        <!--返程机票详情-->
        <div v-if="isReturnDate" class="back_trip">
          <!-- 机票详情 -->
          <v-flyDetail :flyItem="returnDeatilInfo">
            <div slot="go" class="go_back">
              <span class="back fontSize24">返</span>
              <span class="time fontSize30 Arial">{{returnDateOther}}</span>
              <span class="day fontSize30">{{returnDay}}</span>
              <!--<span class="iconfont icon-shichang"></span>-->
              <!--<span class="time_len fontSize24 Arial">{{newsDuration2}}</span>-->
            </div>
          </v-flyDetail>
          <!-- 全价经济舱 -->
          <div class="tank_type">
            <div class="tank_main">
              <h3 class="fontSize30">{{cabinReturn.cabinClassName}}</h3>
              <div class="ticket_type">
                <ul>
                  <li>
                    <span class="text fontSize28">成人票</span><span class="yang fontSize28"> ¥ </span><span class="Arial fontSize28 price">{{cabinReturn.adultPrice}}</span>
                  </li>
                  <li>
                    <span class="text fontSize28">儿童票</span><span class="yang fontSize28"> ¥ </span><span class="Arial fontSize28 price">{{cabinReturn.childPrice}}</span>
                  </li>
                </ul>
              </div>
              <div class="ticket_type fuel">
                <ul>
                  <li>
                    <span class="text fontSize28">机建+燃油</span><span class="yang fontSize28">¥</span><span class="Arial fontSize28 price">{{cabinReturn.adultTax}}+</span><span class="yang fontSize28">¥</span><span class="Arial fontSize28 price">{{cabinReturn.adultFuel}}</span>
                  </li>
                  <li>
                    <span class="text fontSize28">机建+燃油</span><span class="yang fontSize28">¥</span><span class="Arial fontSize28 price">{{cabinReturn.childTax}}+</span><span class="yang fontSize28">¥</span><span class="Arial fontSize28 price">{{cabinReturn.childFuel}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <!-- 退改签规则 -->
          <div class="rules fontSize30" @click="retiredPopup(2)">
            退改签规则/行李额说明
            <span class="iconfont icon-xinxitishi"></span>
          </div>
        </div>
        <!-- 乘机人 -->
        <div class="add_men" ref="addMen">
          <div class="airplane_person" @click="appendPerson" :class="{'border':crews.length>0}">
            <div class="flexBox">
              <div class="person" >
                <p>
                  <span class="fontSize30 air_person">乘机人</span>
                  <span class="num fontSize30" v-if="crews.length > 0 ">
                    (<i class="Arial">{{crews.length}}</i>人)
                  </span>
                </p>
                <p v-if="ticketsNum&&ticketsNum!=20" class="ticketsNum color97">该舱位仅剩<span class="colorRed">{{ticketsNum||0}}</span>张票，乘机人请不要超过<span class="colorRed">{{ticketsNum||0}}</span>人</p>
              </div>
              <span class="iconfont icon-tianjia"></span>
            </div>

          </div>
          <v-contact v-show="air_ren"></v-contact>
          <v-addperson v-show="air_men"></v-addperson>
        </div>
        <div class="maska" v-if="air_men" @click="add_info"></div>
        <!-- 紧急联系人 -->
        <div class="urgent_contact">
          <div class="contact_list">
            <ul>
              <form>

              <li>
                <span class="type fontSize30">联系人</span>
                <input v-model="contact1" type="text" class="username" placeholder="请填写联系人" ref="userName">
                <!--<span class="iconfont icon-tongxunlu" @click="fnSubmit"></span>-->
              </li>
              <li>
                <span class="type fontSize30">手机号码</span>
                <input v-model="contactTel1" type="tel" class="tel"  placeholder="用于接收航班短信" ref="tel">
              </li>
              <li>
                <span class="type fontSize30">电子邮箱</span>
                <input v-model="contactEmail1" type="email"  placeholder="用于接收电子发票(保险发票)" ref="email">
              </li>
              </form>
            </ul>
          </div>
      </div>
      <!-- 意外险 -->
      <v-casualty></v-casualty>
      <!-- 报销凭证 -->
      <div class="credentials">
        <div class="evidence" @click="updateSwitcha(insuranceArr.length)">
          <p class="fontSize30">报销/购票凭证<span @click="$router.push({path:'/PurchaseTicket'})" class="iconfont icon-xinxitishi"></span></p>
            <img src="../assets/images/no-open.png" v-if="!switcha">
            <img src="../assets/images/open.png" v-if="switcha">
        </div>
        <div class="prompt_info fontSize30" v-if="!switcha">
          <p>需在航班起飞后25天之内打印，过期无法打印，也无法提供其他报销凭证。</p>
        </div>
        <div class="courier fontSize30 color53" v-if="switcha">
         <div class="courier_content">
           <div class="courier_box">
              <div class="courier_main fontSize30 flexRow flexSpace">
                <span class="fontSize30 invoice">配送清单</span>
                <p v-if="cabin.billType===1" class="w440">行程单
                  <em v-if="switcha&&insuranceArr.length">、电子发票<span class="fontSize24">(保险发票)</span> </em>
                </p>
                <p v-if="cabin.billType===2" class="w440">代订交通费发票
                  <em v-if="switcha&&insuranceArr.length" class="w440">、电子发票<span class="fontSize24">(保险发票)</span> </em>
                </p>
                <p v-if="cabin.billType===3" class="w440">行程单，代订交通费发票
                  <em v-if="switcha&&insuranceArr.length">、电子发票<span class="fontSize24">(保险发票)</span> </em>
                </p>
                <!--<p class="fontSize30">行程单仅作为报销凭证，不能作为乘机凭证</p>-->
              </div>
              <!--<span class="iconfont radio" :class="{'icon-danxuankuangweixuan':!vouchr,'icon-danxuankuangyixuan':vouchr}"></span>-->
           </div>
           <p v-if="switcha&&insuranceArr.length" class="invoiceInfo mt10 colorRed1">电子发票与纸质发票具备同等法律效力，可支持报销入账</p>
           <!--<div class="express_msg fontSize24" v-if="expressFeeNum===0">您也可以不选择快递，最晚在航班起飞后7日内到航空公司柜台或直属售票处领取。</div>-->
         </div>
          <!-- 配送方式 -->
          <div class="dis_addres border" @click="updateVouchr">
            <div class="dis_main">
              <p class="go_addres fongSize30 center" style="margin-bottom: 0.24rem">配送方式</p>
            </div>
            <em v-if="expressFeeNum===1"><span class="fontSize30 text">顺风快递</span><span class="fontSize30 Arial price colorRed pl5 pr5">￥20</span></em>
            <em v-if="expressFeeNum===2"><span class="fontSize30 text">其他快递</span><span class="fontSize30 Arial price colorRed pl5 pr5">￥10</span></em>
            <span class="iconfont icon-xiangyou"></span>
          </div>
         <!-- 发票地址 -->
         <div class="dis_addres border" @click="goAddInvoice()">
           <div class="dis_main">
             <p class="go_addres fongSize30" :class="{'center':!giveInfo.typeField}">发票</p>
             <p class="name_tel fongSize30">
               <span class="fontSize30 name">{{InvoiceTitle}}</span>
             </p>
             <p class="home_addres fongSize30">{{TFN}}</p>
           </div>
           <span class="no_sele" v-if="!giveInfo.typeField">未选择</span>
           <span class="iconfont icon-xiangyou"></span>
         </div>
         <!-- /发票地址 -->
         <!-- 配送地址 -->
         <div v-if="expressFeeNum===1||expressFeeNum===2" class="dis_addres" @click="goSeleAddress()" >
           <div class="dis_main">
             <p class="go_addres fongSize30" :class="{'center':!addressDetail.receivername}">配送地址</p>
             <p class="name_tel fongSize30">
               <span class="fontSize30 name">{{addressDetail.receivername}}</span><span class="fontSize30 tel">{{addressDetail.receiverphone}}</span>
             </p>
             <p class="home_addres fongSize30">{{addressDetail.ProName}}{{addressDetail.CityName}}{{addressDetail.DisName}}{{addressDetail.address}}</p>
           </div>
           <span class="no_sele" v-if="!addressDetail.receivername">未选择</span>
           <span class="iconfont icon-xiangyou"></span>
         </div>
         <!-- /配送地址 -->
        </div>
      </div>
      <!--积分规则-->
      <p class="creditRules fontSize28 color97">
        <span> *本航班可享受积分支付活动，详情可查看</span>
        <span class="colorRed1" @click="$router.push({path:'/CreditRules'})">积分规则</span>
      </p>
      <!-- 出行须知 -->
      <div class="instructions_a fontSize24" >
        <p>
          <span class="text fontSize24">为保证顺利出行，请您仔细阅读</span>
          <a href="javascript:;" class="fontSize24" @click="$router.push({path:'/TicketNotes'})">《购票须知》</a>、
          <a href="javascript:;" class="fontSize24" @click="$router.push({path:'/LithiumBattery'})">《飞机锂电池及危险品须知》</a>、
          <a href="javascript:;" class="fontSize24" @click="$router.push({path:'/InsuranceContract'})">《保险经纪委托合同》</a>
        </p>
      </div>
      <!-- 账单明细 -->
      <v-detaillist></v-detaillist>
      <!--发票 -->
      <div class="maska" v-if="isNewInvoice" @click="add_info"></div>
      <v-invoice v-if="isNewInvoice"></v-invoice>

      <!--退改签-->
      <v-retired></v-retired>

      <!--快递费用选择-->
      <v-expressfee></v-expressfee>

    </div>
</template>
<script type="text/ecmascript-6">
  import FlyDetail from "@/components/Details/flyDetail"
  import AddPerson from "@/components/AddPerson/addPerson"
  import Contact from "@/components/Contact/contact"
  import Casualty from "@/components/Casualty/casualty"
  import DetailList from "@/components/DetailList/detailList"
  import Invoice from "@/components/Invoice/invoice"
  import Retired from '@/components/Dialog/retired'
  import ExpressFee from '@/components/Order/expressFee'

  import { mapState, mapMutations } from 'vuex'
  export default {
  name: 'duo_page',
  data() {
    return{
      tab:2,//发票抬头切换
//      contact1:'',
//      contactTel1:'',
//      newsDuration1:'',
//      newsDuration2:''
    }
  },
  computed:{
    ...mapState({
      air_men:state => state.duoPage.air_men,
      air_ren:state => state.duoPage.air_ren,
      iconActive:state =>state.duoPage.iconActive,//保险选中取消
      //seleAddress:state =>state.duoPage.sele_address,//配送地址显示隐藏
      invoice:state =>state.duoPage.invoice,//发票是否勾选
      vouchr:state =>state.duoPage.vouchr,//报销凭证是否勾选
      switcha:state =>state.duoPage.switcha,//凭证开关,
      goFlyDetailInfo:state =>state.searchDetail.showDetailInfo,        //去程航班信息
      returnDeatilInfo:state =>state.returnSearchDetail.showDetailInfo, //返程航班信息
      isReturnDate:state =>state.list.isReturnDate,                      //是否有返程
      isShipShow:state =>state.list.isShipShow,//配送地址显示隐藏
      crews:state => state.duoPage.crews,//乘机人
      cabin:state =>state.order.cabin,   //舱位信息,
      cabinReturn:state =>state.order.cabinReturn,   //舱位信息,
      contact:state =>state.order.contact, //联系人
      contactTel:state =>state.order.contactTel, //联系电话
      insuranceArr:state =>state.order.insuranceArr,   //选中的保险集合
      addressDetail:state =>state.order.addressDetail,//快递配送地址信息
      isNewInvoice:state =>state.invoice.isNewInvoice,//新增发票显示隐藏
      giveInfo:state =>state.invoice.giveInfo,//发票配送信息
      departDateList:state =>state.list.departDateList,//去程的日期
      crews:state => state.duoPage.crews,//乘机人
      returnDateOther:state =>state.search.date.returnDateObj.returnDateOther,//返程日期
      returnDay:state =>state.search.date.returnDateObj.returnDay,            //返程周几
      //去程航班城市三字码与出发日期
      departCityIataCode1:state =>state.search.goCityData.departCityIataCode,
      arriveCityIataCode1:state =>state.search.goCityData.arriveCityIataCode,
      departDate:state =>state.list.departDateList.departDate,
      //请求返程航班列表需要的参数
      departCityIataCode:state =>state.search.returnCityData.departCityIataCode, //出发城市三字码
      arriveCityIataCode:state =>state.search.returnCityData.arriveCityIataCode, //到达城市三字码
      returnDate:state =>state.search.date.returnDateObj.returnDate,             //返程日期
      ticketsNum:state =>state.order.ticketsNum,                                 //余票数
      expressFeeNum:state =>state.order.expressFeeNum,
      contact:state =>state.order.contact,
      contactTel:state =>state.order.contactTel,
      isVer:state =>state.order.isVer,                                           //联系人输入格式验证
      contactEmail:state =>state.order.contactEmail,                             //联系人邮箱
      InvoiceTitle:state =>state.order.InvoiceTitle,
      TFN:state =>state.order.TFN
    }),
    //联系人
    contact1: {
      get: function () {
        return this.contact
      },
      set: function (val) {
        this.UPDATE_CONTACT(val);  //全局变量
      }
    },
    //联系电话
    contactTel1: {
      get: function () {
        return this.contactTel
      },
      set: function (val) {
        this.UPDATE_CONTACTTEL(val);//全局变量
      }
    },
    //联系人邮箱
    contactEmail1: {
      get: function () {
        return this.contactEmail
      },
      set: function (val) {
        this.UPDATE_CONTACTEMAIL(val);//全局变量
      }
    }
  },
  created:async function () {
    let vm=this;
//    if(!this.goFlyDetailInfo.departDate||!this.cabin.cabinClassName){
//
//    }

//    console.log('为假');
    //取联系人信息
    if(vm.getCookie('contactCookie')){
      let contact,contactTel,contactEmail;
      contact=JSON.parse(vm.getCookie('contactCookie'));
      contactTel=JSON.parse(vm.getCookie('contactTelCookie'));
      contactEmail=JSON.parse(vm.getCookie('contactEmailCookie'));
      this.UPDATE_CONTACT(contact);           //联系人
      this.UPDATE_CONTACTTEL(contactTel);     //联系电话
      this.UPDATE_CONTACTEMAIL(contactEmail); //联系邮箱
      console.log('联系人：'+contact)
      console.log('联系人电话：'+contactTel)
      console.log('联系人邮箱：'+contactEmail)
    }

    //去程数据存储到全局变量里
    let goFlightNo,goSessionId,goSolution,goCabinCode;
    if(vm.getCookie('flightNumCookie')){
      goFlightNo=JSON.parse(vm.getCookie('flightNumCookie'));
      goSessionId=JSON.parse(vm.getCookie('goSessionIdCookie'));
      goSolution=JSON.parse(vm.getCookie('goSolutionCookie'));
      goCabinCode=JSON.parse(vm.getCookie('goCabinCodeCookie'));
    }
//      let goSessionId=JSON.parse(vm.getCookie('goSessionIdCookie'));

    //取到值 请求选择的航班及舱位信息
    let goParam={
      orgCityCode:vm.departCityIataCode1,
      dstCityCode:vm.arriveCityIataCode1,
      departureDate:vm.departDate,
      channelId:goSolution,
      flightNum:goFlightNo,
      cabinCode:goCabinCode
    }
    vm.$store.commit('loadingShow','拼命加载中');
    let res1=await vm.$root.http.post('/queryResult',goParam,vm);
    if(res1){
      if(res1.data===null||res1.data.length===0||res1.data.data===null){
//        vm.$store.commit('modalShow','抱歉，没请求到数据，已帮您刷新试试！');

//        vm.$router.push({path:'/Order'});
        if(res1.data.errorCode===905){
          vm.$store.dispatch('modalCountdown',res1.data.msg); //带倒计时的消息框
          vm.$router.push({path:'/Home'});
        }
        else{
//          location.reload();      //强制刷新
        }

//        location.reload();      //强制刷新
      }
      else{
        if(res1.data.success){
          vm.$store.commit('UPDATE_DetailInfo',res1.data.data);      //存去程航班数据
          let isOverTime1=true;        //时间过长时，舱位的sessionId可能会变
          res1.data.data.cabin.forEach(function (item) {
            if(goSessionId===item.sessionId){
              isOverTime1=false;
              vm.$store.commit('UPDATE_CABIN',item);  //存去程舱位数据
            }
          })
          if(isOverTime1){
            vm.$store.dispatch('modalCountdown','舱位信息有变动，请重新选择!'); //带倒计时的消息框
            vm.$router.push({path:'/Detail'});
          }
        }
        else{//资源已过期 参数错误
          vm.$store.commit('modalShow',res1.data.msg);
          vm.$router.push({path:'/List'});      //重新请求航班列表页
        }
      }
    }
    //返程数据存储
    if(this.isReturnDate){
//      let goSessionId=JSON.parse(vm.getCookie('goSessionIdCookie'));
      let returnFlightNo=JSON.parse(vm.getCookie('ReturnFlightNumCookie'));
      let returnSessionId=JSON.parse(vm.getCookie('returnSessionIdCookie'));
      let returnSolution=JSON.parse(vm.getCookie('returnSolutionCookie'));
      let returnCabinCode=JSON.parse(vm.getCookie('returnCabinCodeCookie'));
      //取到值 请求选择的航班及舱位信息
      let returnParam={
        orgCityCode:vm.departCityIataCode,
        dstCityCode:vm.arriveCityIataCode,
        departureDate:vm.returnDate,
        channelId:returnSolution,
        flightNum:returnFlightNo,
        cabinCode:returnCabinCode
      }
//       console.log(param);
      let res2=await vm.$root.http.post('/queryResult',returnParam,vm);
//      console.log('我是返程的,我错了吗');
//      console.log(res2);
      if(res2){
        if(res2.data===null||res2.data.length===0||res2.data.data===null){
//          vm.$store.commit('modalShow','抱歉，出错了，请重新选择航班！');
//        setTimeout(function () {
//          vm.$store.commit('modalHide');   //信息框消失
//
//        },3000);
//          vm.$router.push({path:'/List'});      //重新请求航班列表页
          vm.$store.dispatch('modalCountdown','抱歉，没请求到数据!'); //带倒计时的消息框
          location.reload();      //强制刷新
        }
        else{
          if(res2.data.success){
            vm.$store.commit('UPDATE_RETURNDETAILINFO',res2.data.data);      //存返程航班数据
            let isOverTime2=true;
            res2.data.data.cabin.forEach(function (item) {
              if(returnSessionId===item.sessionId){
                isOverTime2=false;
                vm.$store.commit('UPDATE_CABIN_RETURN',item);  //存返程舱位数据
              }
            })
            if(isOverTime2){
              vm.$store.dispatch('modalCountdown','舱位信息有变动，请重新选择!'); //带倒计时的消息框
              vm.$router.push({path:'/Detail'});
            }
            // vm.$store.commit('UPDATE_CABIN_RETURN',res2.data.data.cabin[0]);  //存返程舱位数据
//            console.log('我在谁后边到底');
//            console.log(res2.data.data.cabin[0]);
          }
          else {
            if(res2.data.errorCode===909){
              vm.$store.commit('modalShow',res2.data.msg);
//            setTimeout(function () {
//              vm.$store.commit('modalHide');   //信息框消失
//
//            },3000);
              vm.$router.push({path:'/List'});      //重新请求航班列表页
            }
          }
        }
      }
    }


    //上边请求完后 执行下边的计算 否则没值 计算会报错
    vm.$store.dispatch('Set_small_ticketsNum');   //取余票数 初使化时取少（主要考虑返程）
    vm.$store.dispatch('UpdateTicketsNum');       //计算余票数
    vm.$store.dispatch('TotailPrice');            //计算总价

  },
  methods: {
    ...mapMutations([
      'modalShow',
      'UPDATE_CONTACT',
      'UPDATE_CONTACTTEL',
      'update_vouchr',    //发票
      'update_switcha',   //报销购票凭证
      'update_invoice',
      'SHOW_EXPRESSFEE',
      'UPDATE_CONTACTEMAIL',
      'INVOICE_PAGE',
      'ADDRESS_PAGE'
    ]),
    //添加乘机人显示
    appendPerson(){
      this.$store.state.duoPage.air_men = true;
      this.$store.commit('TRUE_CREWS_SELECTED');      //激活乘机人选中样式
    },
    //添加乘机人隐藏
    add_info(){
      this.$store.state.duoPage.air_men = false;
      this.$store.state.invoice.isNewInvoice = false;
    },
    //提交订单
    // fnSubmit(){
    //   this.$store.dispatch('Contactverification');
    //   if(this.isVer){
    //     this.$store.dispatch('modalCountdown','验证成功！');
    //   }
    // },
     //报销凭证开关;
    fnSwitch(){
      this.$store.state.duoPage.switcha = !this.$store.state.duoPage.switcha;
      this.$store.commit('totalMoney');
    },
    //快递发票
    fnVouchr(){
       this.$store.state.duoPage.vouchr = !this.$store.state.duoPage.vouchr;
      this.$store.commit('totalMoney');
    },

    //跳转发票页
    goAddInvoice(){
      this.$store.state.invoice.isNewInvoice = true;
      this.INVOICE_PAGE(1);   //2 发票增删改页面跳转到补开发票页
    },
    //邮寄地址页面跳转
    goSeleAddress(){
      this.$router.push({path:'/SeleAddress'});
      this.ADDRESS_PAGE(1);   //2 地址增删改页面跳转到补开发票页
    },
    //发票形状开关
    updateSwitcha(len){
      this.update_switcha(len);
      this.$store.dispatch('TotailPrice');    //计算总价
    },
    //发票快递费用点击
    updateVouchr(){
      this.SHOW_EXPRESSFEE(1);  //默认其他快递
//      this.UPDATE_LISTNUM(1);  //弹出快递选择框
//      console.log('小宝');
//      this.update_vouchr();
      this.$store.dispatch('TotailPrice');    //计算总价
    },
    //退改签规则 num=1是去程  num=2是返程 cabinReturn
    retiredPopup:async function (num) {
//      console.log('有值吗,是几'+num);
      var vm=this;
      let params={};
      let category=-1;    //乘机人类型
      if(num===1){   //num=1是去程
        params={
          sessionId:vm.cabin.sessionId,
          orgCityCode:vm.departCityIataCode1,
          dstCityCode:vm.arriveCityIataCode1,
          departureDate:vm.departDate
        }
        category=vm.cabin.applicableTravelerCategory;
        //加行李额
        let obj={
          freeLuggage:vm.cabin.freeLuggage,
          freeLuggageUnit:vm.cabin.freeLuggageUnit
        }
        this.$store.commit('updateFreeLuggage',obj);
      }
      else {    //num=2是返程
        params={
          sessionId:vm.cabinReturn.sessionId,
          orgCityCode:vm.departCityIataCode,
          dstCityCode:vm.arriveCityIataCode,
          departureDate:vm.returnDate
        }
        category=vm.cabinReturn.applicableTravelerCategory;
        //加行李额
        let obj={
          freeLuggage:vm.cabinReturn.freeLuggage,
          freeLuggageUnit:vm.cabinReturn.freeLuggageUnit
        }
        this.$store.commit('updateFreeLuggage',obj);
      }

//      console.log(params);
//      vm.$store.commit('loadingShow','拼命加载中');
      let res=await vm.$root.http.post('/refundRuleQuery',params,vm);
      if(res){
        if(res.data===null||res.data.length===0){
          vm.$store.commit('modalShow','出错了，请再试一次！');      //重试
//        setTimeout(function () {
//          vm.$store.commit('modalHide');
//        },2000);
          return;
        }
        else{
          if(res.data.success){
            let obj={
              Data:res.data.data,
//            Category:category
            }
            vm.$store.commit('UPDATE_RETIRED',obj);
//            console.log(res.data.data);
//            console.log('走到这了吗');
//            console.log(vm.retiredObj);
            vm.$store.commit('retiredShow');
          }
          else {
            //如果过期了 重新加载航班列表需要重新选择
            if(res.data.errorCode===909){
              vm.$store.commit('modalShow','资源已过期，建议重新选择航班！');      //重试
//            setTimeout(function () {
//              vm.$store.commit('modalHide');
//            },2000);
              return;
            }
          }
        }
      }
    },

    //联系人输入绑定全局变量值
//    userNameFun(event){
//      var val=event.target.value;
//      console.log('我输入的是：'+val);
//      this.UPDATE_CONTACT(val);
//    }
  },
  components:{
    'v-flyDetail':FlyDetail,
    'v-addperson':AddPerson,
    'v-contact':Contact,
    'v-casualty':Casualty,
    'v-detaillist':DetailList,
    'v-invoice':Invoice,
    'v-retired':Retired,
    'v-expressfee':ExpressFee
  },

}
</script>
<style >
  .duo_page{
    position: relative;
    background:#F8F8F8;
  }
  .duo_page .instructions{
    background:#FFFDE9;
    padding:0.22rem 0.34rem;
  }
  .duo_page .instructions p{
    color:#535353;
    line-height:0.36rem;
  }
  /* 全价经济舱 */
  .duo_page .back_trip{
    margin-top:0.2rem;
  }
  .duo_page .tank_type{
    padding:0rem 0.34rem 0rem;
    background:#fff;
  }
  .duo_page .tank_type .tank_main{
    display:flex;
    flex-direction: row;
    align-items: center;
    border-bottom:0.02rem solid #EBEBEB;
    padding-top:0.32rem;
    padding-bottom:0.28rem;
  }
  .duo_page .tank_type .tank_main h3{
    flex: 0 0 1.58rem;
    width:1.58rem;
    font-weight:bold;
    color:#535353;
    line-height:0.42rem;
    margin-right:0.19rem;
  }
  .duo_page .tank_type .tank_main .ticket_type{
    /* flex: 0 0 1.58rem;
    width:1.58rem; */
    /*flex:1;*/
    width:2.6rem;
  }
  .duo_page .tank_type .tank_main .ticket_type ul li{
    line-height:0.4rem;
  }
  .duo_page .tank_type .tank_main .ticket_type.fuel{
    width:3.3rem;
  }
  .duo_page .tank_type .tank_main .ticket_type li>div{
    display:inline-block;
    width:1.8rem;
  }
  .duo_page .tank_type .tank_main .ticket_type li>div:last-child{
    display:inline-block;
    width:2.97rem;
  }
  .duo_page .ticket_type span{
    display:inline-block;
    line-height:0.33rem;
  }
  .duo_page .ticket_type .text{
    color:#535353;
  }
  .duo_page .ticket_type .yang,.duo_page .ticket_type .price{
    color:#DA343D;
    font-weight:bold;
  }
  .duo_page .ticket_type .yang{
    padding:0rem 0.05rem;
  }
  /* 退改签规则 */
  .duo_page .rules{
    background:#fff;
    color:#535353;
    font-weight:bold;
    line-height:1rem;
    padding:0rem 0.34rem;
    display:flex;
    align-items: center;
  }
  .duo_page .rules span,.evidence span.icon-xinxitishi{
    display:inline-block;
    font-size:0.28rem;
    color:#979797;
    margin-left:0.1rem;
  }
  /* 乘机人 */
  .duo_page .add_men{
    padding:0rem 0.34rem;
    background:#fff;
    margin-top:0.16rem;

  }

  .duo_page .add_men .airplane_person{
    display:flex;
    /*line-height:1rem;*/
    height: 1rem;
    justify-content: center;
    flex-direction: column;
  }
  .duo_page .add_men .border{
    border-bottom:0.02rem solid #EBEBEB;
  }
  .duo_page .add_men .airplane_person .person{
    display:inline-block;
    flex:1;
    color:#535353;
    font-weight:bold;
  }
  .duo_page .add_men .airplane_person .person .air_person,.duo_page .add_men .airplane_person .person .num{
    color:#535353;
    font-weight:bold;
  }
  .duo_page .add_men .airplane_person .person .num{
    display:inline-block;
    margin-left:0.08rem;
  }
  .duo_page .add_men .airplane_person .person .num i{
    color:#F13E56;
    font-style:normal;
  }
  .duo_page .add_men .airplane_person .icon-tianjia{
    display:inline-block;
    color:#2C7CF9;
    font-size:0.48rem;
  }
  .duo_page .maska{
    position: fixed;
    z-index:2;
    left:0rem;
    top:0rem;
    bottom:0rem;
    right:0rem;
    background:rgba(0,0,0,0.4);
    transition:all 0s ease;
  }
  /* 紧急联系人 */
  .duo_page .urgent_contact{
    position: relative;
    background:#fff;
    margin-top:0.2rem;
  }
  .duo_page .urgent_contact .contact_list{
    margin:0rem 0.34rem;
  }
  .duo_page .urgent_contact .contact_list li{
    display:flex;
    align-items:center;
    height:1rem;
    border-bottom:0.02rem solid #EBEBEB;
    box-sizing:border-box;
  }
  .duo_page .urgent_contact .contact_list li:last-child{
    border:none;
  }
  .duo_page .urgent_contact .contact_list li .type{
    display:inline-block;
    flex:0 0 1.67rem;
    width:1.67rem;
    font-weight:bold;
    color:#535353;
  }
  .duo_page .urgent_contact .contact_list li input{
    flex:1;
    outline: none;
    border:none;
    height:0.5rem;
    line-height:0.5rem;
    background:transparent;
    font-size:0.3rem;
    color:#535353;
    font-weight:bold;
    margin-right:0.3rem;
  }
  .duo_page .urgent_contact .contact_list li input::-webkit-input-placeholder {
    color: #D3D3D3;
    font-weight:bold;
    font-size:0.3rem;
  }
  .duo_page .urgent_contact .contact_list li .icon-tongxunlu{
    flex:0 0 0.45rem;
    width:0.45rem;
    color:#2C7CF9;
    font-size:0.45rem;
  }
  /* 报销凭证 */
  .duo_page .credentials{
    margin-top:0.2rem;
    background:#fff;
    padding:0 0.34rem;
  }
  .duo_page .credentials .evidence{
    display:flex;
    flex-direction:row;
    align-items:center;
    border-bottom:0.02rem solid #EBEBEB;
  }
  .duo_page .credentials .evidence p{
    flex:1;
    font-weight:bold;
    color:#535353;
    line-height:1rem;
  }
  .duo_page .credentials .evidence img{
    display:inline-block;
    flex:0 0 0.83rem;
    width:0.83rem;
    height:0.5rem;
  }
  .duo_page .credentials .prompt_info{
    color:#979797;
    line-height:0.42rem;
    padding-top:0.2rem;
    padding-bottom:0.2rem;
  }
  /* 出行说明 */
  .duo_page .instructions_a{
    display:flex;
    align-items:center;
    justify-content:center;
    flex-direction:column;
    margin-top:0.2rem;
    color:#979797;
    padding:0 0.34rem;
    padding-bottom:1.46rem;
    /* height:1rem; */
    background:#F8F8F8;
  }
  .duo_page .instructions_a .text{
    display:inline-block;
    color:#979797;
    line-height:0.34rem;
  }
  .duo_page .instructions_a a{
    /*display:inline-block;*/
    color:#DA343D;
    line-height:0.34rem;
  }
  /* 快递发票选项 */
  .duo_page .courier .courier_content{
    padding:0.22rem 0rem;
    border-bottom:0.02rem solid #EBEBEB;
  }
 .duo_page .courier .courier_content .courier_box{
    display:flex;
    flex-direction:row;
    align-items:center;
 }
  .duo_page .courier .courier_content .courier_main{
    flex:1;
  }
  .duo_page .courier .courier_content .courier_main .invoice{
    display:inline-block;
    width:1.5rem;
    color:#535353;
    line-height:0.42rem;
    /*margin-right:0.88rem;*/
  }
  .duo_page .courier .courier_content .courier_main .text,.duo_page .courier .courier_content .courier_main .price{
    display:inline-block;
    color:#535353;
    line-height:0.42rem;
  }
  .duo_page .courier .courier_content .courier_main p{
    color:#979797;
    line-height:0.42rem;
  }
  .duo_page .courier .courier_content .radio{
    display:inline-block;
    flex:0 0 0.5rem;
    width:0.5rem;
    color:#D3D3D3;
    font-size:0.5rem;
  }
  .duo_page .courier .courier_content .icon-danxuankuangyixuan{
    color:#2C7CF9;
  }
  .duo_page .courier .courier_content .express_msg{
    padding:0.16rem 0.16rem 0.17rem 0.19rem;
    color:#535353;
    line-height:0.33rem;
    background:#FFFDE9;
    margin-top:0.15rem;
  }
  /* 发票信息 */
  .duo_page .courier .invoice_type{
    border-bottom:0.02rem solid #EBEBEB;
  }
  .duo_page .courier .invoice_type .invoice_info{
    display:flex;
    flex-direction:row;
    align-items:center;
    height:0.95rem;
  }
  .duo_page .invoice_type .invoice_info .type{
    flex: 0 0 1.53rem;
    width:1.53rem;
    color:#535353;
    line-height:0.42rem;
  }
  .duo_page .invoice_type .invoice_info .owen,.duo_page .invoice_type .invoice_info .company{
    flex: 0 0 1.53rem;
    width:1.53rem;
    color:#979797;
    line-height:0.59rem;
    border:0.02rem solid #D3D3D3;
    border-radius:0.08rem;
    text-align:center;
  }
  .duo_page .invoice_type .invoice_info .owen{
    display:inline-block;
    margin-right:0.34rem;
  }
  .duo_page .invoice_type .invoice_info .active{
    border:none;
    color:#fff;
    background:#2C7CF9;
  }
  .duo_page .invoice_detail .ipt_box{
    background:#F5F5F5;
    height:0.7rem;
    margin-bottom:0.18rem;
    display:flex;
    align-items:center;
    justify-content: center;
  }
  .duo_page .invoice_detail .ipt_box input{
    border:none;
    outline:none;
    height:0.42rem;
    line-height:0.42rem;
    background:transparent;
    width:6.16rem;
    overflow:hidden;
  }
  .duo_page .dis_addres{
    display:flex;
    flex-direction:row;
    align-items:center;
    padding:0.2rem 0rem;

  }
  .duo_page .dis_addres .dis_main{
    flex:1;
  }
  .duo_page .border{
    border-bottom:0.02rem solid #EBEBEB;
  }
  .duo_page .dis_addres .dis_main .go_addres{
    display:inline-block;
    color:#535353;
    line-height:0.4rem;
    font-size:0.3rem;
  }
  .duo_page .dis_addres .dis_main .center{
    position:relative;
    top:0.13rem;
  }
  .duo_page .dis_addres .dis_main .name_tel span{
    display:inline-block;
    color:#979797;
    line-height:0.49rem;
  }
  .duo_page .dis_addres .dis_main .name_tel .name{
    margin-right:0.25rem;
  }
  .duo_page .dis_addres .dis_main .home_addres{
    color:#979797;
    line-height:0.43rem;
  }
  .duo_page .dis_addres .icon-xiangyou,.courier_box .icon-xiangyou{
    flex: 0 0 0.25rem;
    width:0.25rem;
    color:#C1C2C3
  }
  .duo_page .dis_addres .no_sele{
    flex: 0 0 1.2rem;
    width:1.2rem;
    color:#979797;
    font-size:0.3rem;
  }
  .flexBox{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .ticketsNum{
    font-weight: normal;
    margin-top: 0.1rem;
  }
  .creditRules{
    padding: 0.19rem 0.34rem 0.43rem;
    line-height: 0.36rem;
  }
  .duo_page .userChd{
    position: absolute;
    top: 0;
    right: -0.8rem;
    /*border: 0.02rem solid #C0191F;*/
    border-radius: 0.08rem;
    width: 0.8rem;
    text-align: center;
    font-weight: normal;
  }
  .duo_page .courier{
    padding: 0;
    line-height: 0.24rem;
    border-bottom: none;
  }
  .courier_main.courierInvoice{
    display: flex;
  }
  .duo_page .invoiceInfo{
    background: #FFFDE9;
    padding: 0.1rem 0.2rem;
    line-height: 0.4rem;
    font-size: 0.24rem;
  }
  .w440{
    width:4.4rem;
    text-align: right;
  }
</style>
