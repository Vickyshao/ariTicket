<template>
     <div class="sele_addr">
        <div class="user_list">
          <ul>
            <li v-for="(item,index) in crews" @click.stop.prevent="fnDetail(index)" >
              <span class="iconfont icon-shanchu icon_style" @click.stop.prevent="del(item.Id)"></span>
              <div class="user_info">
                <span class="userName fontSize30">
                  {{item.Name}}
                  <em v-if="item.PersonType===2" class="userChd color97">儿童</em>
                </span>
                <!--<span class="tel fontSize30 Arial" v-if="false">138****0998</span>-->
                <p class="fontSize28">
                  <span class="text fontSize28">{{item.PsptName}}</span>
                  <span class="card fontSize28 Arial" > {{item.PsptId}}</span>
                </p>
              </div>
              <span class="iconfont icon-xiangyou"></span>
            </li>
          </ul>
        </div>
    </div>


</template>
<script type="text/ecmascript-6">
import { mapState, mapMutations } from 'vuex';
  export default {
    name: 'sele_addr',
    data() {
      return{
        arr:[],

      }
    },
    computed:{
      ...mapState({
        crews:state => state.duoPage.crews,//乘机人
        crewsArr:state => state.duoPage.crewsArr,//乘机人
        eventOri:state => state.duoPage.eventOri,//从order点击跳到编辑页面
        userInfo:state => state.duoPage.userInfo,//编辑乘机人
      })
    },
    methods: {
      ...mapMutations([
        'modalShow'
      ]),
      //单选
     fnDetail(index){
        this.$store.state.duoPage.userInfo = this.$store.state.duoPage.crews[index]
        this.$store.state.duoPage.eventOri = true;
        this.$router.push({path:'/EditorMan'})
      },
      // 删除
      del(index){
        // console.log(index);
        let vm=this,
            chdLen=0,
            auldLen=0;
        // 统计人数 成人与儿童
        this.crews.forEach(function (item) {
          if(item.personType===1){
            auldLen++;
          }
          else if(item.personType===2) {
            chdLen++;
          }
        });
        //如果成人数大于儿童数2倍 可以删除
        this.crews.forEach(function (item, i, array) {
          if(item.Id===index){
            if(item.personType===1&&(chdLen>2*(auldLen-1))){
              vm.$store.dispatch('modalCountdown','一个成人最多可带2名儿童！');
            }
            else{
              vm.$store.state.duoPage.crews.splice(i,1);
              vm.$store.state.duoPage.crewsArr.splice(vm.crewsArr.indexOf(index),1);
            }
          }
        });
      },
    },
  }
</script>
<style >
  .sele_addr{
    position: relative;
    background:#fff;
  }

  .sele_addr .user_list li{
    display:flex;
    flex-direction: row;
    align-items:center;
    background:#fff;
    height:1.18rem;
    border-bottom:0.02rem solid #EBEBEB;
  }
  .sele_addr .user_list li:last-child{
     border-bottom:none;
  }
  .sele_addr .user_list li span{
    display:inline-block;
  }
  .sele_addr .user_list li .icon_style{
    flex:0 0 0.4rem;
    width:0.4rem;
    font-size:0.4rem;
    margin-right:0.25rem;
    color:#2C7CF9;
  }
  .sele_addr .user_list li .user_info{
    flex:1;
  }
  .sele_addr .user_list li .user_info span{
    font-weight:bold;
    color:#535353;
    height:0.42rem;
    line-height:0.42rem;
  }
  .sele_addr .user_list li .user_info .userName{
    font-weight:bold;
    color:#535353;
    margin-right:0.24rem;
    height:0.42rem;
    line-height:0.42rem;
    position: relative;
  }
 .sele_addr .user_list li .user_info p{
    color:#979797;
    height:0.42rem;
    line-height:0.42rem;
  }
  .sele_addr .user_list li .user_info p span{
    color:#979797;
    height:0.42rem;
    line-height:0.42rem;
    font-weight:normal;
    font-size:0.28rem;
  }
  .sele_addr .user_list li .check{
    flex:0 0 0.5rem;
    width:0.5rem;
    color:#D3D3D3;
    font-size:0.5rem;
  }
  .sele_addr .user_list li .icon-xiangyou{
     flex:0 0 0.25rem;
     width:0.25rem;
     color:#C1C2C3;
     font-size:0.25rem;
  }
</style>
