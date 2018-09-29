<template>
  <!--航班信息-->
  <section class="flyInfo">
    <p class="color53 fontBold h_line40">
      <span class="flyLogo">
        <img :src="flyinfo.carrierLogo">
      </span>
      <span>{{flyinfo.airlineCompany}}</span>
      <span>{{flyinfo.flightNo}}</span>
    </p>
    <div class="flexRow center color97 h_lin33">
      <em class="flexcolumn ml24">
        <span>{{flyinfo.departTime}}</span>
        <span>{{flyinfo.arriveTime}}</span>
      </em>
      <em class="groupImg">
        <img src="./Group.png"/>
      </em>
      <em class="flexcolumn fontSize24">
        <span>{{flyinfo.departCityName}}{{flyinfo.orgAirportShortName}}机场</span>
        <span>{{flyinfo.arriveCityName}}{{flyinfo.dstAirportShortName}}机场</span>
      </em>
    </div>
  </section>
</template>
<script>
  export default {
    data() {
      return {}
    },
    props:['flyinfo']
  }
</script>
<style scoped>
  /*航班列表 子组件样式*/
  .flexcolumn{
    display: flex;
    flex-direction: column;
  }
  .flexRow.center{
    align-items: center;
    /*justify-content: center;*/
  }
  .h_line40{
    line-height: 0.4rem;
  }
  .h_lin33{
    line-height: 0.33rem;
  }
  .ml24{
    margin-left: 0.26rem;
  }
  .flexRow.center{
    align-items: center;
    /*justify-content: center;*/
  }
  .flyInfo img{
    width:100%;
    height: auto;
  }
  .flyInfo .flyLogo{
    width:0.24rem;
    display: inline-block;
  }
  .flyInfo .groupImg{
    width:0.15rem;
    display: inline-block;
    height: 0.57rem;
    margin: 0 0.26rem;
  }
</style>
