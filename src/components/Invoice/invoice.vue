<template>
  <transition name="fold">
     <div class="sele_add">
        <div class="sure_cancel">
          <span class="cancel fontSize30" @click="fnCancel">取消</span><span class="add_ren fontSize32">选择发票</span><span class="sure fontSize30" @click="fnSure">确定</span>
        </div>
        <div class="add" @click="add">
          <span class="iconfont icon-tianjia"></span><span class="text fontSize30">新增发票信息</span>
        </div>
        <div class="user_list" :class="{'active':isNewInvoice}">
          <ul>
            <li v-for="(item,index) in resData" @click.stop.prevent="fnRadio(item.invoice_idField,index)">
              <span class="iconfont icon-xiugai icon_style" @click.stop.prevent="editor(index)"></span>
              <div class="user_info" :class="{'fontColor':radioStatus == index}">
                <span class="userName fontSize30">{{item.invoice_headField}}</span>
                <p class="fontSize30">
                  <span class="card fontSize30 Arial" >{{item.typeField == 0 ? item.tax_codeField :'个人抬头'}}</span>
                </p>
              </div>
              <span class="iconfont check" :class="{'icon-danxuankuangweixuan':radioStatus !== index,'icon-danxuankuangyixuan':radioStatus == index}"></span>
            </li>
          </ul>
        </div>
    </div>
  </transition>

</template>
<script type="text/ecmascript-6">
import { mapState, mapMutations } from 'vuex';
  export default {
    name: 'sele_add',
    data() {
      return{
        radioStatus:null,
        resData:[],
      }
    },
    created(){
      //this.radioStatus=this.$store.state.invoice.radio;

    },
    mounted(){
      this.initData();
    },
    computed:{
      ...mapState({
        isNewInvoice:state =>state.invoice.isNewInvoice,//新增发票显示隐藏
        invoiceInfo:state =>state.invoice.invoiceInfo,//编辑信息存储
        giveInfo:state =>state.invoice.giveInfo,//发票配送信息
        radio:state =>state.invoice.radio,//发票配送信息
      })
    },
    methods: {
      ...mapMutations([
        'modalShow'
      ]),
      //单选
      fnRadio(id,index){
        if(this.radioStatus === index){
          this.radioStatus = index;
        }else{
          this.radioStatus = index;
        };
        //this.$store.state.invoice.radio = id;
      },
      //编辑
      editor(index){
        this.$store.state.invoice.invoiceInfo = this.resData[index];
        this.$router.push({path:'/EditorInvoice'})
      },
      //跳转新增地址页
      add(){
        this.$router.push({path:'/NewInvoice'})
      },
      //取消添加联系人
      fnCancel(){
        this.$store.state.invoice.isNewInvoice = false;
      },
      //添加联系人
      fnSure(){
        let index = this.radioStatus
        this.$store.state.invoice.giveInfo = this.resData[index];
        //添加下单用的 发票抬头 税号
        let obj={
          invoiceTitle:this.giveInfo.invoice_headField,
          tfn:this.giveInfo.tax_codeField
        }
        this.$store.commit('UPDATE_INVOICE',obj);

        this.$store.state.invoice.isNewInvoice = false;
      },
      //初始化数据 initData
      initData: async function () {
        this.$store.commit('loadingShow','拼命加载中');
       let params = {}
       let res = await this.$root.http.get('invoice/list', params,this);
       if(res.data.success){
          this.resData = res.data.data.invoiceListField;
//          console.log(this.resData);
//          let id = this.$store.state.invoice.radio
          for(let i = 0;i<this.resData.length;i++){
            if(this.resData[i].invoice_idField == this.giveInfo.invoice_idField){
              this.radioStatus = i
            }
          }

       }
      },
    },
  }
</script>
<style >
  .sele_add{
    position: relative;
    background:#fff;
    position:fixed;
    left:0rem;
    right:0rem;
    bottom:0rem;
    z-index:3;
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
  /* 插槽确定取消 */
  .sele_add .sure_cancel{
    display:flex;
    flex-direction: row;
    align-items: center;
    height:0.9rem;
    padding:0 0.34rem;
    background:linear-gradient(-90deg,rgba(79,176,251,1),rgba(44,124,249,1));
  }
  .sele_add .sure_cancel span{
    display:inline-block;
    color:#FFFFFF;
  }
  .sele_add .sure_cancel .cancel{
    flex: 0 0 0.8rem;
    width:0.8rem;
    text-align:left;
  }
  .sele_add .sure_cancel .add_ren{
    flex: 1;
    color:#DEEBFE;
    text-align:center;
  }
  .sele_add .sure_cancel .sure{
    flex: 0 0 0.8rem;
    width:0.8rem;
    text-align:right;
  }
  .sele_add .add{
    display:flex;
    justify-content: center;
    align-items:center;
    height:1rem;
    background:#fff;
    border-bottom:0.02rem solid #EBEBEB;
  }
  .sele_add .add span{
    display:inline-block;
  }
  .sele_add .add .icon-tianjia{
    font-size:0.48rem;
    color:#2C7CF9;
  }
  .sele_add .add .text{
    flex:0 0 2rem;
    width:2rem;
    color:#2C7CF9;
    font-weight:bold;
    text-align:center;
    margin-left:0.15rem;
  }
  .sele_add .user_list.active{
    padding:0 0.34rem;
  }
  .sele_add .user_list ul{
    height:5rem;
    overflow-y:scroll;
  }
  .sele_add .user_list li{
    display:flex;
    flex-direction: row;
    align-items:center;
    background:#fff;
    height:1.18rem;
    border-bottom:0.02rem solid #EBEBEB;
  }
  .sele_add .user_list li:last-child{
     border-bottom:none;
  }
  .sele_add .user_list li span{
    display:inline-block;
  }
  .sele_add .user_list li .icon_style{
    flex:0 0 0.4rem;
    width:0.4rem;
    font-size:0.4rem;
    margin-right:0.28rem;
    color:#2C7CF9;
  }
  .sele_add .user_list li .user_info{
    flex:1;
  }
  .sele_add .user_list li .user_info span{
    font-weight:bold;
    color:#535353;
    height:0.42rem;
    line-height:0.42rem;
  }
  .sele_add .user_list li .user_info .userName{
    font-weight:bold;
    color:#535353;
    margin-right:0.24rem;
    height:0.42rem;
    line-height:0.42rem;
  }
 .sele_add .user_list li .user_info p{
    color:#979797;
    height:0.42rem;
    line-height:0.42rem;
  }
  .sele_add .user_list li .user_info p span{
    color:#979797;
    height:0.42rem;
    line-height:0.42rem;
    font-weight:normal;
  }
  .sele_add .user_list li .fontColor span,.sele_add .user_list li .fontColor p{
    color:#2C7CF9 !important;
  }
  .sele_add .user_list li .check{
    flex:0 0 0.5rem;
    width:0.5rem;
    color:#D3D3D3;
    font-size:0.5rem;
  }
  .sele_add .user_list li .icon-xiangyou{
     flex:0 0 0.25rem;
     width:0.25rem;
     color:#C1C2C3;
     font-size:0.25rem;
  }
  .sele_add .user_list li .icon-danxuankuangyixuan {
    color:#2C7CF9;
  }

  /* 确定 */
  .sele_add .sure_btn{
    position:fixed;
    bottom:0rem;
    left:0rem;
    right:0rem;
    display:flex;
    z-index:1;
  }
  .sele_add .sure_btn div{
    flex:1;
    display:inline-block;
    font-weight:bold;
    height:1.1rem;
    line-height:1.1rem;
    text-align:center;
    box-sizing:border-box;
  }
  .sele_add .sure_btn .sure{
    color:#fff;
    background:rgba(211,211,211,1);
    box-shadow: 0px -0.02rem 0px 0px rgba(0,0,0,0.1)
  }
  .sele_add .sure_btn .active{
    background:linear-gradient(rgba(231,70,92,1),rgba(255,92,92,1));
    box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.1)
  }
</style>
