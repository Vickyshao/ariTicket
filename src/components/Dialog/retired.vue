<template>
  <transition name="fade">
    <div class="retired" v-if="retiredFlag">
      <div class="mask5" @click="retiredHide"></div>
      <div class="content">
        <h3 class="fongSize30 colorBlue">退改签规则/行李额说明</h3>
        <div class="baggageAllowance">
          <span class="ba_mark">行李额</span>
          <span class="color53">{{freeLuggage}}{{freeLuggageUnit}}免行李额费用</span>
        </div>
        <div class="box-content">
          <!--成人退改签规则-->
          <p class="color53 lineheight40 fontSize28 fontBold">成人退改签规则</p>
          <ul class="table fontSize24">
            <li>
              <!--<div class="color97 textLeft dt">退票规定</div>-->
              <div class="color53 ml20 dd mr20">
                <p class="rulename fontBold">{{backTickets.ruleName}}</p>
                <p v-for="item in backTickets.ruleFeeList">
                  <span>{{item.name}}</span>
                  <span class="pl10 Arial">{{item.value}}</span>
                </p>
                <p class="color97 ruleRemark">备注：{{backTickets.ruleRemark}}</p>
              </div>
            </li>
            <li>
              <!--<div class="color97 textLeft dt">改期规定</div>-->
              <div class="color53 ml20 dd mr20">
                <p class="rulename fontBold">{{changeTickets.ruleName}}</p>
                <p v-for="item in changeTickets.ruleFeeList">
                  <span>{{item.name}}</span>
                  <span class="pl10 Arial">{{item.value}}</span>
                </p>
                <p class="color97 ruleRemark">备注：{{changeTickets.ruleRemark}}</p>
              </div>
            </li>
          </ul>
          <!--儿童退改签规则-->
          <p v-if="Category===1" class="color53 lineheight40 fontSize28 fontBold mt20">儿童退改签规则</p>
          <ul v-if="Category===1" class="table fontSize24">
            <li>
              <!--<div class="color97 textLeft dt">退票规定</div>-->
              <div class="color53 ml20 dd mr20">
                <p class="rulename fontBold">{{backTickets1.ruleName}}</p>
                <p v-for="item in backTickets1.ruleFeeList">
                  <span>{{item.name}}</span>
                  <span class="pl10 Arial">{{item.value}}</span>
                </p>
                <p class="color97 ruleRemark">备注：{{backTickets1.ruleRemark}}</p>
              </div>
            </li>
            <li>
              <!--<div class="color97 textLeft dt">改期规定</div>-->
              <div class="color53 ml20 dd mr20">
                <p class="rulename fontBold">{{changeTickets1.ruleName}}</p>
                <p v-for="item in changeTickets1.ruleFeeList">
                  <span>{{item.name}}</span>
                  <span class="pl10 Arial">{{item.value}}</span>
                </p>
                <p class="color97 ruleRemark">备注：{{changeTickets1.ruleRemark}}</p>
              </div>
            </li>
          </ul>
          <!--<p class="color97 lineheight30 mt20">{{infRuleDesc}}</p>-->
          <p class="color97 lineheight30 mt20">以上机票退改签费用仅供参考，具体以实际订单为准</p>
          <div class="close_btn" @click="retiredHide">
            <span class="colse iconfont icon-danchukuangguanbianniu"></span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script type="text/ecmascript-6">
import { mapState, mapMutations } from 'vuex';
  export default {
    name: 'retired',
    data(){
      return {
//        isRemark1:false,
//        isRemark2:false,
//        isRemark3:false,
//        isRemark4:false,
      }
    },
    computed:{
      ...mapState({
        retiredFlag: state =>state.dialog.retiredFlag,
        infRuleDesc:state =>state.order.retiredObj.infRuleDesc,
        backTickets:state =>state.order.retiredObj.adutObj.backTickets,         //成人退票
        changeTickets:state =>state.order.retiredObj.adutObj.changeTickets,     //成人改签
        backTickets1:state =>state.order.retiredObj.chdObj.backTickets,         //儿童退票
        changeTickets1:state =>state.order.retiredObj.chdObj.changeTickets,     //儿童改签
        Category:state =>state.order.Category,                                  //乘机人类型
        freeLuggage:state =>state.dialog.freeLuggage,                            //行李额
        freeLuggageUnit:state =>state.dialog.freeLuggageUnit                     //单位 kg
      })
    },
//    mounted(){
////      console.log(this.retiredObj);
//    },
     methods: {
      ...mapMutations([
        'retiredHide',
      ]),
    },
  }
</script>
<style lang="css">
 /* 模态框 */
.retired{
    position: fixed;
    z-index:4;
    left:0rem;
    top:0rem;
    bottom:0rem;
    right:0rem;
  }
.retired .mask5{
    position: fixed;
    z-index:3;
    left:0rem;
    top:0rem;
    bottom:0rem;
    right:0rem;
    background:rgba(0,0,0,0.4);
  }
.retired .content{
    position:fixed;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
    z-index:5;
    width:6.82rem;
    padding:0.5rem 0.3rem 0.5rem 0.34rem;
    background:#fff;
    border-radius: 0.1rem ;
  }
 .retired .content h3{
  color:#2C7CF9;
  height:0.42rem;
  line-height:0.42rem;
  text-align:center;
  margin-bottom:0.14rem;
  font-weight:bold;
  font-size:15px;
}
.retired .content .box-content{
 max-height:5.64rem;
  overflow-y:scroll;
}

::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  border-radius: 5px ;

}
.retired .content ul::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  background:#DEEBFE;
  border-radius: 5px ;
}
.retired .content ul::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 0px rgba(255,255,255,1);
    border-radius: 0;
    background: #ffffff;;
}
.close_btn{
  margin-top:0.4rem;
  text-align:center;
  position:fixed;
  bottom:-1.42rem;
  left:0.54rem;
  right:0.54rem;
}
.colse{
  display:inline-block;
  font-size:1.02rem;
  color:#fff;
}
 .table{
   border: 0.02rem solid #ebebeb;
   margin-top: 0.12rem;
 }
.table li{
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  color: #979797;
  /*border-bottom: 0.02rem solid #ebebeb;*/
  line-height: 0.33rem;
}
  .lineheight30,.table li,.original{
    /*line-height: 0.5rem;*/
  }
  .textLeft{
    text-align: left;
  }
  .dt{
    width:1.2rem;
    text-align: center;
  }
  .dd{
    /*width:3rem;*/
  }

  /*行李额*/
 .baggageAllowance{
   display: flex;
   flex-direction: row;
   align-items: center;
   margin-bottom: 0.34rem;
   font-weight: normal;
 }
  .baggageAllowance .ba_mark{
    width:1.06rem;
    height: 0.48rem;
    line-height: 0.48rem;
    text-align: center;
    border:0.02rem solid #2C7CF9;
    border-radius: 0.08rem;
    color:#2C7CF9;
    margin-right: 0.19rem;
  }
  .rulename,.ruleRemark{
    margin: 0.19rem 0 0.12rem;
  }
 /*关闭按钮 弹出层*/
 .close_btn .iconfont{
   font-size: 1.02rem;
 }

</style>
