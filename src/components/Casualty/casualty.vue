<template>
    <div class="casualty_container">
        <div class="user_list">
          <ul>
            <li v-for="(item,index) in insurance"  v-show="index<3||isMore">
              <img src="./baoxian.png" alt="">
              <div class="risk_info">
                <div class="risk_main">
                    <span class="risk fontSize30">{{item.Name}}</span>
                    <span @click="seeRemark(item)" class="prompt iconfont icon-xinxitishi"></span>
                    <span class="yang fontSize24">¥</span>
                    <span class="price Arial fontSize30"> {{item.Cost}} ×{{count}}</span>
                    <span class="text fontSize30">份</span>
                </div>
                <!--<p class="fontSize28">{{item.remark}}</p>-->
              </div>
              <span @click="insuranceFun(item,index)" class="iconfont check" :class="{'icon-danxuankuangweixuan':!item.iSelected,'icon-danxuankuangyixuan':item.iSelected}"></span>
            </li>
          </ul>
          <!--<div v-if="!isMore" class="boxCenter telescopic" @click="isMore=true">-->
            <!--<span v-if="!isMore" class="fontSize30 colorBlue">-->
              <!--<span>更多保险({{insurance.length-2}})</span>-->
              <!--<i class="icon iconfont icon-zhankai mr20"></i>-->
            <!--</span>-->
          <!--</div>-->
        </div>

      <!--保险说明-->
      <v-dialog v-if="dialog && dialogNum == 3">
        <h3 class="fongSize30" slot="titlec">{{casualtyName}}</h3>
        <ul slot="userNamec">
          <li v-for="str in casualtyRemark" class="fontSize28" >{{str}}</li>
        </ul>
        <p slot="more" class="fontBold color53 mt10 fontSize30 flexRow1">
          <span>详情请查看</span>
          <span class="ml10">
            <a class="colorBlue" :href="casualtyUrl" target="_blank">{{casualtyName}}</a>
            <!--&lt;!&ndash;航空组合险&ndash;&gt;-->
            <!--<a v-if="casualtyId===insurance[0].Id" class="colorBlue" href="http://flights.bthhotels.com/PDF/%E5%B9%B3%E5%AE%89%E8%88%AA%E7%A9%BA%E7%BB%84%E5%90%88%E9%99%A9.pdf" target="_blank">航空组合险</a>-->
            <!--&lt;!&ndash;国内航延险&ndash;&gt;-->
            <!--<a v-if="casualtyId===insurance[1].Id" class="colorBlue" href="http://flights.bthhotels.com/PDF/%E5%B9%B3%E5%AE%89%E8%88%AA%E5%BB%B6%E9%99%A9.pdf" target="_blank">机票取消险</a>-->
            <!--&lt;!&ndash;国内航意险方案B&ndash;&gt;-->
            <!--<a v-if="casualtyId===insurance[2].Id" class="colorBlue" href="http://flights.bthhotels.com/PDF/%E5%8D%8E%E5%A4%8F%E8%88%AA%E6%84%8F%E9%99%A9.pdf" target="_blank">国内航意险</a>-->
          </span>
          <i class="icon iconfont icon-xiangyou ml10"></i>
        </p>
      </v-dialog>
    </div>
</template>
<script type="text/ecmascript-6">
  import Dialog from '@/components/Dialog/dialog';
  import { mapState, mapMutations } from 'vuex';
  export default {
    name: 'casualty_container',
    data() {
      return{
        isMore:false,
        obj:{
          userName:'黄晓明',
          tel:15638481533,
          depart:"北京市 朝阳区",
          detail:"京城88号",
        },
        //保险说明文字
        casualtyName:'',
        casualtyUrl:'',
        casualtyId:0,
        casualtyRemark:[]
      }
    },
    computed:{
      ...mapState({
        modal: state =>state.modal.modal,
        iconActive:state =>state.duoPage.iconActive,
        insurance:state =>state.order.insurance,
        insuranceArr:state =>state.order.insuranceArr,
        isReturnDate:state =>state.list.isReturnDate,
        crews:state =>state.duoPage.crews,
        dialog: state =>state.dialog.dialogFlag,
        dialogNum: state =>state.dialog.dialogNum
      }),
      count:function () {
        let num=this.isReturnDate?this.crews.length*2:this.crews.length
        return num;
      }
    },
    components: {
      'v-dialog': Dialog,
    },
    created:async function () {
      if(this.insurance.length===0){
        this.$store.commit('loadingShow','拼命加载中');
        let res=await this.$root.http.get('/insurance');
        //给每一个对象加一个是否选中的属性
        var arr=[];
        res.data.data.forEach(function (item) {
          var newsItem=Object.assign(item,{iSelected:false});
          arr.push(newsItem);
        });
        this.$store.commit('UPDATE_INSURANCE',arr);
      }
    },
    methods: {
      ...mapMutations([
        'UPDATE_INSURANCE',
        'modalShow',
        'totalMoney',
        'UPDATE_ISRC_ISELECTED',
        'UPDATE_SELECTED',
        'update_invoice1',
        'UPDATE_INSURANCE_SELECTED'
      ]),
      //单击保险
      insuranceFun:function (item,index) {
        this.UPDATE_ISRC_ISELECTED(index);  //改变选中状态
        this.UPDATE_SELECTED();             //提取选中的id
        this.update_invoice1(this.insuranceArr.length);//是否选中保险发票
        this.UPDATE_INSURANCE_SELECTED();              //选中的保险集合
        this.$store.dispatch('TotailPrice');    //计算总价
      },
      seeRemark:function (item) {
        this.$store.commit('dialogShow',3);   //显示保险说明弹出层
        this.casualtyName=item.Name;
        this.casualtyUrl=item.Url;
//        this.casualtyId=item.Id;
        let remark=item.Remark.split('\n');
        this.casualtyRemark=remark;
      }
    }
  }
</script>
<style >
  .casualty_container{
    position: relative;
    background:#fff;
    margin-top:0.2rem;
  }
  .casualty_container .user_list{
     padding:0rem 0.34rem;
    padding-bottom: 0.1rem;
  }
  .casualty_container .user_list li{
    display:flex;
    flex-direction: row;
    align-items:center;
    background:#fff;
    /*height:1.2rem;*/
    border-bottom:0.02rem solid #EBEBEB;
    padding: 0.21rem 0;
  }
  .casualty_container .user_list li:last-child{
    border:none;
  }
  .casualty_container .user_list li span{
    display:inline-block;
  }
  .casualty_container .user_list li img{
    flex:0 0 0.47rem;
    width:0.47rem;
    height:0.5rem;
    margin-right:0.23rem;
  }
  .casualty_container .user_list li .risk_info{
    flex:1;
  }
  .casualty_container .user_list li .risk_info span{
    font-weight:bold;
    color:#535353;
    height:0.42rem;
    line-height:0.42rem;
  }
  .casualty_container .user_list li .risk_info .risk{
    margin-right:0.1rem;
  }
  .casualty_container .user_list li .risk_info .prompt{
    font-size:0.28rem;
    color:#D3D3D3;
    margin-right:0.25rem;
  }
  .casualty_container .user_list li .risk_info .yang{
   margin-right:0.03rem;
  }
 .casualty_container .user_list li .risk_info p{
    color:#979797;
    /*height:0.42rem;*/
    line-height:0.42rem;
  }
  .casualty_container .user_list li .check{
    flex:0 0 0.5rem;
    width:0.5rem;
    color:#D3D3D3;
    font-size:0.5rem;
  }
  .casualty_container .user_list li .icon-danxuankuangyixuan {
    color:#2C7CF9;
  }
  .telescopic{
    height: 0.92rem;
    line-height: 0.92rem;
    text-align: center;
  }
  .telescopic .iconfont{
    font-size: 0.2rem;
    margin-left: 0.19rem;
    color: #d3d3d3;
  }
</style>
