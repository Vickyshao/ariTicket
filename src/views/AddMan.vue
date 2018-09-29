<template>
    <div class="add_man">
        <h2 v-title="'添加乘机人'"></h2>
      <!--温馨提醒-->
        <p class="reminder">为了确保您能顺利出行，请确保旅行结束日期至少比证件有效期早6个月</p>
        <div class="type_list">
          <ul>
            <li>
              <span class="type fontSize30">姓名</span><input type="text" class="username" placeholder="姓名须和乘机证件一致" ref="userName"><span class="iconfont icon-yiwen" @click="$store.commit('dialogShow',0)"></span>
            </li>
            <li @click="fnPsptType">
              <span class="type fontSize30">证件类型</span><span class="documentaction fontSize30" >{{cardText}}</span><span class="iconfont icon-xiangyou"></span>
            </li>
            <li>
              <span class="type fontSize30" >证件号码</span><input type="text" class="number" placeholder="证件号码需与乘机证件一致" ref="codeNum" @blur="fnBlur()">
            </li>
            <li @click="setDate" v-if="code != 1">
              <span class="type fontSize30">出生日期</span><span class="documentaction fontSize30" >{{date}}</span><span class="iconfont icon-xiangyou"></span>
            </li>
          </ul>
        </div>
        <div class="annotations">
            <!--<span class="baby fontSize28" @click="$store.commit('dialogShow',1)">婴儿乘机人说明</span>-->
            <span class="child fontSize28" @click="$store.commit('dialogShow',2)">儿童预订说明</span>
        </div>
        <div class="sure_btn">
          <div class="del fontSize36" @click="del">删除</div>
          <div class="sure fontSize36" @click="sure">确定</div>
        </div>
        <div class="maska" @click="maskHide()" v-if="cardFlag"></div>
        <transition name="fold">
          <div class="card_type" v-show="cardFlag">
              <ul >
                <li class="fontSize30" v-for="(item,index) in papers" @click="getCardText($event,item.Code)" :class="{'active':changeBg == item.Code}">{{item.Name}}</li>
               </ul>
          </div>
        </transition>
        <v-dialog v-if="dialog && dialogNum == 0">
            <h3 class="fongSize30" slot="title">用户名标准须知</h3>
            <ul slot="userName">
              <li class="fontSize28" >1.乘机人信息需与登记证件信息上的姓名一致；
  </li>
              <li class="fontSize28" >2.中文姓名：若持护照登机，则必须按照护照上的中文姓名填写；姓名中含有生僻字，则除中文姓名外还需填写姓的全拼音、名的全拼音，（如：王赟里 “wang” “yunli”）；
  </li>
              <li class="fontSize28" >3.英文姓名：姓和名之前用“/”分开，并按证件的姓名顺序填写（如：John/Kim）。</li>
            </ul>
        </v-dialog>
        <v-dialog v-if="dialog && dialogNum == 1">
            <h3 class="fongSize30" slot="titlea">婴儿乘机人说明</h3>
            <ul slot="userNamea">
              <li class="fontSize28" >1. 小于2周岁可购婴儿票。
  </li>
              <li class="fontSize28" >2.婴儿购票可使用身份证、户口本、护照等，具体以航班和舱位要求为准。
  </li>
              <li class="fontSize28" >3. 婴儿乘机须有成人陪同，1名成人最多携带1名婴儿。</li>
              <li class="fontSize28" >4. 婴儿不单独占座。</li>
            </ul>
        </v-dialog>
        <v-dialog v-if="dialog && dialogNum == 2">
            <h3 class="fongSize30" slot="titleb">儿童乘机人说明</h3>
            <ul slot="userNameb">
              <li class="fontSize28" >1. 2周岁 （含） -12周岁，（不含） 可购买儿童票。
  </li>
              <li class="fontSize28" >2. 儿童购票可使用身份证、户口本、护照等，具体以航班和舱位要求为准。
  </li>
              <li class="fontSize28" >3. 儿童乘机须有成人陪同，1名成人最多携带2名儿童。</li>
              <li class="fontSize28" >4. 儿童单独乘机请联系航空公司购票。</li>
            </ul>
        </v-dialog>
    </div>
</template>
<script type="text/ecmascript-6">
import { mapState, mapMutations } from 'vuex';
import Dialog from '@/components/Dialog/dialog';
  export default {
    name: 'add_man',
    data() {
      return{
        cardFlag:false,
        cardText:'身份证',
        date:'',
        code:1,
        changeBg:null,
        papers:[],//证件
      }
    },
    computed:{
      ...mapState({
        dialog: state =>state.dialog.dialogFlag,
        dialogNum: state =>state.dialog.dialogNum
      })
    },
    methods: {
      ...mapMutations([
        'dialogShow',
        'modalShow',
      ]),
      //获取当前点击元素
      getCardText(event,num){
        this.cardFlag = false;
        this.cardText = event.target.innerText;
//        console.log(num)
        this.code = num;
        this.changeBg = num;
      },
      //添加乘机人
      sure(){
        let reg = /([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z]){1,20}$/;
        let chi_reg=/^[\u4E00-\u9FA5]+$/;   //全是中文
        let username = this.$refs.userName;
        let codeNum = this.$refs.codeNum;
        String.prototype.trim=function(){
        　　return this.replace(/(^\s*)|(\s*$)/g, "");
        }
        //用户名验证
        if(username.value === ''||username.value === null ){
          this.$store.dispatch('modalCountdown','用户名不能为空');
          return;
        }else if(!reg.test(username.value.trim())){
          this.$store.dispatch('modalCountdown','用户名支持中文英文');
          return;
        }
        else if(chi_reg.test(username.value.trim())){
          if(username.value.length>10){
            this.$store.dispatch('modalCountdown','用户名中文不能超过10个字符！');
            return;
          }
        }
        else if(username.value.length>20){
          this.$store.dispatch('modalCountdown','用户名不能超过20个字符！');
          return;
        }
        //证件号验证
        if(this.cardText === "身份证"){
          let card_reg =/^\d{17}(\d|x)$/ig;
          if(!card_reg.test(codeNum.value.trim())){
            this.$store.dispatch('modalCountdown','身份证号错误');
            return;
          }
        }else if(codeNum.value === ''||codeNum.value === null){
          this.$store.dispatch('modalCountdown','证件号不能为空');
          return;
        }
        else if(codeNum.value.length>30){
          this.$store.dispatch('modalCountdown','证件号长度不能大于30');
          return;
        }

        //不是身份证的时候 出生日期不能为空
        if(this.code == 1){
          this.date = this.getBirthdayFromIdCard(codeNum.value.trim())
        }
        if(this.date === '' || this.date === null){
          this.$store.dispatch('modalCountdown','出生日期必选');
          return;
        }

        //验证通过后提交
          let obj = {
            Name:username.value,//用户名
            PsptName:this.cardText,
            PsptType:this.code,//证件类型
            PsptId:codeNum.value,//证件号
            Tel:'',
            Birthday:this.date,
            PsptType:this.code
          }
          this.initData(obj)

     },
     //初始化数据 initData
     initData: async function (obj) {
      let params = {
        Name:obj.Name,//用户名
        PsptType:obj.PsptType,//证件类型
        PsptId:obj.PsptId,//证件号
        PsptName:obj.PsptName,
        Tel:obj.Tel,
        Birthday:this.date,
        PsptType:this.code
      }
      this.$store.commit('loadingShow','拼命加载中');
      let res = await this.$root.http.post('tourist/add', params,this);

      if(res.data.success){
        this.$router.push({path:'/Order'})
      }else{
        this.$store.commit('modalShow',res.data.msg);
        //return;
      }
     },
     //删除
     del(){
      this.$router.push({path:'/Order'})
     },
     //证件类型
     fnPsptType(){
        this.cardFlag = true;
        this.changeBg = null;
        this.PsptType()
     },
     //获取证件类型数据
     PsptType: async function () {
        this.$store.commit('loadingShow','拼命加载中');
        let params = {

        }
        let res = await this.$root.http.get('/dictionary/PsptType', params,this);

        if(res.data.success){
            this.papers = res.data.data;
        }else{
          this.$store.commit('modalShow',res.data.msg);
          return;
        }
      },
     //点击出生日期显示
     setDate(){
        if(this.code == 1) return;
        let This = this;

        let today=new Date();
        let y=today.getFullYear(),
            m=today.getMonth()+1,
            d=today.getDate()-1,
            endTm=y+'-'+m+'-'+d;
        this.$calendar.show({
            year:[1928,2050],
            date:'1990-1-1',  //初始化时间
            endTime:endTm,  //截至时间
            onOk(data){
               let arr = data.split("-");
               arr[1] = zero(arr[1]);
               arr[2] = zero(arr[2]);
              function zero(str){
                return parseInt(str) < 10 ? "0" + str : str
              }
               data = arr.join('-');
               This.date = data
               This.data= data.year+'-'+data.month+'-'+data.day;
            },
            onCancel(){
                //console.log('取消')
            }
        })
      },
      // 证件号验证失去焦点的时候
      fnBlur(){
        //if(this.code === 1){
        //    let codeNum = this.$refs.codeNum;
        //    let card_reg =/^\d{17}(\d|x)$/ig;
        //    if(!card_reg.test(codeNum.value)){
        //      this.$store.commit('modalShow','身份证号错误');
        //      return;
        //    };
        //    this.date = this.getBirthdayFromIdCard(codeNum.value)
        //  }
      },
      // 身份证截取出生日期
      getBirthdayFromIdCard(idCard) {
        let birthday = "";
        if(idCard != null && idCard != ""){
            if(idCard.length == 15){
                birthday = "19"+idCard.substr(6,6);
            } else if(idCard.length == 18){
                birthday = idCard.substr(6,8);
            }

            birthday = birthday.replace(/(.{4})(.{2})/,"$1-$2-");
        }

        return birthday;
      },
      maskHide(){
        this.cardFlag = false;
        this.changeBg = null;
      }

    },
    components: {
      'v-dialog': Dialog,
    }
  }
</script>
<style >
  .add_man{
    position: fixed;
    left:0rem;
    right:0rem;
    bottom:0rem;
    top:0rem;
    background:#fff;
    z-index:3;
  }
  .add_man .type_list{
    margin:0rem 0.34rem;
  }
  .add_man .type_list li{
    display:flex;
    align-items:center;
    height:1rem;
    border-bottom:0.02rem solid #EBEBEB;
    box-sizing:border-box;
  }
  .add_man .type_list li .type{
    display:inline-block;
    flex:0 0 1.68rem;
    width:1.68rem;
    font-weight:bold;
    color:#535353;
  }
  .add_man .type_list li input{
    flex:0 0 3.64rem;
    width:3.64rem;
    outline: none;
    border:none;
    height:0.3rem;
    background:transparent;
    font-size:0.3rem;
    overflow:hidden;
  }
  .add_man .type_list li .documentaction{
    flex:0 0 3.64rem;
    width:3.64rem;
    color:#535353;
    overflow:hidden;
  }
  .add_man .type_list li .icon-yiwen{
    flex:1;
    font-size:0.28rem;
    color:#2C7CF9;
    text-align:right;
  }
  .add_man .type_list li .icon-xiangyou{
    flex:1;
    color:#C1C2C3;
    font-size:0.32rem;
    text-align:right;
  }
  .add_man .annotations{
    margin:0.22rem 0.34rem 0rem 0.34rem;
    text-align:right;
  }
  .add_man .annotations span{
    display:inline-block;
    color:#F13E56;
    font-weight:bold;
  }
  .add_man .annotations .baby{
    margin-right:0.35rem;
  }
  /* 删除 确定 */
  .add_man .sure_btn{
    position:fixed;
    bottom:0rem;
    left:0rem;
    right:0rem;
    display:flex;
    z-index:1;
  }
  .add_man .sure_btn div{
    flex:1;
    display:inline-block;
    font-weight:bold;
    height:1.1rem;
    line-height:1.1rem;
    text-align:center;
    box-sizing:border-box;
  }
  .add_man .sure_btn .del{
    color:#F13E56;
    background:rgba(255,245,246,1);
    box-shadow: 0px 0.02rem 0px 0px rgba(0,0,0,0.1)
  }
  .add_man .sure_btn .sure{
    color:#fff;
    background:linear-gradient(90deg,rgba(231,70,92,1),rgba(255,92,92,1));
  }

  .add_man .maska{
    position: fixed;
    z-index:4;
    left:0rem;
    top:0rem;
    bottom:0rem;
    right:0rem;
    background:rgba(0,0,0,0.4);
  }
  .add_man .card_type{
    position:fixed;
    bottom:0rem;
    left:0rem;
    right:0rem;
    z-index:5;
    background:#fff;
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
  .add_man .card_type ul li{
    color:#535353;
    font-weight:bold;
    height:0.94rem;
    line-height:0.94rem;
    text-align:center;
    border-bottom:0.02rem solid #EBEBEB;
  }
  .add_man .card_type ul li.active{
    color:#fff;
    background:#2C7CF9;
  }
  .add_man .reminder{
    background:#FFFDE9;
    padding:0.22rem 0.34rem;
    color:#535353;
    line-height:0.36rem;
  }
</style>
