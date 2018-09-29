export default {
  state: {
    hot_arr:[],             //热门城市
    all_city:[],            //所有城市存储
    curCity:{
      name:'',
      code:''
    }
  },
  mutations: {
    //热门城市
    UPDATE_HOT_CITY(state,arr){
      state.hot_arr=arr;
    },
    //所有城市存储
    UPDATE_ALL_CITY(state,arr){
      state.all_city=arr;
    },
    //当前城市
    UPDATE_CUR_CITY(state,curCity){
      state.curCity.name=curCity.name;
      state.curCity.code=curCity.code;
    }
  },
  getters: {
    // goCityData: state => state.goCityData
  },
  action: {

  }
}
