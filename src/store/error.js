export default {
  state: {
    errorMsg:'没找到相关的数据',
    isShowErr:false
  },
  mutations: {
    ERROR_SHOW(state,msg) {
      state.isShowErr=true;
      state.errorMsg = msg;
    },
    ERROR_HIDDEN(state) {
      state.isShowErr=false;
    }
  },
  getters: {
    // goCityData: state => state.goCityData
  },
  action: {

  }
}
