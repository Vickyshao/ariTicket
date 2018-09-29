export default {
    state: {
        userInfo:{
            Birthday:'',
            Id:'',
            MemberId:'',
            Name:'',
            PsptId:'',
            PsptName:'',
            PsptType:'',
            Tel:'',
        },
        air_ren: true,
        air_men: false, //添加联系人显示隐藏  true隐藏  false 显示
        iconActive: null, //wkb选择
        sele_address: false, //选择邮寄地址显示隐藏
        add_address: false, //新增邮寄地址显示隐藏
        editor_address: false, //编辑邮寄地址显示隐藏
        detailList: false, //明细显示隐藏
        invoice: false, //发票是否勾选
        vouchr: false, //报销凭证是否勾选
        switcha: false, //凭证开关
        go_ticket_money: 576, // 去的飞机票钱
        go_fuel_money: 50, //去的燃油费用
        go_people_num: 1, //去的票数
        back_ticket_money: 576, // 回的飞机票钱
        back_fuel_money: 50, //回的燃油费用
        back_people_num: 0, //回的票数
        safe_money: 30, //保险费用
        express_money: 10, //快递费用
        total_money: 0, //总金额
        address_str: '', //三级地址字符串
        isShipShow: false, //配送地址显示隐藏
        crews:[],//乘机人
        crewsArr:[],//乘机人
        eventOri:false,// 从order点击跳到编辑页面
    },
    mutations: {
      totalMoney(state) {
            //只有机票
            state.total_money = ((state.go_ticket_money + state.go_fuel_money) * state.go_people_num) + ((state.back_ticket_money + state.back_fuel_money) * state.back_people_num);
            //机票 + 保险
            if (state.iconActive > 0) {
                state.total_money = ((state.go_ticket_money + state.go_fuel_money + state.safe_money) * state.go_people_num) + ((state.back_ticket_money + state.back_fuel_money + state.safe_money) * state.back_people_num);
            };
            //机票 + 快递
            if (state.vouchr && state.switcha) {
                state.total_money = (((state.go_ticket_money + state.go_fuel_money) * state.go_people_num) + ((state.back_ticket_money + state.back_fuel_money) * state.back_people_num)) + state.express_money;
            };
            //机票 + 保险 + 快递
            if (state.iconActive > 0 && state.vouchr) {
                state.total_money = (((state.go_ticket_money + state.go_fuel_money + state.safe_money) * state.go_people_num) + ((state.back_ticket_money + state.back_fuel_money + state.safe_money) * state.back_people_num)) + state.express_money;
            }

        },
      //发票值改变
      update_vouchr(state){
        state.vouchr=!state.vouchr;
        // console.log(state.vouchr)
      },
      //报销 购票凭证
      update_switcha(state,len){
        state.switcha=!state.switcha;
        if(state.switcha){
          state.vouchr=true;
          if(len>0){
            state.invoice=true;
          }
          else {
            state.invoice=false;
          }
        }
        else{
          state.vouchr=false;
          state.invoice=false;
        }
      },
      
      //保险发票
      update_invoice(state){
        state.invoice=!state.invoice;
      },
      //选择保险时 保险发票是否选中
      update_invoice1(state,len){
        if(state.switcha){
          if(len>0){
            state.invoice=true;
          }
          else {
            state.invoice=false;
          }
        }
        else{
          state.invoice=false;
        }
        },
      //编辑乘机人
      ediInfo(state,obj){
          state.userInfo = Object.assign({},obj)
      },
      //初使化清空乘机人
      CLEAR_CREWS(state){
        // console.log('快看，乘机人清空了！');
        state.crews=[];
      },
      //更新乘机人
      UPDATE_CREWS(state,arr){
        state.crews=arr;
      },
      //订单总额明细 是否显示
      UPDATE_DETAILLIST(state){
        state.detailList=!state.detailList;
      }

    },
    getters: {
        // goCityData: state => state.goCityData
    },
    action: {

    }
}
