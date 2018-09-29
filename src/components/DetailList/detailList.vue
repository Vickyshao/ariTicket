<template>
  <div class="detail_list">
      <div class="place_order">
        <div class="order_total">
          <span class="order fontSize28">订单总额</span>
          <div class="order_money">
            <span class="yang fontSize24">¥</span><span class="money fontSize36">{{totalPrice||0}}</span>
          </div>
          <div class="bill fontSize24" @click="UPDATE_DETAILLIST">明细</div>
        </div>
        <div class="submit fontSize36" :class="{ticketNm:ticketsNum!=20}"  @click="submitOrder">
          <span :class="{sb1:ticketsNum!=20}">提交订单</span>
          <span v-if="ticketsNum!=20" class="fontSize24 sb2">仅剩{{ticketsNum}}张</span>
        </div>
      </div>
      <!-- 明细列表 -->
      <transition name="listFold">
        <div class="bil_list" v-if="detailList">
          <div class="go">
            <ul>
              <!--成人-->
              <li class="li_t">
                <h3 class="fongSize28" v-if="isReturnDate">去程</h3>
                <div class="main_container">
                  <span class="text fontSize28">成人票</span>
                  <div class="price_box">
                    <span class="yang fontSize28">¥</span><span class="total fontSize28 Arial">{{cabin.adultPrice}}</span>
                  </div>
                  <span class="people fontSize28">x<i class="Arial fontSize28">{{adultLen}}</i>人</span>
                </div>
                <div class="main_container">
                  <span class="text fontSize28">机建+燃油</span>
                  <div class="price_box">
                    <span class="yang fontSize28">¥</span><span class="total fontSize28 Arial">{{cabin.adultTax+cabin.adultFuel}}</span>
                  </div>
                  <span class="people fontSize28">x<i class="Arial fontSize28">{{adultLen}}</i>人</span>
                </div>
              </li>
              <!--儿童-->
              <li v-if="chdLen>0" class="li_t">
                <div class="main_container">
                  <span class="text fontSize28">儿童票</span>
                  <div class="price_box">
                    <span class="yang fontSize28">¥</span><span class="total fontSize28 Arial">{{cabin.childPrice}}</span>
                  </div>
                  <span class="people fontSize28">x<i class="Arial fontSize28">{{chdLen}}</i>人</span>
                </div>
                <div class="main_container">
                  <span class="text fontSize28">机建+燃油</span>
                  <div class="price_box">
                    <span class="yang fontSize28">¥</span><span class="total fontSize28 Arial">{{cabin.childTax*cabin.childFuel}}</span>
                  </div>
                  <span class="people fontSize28">x<i class="Arial fontSize28">{{chdLen}}</i>人</span>
                </div>
              </li>
              <!--返程-->
              <!--成人-->
              <li v-if="isReturnDate" class="li_t">
                <h3 class="fongSize28" v-if="isReturnDate">返程</h3>
                <div class="main_container">
                  <span class="text fontSize28">成人票</span>
                  <div class="price_box">
                    <span class="yang fontSize28">¥</span><span class="total fontSize28 Arial">{{cabinReturn.adultPrice}}</span>
                  </div>
                  <span class="people fontSize28">x<i class="Arial fontSize28">{{adultLen}}</i>人</span>
                </div>
                <div class="main_container">
                  <span class="text fontSize28">机建+燃油</span>
                  <div class="price_box">
                    <span class="yang fontSize28">¥</span><span class="total fontSize28 Arial">{{cabinReturn.adultTax+cabin.adultFuel}}</span>
                  </div>
                  <span class="people fontSize28">x<i class="Arial fontSize28">{{adultLen}}</i>人</span>
                </div>
              </li>
              <!--儿童-->
              <li v-if="chdLen>0&&isReturnDate" class="li_t">
                <div class="main_container">
                  <span class="text fontSize28">儿童票</span>
                  <div class="price_box">
                    <span class="yang fontSize28">¥</span><span class="total fontSize28 Arial">{{cabinReturn.childPrice}}</span>
                  </div>
                  <span class="people fontSize28">x<i class="Arial fontSize28">{{chdLen}}</i>人</span>
                </div>
                <div class="main_container">
                  <span class="text fontSize28">机建+燃油</span>
                  <div class="price_box">
                    <span class="yang fontSize28">¥</span><span class="total fontSize28 Arial">{{cabinReturn.childTax*cabin.childFuel}}</span>
                  </div>
                  <span class="people fontSize28">x<i class="Arial fontSize28">{{chdLen}}</i>人</span>
                </div>
              </li>
              <li v-if="insuranceArr.length>0">
                <div v-for="item in insuranceSelected" class="main_container">
                  <span class="text fontSize28">{{item.Name}}</span>
                  <div class="price_box">
                    <span class="yang fontSize28">¥</span><span class="total fontSize28 Arial">{{item.Cost}}</span>
                  </div>
                  <span class="people fontSize28">x<i class="Arial fontSize28">{{count}}</i>份</span>
                </div>
              </li>
              <li class="li_t" v-if="switcha">
                <div class="main_container" v-if="vouchr">
                  <span v-if="expressFeeNum===2" class="text fontSize28">普通快递</span>
                  <span v-if="expressFeeNum===1" class="text fontSize28">顺风快递</span>
                  <span v-if="expressFeeNum===0" class="text fontSize28">不需要快递</span>
                  <div class="price_box">
                    <span class="yang fontSize28">¥</span><span class="total fontSize28 Arial">{{expressFeeNum===2?10:expressFeeNum===1?20:0}}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
      <div class="boli_mask" @click="$store.state.duoPage.detailList = false" v-if="detailList"></div>
      <!--如果价格有变动 弹出一个提示框-->
      <v-dialogbox>
        <em slot="cancel" class="color97" @click="cancelBtn">取消</em>
        <em slot="confirm" class="confirm" @click="reconfirm">确认</em>
      </v-dialogbox>
  </div>
</template>

<script type="text/ecmascript-6">
  import DialogBox from '@/components/Modal/dialogueBox'
  import { mapState, mapMutations } from 'vuex';
  export default {
    name: 'modala',
    computed:{
      ...mapState({
        modal: state =>state.modal.modal,
        msg: state => state.modal.msg,
        detailList:state =>state.duoPage.detailList,//配送地址显示隐藏
        iconActive:state =>state.duoPage.iconActive,//意外险选中
        invoice:state =>state.duoPage.invoice,//发票是否勾选
        vouchr:state =>state.duoPage.vouchr,//快递发票勾选不勾选
        switcha:state =>state.duoPage.switcha,//凭证开关
        isReturnDate:state =>state.list.isReturnDate,//去程状态
        safe_money:state =>state.duoPage.safe_money, //保险费用
        express_money:state =>state.duoPage.express_money, //快递费用
        total_money:state =>state.duoPage.total_money, //总金额
        insuranceSelected:state =>state.order.insuranceSelected,//选中的保险集合
        cabin:state =>state.order.cabin,   //舱位信息,
        adultLen:state =>state.order.adultLen,     //成人人数
        chdLen:state =>state.order.chdLen,         //儿童人数
        totalPrice:state =>state.order.totalPrice, //总价
        ticketsNum:state =>state.order.ticketsNum, //余票数

        //下单要用的参数
//        cabin:state =>state.order.cabin,                            //舱位信息
        showDetailInfo:state =>state.searchDetail.showDetailInfo,   //航班信息
        goCityData:state =>state.search.goCityData,                 //出发城市三字码，到达城市三字码
        contact:state =>state.order.contact,                        //联系人
        contactTel:state =>state.order.contactTel,                  //联系人电话
        contactEmail:state =>state.order.contactEmail,              //联系人邮箱
        insuranceArr:state =>state.order.insuranceArr,              //保险id
        crews:state =>state.duoPage.crews,                          //乘机人列表
        vouchr:state =>state.duoPage.vouchr,
        invoice:state =>state.duoPage.invoice,
        InvoiceTitle:state =>state.order.InvoiceTitle,
        TFN:state =>state.order.TFN,
        Address:state =>state.order.Address,
        goDepartDate:state =>state.list.departDateList.departDate,          //去程出发日期
        isVer:state =>state.order.isVer,                                    //联系人输入格式验证

        //返程要用的参数
        cabinReturn:state =>state.order.cabinReturn,                        //返程舱位信息,
        showDetailInfo1:state =>state.returnSearchDetail.showDetailInfo,    //航班信息
        returnCityData:state =>state.search.returnCityData,                 //出发城市三字码，到达城市三字码
        expressFeeNum:state =>state.order.expressFeeNum,
        returnDepartDate:state =>state.search.date.returnDateObj.returnDate, //返程日期
        addressDetail:state =>state.order.addressDetail,
      }),
      count:function () {
        let num=this.isReturnDate?this.crews.length*2:this.crews.length;
        return num;
      }
    },
    components:{
      'v-dialogbox':DialogBox,
    },
    // created:function () {
    //
    // },
    mounted(){
      this.$store.commit('totalMoney')
    },
     methods: {
      ...mapMutations([
        'modalShow',
        'modalHide',
        'totalMoney',
        'UPDATE_ADULTLEN',
        'UPDATE_CHDLEN',
        'UPDATE_TOTALPRICE',
        'UPDATE_DETAILLIST',
        'UPDATE_INVOICE',
        'UPDATE_ADRESS',
        'CLEAR_ADRESS_DETAIL',
        'dialogBoxHide'
       ]),
       //提交订单
       submitOrder:async function () {
        //把联系人存入cookie中 contactEmail
         let contact,contactTel,contactEmail;
         contact=JSON.stringify(this.contact);
         this.setCookie('contactCookie',contact,300);

         contactTel=JSON.stringify(this.contactTel);
         this.setCookie('contactTelCookie',contactTel,300);

         contactEmail=JSON.stringify(this.contactEmail);
         this.setCookie('contactEmailCookie',contactEmail,300);

        //验证请求参数
         let that=this;
         let isVerification=true;
         let isCheck1=false;     //去程
         let isCheck2=false;     //返程
         let checkGoErrorMsg='',
             checkReturnErrorMsg='',
//             checkErrorMsg='',
             reloadGo=false,     //去程数据是否重新加载
             reloadReturn=false; //返程数据是否重新加载
         //验证不成功 提示信息
         var verification=function (str) {
           that.$store.commit('modalShow',str);
           setTimeout(function () {
             that.$store.commit('modalHide');
           },1000);
         }
         if(this.crews.length===0){
           verification('请添加乘机人!');
           $('html, body').animate({
             scrollTop: 400
           }, 1000);
           isVerification=false;
           return;
         }
         if(this.contact===''){
           verification('请添加联系人!');
           isVerification=false;
           return;
         }
         if(this.contactTel===''){
           verification('请添加联系人手机号码!');
           isVerification=false;
           return;
         }
         var reg = /^1(3|4|5|7|8)\d{9}$/; //手机验证规则
         var flag=reg.test(parseInt(this.contactTel));
//         console.log(flag);
         if(!flag){
           verification('手机号输入有误!');
           isVerification=false;
           return;
         }
         //如果选择购销凭证 必须选择发票 如果选择快递 必须选择配送地址
         if(this.vouchr){
           if(this.InvoiceTitle===''){
             verification('请选择发票!');
             isVerification=false;
             return;
           }
           if(this.Address===''){
             verification('请选择配送地址!');
             isVerification=false;
             return;
           }
           // if(this.expressFeeNum===1||this.expressFeeNum===2){
           //   if(this.Address===''){
           //     verification('请选择配送地址!');
           //     isVerification=false;
           //     return;
           //   }
           // }
         }
         //联系人,联系电话,邮箱输入格式 验证
         this.$store.dispatch('Contactverification');
//         console.log('为真吗?'+this.isVer);
         if(!this.isVer){
//           console.log('我可以进来了吗');
           isVerification=false;
           return;
         }
         //验舱验价
         let touristlist1=[];     //乘机人
         that.crews.forEach(function (item) {
           let obj={
             id:item.Id,
             name:item.Name,
             psptType:item.PsptType,
             psptId:item.PsptId,
             birthday:item.Birthday,
             personType:item.personType
           }
           touristlist1.push(obj);
         });
         //验舱验价 方法
         var checkingPrice=async function (param,n) {
           that.$store.commit('loadingShow','验证中');
           let res=await that.$root.http.post('/order/checkCabinPrice',param,that);
//           console.log('验价可以通过吗?');
//           console.log(res);
           if(res.data.success){
             if(n===1){
               isCheck1=true;
//               console.log('为什么没改过来呢'+isCheck1);
             }
             else{
               isCheck2=true;
             }
             //价格有变动时弹出一个确认框  9000003 9000011
             if(res.data.errorCode===9000003){
               if(n===1){
//                   let goParam={
//                     orgCityCode:that.goCityData.departCityIataCode,
//                     dstCityCode:that.goCityData.arriveCityIataCode,
//                     departureDate:that.showDetailInfo.departDate,
//                     channelId:that.cabin.solution,
//                     flightNum:that.showDetailInfo.flightNo,
//                     cabinCode:that.cabin.cabinCode
//                   }
//                   console.log(param);
//                   let res1=await that.$root.http.post('/queryResult',goParam,that);
//                   that.$store.commit('UPDATE_CABIN',res1.data.data.cabin[0]);  //存去程数据
//                  checkGoErrorMsg=that.goCityData.departCityName+'-'+that.goCityData.arriveCityName+res1.data.msg;
                 reloadGo=true;    //去程价格有变动
                 isCheck1=false;
               }
               else{
                 // that.$store.commit('UPDATE_CABIN_RETURN',res1.data.data.cabin[0]);  //存返程数据
                 // checkReturnErrorMsg=that.returnCityData.departCityName+'-'+that.returnCityData.arriveCityName+res.data.msg;
                 reloadReturn=true; //返程价格有变动
                 isCheck2=false;
               }

//                 that.$store.commit('modalShow',checkGoErrorMsg+'已帮您更新为最新的状态，请再次确认无误后，提交订单！');
//                 setTimeout(function () {
//                   that.$store.commit('modalHide');   //信息框消失
//                 },3000);
             }
           }
           else{
             if(n===1){
               isCheck1=false;
               checkGoErrorMsg=that.goCityData.departCityName+'-'+that.goCityData.arriveCityName+res.data.msg;
             }
             else{
               isCheck2=false;
               checkReturnErrorMsg=that.returnCityData.departCityName+'-'+that.returnCityData.arriveCityName+res.data.msg;
             }

             // else{
               //1代表去程 2返程
//                if(n===1){
//                  checkGoErrorMsg=that.goCityData.departCityName+'-'+that.goCityData.arriveCityName+res.data.msg;
// //                   that.$store.commit('modalShow',that.goCityData.departCityName+'-'+that.goCityData.arriveCityName+res.data.msg);
//                }
//                else{
//                  checkReturnErrorMsg=that.returnCityData.departCityName+'-'+that.returnCityData.arriveCityName+res.data.msg;
// //                   that.$store.commit('modalShow',that.returnCityData.departCityName+'-'+that.returnCityData.arriveCityName+res.data.msg);
//                }
               //如果data返回为null 可以再试一次下单操作
               if(res.data.errorCode===0&&res.data.data===null){
                 this.$store.dispatch('modalCountdown','网络问题，请重试！'); //带倒计时的消息框
                 that.$router.push({path:'/Order'});
                 isVerification=false;
                 return;
               }

             // }
           }
         };

         //去程验舱验价
         //去程参数
         let checkParam1={
           sessionId:that.cabin.sessionId,
           tourists:touristlist1,                  //乘机人集合
           adtPrice:that.cabin.adultPrice,
           chdPrice:that.cabin.childPrice,
           orgCityCode:that.goCityData.departCityIataCode,
           dstCityCode:that.goCityData.arriveCityIataCode,
           departureDate:that.goDepartDate,
         };
//         console.log('去程验舱参数：');
//         console.log(checkParam1);
         await checkingPrice(checkParam1,1);        //验证去程

//         console.log('去程通过吗？'+isCheck1);
         if(that.isReturnDate){
           //返程参数
           let checkParam2={
             sessionId:that.cabinReturn.sessionId,
             tourists:touristlist1,                  //乘机人集合
             adtPrice:that.cabinReturn.adultPrice,
             chdPrice:that.cabinReturn.childPrice,
             orgCityCode:that.returnCityData.departCityIataCode,
             dstCityCode:that.returnCityData.arriveCityIataCode,
             departureDate:that.returnDepartDate,
           };
//           console.log('返程验舱参数：');
//           console.log(checkParam2);
           await checkingPrice(checkParam2,2);        //验证返程
         }
         else{
           isCheck2=true;
//           console.log('没有返程，为什么会显示在前面');
         }
         //去程与返程都验证成功才能提交订单
//         console.log(isCheck1);
//         console.log(isCheck2);
//         console.log('哈哈哈哈');
         if(isCheck1&&isCheck2){
           isVerification=true;
         }
         else{
           isVerification=false;
           var timeOut3=function () {
             setTimeout(function () {
               that.$store.commit('modalHide');   //信息框消失
             },3000);
           };
           // if(reloadGo&&reloadReturn){
           //   that.$store.commit('modalShow',checkGoErrorMsg+checkReturnErrorMsg+'已帮您更新为最新的状态，请再次确认无误后，提交订单！');
           //   timeOut3();
           //   that.$router.push({path:'/Order'});
           // }
           // else if(reloadGo&&isCheck2){
           //   that.$store.commit('modalShow',checkGoErrorMsg+'已帮您更新为最新的状态，请再次确认无误后，提交订单！');
           //   timeOut3();
           //   that.$router.push({path:'/Order'});
           // }
           // else if(reloadReturn&&isCheck1){
           //   that.$store.commit('modalShow',checkReturnErrorMsg+'已帮您更新为最新的状态，请再次确认无误后，提交订单！');
           //   timeOut3();
           //   that.$router.push({path:'/Order'});
           // }
           //只要有一个价格变动 就弹出提示框
           if(reloadGo||reloadReturn){
             this.$store.commit('updateDialogNum',4);     //普通消息框 带确认
             this.$store.commit('dialogBoxShow','价格有变动，是否继续下单？');
           }
           else{
             that.$store.commit('modalShow',checkGoErrorMsg+checkReturnErrorMsg);
             timeOut3();
             that.$router.push({path:'/List'});
           }
         }
         //全部验证成功才提交  请求下单
         if(isVerification){
           this.bookOrder();    //验证成功了就去下单
         }


         //请求下单结束---------->
       },
       //请求 下单
       bookOrder:async function () {
         let isOrderSuccess1=false;   //去程是否下单成功
         let isOrderSuccess2=false;   //返程是否下单成功
         let goErrorMsg='',           //去程错误消息
           goExpired=false,         //去程资源是否过期
           returnExpired=false,     //返程资源是否过期
           isSpecialTips=false,     //是否是特殊 提示
           returnErrorMsg='';       //返程错误消息

//        去程请求
         let touristlist=[];     //乘机人
         this.crews.forEach(function (item) {
           let obj={
             id:item.Id,
             name:item.Name,
             psptType:item.PsptType,
             psptId:item.PsptId,
             birthday:item.Birthday,
           }
           touristlist.push(obj);
         });
         let NeedInvoice=this.vouchr?1:0;            //发票
         let expressFeeNum=this.vouchr?this.expressFeeNum:0;
//           let NeedInsuranceInvoice=this.invoice?1:0;  //保险发票
         let param={
           sessionId:this.cabin.sessionId,
           flight:{
             flightNum:this.showDetailInfo.flightNo,
             departureDate:this.showDetailInfo.departDate,
             departureCityCode:this.goCityData.departCityIataCode,
             cabinCode:this.cabin.cabinCode,
             cabinClass:this.cabin.cabinClass,
             arriveCityCode:this.goCityData.arriveCityIataCode,
             adtPrice:this.cabin.adultPrice,
             chdPrice:this.cabin.childPrice
           },
           touristList:touristlist,                     //乘机人集合
           contact:this.contact,
           contactTel:this.contactTel,
           insuranceList:this.insuranceArr,             //保险集合
           NeedInvoice:NeedInvoice,
//             NeedInsuranceInvoice:NeedInsuranceInvoice, //保险发票
           InvoiceTitle:this.InvoiceTitle,              //发票抬头
           TFN:this.TFN,                                //税号
           Address:this.Address,                        //配送地址
           EmsType:expressFeeNum,                       //快递费用
           ContactEmail:this.contactEmail               //邮箱
         }
//           console.log('单程的');
//           console.log(JSON.stringify(param));
         this.$store.commit('loadingShow','拼命下单中');
         var response=await this.$root.http.post('/order/book',param,this);
         var vm=this;

         if(response.data!=null&&response.data.success){
//             console.log('去程成功了呢')
           isOrderSuccess1=true;
         }
         else{
           goErrorMsg=vm.goCityData.departCityName+'-'+vm.goCityData.arriveCityName+response.data.msg;
           if(response.data.errorCode===9050){
             isSpecialTips=true;
             goErrorMsg=response.data.msg;
           }
         }

         //如果有返程 再请求一个返程
         if(vm.isReturnDate){
           //返程请求
//             console.log('返程的');
           let returnParam={
             sessionId:this.cabinReturn.sessionId,
             flight:{
               flightNum:this.showDetailInfo1.flightNo,
               departureDate:this.showDetailInfo1.departDate,
               departureCityCode:this.returnCityData.departCityIataCode,
               cabinCode:this.cabinReturn.cabinCode,
               cabinClass:this.cabinReturn.cabinClass,
               arriveCityCode:this.returnCityData.arriveCityIataCode,
               adtPrice:this.cabinReturn.adultPrice,
               chdPrice:this.cabinReturn.childPrice
             },
             touristList:touristlist,                  //乘机人集合
             contact:this.contact,
             contactTel:this.contactTel,
             insuranceList:this.insuranceArr,          //保险集合
             NeedInvoice:NeedInvoice,
//               NeedInsuranceInvoice:NeedInsuranceInvoice,//保险发票
             InvoiceTitle:this.InvoiceTitle,
             TFN:this.TFN,
             Address:this.Address,
             EmsType:expressFeeNum,
             ContactEmail:this.contactEmail               //邮箱
           }
//             console.log(JSON.stringify(returnParam));
           vm.$store.commit('loadingShow','拼命下单中');
           let response1=await this.$root.http.post('/order/book',returnParam,this);
           if(response1.data!=null&&response1.data.success){
//               console.log('返程成功了呢')
             isOrderSuccess2=true;     //返程下单成功
           }
           else{
             returnErrorMsg=vm.returnCityData.departCityName+'-'+vm.returnCityData.arriveCityName+response1.data.msg;
//               this.$store.commit('modalShow',response.data.msg);
           }

           //如果有返程 两个单都成功了跳转 1成功 2失败
           var MessageBox=function (msg,num) {
             vm.$store.dispatch('ClearOrderHistory'); //清空下单历史记录
             vm.$store.commit('modalShow',msg);
             setTimeout(function () {
               vm.$store.commit('modalHide');
               if(num===1){
//                 console.log('为啥没跳转呢')
                 vm.$router.push({path:'/OrderList'});
                 this.$store.commit('CLEAR_CREWS');           //清空乘机人
                 this.$store.commit('FALSE_CREWS_SELECTED');  //去掉乘机人选中样式
                 this.UPDATE_INVOICE({invoiceTitle:'',tfn:''});//清空发票抬头与税号
                 this.UPDATE_ADRESS('');                       //清空配送地址
                 this.CLEAR_ADRESS_DETAIL();                //清空配送地址 详情
                 this.$store.commit('CLEAR_INSURANCE');        //清空选中的保险
               }
               else{
                 vm.$router.push({path:'/List'});
                 this.$store.commit('CLEAR_CREWS');           //清空乘机人
                 this.$store.commit('FALSE_CREWS_SELECTED');  //去掉乘机人选中样式
                 this.UPDATE_INVOICE({invoiceTitle:'',tfn:''});//清空发票抬头与税号
                 this.UPDATE_ADRESS('');                       //清空配送地址
                 this.CLEAR_ADRESS_DETAIL();                //清空配送地址 详情
                 this.$store.commit('CLEAR_INSURANCE');        //清空选中的保险
               }
             },5000);
           }
           if(isOrderSuccess1&&isOrderSuccess2){
             MessageBox('恭喜您,下单成功!',1);
           }
           else if(isOrderSuccess1){
             let str='恭喜您,'+vm.goCityData.departCityName+'-'+vm.goCityData.arriveCityName+'航班下单成功!';
             str+='由于'+returnErrorMsg+'下单失败!';
             MessageBox(str,1);
           }
           else if(isOrderSuccess2){
             let str='恭喜您,'+vm.returnCityData.departCityName+'-'+vm.returnCityData.arriveCityName+'航班下单成功!';
             str+='由于'+goErrorMsg+'下单失败!';
             MessageBox(str,1);
           }
           else{
             if(isSpecialTips){
               vm.$store.dispatch('modalCountdown',goErrorMsg); //带倒计时的消息框
             }
             else{
               let str=goErrorMsg+returnErrorMsg+'很抱歉,下单失败,请重新选择!';
               MessageBox(str,2);  //下单失败
             }
           }
         }
         //如果没返程，只要去程下单成功就跳转
         else{
           if(isOrderSuccess1){
//               vm.$store.dispatch('modalCountdown','恭喜您,下单成功!'); //带倒计时的消息框
             vm.$store.commit('modalShow','恭喜您,下单成功!');
             vm.$store.dispatch('ClearOrderHistory'); //清空下单历史记录
             setTimeout(function () {
               vm.$store.commit('modalHide');
             },5000);
             vm.$router.push({path:'/OrderList'});
             this.$store.commit('CLEAR_CREWS');           //清空乘机人
             this.$store.commit('FALSE_CREWS_SELECTED');  //去掉乘机人选中样式
             this.UPDATE_INVOICE({invoiceTitle:'',tfn:''});//清空发票抬头与税号
             this.UPDATE_ADRESS('');                       //清空配送地址
             this.CLEAR_ADRESS_DETAIL();                //清空配送地址 详情
             this.$store.commit('CLEAR_INSURANCE');        //清空选中的保险
           }
           else{
             if(isSpecialTips){
               vm.$store.dispatch('modalCountdown',goErrorMsg); //带倒计时的消息框
             }
             else{
               vm.$store.commit('modalShow',goErrorMsg+'下单失败,请重新选择航班!');
               vm.$store.dispatch('ClearOrderHistory'); //清空下单历史记录
               setTimeout(function () {
                 vm.$store.commit('modalHide');
               },5000);
               vm.$router.push({path:'/List'});
               this.$store.commit('CLEAR_CREWS');           //清空乘机人
               this.$store.commit('FALSE_CREWS_SELECTED');  //去掉乘机人选中样式
               this.UPDATE_INVOICE({invoiceTitle:'',tfn:''});//清空发票抬头与税号
               this.UPDATE_ADRESS('');                       //清空配送地址
               this.CLEAR_ADRESS_DETAIL();                //清空配送地址 详情
               this.$store.commit('CLEAR_INSURANCE');        //清空选中的保险
             }
           }
         }
       },
       //价格有变动时 再次确认是否下单
       reconfirm:function () {
         this.bookOrder();                    //请求下单
         this.$store.commit('dialogBoxHide'); //弹出框隐藏
       },
       //价格有变动时 取消 强刷新页面
       cancelBtn:function () {
         this.dialogBoxHide();                //隐藏提示框
         this.$router.push({path:'/Detail'});
       }
    },
    watch:{
      crews:function (val,oldVal) {
        this.$store.dispatch('TotailPrice');      //计算总价
        this.$store.dispatch('UpdateTicketsNum'); //余票数
//        console.log('我什么时候会进来');
      }
    }
  }
</script>
<style lang="css">
.listFold-enter-active,.listFold-leave-active{
    	transition:all 0.5s ease;
  }
	.listFold-enter-active{
    transform:translate3d(0,0,0);
  }
  .listFold-enter,.listFold-leave-active{
    transform:translate3d(0,100%,0);
  }
.detail_list{
  position:fixed;
  left:0rem;
  right:0rem;
  bottom:0rem;
  /*z-index:2;*/
  z-index:1;
}
.detail_list .place_order{
  display:flex;
  flex-direction:row;
  height:1.1rem;
  background:#FFFFFF;
  box-shadow: 0px 0.02rem 0px 0px rgba(0,0,0,0.1);
}
.detail_list .place_order .order_total{
  flex:1;
  display:flex;
  flex-direction:row;
  align-items:center;
  border-top:0.02rem solid #EBEBEB;
  box-sizing:border-box;
}
.detail_list .place_order span{
  display:inline-block;
  font-weight:bold;
}
.detail_list .place_order .order{
  flex:0 0 1.22rem;
  width:1.12rem;
  color:#535353;
  margin-left:0.34rem;
  margin-right:0.25rem;
}
.detail_list .place_order .order_money{
  flex:0 0 1.67rem;
  width:1.67rem;
  margin-right:0.58rem;
}
.detail_list .place_order .yang{
  color:#F13E56;
  padding:0.02rem;
}
.detail_list .place_order .money{
  color:#F13E56;
}
.detail_list .place_order .bill{
  flex:0 0 0.78rem;
  line-height:0.4rem;
  color:#2C7CF9;
  border:0.02rem solid #2C7CF9;
  border-radius:0.05rem;
  text-align:center;
}
.detail_list .place_order .submit{
  flex:0 0 2.4rem;
  width:2.4rem;
  background:linear-gradient(to right,rgba(231,70,92,1),rgba(255,92,92,1));
  color:#fff;
  text-align:center;
  line-height:1.1rem;

}
.detail_list .place_order .submit.ticketNm{
  height: 1.1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height:0.5rem;
}
.detail_list .place_order .submit .sb1{
  margin-top: 0.15rem;
}
.detail_list .place_order .submit .sb2{
  font-weight: normal;
  line-height: 0.2rem;
}
/* 明细列表 */
.detail_list .boli_mask{
   position: fixed;
    z-index:-2;
    left:0rem;
    top:0rem;
    bottom:0rem;
    right:0rem;
    background:rgba(0,0,0,0.4);
}
.detail_list .bil_list{
  position:fixed;
  left:0rem;
  right:0rem;
  bottom:1.1rem;
  background:#fff;
  z-index:-1;
  padding:0 0.34rem;
  padding-top:0.12rem;
}
.detail_list .bil_list h3{
  padding-top:0.16rem;
  color:#535353;
  font-weight:bold;
  line-height:0.4rem;
}
.detail_list .bil_list li{
  border-bottom:0.02rem solid #EBEBEB;
}
.detail_list .bil_list li:last-child{
  border-bottom:none;
}
.detail_list .bil_list li:first-child{
  border-bottom:0.02rem solid #EBEBEB;
}
.detail_list .bil_list li .main_container{
  display:flex;
  flex-direction:row;
  align-items:center;
  height:0.85rem;
}
.detail_list .bil_list .li_t{
  /* height:0.95rem; */
  padding-top:0.11rem;
  padding-bottom:0.2rem;
}
.detail_list .bil_list .li_t .main_container{
  height:0.5rem;
}
.detail_list .bil_list .text{
  flex:0 0 3.4rem;
  width:3.4rem;
  line-height:0.5rem;
  color:#535353;
}
.detail_list .bil_list .price_box{
  flex:0 0 1.3rem;
  width:1.3rem;
}
.detail_list .bil_list .price_box span{
  display:inline-block;
  font-weight:bold;
  color:#F13E56;
  line-height:0.5rem;
}
.detail_list .bil_list .price_box .yange{
  padding:0 0.03rem;
}
.detail_list .bil_list .people{
  display:inline-block;
  flex:1;
  color:#535353;
  text-align:right;
  line-height:0.5rem;
}
.detail_list .bil_list .people i{
 font-style:normal;
}
</style>
