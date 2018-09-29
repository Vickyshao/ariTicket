<template>
  <ul class="changeProcess">
    <h2 v-title="'改签流程'"></h2>
    <li v-for="(item,index) in changeProcessArr" :class="{cur:index===0}">
      <i class="circle"></i>
      <div class="content">
        <p class="fontBold fontSize30">{{item.LogDesc}}</p>
        <p class="fontSize28">{{item.CreateTime}}</p>
      </div>
    </li>

  </ul>
</template>
<script>
export default {
  data(){
    return {
      changeProcessArr:[]
    }
  },
  created:async function () {
    let orderid=this.$route.query.OrderId;
    const response=await this.$root.http.get('/orderLog/info?orderId='+orderid,'',this);
    if(response){
      if(response.data.success){
        this.changeProcessArr=response.data.data;
      }
    }
  }
}
</script>
<style scoped>
  .changeProcess{
    height: 13.3rem;
    background: #fff;
    padding-top: 0.48rem;
  }
  .changeProcess li{
    margin-left: 0.46rem;
    border-left: 0.02rem solid #ebebeb;
    padding:0 0.18rem 0.26rem 0.3rem;
    line-height: 0.42rem;
    font-size: 0.3rem;
    position: relative;
  }
  .changeProcess li:last-child{
    border-left: none;
  }
  .changeProcess li .content{
    display: flex;
    flex-direction: column;
    color: #c0c0c0;
  }
  .changeProcess li .content p:first-child{
    margin-top: -0.07rem;
  }
  .changeProcess li .circle{
    width:0.24rem;
    height: 0.24rem;
    border-radius: 50%;
    position: absolute;
    left: -0.12rem;
    top:0.02rem;
    background: #e2e2e2;
  }
  .changeProcess li.cur,.changeProcess li.cur .content{
    color: #2C7CF9;
  }
  .changeProcess li.cur .circle{
    background: #2C7CF9;
  }
</style>
