 <template>
    <div class="sele_address_a">
        <div class="add" @click="add">
          <span class="iconfont icon-tianjia"></span><span class="text fontSize30">新增配送地址</span>
        </div>
        <div class="user_list">
          <ul>
            <li v-for="(item,index) in addrData" @click.stop.prevent="radio(index)">
              <span class="iconfont icon-xiugai" @click.stop.prevent="editor(index)"></span>
              <div class="user_info">
                <span class="userName fontSize30">{{item.receivername}}</span><span class="tel fontSize30 Arial">{{item.receiverphone}}</span>
                <p class="fontSize30"><span class="tacit" v-if="item.defaultaddress != '0'">[默认]</span>{{item.ProName}}{{item.CityName}}{{item.DisName}}{{item.address}}</p>
              </div>
              <span class="iconfont check" :class="{'icon-danxuankuangweixuan':iconActive !==index,'icon-danxuankuangyixuan':iconActive ===index}"></span>
            </li>
          </ul>
        </div>
        <div class="sure_btn">
          <div class="sure fontSize36" @click="sure" :class="{'active':iconActive !=null}">确定</div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import { mapState, mapMutations } from 'vuex';
  export default {
    name: 'sele_address_a',
    data() {
      return{
        iconActive:null,
        addrData:[],//初始化数据
        addrStr:'',//地址字符串
      }
    },
    computed:{
      ...mapState({
        modal: state =>state.modal.modal,
        Address:state =>state.order.Address,
        addressDetail:state =>state.order.addressDetail,
        ediAddress:state =>state.order.ediAddress,//编辑配送地址信息
        address_str:state =>state.duoPage.address_str,//省市区合并
        addressPage:state =>state.order.addressPage
      })
    },
    mounted(){
      this.initData();
    },
    methods: {
      ...mapMutations([
        'modalShow'
      ]),
      //单选
      radio(num){
        if(this.iconActive === num){
          this.iconActive = null;
        }else{
          this.iconActive = num;
        }

      },
      //编辑
      editor(index){
        this.$store.state.order.ediAddress = this.addrData[index]
        let itemInfo = this.$store.state.order.ediAddress;
//        console.log('这里是什么');
//        console.log(itemInfo);
        this.$store.state.duoPage.address_str = itemInfo.ProName + itemInfo.CityName + itemInfo.DisName
        this.$router.push({path:'/EditorAddress'})
      },
      //提交
      sure(){
        if(this.iconActive === null){
          return
        };
        let index = parseInt(this.iconActive)
        this.$store.state.order.Address = this.addrData[index].receivername + ' ' + this.addrData[index].receiverphone + ' ' + this.addrData[index].ProName + this.addrData[index].CityName + this.addrData[index].DisName + this.addrData[index].address;

        this.$store.state.order.addressDetail = this.addrData[index];
        if(this.addressPage===1){
          this.$router.push({path:'/Order'});           //下单页
        }
        else if(this.addressPage===2){
          this.$router.push({path:'/CompInvoicing'});   //补开发票
        }
        // this.$router.go(-1);
        // this.$router.push({path:'/Order'})
      },
      //跳转新增地址页
      add(){
        this.$router.push({path:'/AddAddress'})
      },
      //数据初始化
      initData:async function () {
         this.$store.commit('loadingShow','拼命加载中');
         let params = {}
         const res = await this.$root.http.get('address/query', params,this)

         if (res.data.success) {
           this.addrData = res.data.data;
//           console.log(this.addrData);
           //如果有选择的配送地址 选择的高亮 否则让默认为高亮
           let isDefault=true;
           if(this.addressDetail.id){
             isDefault=false;
           }
           for(let i=0;i<this.addrData.length;i++){
             if(isDefault){
               if(this.addrData[i].defaultaddress == '1'){
                 this.iconActive = i;
               }
             }
             else{
               if(this.addrData[i].id === this.addressDetail.id){
                 this.iconActive = i;
               }
             }
           }
         }else{
          this.$store.commit('modalShow',res.data.msg);
          return;
        }
      },
    }
  }
</script>
<style >
  .sele_address_a{
    position:fixed;
    left:0rem;
    right:0rem;
    bottom:0rem;
    top:0rem;
    z-index:4;
    background:#F8F8F8;
  }
  .sele_address_a .add{
    display:flex;
    justify-content: center;
    align-items:center;
    height:1rem;
    background:#fff;
  }
  .sele_address_a .add span{
    display:inline-block;
  }
  .sele_address_a .add .icon-tianjia{
    font-size:0.48rem;
    color:#2C7CF9;
  }
  .sele_address_a .add .text{
    flex:0 0 2.21rem;
    width:2.21rem;
    color:#2C7CF9;
    font-weight:bold;
    text-align:center;
  }
  .sele_address_a .user_list li{
    display:flex;
    flex-direction: row;
    align-items:center;
    margin-top:0.2rem;
    background:#fff;
    padding:0.2rem 0.34rem;
    /*height:1.3rem;*/
  }
  .sele_address_a .user_list li span{
    display:inline-block;
  }
  .sele_address_a .user_list li .icon-xiugai{
    flex:0 0 0.4rem;
    width:0.4rem;
    font-size:0.4rem;
    margin-right:0.28rem;
    color:#2C7CF9;
  }
  .sele_address_a .user_list li .user_info{
    flex:1;
  }
  .sele_address_a .user_list li .user_info span{
    font-weight:bold;
    color:#535353;
    height:0.49rem;
    line-height:0.49rem;
  }
  .sele_address_a .user_list li .user_info .userName{
    font-weight:bold;
    color:#535353;
    margin-right:0.24rem;
    height:0.49rem;
    line-height:0.49rem;
  }
 .sele_address_a .user_list li .user_info p{
    color:#979797;
    /*height:0.47rem;*/
    line-height:0.47rem;
  }
  .sele_address_a .user_list li .user_info p span{
    font-weight:normal;
    color:#979797;
    height:0.47rem;
    line-height:0.47rem;
  }
  .sele_address_a .user_list li .check{
    flex:0 0 0.5rem;
    width:0.5rem;
    color:#D3D3D3;
    font-size:0.5rem;
  }
  .sele_address_a .user_list li .icon-danxuankuangyixuan {
    color:#2C7CF9;
  }
  /* 确定 */
  .sele_address_a .sure_btn{
    position:fixed;
    bottom:0rem;
    left:0rem;
    right:0rem;
    display:flex;
    z-index:1;
  }
  .sele_address_a .sure_btn div{
    flex:1;
    display:inline-block;
    font-weight:bold;
    height:1.1rem;
    line-height:1.1rem;
    text-align:center;
    box-sizing:border-box;
  }
  .sele_address_a .sure_btn .sure{
    color:#fff;
    background:rgba(211,211,211,1);
    box-shadow: 0px -0.02rem 0px 0px rgba(0,0,0,0.1)
  }
  .sele_address_a .sure_btn .active{
    background:linear-gradient(90deg,rgba(231,70,92,1),rgba(255,92,92,1));
    box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.1)
  }
</style>
