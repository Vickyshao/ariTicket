<template>
<div class="city_container">
   <transition name="cityFold">
    <div class="city_choice" >
      <h3 class="fontSzie32">配送至</h3>
      <div class="nav">
        <ul class="clearfix" ref="tab">
          <li class="show active" @click="tab(0)">请选择</li>
          <li @click="tab(1)">请选择</li>
          <li @click="tab(2)">请选择</li>
          <!-- <li @click="tab(3)">请选择</li> -->
        </ul>
      </div>
      <div class="city_content" v-show="next === 0">
        <ul ref="citya">
          <li v-for = "(item,index) in provinceData" @click="selted($event,item, 0)" ><span class="city_name">{{item.name}}</span><span class="iconfont icon-gouxuan radioed"></span></li>
        </ul>
      </div>
      <div class="city_content" v-show="next === 1">
        <ul ref="cityb">
          <li v-for = "(item,index) in cityData" @click="selted($event,item, 1)"><span class="city_name">{{item.name}}</span><span class="iconfont icon-gouxuan radioed"></span></li>
        </ul>
      </div>
      <div class="city_content" v-show="next === 2">
        <ul ref="cityc">
          <li v-for = "(item,index) in areaData" @click="selted($event,item, 2)"><span class="city_name">{{item.name}}</span><span class="iconfont icon-gouxuan radioed"></span></li>
        </ul>
      </div>
      <!-- <div class="city_content" v-if="next === 3">
        <ul ref="city">
          <li v-for = "(item,index) in countyData" @click="selted($event,item, 3)"><span class="city_name">{{item.name}}</span><span class="iconfont icon-gouxuan radioed"></span></li>
        </ul>
      </div> -->
      
    </div> 
  </transition> 
  <div class="maska" @click="$store.state.duoPage.isShipShow = false"></div>
</div>
 
</template>

<script type="text/ecmascript-6">
 import { mapState, mapMutations } from 'vuex';
  export default {
    name: 'cityChoice',
    data(){
      return{
        cur:0,
        next:0,
        provinceData:[],//省份城市数据
        cityData:[],//市数据
        areaData:[],//区的数据
        countyData:[],//县的数据
        depart:{
          provinceVal:'',//tab 省份的值
          cityVal:'',//tab 市的值
          areaVal:'',//tab 区的值
          special:'',//直辖市
        }
        
      }
    },
    computed:{
      ...mapState({
        modal: state =>state.modal.modal,
        msg: state => state.modal.msg,
        address_str: state => state.duoPage.address_str,
        isShipShow:state =>state.duoPage.isShipShow,//配送地址显示隐藏
        Area:state =>state.order.Area,//省市区
      }),
    },
    mounted(){
     this.province();
    },
     methods: {
      ...mapMutations([
        'modalShow',
        'modalHide',
      ]),
      //选择城市
      selted(event,obj,num){
        let tab = this.$refs.tab.children;
        let lena = this.$refs.citya.children.length;
        let lenb = this.$refs.cityb.children.length; 
        let lenc = this.$refs.cityc.children.length;
        if(num ===0){
          this.city(obj);
          //当前选择省份
          for(let i = 0; i < lena; i++){
            this.$refs.citya.children[i].classList.remove('active')
          };
          //选择省份还原导航信息
          for(let j=1;j<tab.length;j++){
            tab[j].innerText = '请选择';
            tab[j].classList.remove('active');
            tab[j].classList.remove('show');
          };
          //将市区 、县选中清楚
          for(let i = 0; i < lenb; i++){
            this.$refs.cityb.children[i].classList.remove('active')
          }
          for(let i = 0; i < lenc; i++){
            this.$refs.cityc.children[i].classList.remove('active')
          }  
          this.depart.provinceVal = obj.name; 
          this.depart.cityVal = ""  
          this.depart.areaVal = ""
          this.depart.special = ""
        }else if(num ===1){
          this.area(obj);
           for(let i = 0; i < lenb; i++){
            this.$refs.cityb.children[i].classList.remove('active')
          };
          //选择省份还原导航信息
          for(let j=2;j<tab.length;j++){
            tab[j].innerText = '请选择';
            tab[j].classList.remove('active');
            tab[j].classList.remove('show');
          };
          for(let i = 0; i < lenc; i++){
            this.$refs.cityc.children[i].classList.remove('active')
          }  
          if(obj.name === '市辖区' || obj.name === '县'){
            this.depart.special = obj.name;
          }else{
            this.depart.cityVal = obj.name;
            this.depart.special = obj.name; 
          }
            
        }else{
          for(let i = 0; i < lenc; i++){
            this.$refs.cityc.children[i].classList.remove('active')
          } ;
          this.depart.areaVal = obj.name;
          this.$store.state.duoPage.isShipShow =  false;
        } 
       
        this.cur =  num;    
        tab[num].innerText = obj.name;
        tab[num].classList.remove('active');
        if(num === 2){  
          tab[num].classList.add('active');
        }else{
          this.next = num + 1
          tab[num + 1].classList.add('active');
          tab[num + 1].classList.add('show');
        }
        event.target.parentNode.className = 'active'; 
        if(num == 2){
          this.$store.state.duoPage.address_str = this.depart.provinceVal + this.depart.cityVal + this.depart.areaVal;
          this.$store.state.order.Area = this.depart;
        }
        
      },
      //省份接口请求
      province: async function () {
       this.$store.commit('loadingShow','拼命加载中');  
       let params = {
       }
       let res = await this.$root.http.get('address/getArea', params,this);
       if(res.data.success){
         this.$nextTick(() => {
           this.provinceData = res.data.data;
         })
       }else{
          // this.$router.push({path:'/err',query:{Msg:encodeURIComponent(res.data.msg)}})
       }
      },
      //市的数据接口
      city: async function (obj) {
        this.$store.commit('loadingShow','拼命加载中');  
        let params = {
          "parentid":obj.code,
          "level": parseInt(obj.level)+1
        }
        let res = await this.$root.http.get('address/getArea', params,this);
        if(res.data.success){
          this.$nextTick(() => {
            this.cityData = res.data.data;
          })
        }else{
            // this.$router.push({path:'/err',query:{Msg:encodeURIComponent(res.data.msg)}})
        }
      },
      //市的数据接口
      area: async function (obj) { 
        this.$store.commit('loadingShow','拼命加载中'); 
        let params = {
          "parentid":obj.code,
          "level": parseInt(obj.level)+1
        }
        let res = await this.$root.http.get('address/getArea', params,this);
        if(res.data.success){
          this.$nextTick(() => {
            this.areaData = res.data.data;
          })
        }else{
            // this.$router.push({path:'/err',query:{Msg:encodeURIComponent(res.data.msg)}})
        }
      },
      
      //tab选项卡切换
      tab(num){
        let tab = this.$refs.tab.children;
        for(let i=0;i<tab.length;i++){
          tab[i].classList.remove('active');
        }
        tab[num].classList.add('active');
        this.next = num
      }
    },
    
  }
</script>
<style lang="css">
 /* 模态框 */
  .city_choice{
    position: fixed;
    z-index:10;
    left:0rem;
    bottom:0rem;
    right:0rem;
    background:#fff;
    transition:all 2s ease;
  }
  .cityFold-enter-active,.cityFold-leave-active{
      transition:all 2s ease;
  }     
  .cityFold-enter-active{
    transform:translate3d(0,0,0);
  }       
  .cityFold-enter,.cityFold-leave-active{
    transform:translate3d(0,100%,0);
  }       
  .city_container .maska{
    position: fixed;
    z-index:1 !important;
    left:0rem;
    top:0rem;
    bottom:0rem;
    right:0rem;
    background:rgba(0,0,0,0.4);
  }
  .city_choice h3{
    height:0.9rem;
    line-height:0.9rem;
    color:#DEEBFE;
    background:linear-gradient(rgba(79,176,251,1),rgba(44,124,249,1));
    text-align:center;
  }
  .city_choice .nav ul{
    border-bottom:0.02rem solid #EBEBEB; 
    display:flex;
    flex-direction:row;
    padding-left:0.34rem;
  }
  .city_choice .nav ul li{
    float:left;
    margin-right:0.8rem;
    max-width:1.2rem;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    color:#535353;
    font-size:0.28rem;
    font-weight:bold;
    line-height:0.4rem;
    padding-top:0.33rem;
    padding-bottom:0.11rem;
    display:none;
  }
  .city_choice .nav ul li.show{
    display:block;
  }
  .city_choice .nav ul li.active{
    position: relative;
    top:0.02rem;
    color:#2C7CF9;
    border-bottom:0.04rem solid #2C7CF9
  }
  .city_choice .city_content{
    max-height:7.32rem;
    overflow-x:scroll;
  }
  .city_choice .city_content li{
    display:flex;
    flex-direction:row;
    align-items:center;
    padding:0rem 0.34rem;
  }
  .city_choice .city_content li .city_name{
    flex:1;
    color:#535353;
    font-size:0.28rem;
    font-weight:bold;
    line-height:0.8rem;
  }
  .city_choice .city_content li .radioed{
    flex: 0 0 0.29rem;
    width:0.29rem;
    display:none;
    font-size:0.29rem;
    color:#fff;
  }
  .city_choice .city_content li.active{
    background:#2C7CF9;
  }
  .city_choice .city_content li.active .city_name{
    color:#fff;
  }
  .city_choice .city_content li.active .radioed{
    display:block;
  }
  
</style>
