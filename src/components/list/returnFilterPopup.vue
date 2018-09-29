<template>
  <section class="filterPopup">
    <div :class="{show:isShow}" class="mask"></div>
    <section :class="{show:isShow}" class="filterList">
      <div class="topOpt fontSize30">
        <span class="ml30" @click="filterCancel">取消</span>
        <span :class="{gray:isAnyJC&&isAnySJ&&isAnyHKGS&&isAnyJX}" class="clearSelected fontSize30" @click="clearSelected">清空已选</span>
        <span class="mr30" @click="selectedOk">确定</span>
      </div>
      <div class="bottomList">
        <ul class="listLeft color97">
          <li v-for="(name,index) in queryClass" :class="{cur:iscur==index}" @click="iscur=index">
            <span v-show="arrow(index)" class="arrow mr5"></span>
            <span :class="{colorBlue:arrow(index)}">{{name}}</span>
          </li>
        </ul>
        <div class="listWrap">
          <!--机场-->
          <section :class="{cur:iscur==0}">
            <div @click="setAny('jc')" class="any">
              <span>不限</span>
              <div>
                <i v-if="isAnyJC" class="icon iconfont icon-danxuankuangyixuan colorBlue"></i>
                <i class="icon iconfont icon-danxuankuangweixuan colorD3" v-else></i>
              </div>
            </div>
            <div class="dptStyle">
              <div class="color97 lineBtm">起飞机场</div>
              <li v-for="item in airport.departAirport" @click="item.isSelected=!item.isSelected">
                <span :class="{colorBlue:item.isSelected}">{{item.name}}机场</span>
                <div>
                  <i v-if="item.isSelected" class="icon iconfont icon-danxuankuangyixuan colorBlue"></i>
                  <i class="icon iconfont icon-danxuankuangweixuan colorD3" v-else></i>
                </div>
              </li>
            </div>
            <div class="arvStyle">
              <div class="color97 lineBtm">到达机场</div>
              <li v-for="item in airport.arriveAirport" @click="item.isSelected=!item.isSelected">
                <span :class="{colorBlue:item.isSelected}">{{item.name}}机场</span>
                <div>
                  <i v-if="item.isSelected" class="icon iconfont icon-danxuankuangyixuan colorBlue"></i>
                  <i class="icon iconfont icon-danxuankuangweixuan colorD3" v-else></i>
                </div>
              </li>
            </div>
          </section>
          <!--起飞时间-->
          <section :class="{cur:iscur==1}">
            <div @click="setAny('sj')" class="any">
              <span>不限</span>
              <div>
                <i v-if="isAnySJ" class="icon iconfont icon-danxuankuangyixuan colorBlue"></i>
                <i class="icon iconfont icon-danxuankuangweixuan colorD3" v-else></i>
              </div>
            </div>
            <div class="detTime">
              <li v-for="item in dpttureTimeArr" @click="item.isSelected=!item.isSelected">
                <span :class="{colorBlue:item.isSelected}">{{item.period}}</span>
                <div>
                  <i v-if="item.isSelected" class="icon iconfont icon-danxuankuangyixuan colorBlue"></i>
                  <i class="icon iconfont icon-danxuankuangweixuan colorD3" v-else></i>
                </div>
              </li>
            </div>
          </section>
          <!--航空公司-->
          <section :class="{cur:iscur==2}">
            <div @click="setAny('hkgs')" class="any">
              <span>不限</span>
              <div>
                <i v-if="isAnyHKGS" class="icon iconfont icon-danxuankuangyixuan colorBlue"></i>
                <i class="icon iconfont icon-danxuankuangweixuan colorD3" v-else></i>
              </div>
            </div>
            <div class="airline">
              <li v-for="item in airLineArr" @click="item.isSelected=!item.isSelected">
                <div class="airlineLeft">
                  <span class="pic"><img :src="item.logo"/></span>
                  <span :class="{colorBlue:item.isSelected}">{{item.company}}{{item.shorthand}}</span>
                </div>
                <div>
                  <i v-show="item.isSelected" class="icon iconfont icon-danxuankuangyixuan colorBlue"></i>
                  <i v-show="!item.isSelected" class="icon iconfont icon-danxuankuangweixuan colorD3"></i>
                </div>
              </li>
            </div>
          </section>
          <!--机型-->
          <section :class="{cur:iscur==3}">
            <div @click="setAny('jx')" class="any">
              <span>不限</span>
              <div>
                <i v-if="isAnyJX" class="icon iconfont icon-danxuankuangyixuan colorBlue"></i>
                <i class="icon iconfont icon-danxuankuangweixuan colorD3" v-else></i>
              </div>
            </div>
            <li v-for="item in modelArr" @click="item.isSelected=!item.isSelected">
              <span :class="{colorBlue:item.isSelected}">{{item.name}}</span>
              <div>
                <i v-if="item.isSelected" class="icon iconfont icon-danxuankuangyixuan colorBlue"></i>
                <i class="icon iconfont icon-danxuankuangweixuan colorD3" v-else></i>
              </div>
            </li>
          </section>
        </div>
      </div>
    </section>
  </section>
</template>
<script>
  import { mapState, mapMutations } from 'vuex';
  export default {
    data(){
      return{
        iscur:0,
        queryClass:['机场','起飞时间','航空公司','机型'],
        airport:{
          departAirport:[],
          arriveAirport:[]
        },
        dpttureTimeArr:[
          {
            period:'00:00~06:00',
            isSelected:false
          },
          {
            period:'06:00~12:00',
            isSelected:false
          },
          {
            period:'12:00~18:00',
            isSelected:false
          },
          {
            period:'18:00~24:00',
            isSelected:false
          },
        ],
        airLineArr:[],
        modelArr:[]
      }
    },
    props:['isShow'],
    computed:{
      ...mapState({
        airline:state =>state.returnList.filterList.airline,
        orgAirport:state =>state.returnList.filterList.orgAirport,
        dstAirport:state =>state.returnList.filterList.dstAirport,
        craftType:state =>state.returnList.filterList.craftType,
        queryAllCityList:state =>state.returnList.queryAllCityList,
        showCityList:state =>state.returnList.showCityList,
      }),
      //机场
      isAnyJC:function () {
        var isany=true;
        this.airport.departAirport.forEach(function (item) {
          if(item.isSelected){
            isany=false;
          }
        });
        this.airport.arriveAirport.forEach(function (item) {
          if(item.isSelected){
            isany=false;
          }
        });
        return isany;
      },
      //起飞时间
      isAnySJ:function () {
        var isany=true;
        this.dpttureTimeArr.forEach(function (item) {
          if(item.isSelected){
            isany=false;
          }
        });
        return isany;
      },
      //航空公司
      isAnyHKGS:function () {
        var isany=true;
        this.airLineArr.forEach(function (item) {
          if(item.isSelected){
            isany=false;
          }
        });
        return isany;
      },
      //机型
      isAnyJX:function () {
        var isany=true;
        this.modelArr.forEach(function (item) {
          if(item.isSelected){
            isany=false;
          }
        });
        return isany;
      }
    },
    created:function(){
      let vm=this;
      //从后台拿的筛选条件 赋值
      //机场
      this.airport.departAirport=[];    //清空
      this.orgAirport.forEach(function (item) {
        var obj={
          name:item.orgAirportShortName,
          isSelected:false
        }
        vm.airport.departAirport.push(obj);
      });
      this.airport.arriveAirport=[];
      this.dstAirport.forEach(function (item) {
        var obj={
          name:item.dstAirportShortName,
          isSelected:false
        };
        vm.airport.arriveAirport.push(obj);
      });
      //航空公司
      this.airLineArr=[];   //清空
      this.airline.forEach(function (item) {
        var obj={
          logo:item.carrierLogo,
          company:item.airlineCompany,
          shorthand:item.airlineIataCode,
          isSelected:false
        };
        vm.airLineArr.push(obj);
      });
      //机型
      this.modelArr=[];
      this.craftType.forEach(function (item) {
        var obj={
          name:item.flightType,
          isSelected:false
        };
        vm.modelArr.push(obj);
      });

    },
    methods:{
//      ...mapMutations([
//        'UPDATELOADING_RETURN',
//        'INIT_FLIGHTS_RETURN',
//        'FILTER_FLIGHTS_RETURN',
//        'UPDATE_FILTER_RETURN'
//      ]),
      arrow:function (i) {
        //i=0是机场 1起飞时间 2航空公司 3机型 如果返回御前true左边列表前的小蓝点显示
        switch(i){
          case 0:
            if(!this.isAnyJC){
              return true
            }
            else {
              return false
            }
            break;
          case 1:
            if(!this.isAnySJ){
              return true
            }
            else {
              return false
            }
            break;
          case 2:
            if(!this.isAnyHKGS){
              return true
            }
            else {
              return false
            }
            break;
          case 3:
            if(!this.isAnyJX){
              return true
            }
            else {
              return false
            }
            break;
        }
      },
      //单击 不限
      setAny:function (str) {
        //机场
        if(str=='jc'){
          this.airport.departAirport.forEach(function (item) {
            item.isSelected=false;
          });
          this.airport.arriveAirport.forEach(function (item) {
            item.isSelected=false;
          });
        }
        //起飞时间
        if(str=='sj'){
          this.dpttureTimeArr.forEach(function (item) {
            item.isSelected=false;
          });
        }
        //航空公司
        if(str=='hkgs'){
          this.airLineArr.forEach(function (item) {
            item.isSelected=false;
          });
        }
        //机型
        if(str=='jx'){
          this.modelArr.forEach(function (item) {
            item.isSelected=false;
          });
        }
      },
      //点击取消
      filterCancel:function () {
        var obj={
          isShowPopup:false
        }
        this.$emit('listenEventFilter',obj);
      },
      //清空已选
      clearSelected:function () {
        //jc:机场 sj:起飞时间 hkgs:航空公司 jx:机型
        this.$options.methods.setAny.bind(this)('jc');
        this.$options.methods.setAny.bind(this)('sj');
        this.$options.methods.setAny.bind(this)('hkgs');
        this.$options.methods.setAny.bind(this)('jx');
      },
      //筛选条件有变化时 重新赋值
      updateFilter:function(){
        let vm=this;
        //从后台拿的筛选条件 赋值
        //机场
        this.airport.departAirport=[];    //清空
        this.orgAirport.forEach(function (item) {
          var obj={
            name:item.orgAirportShortName,
            isSelected:false
          }
          vm.airport.departAirport.push(obj);
        });
        this.airport.arriveAirport=[];
        this.dstAirport.forEach(function (item) {
          var obj={
            name:item.dstAirportShortName,
            isSelected:false
          };
          vm.airport.arriveAirport.push(obj);
        });
        //航空公司
        this.airLineArr=[];   //清空
        this.airline.forEach(function (item) {
          var obj={
            logo:item.carrierLogo,
            company:item.airlineCompany,
            shorthand:item.airlineIataCode,
            isSelected:false
          };
          vm.airLineArr.push(obj);
        });
        //机型
        this.modelArr=[];
        this.craftType.forEach(function (item) {
          var obj={
            name:item.flightType,
            isSelected:false
          };
          vm.modelArr.push(obj);
        });
      },
      selectedOk:function () {
        var orgAirport=[],    //出发机场
            dstAirport=[],    //到达机场
            time=[],          //时间
            airline=[],       //航空公司
            craftType=[];     //机型
        //出发机场
        if(!this.isAnyJC){
          this.airport.departAirport.forEach(function (item) {
            if(item.isSelected){
              orgAirport.push(item.name);
            }
          })
        }
        //到达机场
        if(!this.isAnyJC){
          this.airport.arriveAirport.forEach(function (item) {
            if(item.isSelected){
              dstAirport.push(item.name);
            }
          })
        }
        //时间
        if(!this.isAnySJ){
          this.dpttureTimeArr.forEach(function (item) {
            if(item.isSelected){
              time.push(item.period);
            }
          })
        }
        //航空公司
        if(!this.isAnyHKGS){
          this.airLineArr.forEach(function (item) {
            if(item.isSelected){
              airline.push(item.shorthand);
            }
          })
        }
        //机型
        if(!this.isAnyJX){
          this.modelArr.forEach(function (item) {
            if(item.isSelected){
              craftType.push(item.name);
            }
          })
        }
//        console.log('出发机场：'+orgAirport);
//        console.log('到达机场：'+dstAirport);
//        console.log('时间：'+time);
//        console.log('航空公司：'+airline);
//        console.log('机型：'+craftType);

        if(orgAirport.length===0&&dstAirport.length===0&&time.length===0&&airline.length===0&&craftType.length===0){
          this.$store.commit('UPDATEASALL_RETURN');   //重新加载全部数据
          this.$store.commit('ERROR_HIDDEN');       //错误页隐藏
//          console.log('为什么没隐藏');
//          console.log('全部为空');

          this.$options.methods.filterCancel.bind(this)();
//          console.log('到底想怎么样');
          this.$store.commit('ISHASFILTER_RETURN',2);    //筛选灰掉样式
          return;
        }
//        console.log('怎么回事啊');
        //有一个选中的就高亮显示
        if(orgAirport.length!=0||dstAirport.length!=0||time.length!=0||airline.length!=0||craftType.length){
          this.$store.commit('ISHASFILTER_RETURN',1);    //筛选高亮样式
        }
        //条件过滤函数
        var queryFlyList=function (item,index,oldArr) {
//          console.log('哈哈，我进来了呀');
//          console.log('我是筛选的起飞机场:'+item.orgAirportShortName);
          var isOrgAirport=false,     //起飞机场
            isDstAirport=false,       //到达机场
            isTime=false,             //时间
            isAirline=false,          //航空公司
            isCraftType=false;        //机型
          //匹配起飞机场
          if(orgAirport.length==0){
            isOrgAirport=true;
          }
          else{
            for(var i=0;i<orgAirport.length;i++){
              if(orgAirport[i]==item.orgAirportShortName){
                isOrgAirport=true;
              }
            }
          }
          //匹配到达机场
          if(dstAirport.length==0){
            isDstAirport=true;
          }
          else{
            for(var i=0;i<dstAirport.length;i++){
              if(dstAirport[i]==item.dstAirportShortName){
                isDstAirport=true;
              }
            }
          }
          //匹配起飞时间
          if(time.length==0){
            isTime=true;
          }
          else{
            for(var i=0;i<time.length;i++){
              var timeArr=time[i].split("~");
              if(item.departTime>=timeArr[0]&&item.departTime<=timeArr[1]){
                isTime=true;
              }
            }
          }
          //匹配航空公司
          if(airline.length==0){
            isAirline=true;
          }
          else{
            for(var i=0;i<airline.length;i++){
              if(airline[i]===item.airlineIataCode){
                isAirline=true;
              }
            }
          }
          //匹配机型
          if(craftType.length==0){
            isCraftType=true;
          }
          else{
            for(var i=0;i<craftType.length;i++){
              if(craftType[i]==item.flightType){
                isCraftType=true;
              }
            }
          }

          //最终筛选结果
          if(isOrgAirport && isAirline && isDstAirport && isTime && isCraftType){
            return true;
          }
          else{
            return false;
          }
        }
//        console.log('你想干嘛？');
        //过滤 符合条件的数组 newsFlyList
        var newsFlyList=this.queryAllCityList.filter(queryFlyList);
        //更新 最终数组
        this.$store.commit('FILTER_FLIGHTS_RETURN',newsFlyList);
        if(this.showCityList.length===0){
          this.$store.commit('ERROR_SHOW','没有您要查询的航班了')
        }
        else{
          this.$store.commit('ERROR_HIDDEN');       //错误页隐藏
//          console.log('为什么没隐藏');
        }

        this.$options.methods.filterCancel.bind(this)();
      }
    },
    watch:{
      airline:function (val,oldval) {
        this.$options.methods.updateFilter.bind(this)();
      },
      orgAirport:function (val,oldval) {
        this.$options.methods.updateFilter.bind(this)();
      },
      dstAirport:function (val,oldval) {
        this.$options.methods.updateFilter.bind(this)();
      },
      craftType:function (val,oldval) {
        this.$options.methods.updateFilter.bind(this)();
      },
    }

  }
</script>
<style>
  /*筛选*/
  .filterList{
    width:7.5rem;
    position: fixed;
    left: 0;
    bottom:0;
    z-index: 2000;
    display: none;
  }
  .filterList .topOpt{
    width:7.5rem;
    height:0.9rem;
    background:linear-gradient(to right,rgba(44,124,249,1),rgba(79,176,251,1));
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    color: #fff;
  }
  .filterList .bottomList{
    width:7.5rem;
    height:4.6rem;
    background:rgba(255,255,255,1);
    display: flex;
    flex-direction: row;
    font-size: 0.28rem;
  }
  .listLeft{
    width:2.08rem;
    height: 4.6rem;
    background:rgba(246,246,246,1);
  }
  .listLeft li,.listWrap li,.lineBtm,.any{
    height: 0.9rem;
    border-bottom: 1px solid #ebebeb;
    line-height: 0.9rem;
    display: flex;
    flex-direction: row;
    align-items: center;

  }
  .listLeft li{
    justify-content: center;
    color: #979797;
  }
  .listLeft li.cur{
    background: #fff;
    color:#2C7CF9;
  }
  .arrow{
    width:0.1rem;
    height: 0.1rem;
    background: #2C7CF9;
    border-radius: 50%;
    display: block;
  }
  .listWrap{
    width:5rem;
    margin-left: 0.2rem;
    height: 4.6rem;
    overflow: scroll;
    font-size: 0.28rem;
  }
  .listWrap li,.any{
    justify-content: space-between;
    color: #535353;
  }
  .listWrap li .iconfont{
    font-size: 0.5rem;
  }
  .any .iconfont{
    font-size: 0.5rem;
  }
  .listWrap .cur{
    display: block;
  }
  .listWrap section{
    display: none;
  }
  .airline .pic{
    width:0.3rem;
    display: block;
    margin-right: 0.08rem;
  }
  .airline .pic img{
    vertical-align: middle;
    margin-top: -0.07rem;
  }
  .airlineLeft{
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .show{
    display: block;
  }
  .clearSelected{
    width:2.05rem;
    height:0.55rem;
    border-radius: 0.1rem;
    line-height: 0.5rem;
    text-align: center;
    border:0.02rem solid #fff;
    color: #fff;
  }
  .clearSelected.gray{
    border:0.02rem solid #95BDFC;
    color: #95BDFC;
  }
</style>
