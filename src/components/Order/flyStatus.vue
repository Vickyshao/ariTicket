<template>
  <section>
    <div v-if="statusInfo">
      <!--状态一 计划-->
      <div v-if="statusInfo.FlightState==='计划'" class="flyStatus flexRow flexSpace status1">
        <div class="statusTxt fontSize40 fontBold">
          {{statusInfo.FlightState}}<span class="line"></span>
        </div>
        <div class="onTime">
          <em class="ontimeL">
            <span class="fontSize26">准点率</span><br>
            <span class="fontSize22">*仅供参考</span>
          </em>
          <em class="ontimeR fontBold Arial">
            {{statusInfo.OntimeRate}}
          </em>
        </div>
      </div>
      <!--状态一 取消-->
      <div v-if="statusInfo.FlightState==='取消'" class="flyStatus flexRow flexSpace status2">
        <div class="statusTxt fontSize40 fontBold">
          {{statusInfo.FlightState}}<span class="line"></span>
        </div>
        <div class="onTime">
          <em class="ontimeL">
            <span class="fontSize26">准点率</span><br>
            <span class="fontSize22">*仅供参考</span>
          </em>
          <em class="ontimeR fontBold Arial">
            {{statusInfo.OntimeRate}}
          </em>
        </div>
      </div>
      <!--状态一 延误-->
      <div v-if="statusInfo.FlightState==='延误'" class="flyStatus flexRow flexSpace status3">
        <div class="statusTxt fontSize40 fontBold">
          {{statusInfo.FlightState}}<span class="line"></span>
        </div>
        <div class="onTime">
          <em class="ontimeL">
            <span class="fontSize26">准点率</span><br>
            <span class="fontSize22">*仅供参考</span>
          </em>
          <em class="ontimeR fontBold Arial">
            {{statusInfo.OntimeRate}}
          </em>
        </div>
      </div>
      <!--状态一 起飞-->
      <div v-if="statusInfo.FlightState==='起飞'" class="flyStatus flexRow status4">
        <div class="statusTxt fontSize40 fontBold">
          {{statusInfo.FlightState}}<span class="line"></span>
          <!--起飞<span class="line"></span>-->
        </div>
        <div class="plane">
          <div class="plane_lightLine"></div>
          <div :style="{width:alreadyTm+'%'}" class="plane_strongLine"></div>
          <div :style="{left:alreadyTm+'%'}" class="plane_img">
            <img src="../../assets/images/Shape.png" />
          </div>
          <!--时间-->
          <div class="planeTime">剩余{{surplusMinite}}分钟到达</div>
        </div>
      </div>
      <!--状态一 到达-->
      <div v-if="statusInfo.FlightState==='到达'" class="flyStatus flexRow status4">
        <div class="statusTxt fontSize40 fontBold">
          {{statusInfo.FlightState}}<span class="line"></span>
        </div>
        <div class="plane">
          <div class="plane_lightLine"></div>
          <div :style="{width:'100%'}" class="plane_strongLine"></div>
          <div :style="{left:'91.6%'}" class="plane_img">
            <img src="../../assets/images/Shape.png" />
          </div>
          <!--时间-->
          <div v-if="minite>0" class="planeTime">比计划晚点{{Math.abs(minite)}}分钟到达</div>
          <div class="planeTime" v-else>比计划提前{{Math.abs(minite)}}分钟到达</div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
  export default {
    data(){
      return {
        minite:0,             //分钟  负为提前 正为晚点(到达状态)
        surplusMinite:1,     //剩余 分钟 (起飞状态)
        alreadyTm:1           //已飞时间 用来计算 百分比 显示小飞机图标用的
      }
    },
    props:['statusInfo'],
    created:function () {
      let vm=this;
      setTimeout(function () {
        if(vm.statusInfo.FlightState==='起飞'){
          let readyArrTime,nowTime;
          readyArrTime=new Date(vm.statusInfo.FlightArrtimeReadyDate.replace(/-/g,"/")).getTime();
          nowTime=new Date().getTime();
          vm.surplusMinite=parseInt((readyArrTime-nowTime)/60/1000);
          console.log(vm.surplusMinite)
          if(vm.surplusMinite<=0){
            vm.surplusMinite=0
          }
          vm.alreadyTm=((vm.statusInfo.FlightDuration-vm.surplusMinite)/vm.statusInfo.FlightDuration).toFixed(2)*100;   //已经飞了多长时间
          // console.log('是多少'+this.alreadyTm);
        }
        if(vm.statusInfo.FlightState==='到达'){
          let planTime,actualTime;
          planTime=new Date(vm.statusInfo.FlightArrtimePlanDate.replace(/-/g,"/")).getTime();
          actualTime=new Date(vm.statusInfo.FlightArrtimeDate.replace(/-/g,"/")).getTime();
          vm.minite=(actualTime-planTime)/60/1000;
        }
      },300)
    }
  }

</script>
<style>
  .flyStatus{
    height: 1rem;
    color: #fff;
  }
  .flyStatus.status1{
    background: #5196FF;
  }
  .flyStatus.status2{
    background: #D0021B;
  }
  .flyStatus.status3{
    background: #FFBD00;
  }
  .flyStatus.status4{
    background: #52C773;
  }
  .flyStatus .statusTxt{
    line-height: 1rem;
    margin-left: 0.3rem;
  }
  .flyStatus .statusTxt .line{
    width:0;
    height: 0.6rem;
    border-left: 0.02rem solid rgba(255,255,255,.3);
    margin-left: 0.3rem;
  }
  .flexRow.center{
    align-items: center;
    justify-items: center;
  }
  .onTime{
    /*margin-top: 0.26rem;*/
  }
  .onTime .ontimeL{
    line-height: 0.36rem;
    margin-top: 0.08rem;
    /*width:1.1rem;*/
    display: inline-block;
    text-align: right;
    vertical-align: top;
  }
  .onTime .ontimeR{
    font-size: 0.64rem;
    display: inline-block;
    vertical-align: top;
    margin: 0.09rem 0.3rem 0 0.14rem;
  }
  .plane{
    width:4.7rem;
    position: relative;
    margin-left: 0.34rem;
  }
  .plane .plane_lightLine,.plane .plane_strongLine{
    width:4.7rem;
    position: absolute;
    left: 0;
    top:0.4rem;
  }
  .plane .plane_strongLine{
    border-top:0.02rem solid rgb(255,255,255);
  }
  .plane .plane_lightLine{
    border-top:0.02rem solid rgba(255,255,255,.3);
  }
  .plane .plane_img{
    width:0.42rem;
    position: absolute;
    left:0rem;
    top:0.22rem;
  }
  .plane .plane_img img{
    width:100%;
    height: auto;
  }
  .plane .planeTime{
    position: absolute;
    right:0;
    bottom:0.08rem;
    font-size: 0.2rem;
    line-height: 0.28rem;
    color: #fff;
  }
</style>
