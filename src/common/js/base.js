import Vue from 'vue'

// 判断andr  还ios
Vue.prototype.andrIos = function(){
  let ua = navigator.userAgent.toLowerCase();
  if (/android/.test(ua)) {
    return true
  }else {
    false
  }
}

// Cookie
Vue.prototype.removeCookie = function (name){
  setCookie(decodeURIComponent(name),'',-1);
}

Vue.prototype.getCookie = function (name){
  //user=alex; address=外滩18号; user2=ritian
   var arr=document.cookie.split('; ');
   for(var i=0;i<arr.length;i++){
    //arr[i]  ==   'user=alex'
    var arr2 = arr[i].split('=');//['user','alex']
    if(arr2[0]==decodeURIComponent(name)){
      return decodeURIComponent(arr2[1]);
    }
   }
   return '';
}

Vue.prototype.setCookie = function (name,value,timeout){
  timeout = timeout||1
  name = encodeURIComponent(name)
  value = encodeURIComponent(value)
  var d=new Date();
  d.setDate(d.getDate()+timeout);
  document.cookie=name+'='+value+';expires='+d;
}

//存储数据
Vue.prototype.saveData = function(){
  //出发城市、到达城市、出发日期，返程存到cookie中
  let goCityObj=JSON.stringify(this.$store.state.search.goCityData);
  this.setCookie('goCityCookie',goCityObj);               //出发城市
  let departDate=JSON.stringify(this.$store.state.list.departDateList);
  this.setCookie('departDateCookie',departDate);          //出发日期
  //返程的值存 cookie
  let isReturnDate=JSON.stringify(this.$store.state.list.isReturnDate);
  this.setCookie('isReturnDateCookie',isReturnDate);            //是否有返程

  // console.log('我是cookie,有返程吗？'+this.$store.state.list.isReturnDate);

  let returnDateObj=JSON.stringify(this.$store.state.search.date.returnDateObj);
  this.setCookie('returnDateCookie',returnDateObj);                //返程 日期
  // console.log(returnDateObj);
}

//获取数据
Vue.prototype.getData = function(){
  // console.log('刷新了，你知道吗');
  // console.log('我就是在这里刷新的');
  //从cookie中取值 出发城市 到达城市 出发日期 是否有返程刷新用的
  if(this.getCookie('goCityCookie')){
    let goCity=JSON.parse(this.getCookie('goCityCookie'));
    let goDepartDate=JSON.parse(this.getCookie('departDateCookie'));
    //去程
    this.$store.commit('updateCity',goCity);              //出发城市到达城市赋值
    this.$store.commit('upDateListDepartDate',goDepartDate);      //出发日期
    // console.log('这时候的出发日期是什么');
    // console.log(goDepartDate);

    //返程
    let isReturnDate=JSON.parse(this.getCookie('isReturnDateCookie'));
    let returnDate=JSON.parse(this.getCookie('returnDateCookie'));

    this.$store.commit('upReturnDate',returnDate);
    if(isReturnDate){
      this.$store.commit('UPDATE_RETURN_STATE',1);    //如果返程日期不为空 更新全局状态为真
      this.$store.commit('UPDATE_RETURN_CityData',1);   //给返程赋值 出发城市与到达城市
    }
    else{
      this.$store.commit('UPDATE_RETURN_STATE',2);    //如果返程日期为空 更新全局状态为假
      this.$store.commit('UPDATE_RETURN_CityData',2);   //给返程赋值 出发城市与到达城市初使为空
    }


    //如果cookie有效期过了 清空cookie的日期
    var cookieDate = new Date(goDepartDate.departDate.replace(/-/g,"/"));
    var now=new Date();
    let n=new Date(cookieDate.getFullYear(),cookieDate.getMonth(),cookieDate.getDate()).getTime()-new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime();
    if(n<0){
      // this.$router.push({path:'/Home'});
      //如果缓存里的日期小于今天的日期 清空缓存日期
      let obj={
        departDate:'',
        departShorthand:'',
        departDay:'',
        otherShorthand:''   //月 日
      }
      let departDate=JSON.stringify(obj);
      this.setCookie('departDateCookie',departDate);          //出发日期
    }
  }
  // else{
  //   this.$router.push({path:'/Home'});
  // }
  //获取去程舱位的值

}
//删除数据
Vue.prototype.removeData = function(){

}

