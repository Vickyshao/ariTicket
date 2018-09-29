export default {
    state: {
      modal: false,
      msg: '',
      isLoading:false,
      msgLoading:'',
      isCustom:false,       //客服弹框显示隐藏
      isDialogBox:false,    //带确认的消息框
      dialogMsg:'',         //带确认的消息 信息
      dialogNum:1,          //1普通的 消息带确认框 2是退票的特殊的带确认框  默认为普通 3普通的一个确认按钮的
    },
    mutations: {
      modalHide(state) {
          state.modal = false;
      },
      modalShow(state, Msg) {
          state.modal = true;
          state.msg = Msg;
      },
      loadingShow(state,msg){
        state.isLoading=true;
        state.msgLoading=msg;
      },
      loadingHide(state){
        state.isLoading=false;
      },
      //带确认的 消息框
      dialogBoxShow(state, Msg) {
        state.isDialogBox = true;
        state.dialogMsg = Msg;
      },
      dialogBoxHide(state){
        state.isDialogBox = false;
      },
      updateDialogNum(state,num){
        state.dialogNum=num;
      }
    },
    getters: {
        // goCityData: state => state.goCityData
    },
    actions: {
      //消息框倒计时 隐藏
      modalCountdown({commit},msg){
        commit('modalShow',msg);
        setTimeout(function () {
          commit('modalHide');   //信息框消失
        },3000);
      }
    }

}
