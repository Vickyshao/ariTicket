<template>
  <transition name="fold">
     <div class="sele_add">
        <div class="sure_cancel">
          <span class="cancel fontSize30" @click="fnCancel">取消</span><span class="add_ren fontSize32">选择乘机人</span><span class="sure fontSize30" @click="fnSure">确定</span>
        </div>
        <div class="add" @click="add">
          <span class="iconfont icon-tianjia"></span><span class="text fontSize30">新增乘机人</span>
        </div>
        <div class="user_list" :class="{'active':air_men}">
          <ul ref="user_list">
            <li v-for="(item,index) in resData" @click.stop.prevent="more(item.Id,index)" :class="{'cur-hook':crewsArr.indexOf(item.Id) > -1}">
              <span class="iconfont icon-xiugai icon_style" @click.stop.prevent="editor(index)"></span>
              <div class="user_info" :class="{'fontColor':$store.state.duoPage.crewsArr.indexOf(index) > -1}">
                <span class="userName fontSize30">{{item.Name}}
                  <em v-if="item.PersonType===2" class="userChd color97">儿童</em>
                </span>
                <span class="tel fontSize30 Arial"  v-if="false">138****0998</span>
                <p class="fontSize30">
                  <span class="text fontSize30">{{item.PsptName}}</span>
                  <span class="card fontSize30 Arial" >{{item.PsptId}}</span>
                </p>
              </div>
              <span class="iconfont check" :class="{'icon-duoxuankuangweixuan':crewsArr.indexOf(item.Id) == -1,'icon-duoxuankuangyixuan':crewsSelect&&crewsArr.indexOf(item.Id) > -1}" ></span>
            </li>
          </ul>
        </div>
    </div>
  </transition>

</template>
<script type="text/ecmascript-6">
import { mapState, mapMutations } from 'vuex';
import { getAge } from '@/common/js/util.js'
  export default {
    name: 'sele_add',
    data() {
      return{
        resData:[],
        personNum:5,            //乘机人数 最多不能超过的的最大数
      }
    },
    mounted(){
      this.initData();
    },
    computed:{
      ...mapState({
        air_men:state => state.duoPage.air_men,
        air_ren:state => state.duoPage.air_ren,
        crews:state => state.duoPage.crews,//乘机人
        crewsArr:state => state.duoPage.crewsArr,//乘机人
        crewsSelect:state =>state.order.crewsSelect,  //选择乘机样式是否激活
        smallTicketsNum:state =>state.order.smallTicketsNum,//余票取少的值 （主要考虑返程）
        cabin:state =>state.order.cabin,   //舱位信息,
        cabinReturn:state =>state.order.cabinReturn,                  //返程舱位信息,
      })
    },
    methods: {
      ...mapMutations([
        'modalShow',
        'ediInfo',//编辑乘机人
      ]),
      //单选
      more(num,index){
        let itemArr = this.$store.state.duoPage.crewsArr
        if(itemArr.indexOf(num)>-1){
          itemArr.splice(itemArr.indexOf(num),1);
        }else{
            itemArr.push(num);
        }
      },
      //编辑
      editor(index){
        this.$router.push({path:'/EditorMan'})
        this.$store.commit('ediInfo',this.resData[index])
      },
      //跳转新增地址页
      add(){
        //this.$store.state.duoPage.add_contact = true;
        this.$router.push({path:'/AddMan'})
      },

      //取消添加联系人
      fnCancel(){
        this.$store.state.duoPage.air_men = false;
        this.$store.state.duoPage.crewsArr = [];
        this.$store.state.duoPage.crews = [];
      },
      //添加联系人
      fnSure(){
        // console.log('点击了确定');
        let user_list = this.$refs.user_list.children;
        let itemArr = this.$store.state.duoPage.crews;
        let arr=[],
            lenSelected=0;
        for(let i = 0;i<user_list.length;i++){
          if(user_list[i].classList.contains('cur-hook')){
            arr.push(this.resData[i]);
            lenSelected+=1;
          }
        }
        //乘机人 总人数限制 maxPsgCnt 航司规定最大人数  0，9是不限
        if(this.cabin.maxPsgCnt!==0&&this.cabin.maxPsgCnt!==9){
          this.personNum=this.cabin.maxPsgCnt<5?this.cabin.maxPsgCnt:5;     //取最小值
        }
        if(this.cabinReturn.maxPsgCnt!==0&&this.cabinReturn.maxPsgCnt!==9){ //如果有返程 取最小值
          this.personNum=this.cabinReturn.maxPsgCnt<this.personNum?this.cabinReturn.maxPsgCnt:this.personNum;
        }
        if(arr.length>this.personNum){
          this.$store.dispatch('modalCountdown','乘机人最多不能超过'+this.personNum+'人！'); //带倒计时的消息框
          return false;
        }
        //乘机人数不能大于余票数
        if(this.smallTicketsNum!='>9'){
          if(lenSelected>this.smallTicketsNum){
            this.$store.dispatch('modalCountdown','乘机人数不能大于余票数！'); //带倒计时的消息框
            return false;
          }
        }
//        判断是否支持儿童 不支持返回重选 2不支付儿童
        if(this.cabin.applicableTravelerCategory===2||this.cabinReturn.applicableTravelerCategory===2){
//          console.log('有儿童吗？')
          let vm=this,
              isChd=true;
          arr.forEach(function (item) {
            if(item.PersonType===2){
              vm.$store.dispatch('modalCountdown','您选择的航班不支持儿童票！'); //带倒计时的消息框
              isChd=false;
            }
          });
          if(!isChd){
            return false;
          }
        }
        //一个大人最多可带两名儿童
        let audLen=0;
        let chdLen=0;
        arr.forEach(function (item){
            if(item.PersonType===2){
              chdLen++;
            }
            else if(item.PersonType===1){
              audLen++;
            }
        });
//        console.log('成人:'+audLen);
//        console.log('儿童:'+chdLen);
        if(chdLen>audLen*2){
          this.$store.dispatch('modalCountdown','一个成人最多可带2名儿童！');
          return false;
        }
        //      满足以上条件就选中
        this.$store.state.duoPage.air_men = false;
        this.$store.commit('UPDATE_CREWS',arr);//乘机人选中的重新赋值
      },
      //初始化数据 initData
      initData: async function () {
        this.$store.commit('loadingShow','拼命加载中');
       let params = {
       }
       let res = await this.$root.http.get('tourist/list', params,this);
       if(res.data.success){
          this.resData = res.data.data;
         this.resData.forEach(function (item) {
           let age=getAge(item.Birthday);
           if(age>=12){
             // console.log('成人');
             var obj=Object.assign(item,{PersonType:1});
           }
           else{
             // console.log('儿童');
             var obj=Object.assign(item,{PersonType:2});
           }
         });
       }else{
          // this.$router.push({path:'/err',query:{Msg:encodeURIComponent(res.data.msg)}})
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
    flex:0 0 1.8rem;
    width:1.8rem;
    color:#2C7CF9;
    font-weight:bold;
    text-align:center;
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
    position: relative;
  }
  .sele_add .user_list li .user_info .userChd{
    position: absolute;
    top: 0;
    right: -0.8rem;
    /*border: 0.02rem solid #C0191F;*/
    border-radius: 0.08rem;
    width: 0.8rem;
    text-align: center;
    font-weight: normal;
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
  .sele_add .user_list li .icon-duoxuankuangyixuan,.sele_add .user_list li .check.icon-duoxuankuangyixuan {
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
