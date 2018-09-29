<template>
    <div class="add_addres">
        <div class="add_list">
          <ul>
            <li @click="fnFoldShow()">
              <span class="type fontSize30">发票类型</span><span class="company fontSize30">{{invoiceInfo.typeField == 0 ? '公司':'个人'}}</span><span class="iconfont icon-xiangyou"></span>
            </li>
            <li>
              <span class="type fontSize30">发票抬头</span><input type="text"  v-model="invoiceInfo.invoice_headField" ref="title">
            </li>
            <li v-show="invoiceInfo.typeField == 0">
              <span class="type fontSize30">纳税人识别号</span><input type="text"  v-model="invoiceInfo.tax_codeField" ref="duty">
            </li>
          </ul>
        </div>
        <div class="sure_btn">
          <div class="delete fontSize36" @click="del">删除</div>
          <div class="sure fontSize36" @click="sure">确定</div>
        </div>
        <div class="maska" @click="isFoldShow = false" v-if="isFoldShow"></div>
        <transition name="fold">
          <div class="card_type" v-show="isFoldShow">
              <ul >
                <li class="fontSize30" :class="{'active':flag === 1}" @click="getCardText($event,1)">个人</li>
                <li class="fontSize30" :class="{'active':flag === 0}"  @click="getCardText($event,0)">公司</li>
              </ul>
          </div>
        </transition>
    </div>
</template>
<script type="text/ecmascript-6">
import { mapState, mapMutations } from 'vuex';
  export default {
    name: 'add_addres',
    data() {
      return{
        isFoldShow:false,//公司个人弹框显示
        flag:null,
      }
    },
    computed:{
      ...mapState({
        modal: state =>state.modal.modal,
        msg: state => state.modal.msg,
        invoiceInfo:state =>state.invoice.invoiceInfo,//编辑信息存储
        giveInfo:state =>state.invoice.giveInfo,//发票配送信息
        invoicePage:state =>state.order.invoicePage
      })
    },
    methods: {
      ...mapMutations([
        'modalShow',
      ]),

      //添加乘机人
      sure(){
        let title = this.$refs.title;
        let duty = this.$refs.duty;
        String.prototype.trim=function(){
        　　return this.replace(/(^\s*)|(\s*$)/g, "");
        }
        //发票抬头验证
        if(title.value === ''||title.value === null ){
          this.$store.dispatch('modalCountdown','发票抬头不能为空');
          return;
        }
        else if(title.value.length>25){
          this.$store.dispatch('modalCountdown','发票抬头长度不能大于25个字符');
          return;
        }
        //税号验证
        let invoiceInfo = this.$store.state.invoice.invoiceInfo
        if(invoiceInfo.typeField == 0){
          let reg = /[a-zA-Z1-9]+/;

          if(duty.value === ''||duty.value === null){
            this.$store.dispatch('modalCountdown','税号不能为空');
            return;
          }else if(!reg.test(duty.value.trim())){
            this.$store.dispatch('modalCountdown','税号格式错误');
            return;
          }
          else if(duty.value.trim().length>50){
            this.$store.dispatch('modalCountdown','税号长度不能大于50个字符');
            return;
          }
        }
          let id =this.$store.state.invoice.invoiceInfo.invoice_idField
          let obj = {
            typeField:invoiceInfo.typeField,
            invoice_headField:title.value,
            tax_codeField:invoiceInfo.typeField == 0 ? duty.value :'',
            invoice_idField:id,
          }
          this.submit(obj);
      },
      // 数据提交
      submit: async function (obj) {
       this.$store.commit('loadingShow','拼命加载中');
       let params = obj;
       let res = ''
       //if(obj.typeField === 0){
        //  res = await this.$root.http.post('invoice/modify', params,this)
       //}else{
        //  res = await this.$root.http.post('invoice/modify', params,this)
       //}
       res = await this.$root.http.post('invoice/modify', params,this);

       if (res.data.success) {
          let itemId = this.$store.state.invoice.giveInfo
          if(itemId.invoice_idField == obj.invoice_idField){
            this.$store.state.invoice.giveInfo = Object.assign({},itemId,obj);
//            console.log(this.$store.state.invoice.giveInfo)
          }
           // this.$router.push({path:'/Order'});
         if(this.invoicePage===1){
           this.$router.push({path:'/Order'});
         }
         else if(this.invoicePage===2){
           this.$router.push({path:'/CompInvoicing'});
         }
         // this.$router.go(-1);
       }else{
          this.$store.commit('modalShow',res.data.msg);
          return;
        }

     },
    // 删除
     del(){
        let id =this.$store.state.invoice.invoiceInfo.invoice_idField
        this.fnDel(id);
     },
     fnDel: async function (id) {
       this.$store.commit('loadingShow','拼命加载中');
       let params = {}
       const res = await this.$root.http.get('invoice/delete/'+id, params,this);

       if (res.data.success) {
           // this.$router.push({path:'/Order'})
         this.$router.go(-1);
       }else{
          this.$store.commit('modalShow',res.data.msg);
          return;
        }
     },
     //获取当前点击元素
     getCardText(event,num){
       let invoiceInfo = this.$store.state.invoice.invoiceInfo
       invoiceInfo.typeField = num;
       this.flag = num;
       this.isFoldShow = false;
     },
     //公司个人显示
     fnFoldShow(){
        this.flag = null;
        this.isFoldShow = true
     }
    },
    components:{
    }
  }
</script>
<style >
  .add_addres{
    position:fixed;
    left:0rem;
    right:0rem;
    bottom:0rem;
    top:0rem;
    z-index:4;
    background:#fff;
  }
  .add_addres .add_list{
    margin:0rem 0.34rem;
  }
  .add_addres .add_list li{
    display:flex;
    align-items:center;
    height:1rem;
    border-bottom:0.02rem solid #EBEBEB;
    box-sizing:border-box;
  }
  .add_addres .add_list li .type{
    display:inline-block;
    flex:0 0 2.01rem;
    width:2.01rem;
    font-weight:bold;
    color:#535353;
    margin-right:0.4rem;
  }
  .add_addres .add_list li .company{
    display:inline-block;
    flex:0 0 4.27rem;
    width:4.27rem;
    color:#535353;
    font-size:0.3rem;
  }
  .add_addres .add_list li input{

    flex:0 0 4.27rem;
    width:4.27rem;
    outline: none;
    border:none;
    height:0.5rem;
    line-height:0.5rem;
    background:transparent;
    font-size:0.3rem;
    color:#535353;
    overflow:hidden;
  }
  .add_addres .add_list li .icon-xiangyou{
    flex:1;
    color:#C1C2C3;
    font-size:0.25rem;
    text-align:right;
  }
  /* 删除 确定 */
  .add_addres .sure_btn{
    position:fixed;
    bottom:0rem;
    left:0rem;
    right:0rem;
    display:flex;
    z-index:1;
  }
  .add_addres .sure_btn div{
    flex:1;
    display:inline-block;
    font-weight:bold;
    height:1.1rem;
    line-height:1.1rem;
    text-align:center;
    box-sizing:border-box;
  }
  .add_addres .sure_btn .delete{
    color:#F13E56;
    background:rgba(255,245,246,1);
    box-shadow: 0px -0.02rem 0px 0px rgba(0,0,0,0.1) ;
  }
  .add_addres .sure_btn .sure{
    color:#fff;
    background:linear-gradient(90deg,rgba(231,70,92,1),rgba(255,92,92,1));
  }
  ::-webkit-input-placeholder{
    font-size:0.3rem;
    color: #CACACA;
  }

    .add_addres .maska{
      position: fixed;
      z-index:4;
      left:0rem;
      top:0rem;
      bottom:0rem;
      right:0rem;
      background:rgba(0,0,0,0.4);
    }
    .add_addres .card_type{
      position:fixed;
      bottom:0rem;
      left:0rem;
      right:0rem;
      z-index:5;
      background:#fff;
      transition:all 0.5s ease;
    }

   .fold-enter-active,.fold-leave-active{
        transition:all 0.5s ease;
    }
    .fold-enter-active{
      transform:translate3d(0,0,0);
    }
    .fold-enter,.fold-leave-active{
      transform:translate3d(0,100%,0);
    }
    .add_addres .card_type ul li{
      color:#535353;
      font-weight:bold;
      height:0.94rem;
      line-height:0.94rem;
      text-align:center;
      border-bottom:0.02rem solid #EBEBEB;
    }
    .add_addres .card_type ul li.active{
      color:#fff;
      background:#2C7CF9;
    }
</style>
