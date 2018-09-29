<template>
<section>
  <h2 v-title="'补开发票'"></h2>
  <!--正文表单内容-->
  <section class="compInvoic">
    <div class="courier fontSize30 color53">
      <div class="courier_content">
        <div class="courier_box">
          <div class="courier_main fontSize30 flexRow flexSpace">
            <span class="fontSize30 invoice">配送清单</span>
            <!--<p v-if="cabin.billType===1" class="w440">行程单-->
            <!--<em v-if="switcha&&insuranceArr.length">、电子发票<span class="fontSize24">(保险发票)</span> </em>-->
            <!--</p>-->
            <!--<p v-if="cabin.billType===2" class="w440">代订交通费发票-->
            <!--<em v-if="switcha&&insuranceArr.length" class="w440">、电子发票<span class="fontSize24">(保险发票)</span> </em>-->
            <!--</p>-->
            <!--<p v-if="cabin.billType===3" class="w440">行程单，代订交通费发票-->
            <!--<em v-if="switcha&&insuranceArr.length">、电子发票<span class="fontSize24">(保险发票)</span> </em>-->
            <!--</p>-->
            <p class="w440">{{showText()}}
              <em v-if="distributionList.len>0">、电子发票<span class="fontSize24">(保险发票)</span> </em>
            </p>
            <!--<p class="fontSize30">行程单仅作为报销凭证，不能作为乘机凭证</p>-->
          </div>

          <!--<span class="iconfont radio" :class="{'icon-danxuankuangweixuan':!vouchr,'icon-danxuankuangyixuan':vouchr}"></span>-->
        </div>
        <p class="invoiceInfo mt10 colorRed1">电子发票与纸质发票具备同等法律效力，可支持报销入账</p>
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
      <!-- 配送地址 -->
    </div>
  </section>
  <!--提交按钮-->
  <section class="ivoicBtn fontSize36 boxCenter" @click="enterBtnClick">提交</section>
  <!--快递费用选择-->
  <v-expressfee></v-expressfee>
  <!--发票 -->
  <div class="maska" v-show="isNewInvoice" @click="add_info"></div>
  <v-invoice v-show="isNewInvoice"></v-invoice>
  <!--消息提示框 发票申请成功后 联系客服提醒-->
  <v-dialogbox>
    <em slot="confirm" class="confirm oneBtn" @click="applyRefundInvoice">知道了</em>
  </v-dialogbox>
</section>
</template>
<script>
  import DetailList from "@/components/DetailList/detailList"
  import Invoice from "@/components/Invoice/invoice"
  import ExpressFee from '@/components/Order/expressFee'
  import DialogBox from '@/components/Modal/dialogueBox'
  import { mapState, mapMutations } from 'vuex'
  export default {
    name: 'duo_page',
    data() {
      return {
        distributionList:{},          //配送清单 具体显示内容
      }
    },
    components:{
      'v-invoice':Invoice,
      'v-expressfee':ExpressFee,
      'v-dialogbox':DialogBox,
    },
    computed: {
      ...mapState({
        addressDetail:state =>state.order.addressDetail,//快递配送地址信息
        giveInfo: state => state.invoice.giveInfo,//发票配送信息
        expressFeeNum: state => state.order.expressFeeNum,
        InvoiceTitle: state => state.order.InvoiceTitle,
        TFN: state => state.order.TFN,
        isNewInvoice:state =>state.invoice.isNewInvoice,//新增发票显示隐藏
        Address:state =>state.order.Address,
      }),
    },
    created:function(){
      this.distributionList=JSON.parse(this.getCookie('compInvoicCookie'));
    },
    methods:{
      ...mapMutations([
        'modalShow',
        'update_vouchr',    //发票
        'update_switcha',   //报销购票凭证
        'update_invoice',
        'SHOW_EXPRESSFEE',
        'UPDATE_INVOICE',
        'UPDATE_ADRESS',
        'CLEAR_ADRESS_DETAIL',
        'INVOICE_PAGE',
        'ADDRESS_PAGE',
        'updateDialogNum'
      ]),
      //跳转发票页
      goAddInvoice(){
        this.$store.state.invoice.isNewInvoice = true;
        this.INVOICE_PAGE(2);   //2 发票增删改页面跳转到补开发票页
      },
      //邮寄地址页面跳转
      goSeleAddress(){
        this.$router.push({path:'/SeleAddress'});
        this.ADDRESS_PAGE(2);   //2 地址增删改页面跳转到补开发票页
      },
      //发票快递费用点击
      updateVouchr(){
        this.SHOW_EXPRESSFEE(1);  //默认其他快递
//      this.UPDATE_LISTNUM(1);  //弹出快递选择框
//      console.log('小宝');
//      this.update_vouchr();
//       this.$store.dispatch('TotailPrice');    //计算总价
      },
      //添加/隐藏  发票
      add_info(){
        this.$store.state.duoPage.air_men = false;
        this.$store.state.invoice.isNewInvoice = false;
      },
      //提交
      async enterBtnClick(){
        // let orderid=this.$route.query.OrderId;
        if(!this.distributionList.orderId===''){
          this.$store.dispatch('modalCountdown','订单号不能为空！');   //带倒计时的消息框
          return false;
        }
        if(!this.expressFeeNum){
          this.$store.dispatch('modalCountdown','请选择配送方式！');   //带倒计时的消息框
          return false;
        }
        if(!this.InvoiceTitle){
          this.$store.dispatch('modalCountdown','发票抬头不能为空！');   //带倒计时的消息框
          return false;
        }
        if(!this.Address){
          this.$store.dispatch('modalCountdown','配送地址不能为空！');   //带倒计时的消息框
          return false;
        }

        let param={
          OrderId:this.distributionList.orderId,
          EmsType:this.expressFeeNum,
          InvoiceTitle:this.InvoiceTitle,
          TFN:this.TFN,
          Address:this.Address
        }
        const res=await this.$root.http.post('/order/applyDelivery', param,this);
        if(res){
          if(res.data.success){
            // this.$store.dispatch('modalCountdown','提交成功！');   //带倒计时的消息框
            this.UPDATE_INVOICE({invoiceTitle:'',tfn:''});        //清空发票抬头与税号
            this.UPDATE_ADRESS('');                               //清空配送地址
            this.CLEAR_ADRESS_DETAIL();                           //清空配送地址 详情
            // window.location.href=this.distributionList.url;       //跳转到上一页
            this.updateDialogNum(3);
            this.$store.commit('dialogBoxShow','您的申请已提交成功！申请后需联系客服支付快递费用才能寄送。客服电话：400 820 3333*9 ');

          }
          else{
            this.$store.dispatch('modalCountdown',res.data.msg); //带倒计时的消息框
          }
        }
      },
      //申请成功后 确认后跳转到详情页
      applyRefundInvoice:function () {
        this.$store.commit('dialogBoxHide');
        this.$router.push({path:'/OrderDetail',query:{OrderId:this.distributionList.orderId}}); //跳到详情页
      },
      //配送清单文本显示内容
      showText(){
        let str='';
        switch (this.distributionList.BillType){
          case 1:
            str='行程单';
            break;
          case 2:
            str='代订交通费发票';
            break;
          default:
            str='行程单，代订交通费发票';
            break;
        }
        return str;
        // this.$router.push({path:'/CompInvoicing'});

      }
    }
  }
</script>
<style scoped>
  .compInvoic{
    width:7.5rem;
    background: #fff;
    padding: 0.34rem 0.34rem 0;
  }
  .compInvoic .courier .courier_content{
    padding:0.22rem 0rem;
    border-bottom:0.02rem solid #EBEBEB;
  }
  .compInvoic .courier .courier_content .courier_box{
    display:flex;
    flex-direction:row;
    align-items:center;
  }
  .compInvoic .courier .courier_content .courier_main{
    flex:1;
  }
  .compInvoic .courier .courier_content .courier_main .invoice{
    display:inline-block;
    width:1.5rem;
    color:#535353;
    line-height:0.42rem;
    /*margin-right:0.88rem;*/
  }
  .compInvoic .courier .courier_content .courier_main .text,.compInvoic .courier .courier_content .courier_main .price{
    display:inline-block;
    color:#535353;
    line-height:0.42rem;
  }
  .compInvoic .courier .courier_content .courier_main p{
    color:#979797;
    line-height:0.42rem;
  }
  .compInvoic .courier .courier_content .radio{
    display:inline-block;
    flex:0 0 0.5rem;
    width:0.5rem;
    color:#D3D3D3;
    font-size:0.5rem;
  }
  .compInvoic .courier .courier_content .icon-danxuankuangyixuan{
    color:#2C7CF9;
  }
  .compInvoic .courier .courier_content .express_msg{
    padding:0.16rem 0.16rem 0.17rem 0.19rem;
    color:#535353;
    line-height:0.33rem;
    background:#FFFDE9;
    margin-top:0.15rem;
  }
  /* 发票信息 */
  .compInvoic .courier .invoice_type{
    border-bottom:0.02rem solid #EBEBEB;
  }
  .compInvoic .courier .invoice_type .invoice_info{
    display:flex;
    flex-direction:row;
    align-items:center;
    height:0.95rem;
  }
  .dis_addres{
    display:flex;
    flex-direction:row;
    align-items:center;
    padding:0.2rem 0rem;

  }
  .compInvoic .dis_addres .dis_main{
    flex:1;
  }
  .compInvoic .border{
    border-bottom:0.02rem solid #EBEBEB;
  }
  .compInvoic .dis_addres .dis_main .go_addres{
    display:inline-block;
    color:#535353;
    line-height:0.4rem;
    font-size:0.3rem;
  }
  .compInvoic .dis_addres .dis_main .center{
    position:relative;
    top:0.13rem;
  }
  .compInvoic .dis_addres .dis_main .name_tel span{
    display:inline-block;
    color:#979797;
    line-height:0.49rem;
  }
  .compInvoic .dis_addres .dis_main .name_tel .name{
    margin-right:0.25rem;
  }
  .compInvoic .dis_addres .dis_main .home_addres{
    color:#979797;
    line-height:0.43rem;
  }
  .compInvoic .dis_addres .icon-xiangyou,.courier_box .icon-xiangyou{
    flex: 0 0 0.25rem;
    width:0.25rem;
    color:#C1C2C3
  }
  .compInvoic .dis_addres .no_sele{
    flex: 0 0 1.2rem;
    width:1.2rem;
    color:#979797;
    font-size:0.3rem;
  }
  .w440{
    width:4.4rem;
    text-align: right;
  }
  .ivoicBtn{
    width:6.82rem;
    height: 1rem;
    background:linear-gradient(to right,rgba(231, 70, 92, 1),rgba(255, 92, 92, 1));
    border-radius: 0.12rem;
    line-height: 1rem;
    text-align: center;
    color: #fff;
    margin-top: 0.35rem;
  }
  .maska{
    position: fixed;
    z-index:2;
    left:0rem;
    top:0rem;
    bottom:0rem;
    right:0rem;
    background:rgba(0,0,0,0.4);
    transition:all 0s ease;
  }
  .dialogueBox .content p.dialogMsg3{
    font-size: 0.3rem;
    font-weight: normal;
  }
</style>
