export default {
    state: {
      dialogFlag: false, //dialog显示隐藏
      dialogNum: 0, //0 表示用户名   1 表示婴儿    2表示 儿童  3表示 保险
      retiredFlag:false,  //退改签 显示隐藏
      freeLuggage:'',     //行李额
      freeLuggageUnit:''  //单位 kg
    },
    mutations: {
        dialogHide(state) {
            state.dialogFlag = false;
        },
        dialogShow(state, num) {
            state.dialogFlag = true;
            state.dialogNum = num;
            // console.log(state.dialogNum)
        },
        retiredHide(state) {
          state.retiredFlag = false;
        },
        retiredShow(state) {
          state.retiredFlag = true;
        },
        updateFreeLuggage(state,obj){
          state.freeLuggage=obj.freeLuggage;
          state.freeLuggageUnit=obj.freeLuggageUnit;
        }
    },
    getters: {
        // goCityData: state => state.goCityData
    },
    action: {

    }
}
