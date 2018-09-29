<template>
  <ul class="orderList" ref="orderlist">
    <h2 v-title="'我的订单'"></h2>
    <li v-if="isNoOrder>0" v-for="item in orderList" @click="viewOrderDetail(item.OrderId)">
      <div class="item ml30 orderNum fontSize28 orderNum">
        <span class="color53 fontSize28">订单号：{{item.OrderId}}</span>
        <em class="fontSize28 fontBold">
          <span v-if="item.OrderStatus==='OS0002'||item.OrderStatus==='OS0001'" class="colorRed">
            {{item.OrderStatusDesc}}
          </span>
          <span v-else class="color53">{{item.OrderStatusDesc}}</span>
          <span v-if="item.ChangeFlag===1" class="color53">(有改签)</span>
        </em>
      </div>
      <div class="item ml30">
        <p class="color53 fontSize30 fontBold">{{item.DepartCityName}} - {{item.ArriveCityName}} </p>
        <p class="color97 fontSize28 fontBold">起飞时间：{{item.DepartDate}} {{item.DepartTime}}</p>
        <p v-for="itemChild in item.InsuranceList" class="color53 fontSize30 fontBold">
          <span>{{itemChild.InsuranceName}}：</span>
          <span class="Arial">￥{{itemChild.Cost}}×{{itemChild.Count}}</span>份
        </p>
      </div>
      <div class="item ml30 pay fontBold">
        <em>
          <span class="fontSize28 color53">实付款</span>
          <span class="colorRed">
          <em class="fontSize24">￥</em>
          <em class="fontSize36">{{item.TotalPrice}}</em>
        </span>
        </em>
        <em v-if="item.OrderStatus==='OS0002'||item.OrderStatus==='OS0001'">
          <span class="payBtn fontSize34" @click.stop.prevent="goToPay(item.OrderId)">去付款</span>
        </em>
        <!--<em v-if="item.OrderStatus==='OS0008'&&item.NeedInvoice===0">-->
          <!--<span class="payBtn invoiceBtn fontSize34">补开发票</span>-->
        <!--</em>-->
        <em v-if="item.OrderStatus==='OS0008'&&item.InvoiceTitle===''" @click.stop.prevent="CompInvoicing(item.BillType,item.InsuranceList?item.InsuranceList.length:0,item.OrderId)">
          <span class="payBtn invoiceBtn fontSize34">补开发票</span>
        </em>
      </div>
    </li>
    <div v-if="isNoOrder>0" class="dropDown color97 fontSize28">
      <!--<span v-if="num===1">下拉加载更多...</span>-->
      <span @click="loadMore" v-if="num===2">点击加载更多</span>
      <span v-if="num===3">已显示全部订单</span>
    </div>

    <!--无相关订单 去下单-->
    <v-noOrder v-if="isNoOrder===0" :message="'暂无相关订单'">
      <div slot="goOrder" class="goOrder boxCenter fontSize34" @click="goOrder">去下单</div>
    </v-noOrder>
  </ul>
</template>
<script>
  import { mapState,mapMutations } from 'vuex'
  import NoOrder from '@/components/Order/noOrder'
  export default {
    name: 'myOrder',
    data(){
      return {
        num:0,
        pageIndex:1,
        isNoOrder:-1,    //默认没有订单
      }
    },
    computed:{
      ...mapState({
        orderList: state =>state.orderList.orderList
      })

    },
    components:{
      'v-noOrder':NoOrder,
    },
    created:function () {
      var vm=this;
      var loaderOrderInit=async function () {
        vm.pageIndex=1;
        vm.$store.commit('CLEAR_ORDERLIST');  //先清空订单列表
        const params={
          pageIndex:1
        }
//        console.log('我是几');
//        console.log(params);
        vm.$store.commit('loadingShow','拼命加载中');
        const res=await vm.$root.http.get('/member/orderList', params,vm);
//        console.log(res);
        if(res){
          if(res.data!==null){
            if(res.data.success){
              vm.$store.commit('UPDATEORDERLIST',res.data.data);
              if(res.data.data.length>0){
                vm.isNoOrder=1;       //有订单
              }
              else{
                vm.isNoOrder=0;       //无订单
              }
              if(res.data.data.length%10===0){
                vm.num=2;
              }
              else{
                vm.num=3;
              }
            }
            else{
              if(res.data.errorCode!=9999){
                vm.$store.commit('modalShow',res.data.msg);
              }
            }
          }
        }
      }
      loaderOrderInit()    //初使化订单列表
    },
    methods:{
      //查看订单详情页
      viewOrderDetail:function (orderid) {
        this.$store.commit('CLEAR_ORDERDETAIL');   //先清空
        this.$router.push({path:'/OrderDetail',query:{OrderId:orderid}});
      },
      //去支付
      goToPay:async function (orderId) {
//        console.log(orderId);
        this.$store.commit('loadingShow','拼命加载中');
        const res=await this.$root.http.get('/order/pay/'+orderId,'',this);
//        console.log(res);
//        console.log(res.data);
        if(res){
          if(res.data.success){
            window.location.href=res.data.data;
          }
          else {

          }
        }

//        window.open(''+res.data.data);
      },
      //点击加载更多
      loadMore:async function () {
//        console.log('几条:'+this.orderList.length);
        this.pageIndex++;
        const params={
          pageIndex:this.pageIndex
        }

        const res=await this.$root.http.get('/member/orderList', params,this);
//        console.log(res);
//        console.log(params);
        if(res.data.success){
          this.$store.commit('UPDATEORDERLIST',res.data.data);
//          console.log(res.data.data.length);
//          console.log('有10条吗'+res.data.data.length%10)
          if(res.data.data.length%10===0&&res.data.data.length!=0){
//            console.log('为什么会进来,出去')
            this.num=2;
          }
          else{
            this.num=3;
          }
        }
        else{
          this.$store.commit('modalShow',res.data.msg);
        }
      },
      //补开发票
      CompInvoicing:function (BillType,len,orderID) {
        let obj={
          BillType:BillType,
          len:len,
          orderId:orderID,
          // url:window.location.href
        }
        this.setCookie('compInvoicCookie',JSON.stringify(obj));
        this.$router.push({path:'/CompInvoicing'});
      },
      //去下单
      goOrder:function () {
        this.$router.push({path:'/Home'});
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
  border-bottom: 1px solid #EBEBEB;
  padding: 0.2rem 0;
  line-height: 0.49rem;
}
.orderList .item:last-child{
  border-bottom: none;
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
}
.dropDown{
  width:7.5rem;
  height: 0.8rem;
  line-height: 0.8rem;
  text-align: center;
}
.payBtn.invoiceBtn{
  width:1.88rem;
  background: #fff;
  color: #f13e56;
  border:0.02rem solid #f13e56;
}
.goOrder{
  width:2.5rem;
  height: 0.7rem;
  line-height: 0.7rem;
  text-align: center;
  background:linear-gradient(90deg,rgba(231,70,92,1),rgba(255,92,92,1));
  color: #fff;
  margin-top: 0.63rem;
  border-radius: 0.4rem;
}
</style>
