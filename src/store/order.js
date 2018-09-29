//下单页
export default {
  state: {
    cabin:{},       //舱位信息 去程
    cabinReturn:{}, //舱位信息 返程
    insurance:[],    //保险
    retiredObj:{
      adutObj:{
        backTickets:{},
        changeTickets:{}
      },
      chdObj:{
        backTickets:{},
        changeTickets:{}
      },
      infRuleDesc:''
    },
    Category:1,

    //提交订单时需要传的参数 ID
    insuranceArr:[],      //保险id
    insuranceSelected:[], //选中的保险集合
    contact:'',           //联系人
    contactTel:'',        //联系人电话
    contactEmail:'',      //联系人邮箱
    isVer:false,          //联系人验证是否通过
    InvoiceTitle:'',      //发票抬头
    TFN:'',               //税号
    Address:'',           //配送地址
    addressDetail:{},     //配送地址详细信息
    Area:{},              //省市区
    ediAddress:{},        //编辑配送地址
    //明细需要的参数
    adultLen:0,           //乘机人成人 人数
    chdLen:0,             //乘机人儿童 人数
    totalPrice:0,         //总价格
    smallTicketsNum:0,
    ticketsNum:20,        //余票数
    crewsSelect:false,

    //快递费用选择 1顺风 2其他
    expressFeeNum:2,      //默认其他快递
    isExpressFee:false,

    //列表选项弹出 1是快递 2自愿退票原因 3非自愿退票原因
    listNum:0,
    voluntaryRefund:0,    //自愿退票
    involuntaryRefund:0,  //非自愿退票
    invoicePage:1,        //发票 1为下单页 2为补开发票页 增删改的时候跳转页面
    addressPage:1,        //配送地址 1为下单页 2为补开发票页 增删改的时候跳转页面
  },
  mutations: {
    //更新舱位 去程
    UPDATE_CABIN(state,cabin){
      state.cabin=cabin;
    },
    //更新舱位 返程
    UPDATE_CABIN_RETURN(state,cabin){
      state.cabinReturn=cabin;
    },
    //保险
    UPDATE_INSURANCE(state,insurance){
      state.insurance=insurance;
    },
    //改变保险选中状态
    UPDATE_ISRC_ISELECTED(state,i){
      state.insurance[i].iSelected=!state.insurance[i].iSelected;
    },
    //把选中的保险id传给insuranceArr这个数组
    UPDATE_SELECTED(state){
      state.insuranceArr=[];   //赋值前先清空
      state.insurance.forEach(function (item) {
        if(item.iSelected){
          state.insuranceArr.push(item.Id);
        }
      });
      // console.log(state.insuranceArr);
    },
    //初使化清空保险选中
    CLEAR_INSURANCE(state){
      state.insuranceArr=[];
      state.insuranceSelected=[];
      state.insurance.forEach(function (item) {
        item.iSelected=false;
      })
    },
    //联系人
    UPDATE_CONTACT(state,val){
      state.contact=val;
    },
    //联系电话
    UPDATE_CONTACTTEL(state,val){
      state.contactTel=val;
    },
    //联系人 邮箱
    UPDATE_CONTACTEMAIL(state,val){
      state.contactEmail=val;
    },
    //选中的保险集合
    UPDATE_INSURANCE_SELECTED(state){
      state.insuranceSelected=[];
      state.insurance.forEach(function (item) {
        if(item.iSelected){
          state.insuranceSelected.push(item);
        }
      })
    },
    //成人人数
    UPDATE_ADULTLEN(state,len){
      state.adultLen=len;
    },
    //儿童人数
    UPDATE_CHDLEN(state,len){
      state.chdLen=len;
    },
    //总价
    UPDATE_TOTALPRICE(state,price){
      state.totalPrice=price;
    },
    //更新退改签规则
    UPDATE_RETIRED(state,obj){
      //num=1时，成人儿童都显示
      let num=2;
      state.retiredObj.infRuleDesc=obj.Data.infRuleDesc;
      obj.Data.ruleInfos.forEach(function (item) {
        if(item.passengerType===1){
          if(item.ruleFlag===1){
            state.retiredObj.adutObj.backTickets=item;
          }
          else if(item.ruleFlag===2){
            state.retiredObj.adutObj.changeTickets=item;
          }
        }
        else{
          num=1;
          if(item.ruleFlag===1){
            state.retiredObj.chdObj.backTickets=item;
          }
          else if(item.ruleFlag===2){
            state.retiredObj.chdObj.changeTickets=item;
          }
        }
      })
      state.Category=num;    //乘机人类型
      // console.log('我是多少，你知道吗'+state.Category);
      // state.retiredObj=obj;
    },
    CLEAR_ORDER(state){
      state.contact='';
      state.contactTel='';
    },
    UPDATE_TICKETS_NUM(state,num){
      state.ticketsNum=num;
    },
    FALSE_CREWS_SELECTED(state){
      state.crewsSelect=false;
    },
    TRUE_CREWS_SELECTED(state){
      state.crewsSelect=true;
    },
    SET_SMALL_TicketsNum(state,num){
      state.smallTicketsNum=num;
    },
    //更新发票
    UPDATE_INVOICE(state,obj){
      state.InvoiceTitle=obj.invoiceTitle;
      state.TFN=obj.tfn;
    },
    //更新配送地址
    UPDATE_ADRESS(state,str){
      state.Address=str;
    },
    //更新配送地址 详情
    CLEAR_ADRESS_DETAIL(state){
      state.addressDetail={};
    },
    //快递选择
    UPDATE_EXPRESSFEE(state,num){
      // console.log('小宝是几啊：'+num);
      state.isExpressFee=false;
      state.expressFeeNum=num;
    },
    //列表选项弹出框隐藏
    HIDDEN_EXPRESSFEE(state){
      state.isExpressFee=false;
    },
    //列表选项弹出框显示 num=1是快递 2自愿退票原因 3非自愿退票原因
    SHOW_EXPRESSFEE(state,num){
      state.isExpressFee=true;
      state.listNum=num;
    },
    //联系人验证是否通过 num=1通过 2不通过
    UPDATE_ISVER(state,num){
      if(num===1){
        state.isVer=true;
      }
      else{
        state.isVer=false;
      }
    },
    //省市区
    UPDATE_AREA(state,area){
      state.Area=area;
    },
    //列表选项弹出 num=1是快递 2自愿退票原因 3非自愿退票原因
    //自愿退票
    UPDATE_VoluntaryRefund(state,num){
      state.involuntaryRefund=0;
      state.voluntaryRefund=num;
      state.isExpressFee=false;
      // setTimeout(function () {
      //   state.isExpressFee=false;
      // },50);
    },
    //非自愿退票
    UPDATE_InVoluntaryRefund(state,num){
      state.voluntaryRefund=0;
      state.involuntaryRefund=num;
      state.isExpressFee=false;
      // setTimeout(function () {
      //   state.isExpressFee=false;
      // },50);
    },
    //发票 1为下单页 2为补开发票页 增删改的时候跳转页面
    INVOICE_PAGE(state,num){
      state.invoicePage=num;
    },
    //配送地址 1为下单页 2为补开发票页 增删改的时候跳转页面 addressPage
    ADDRESS_PAGE(state,num){
      state.addressPage=num;
    }
  },
  actions:{
    //计算总价
    TotailPrice({commit, state,rootState}){
      function getAge(dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      }
      let crewsArr=rootState.duoPage.crews;
      let switcha=rootState.duoPage.switcha;
      let vouchr=rootState.duoPage.vouchr;
      let isReturn=rootState.list.isReturnDate;
      let express_money=rootState.duoPage.express_money;
      let newsCrews=[];
      let adu=0,
        chd=0,
        casualtyMoney=0,  //保险费用
        expressMoney=0,   //快递费用
        totalPrice=0,     //总价格 去程
        returnTotalPrice=0;//总价格 返程
        crewsArr.forEach(function (item) {
        let age=getAge(item.Birthday);
        if(age>=12){
          adu++;
          var obj=Object.assign(item,{personType:1});
          newsCrews.push(obj);
        }
        else{
          chd++;
          var obj=Object.assign(item,{personType:2});
          newsCrews.push(obj);
        }
      });
      crewsArr=newsCrews;     //重新改变选中的乘机人 多加一个乘机人类型
      // console.log(newsCrews);
      commit('UPDATE_ADULTLEN',adu);      //成人人数
      commit('UPDATE_CHDLEN',chd);        //儿童人数

//        如果乘机人数大于0 计算保险费用
      if(crewsArr.length>0){
        state.insuranceSelected.forEach(function (item) {
          if(isReturn){
            casualtyMoney+=item.Cost*crewsArr.length*2;
          }
          else{
            casualtyMoney+=item.Cost*crewsArr.length
          }
        })
      }
      if(crewsArr.length>0&&switcha&&vouchr){
        //快递费用加上 2普通 1顺风
        if(state.expressFeeNum===2){
          expressMoney=10;
        }
        else if(state.expressFeeNum===1){
          expressMoney=20;
        }
        else{
          expressMoney=0;
        }
      }
      // console.log('保险'+casualtyMoney);

      totalPrice = state.cabin.adultPrice*state.adultLen+
        (state.cabin.adultTax+state.cabin.adultFuel)*state.adultLen+
        state.cabin.childPrice*state.chdLen+
        (state.cabin.childTax+state.cabin.childFuel)*state.chdLen
        +casualtyMoney+expressMoney;
      //如果有返程 加上返程的价格
      if(isReturn){
        returnTotalPrice = state.cabinReturn.adultPrice*state.adultLen+
          (state.cabinReturn.adultTax+state.cabinReturn.adultFuel)*state.adultLen+
          state.cabinReturn.childPrice*state.chdLen+
          (state.cabinReturn.childTax+state.cabinReturn.childFuel)*state.chdLen
      }
      commit('UPDATE_TOTALPRICE',totalPrice+returnTotalPrice);
      // console.log('返程总数'+returnTotalPrice);
      // console.log(totalPrice+returnTotalPrice);
    },
    //清空下单的历史记录
    ClearOrderHistory({commit, state,rootState}){
      commit('CLEAR_ORDER');
    },
    //余票数
    UpdateTicketsNum({commit, state,rootState}){
      let crewsArr=rootState.duoPage.crews;
      // console.log('取少:'+state.smallTicketsNum);
      if(state.smallTicketsNum!='>9'){
        let num=parseInt(state.smallTicketsNum)-crewsArr.length;
        commit('UPDATE_TICKETS_NUM',num);
      }
      else {
        commit('UPDATE_TICKETS_NUM',20);
      }
    },
    //取少 余票数（有返程时）
    Set_small_ticketsNum({commit, state,rootState}){
      let seatNum1=state.cabin.seatStatus,
        seatNum2=rootState.list.isReturnDate?state.cabinReturn.seatStatus:20,
        num=0;
      if(rootState.list.isReturnDate){
        // console.log('有返程的');
        if(seatNum1!='>9'&&seatNum2!='>9'){
          if(parseInt(seatNum1)>parseInt(seatNum2)){
            num=seatNum2;
          }
          else{
            num=seatNum1;
          }
        }
        else{
          if(seatNum1!='>9'){
            num=seatNum1;
          }
          else if(seatNum2!='>9'){
            num=seatNum2;
          }
          else{
            num='>9';
          }
        }
      }
      else{
        num=seatNum1;
      }
      // console.log('原始是：'+num);
      commit('SET_SMALL_TicketsNum',num);
    },
    //联系人 联系人电话 联系邮箱验证
    Contactverification({commit, state,dispatch,rootState}){
      let user_reg = /([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z]){1,20}$/;
      let chi_reg=/^[\u4E00-\u9FA5]+$/;   //全是中文
      let tel_reg = /^1[3|4|5|7|8][0-9]{9}$/;
      let email_reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      let username = state.contact;
      let tel = state.contactTel;
      let email = state.contactEmail;
      let modalInfo=function (str) {
        dispatch('modalCountdown',str);
        commit('UPDATE_ISVER',2); //失败
        // console.log('我是联系人,应该是失败的.'+state.isVer);
      }
      //用户名验证
      if(username === ''||username === null ){
        modalInfo('联系人不能为空！');
        return;
      }
      else if(!user_reg.test(username)){
        modalInfo('联系人只支持中文英文！');
        return;
      }
      else if(chi_reg.test(username)){
        if(username.length>10){
          modalInfo('联系人中文不能超过10个字符！');
          return;
        }
      }
      else if(username.length>20){
        modalInfo('联系人不能超过20个字符！');
        return;
      }
      //手机号验证
      if(tel === ''||tel === null){
        modalInfo('手机号不能为空！');
        return;
      }else if(!tel_reg.test(tel)){
        modalInfo('手机号错误！');
        return;
      };
      //如果选了保险邮箱必填
      if(rootState.duoPage.switcha&&state.insuranceArr.length&&email===''){
        modalInfo('请填写电子邮箱！');
        return;
      }
      // 邮箱验证 (如果邮箱内有内容就进行验证)
      if(email != ''){
        if(!email_reg.test(email)){
          modalInfo('请填写有效的邮箱！');
          return;
        };
      }
      //验证通过后提交
      if(user_reg.test(username) && tel_reg.test(tel)){
        commit('UPDATE_ISVER',1); //成功
      }
    }

    //配送清单 初使化

  }
}
