<template>
  <ul class="orderList" ref="orderlist">
    <h2 v-title="'改签列表'"></h2>
    <li v-for="item in changeList" @click="viewOrderDetail(item.Apply.ApplyId)">
      <div class="item ml30 orderNum fontSize28 orderNum">
        <span class="color53 fontSize28">订单号：{{item.Apply.ApplyId}}</span>
        <em class="fontSize28 fontBold">
          <span class="colorRed">
            {{ChangeStatus(item.Apply.ChangeStatus)}}
          </span>
          <!--<span v-else class="colorBlue">{{item.OrderStatusDesc}}</span>-->
        </em>
      </div>
      <div class="item ml30">
        <!--<p class="color53 fontSize30 fontBold">{{item.DepartCityName}} - {{item.ArriveCityName}} </p>-->
        <p class="fontSize28 color53"><span class="color97">申请时间：</span>{{item.Apply.CreateTime}}</p>
        <!--<p v-for="itemChild in item.InsuranceList" class="color53 fontSize30 fontBold">-->
          <!--<span>{{itemChild.InsuranceName}}：</span>-->
          <!--<span class="Arial">￥{{itemChild.Cost}}×{{itemChild.Count}}</span>份-->
        <!--</p>-->
        <!--改签成功状态显示：改签人-->
        <dl v-if="item.Apply.ChangeStatus===2||item.Apply.ChangeStatus===3" class="flexRow fontSize28">
          <dt class="color97">改签后票号：</dt>
          <dd class="flexcolumn color53">
            <p>
              <!--<b>{{item.Apply.TouristName}}</b>-->
              <!--<span class="pl20">改签后票号</span>-->
              <span class="pl10">{{item.Apply.TicketCodeNew?item.Apply.TicketCodeNew:'未出票'}}</span>
            </p>
          </dd>
        </dl>
        <!--其他状态显示-->
        <div class="fontSize28" v-else>
          <p><span class="color97">改签前票号：</span><span class="color53">{{item.Apply.TicketCode}}</span>  </p>
          <p><span class="color97">改签后票号：</span><span class="color53">{{item.Apply.TicketCodeNew?item.Apply.TicketCodeNew:'未出票'}}</span></p>
        </div>
      </div>
      <div v-if="item.Apply.ChangeStatus===1" class="item ml30 pay fontBold">
        <em>
          <span class="fontSize28 color53">补全差价</span>
          <span class="colorRed">
          <em class="fontSize24">￥</em>
          <em class="fontSize36">{{item.Cost!==null?item.Cost.Cost:0}}</em>
        </span>
        </em>
        <em>
          <span class="payBtn fontSize34" @click.stop.prevent="goToPay(item)">去付款</span>
        </em>
        <em v-if="item.OrderStatus==='OS0008'&&item.NeedInvoice===0">
          <span class="payBtn fontSize34">补开发票</span>
        </em>
      </div>
    </li>
    <!--<div class="dropDown color97 fontSize28">-->
      <!--&lt;!&ndash;<span v-if="num===1">下拉加载更多...</span>&ndash;&gt;-->
      <!--<span @click="loadMore" v-if="num===2">点击加载更多</span>-->
      <!--<span v-if="num===3">已显示全部订单</span>-->
    <!--</div>-->
    <v-dialogbox>
      <em slot="confirm" class="confirm oneBtn" @click="promptBox">确定</em>
    </v-dialogbox>
  </ul>
</template>
<script>
  import { mapState,mapMutations } from 'vuex'
  import DialogBox from '@/components/Modal/dialogueBox'
  export default {
    name: 'myOrder',
    data(){
      return {
        changeList:[],
        changeStatusDesc:''
      }
    },
    computed:{
      // ...mapState({
      //   // orderList: state =>state.orderList.orderList
      // })

    },
    components:{
      'v-dialogbox':DialogBox,
    },
    created:async function () {
      let orderid=this.$route.query.OrderId;
      const res=await this.$root.http.get('/order/changeList', {orderId:orderid},this);
      if(res){
        if(res.data.success){
          this.changeList=res.data.data;
        }
        else{
          this.$store.dispatch('modalCountdown',res.data.msg); //带倒计时的消息框
        }
      }
    },
    methods:{
      //查看订单详情页
      viewOrderDetail:function (applyId) {
        // this.$store.commit('CLEAR_CHANGE_DETAIL');   //先清空
        this.$router.push({path:'/ChangeOrderDetail',query:{applyId:applyId}});
      },
      //去支付
      goToPay:async function (item) {
        //isExpiryTime 如果过期了 弹出一个联系客服的提示框
        let isNotExpiryTime=new Date(item.Cost.ExpiryTime).getTime()-new Date().getTime()>0;
        if(isNotExpiryTime){
          console.log(item.ExpiryTime)
          // console.log(costId);
//        console.log(orderId);
          this.$store.commit('loadingShow','拼命加载中');
          let url=window.location.href;
          let param={
            costId:item.Cost.CostId,
            returnUrl:url
          }
          const res=await this.$root.http.get('/order/payAgain',param,this);
          if(res){
            if(res.data.success){
              window.location.href=res.data.data;
            }
            else{
              this.$store.dispatch('modalCountdown',res.data.msg); //带倒计时的消息框
            }
          }
        }
        else {
          this.$store.commit('updateDialogNum',3);
          this.$store.commit('dialogBoxShow','支付已超时，请联系客服，客服电话：400 820 3333*9');
        }

//        window.open(''+res.data.data);
      },
      //状态描述文字
      ChangeStatus:function (status) {
        let str='';
        switch (status){
          case 0:
            str='改签中';
            break;
          case 1:
            str='确定航班待支付';
            break;
          case 2:
            str='待出票';
            break;
          case 3:
            str='已完成';
            break;
          case 99:
            str='改签已取消';
            break;
        }
        return str;
      },
      //支付已超时的提示框关闭
      promptBox:function () {
        this.$store.commit('dialogBoxHide');       //关闭提示框
      }
    }
  }
</script>
<style>
  .orderList li{
    width:7.5rem;
    background: #fff;
    margin-top: 0.2rem;
  }
  .orderList .item{
    width:6.84rem;
    /*border-bottom: 1px solid #EBEBEB;*/
    padding: 0.2rem 0;
    line-height: 0.49rem;
  }

  .payBtn{
    width:1.52rem;
    height:0.7rem;
    background:rgba(241,62,86,1);
    border-radius: 0.1rem;
    display: block;
    color: #fff;
    line-height: 0.7rem;
    text-align: center;
  }
  .item.pay,.item.orderNum{
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    /*border-bottom: 1px solid #EBEBEB;*/
  }
  .item.pay{
    border-top: 1px solid #EBEBEB;
  }
  .item.orderNum{
    border-bottom: 1px solid #EBEBEB;
  }
  .dropDown{
    width:7.5rem;
    height: 0.8rem;
    line-height: 0.8rem;
    text-align: center;
  }
  .w140{
    width:1.4rem;
  }
  .pl20{
    padding-left: 0.2rem;
  }
  .orderList{
    border-bottom: none;
  }
</style>
