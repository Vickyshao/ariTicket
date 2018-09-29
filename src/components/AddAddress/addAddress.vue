<template>
    <div class="add_addres">
        <div class="add_list">
          <ul>
            <li>
              <span class="type fontSize30">收件人</span><input type="text" class="username" placeholder="请填写收件人姓名" ref="userName">
            </li>
            <li>
              <span class="type fontSize30">手机号码</span><input type="tel" class="tel" placeholder="仅支持中国大陆手机号码" ref="tel">
            </li>
            <li @click="ship_addr">
              <span class="type fontSize30">所在省市区</span><input type="text"  placeholder="请选择省市区" v-model="address_str" ref="depart"><span class="iconfont icon-xiangyou"></span>
            </li>
            <li>
              <span class="type fontSize30">详细地址</span><input type="text"  placeholder="不需要填写省/市/区" ref="detail">
            </li>
          </ul>
        </div>
        <div class="default" @click="obj.selected = !obj.selected" >
            <span class="iconfont radio" :class="{'icon-danxuankuangweixuan':!obj.selected,'icon-danxuankuangyixuan':obj.selected}"></span><span class="text fontSize30">设为默认地址</span>
        </div>
        <div class="sure_btn">
          <div class="delete fontSize36" @click="del">删除</div>
          <div class="sure fontSize36" @click="sure">保存并使用</div>
        </div> 
        <!-- 城市三级菜单 -->
        <v-citychoice v-show="isShipShow"></v-citychoice>
    </div>
</template>
<script type="text/ecmascript-6">
import { mapState, mapMutations } from 'vuex';
import CityChoice from "@/components/CityChoice/cityChoice"
  export default {
    name: 'add_addres',
    data() {
      return{
        obj:{
          'username':null,
          'tel':null,
          'depart':null,
          'detail':null,
          'selected':false 
        },
        
      }  
    },
    computed:{
      ...mapState({
        modal: state =>state.modal.modal,
        msg: state => state.modal.msg,
        isShipShow:state =>state.duoPage.isShipShow,//配送地址显示隐藏
        address_str:state =>state.duoPage.address_str,//配送地址显示隐藏
      })
    },
    methods: {
      ...mapMutations([
        'modalShow',
      ]),
      //获取当前点击元素
      getCardText(event){
        this.cardFlag = false;
        this.cardText = event.target.innerText;
      },
      //添加乘机人
      sure(){
        let reg = /([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z]){1,20}$/;
        let tel_reg = /^1[3|4|5|7|8][0-9]{9}$/;
        let username = this.$refs.userName;
        let tel = this.$refs.tel;
        String.prototype.trim=function(){
        　　return this.replace(/(^\s*)|(\s*$)/g, "");
        }
        //用户名验证
        if(username.value === ''||username.value === null ){
          this.$store.commit('modalShow','用户名不能为空');
          return;
        }else if(!reg.test(username.value.trim())){
          this.$store.commit('modalShow','用户名支持中文英文');
          return;
        }
        //手机号验证
        if(tel.value === ''||tel.value === null){
          this.$store.commit('modalShow','手机号不能为空');
          return;
        }else if(!tel_reg.test(tel.value.trim())){
          this.$store.commit('modalShow','手机号错误');
          return;
        };
        // 省市区验证
        let depart = this.$refs.depart;
        if(depart.value === "" || depart.value === null){
          this.$store.commit('modalShow','请输入正确的省市区');
          return;
        }
        //详细地址验证
        let detail = this.$refs.detail;
        if(detail.value === "" || detail.value === null){
          this.$store.commit('modalShow','详细信息不能为空');
          return;
        }
        //验证通过后提交
        
         this.$store.state.duoPage.sele_address = false;
         this.$store.state.duoPage.add_address = false;
         // this.obj
         // this.submit(username.value,codeNum.value);
      },
      // 数据提交
      submit: async function () {
       this.$store.commit('loadingShow','拼命加载中');
       let params = obj
       const res = await this.$root.http.post('/mvc/pay/QueryPayInfos', params,this)
       if (res.data.Flag === 1) {
            
       } else if (res.data.Flag === 0 ){
         
       }
     },
     // 删除
     del(){
       this.$store.state.duoPage.add_address = false;
     },
     //配送地址选择
      ship_addr(){ 
        this.$store.state.duoPage.isShipShow =  true;
      },
    },
    components:{
      'v-citychoice':CityChoice
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
    flex:0 0 1.68rem;
    width:1.68rem;
    font-weight:bold;
    color:#535353;
  }
  .add_addres .add_list li input{

    flex:0 0 3.64rem;
    width:3.64rem;
    outline: none;
    border:none;
    height:0.5rem;
    line-height:0.5rem;
    background:transparent;
    font-size:0.3rem;
    color:#535353;
    overflow:hidden;
  }
  .add_addres .default{
    display:flex;
    margin-top:0.33rem;
    align-items: center;
    padding:0 0.34rem;
  }
  .add_addres .default .radio{
    display:inline-block;
    color:#D3D3D3;
    font-size:0.4rem;
    margin-right:0.2rem;
  }
  .add_addres .default .icon-danxuankuangyixuan{
    color:#2C7CF9;
  }
  .add_addres .default .text{
    color:#535353;
    font-weight:bold;
  }
  
  .add_addres .add_list li .icon-xiangyou{
    flex:1;
    color:#C1C2C3;
    font-size:0.32rem;
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
    background:linear-gradient(rgba(231,70,92,1),rgba(255,92,92,1))
  }
  ::-webkit-input-placeholder{
    font-size:0.3rem;
    color: #CACACA;
  }
</style>
