<template>
  <div class="date-container">
    <div class="date clearfix">
        <div v-if="noShow"><span>03月14日</span><b>周三</b><i></i></div>
    </div>
    <div class="page_date">
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import $ from 'jquery'
import '@/common/js/dateMobile'
  export default {
    name: 'date-container',
    data(){
      return{
        noShow:false,
        textContent:'',
        showDay:'',
        dateStr:''
      }
    },
    watch:{
//      textContent() {
//        console.log('000');
//      }
    },
    methods:{
      //日历调用
      showDate:function(num) {
        var vm=this;    //回调函数绑定vue实例
        //小于10补零
        var lower10=function (num) {
          return num < 10 ? '0' + num : num;
        };
        var seperateDays=function (start, length) {
          var start = start.split('-'),
            end = new Date(new Date(start[0], start[1] - 1, start[2]).getTime() + length * 24 * 60 * 60 * 1000),
            endYear = end.getFullYear(),
            endMonth = end.getMonth(),
            endDate = end.getDate();
          return endYear + '-' + lower10(endMonth + 1) + '-' + lower10(endDate);
        };
        var daysAway=function (start, end) {
          var startTime = start.getTime(),
            endTime = end.getTime(),
            str = "",
            weekDefine = ['日', '一', '二', '三', '四', '五', '六'];
          if (endTime - startTime < 1) {
            str = "今天"
          } else if (endTime - startTime == 24 * 60 * 60 * 1000) {
            str = "明天"
          } else if (endTime - startTime == 24 * 60 * 60 * 1000 * 2) {
            str = "后天";
          } else {
            str = "周" + weekDefine[end.getDay()];
          }
          return str;
        };
        $('.page_date').addClass('show');
        var today=new Date(),
          todayYear=today.getFullYear(),
          todayMonth=today.getMonth(),
          todayDate=today.getDate();
        var todayStr=todayYear+'-'+lower10(todayMonth+1)+'-'+lower10(todayDate);
        var startdate=todayStr;
        //如果是返程，开始日期是出发日期，出发日期之前的是不可选的
        if(num===2){
          startdate=this.$store.state.search.date.departDateObj.departDate;
        }

        $('.date').dateChoose({
          startDate:startdate,
          endDate:seperateDays(todayStr,360),
//                dateDom:'input.godateinput',
          callback:function(){
            $('.page_date').removeClass('show');
            var text=$(".date_item .date_list a.cur").attr('data-date'),
              dateStr=text.split("-"),
              dateTime=new Date(dateStr[0],dateStr[1]-1,dateStr[2]);
////                    $(".date span").text(dateStr[1]+'月'+dateStr[2]+'日').next().text(daysAway(new Date(todayYear,todayMonth,todayDate),dateTime));
            var textContent=dateStr[1]+'月'+dateStr[2]+'日',
                textContent1=dateStr[1]+'-'+dateStr[2],   //列表里使用的
                showDay=daysAway(new Date(todayYear,todayMonth,todayDate),dateTime);
            //num=1首页去程,num=2首页返程,num=3预订列表页头部选择,num=4改签日期,
            switch(num)
            {
              case 1:
                var obj={
                  departDate:text,
                  departShorthand:textContent1,
                  departDay:showDay,
                  otherShorthand:textContent
                }
                vm.$store.commit('upDepartDate',obj);
                vm.$store.commit('upDateListDepartDate',obj);
                break;
              case 2:
                var obj={
                  returnDate:text,
                  returnShorthand:textContent,
                  returnDay:showDay,
                  returnDateOther:textContent1
                }
                vm.$store.commit('upReturnDate',obj);
                break;
              case 3:
                var obj={
                  departDate:text,
                  departShorthand:textContent1,
                  departDay:showDay,
                  otherShorthand:textContent
                }
                vm.$store.commit('upDateListDepartDate',obj);
                break;
              default:
                vm.$store.commit('CHANGE_DATE',text);
            }
          }
        });
      }
    },
    mounted(){
    }
  }
</script>
<style lang="css">
::-webkit-scrollbar {
    width: 0px !important;
    height: 0px !important;
}
.page_date{
  position: fixed;
  left: 100%;
  top: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background: #fff;
  -webkit-transition: all 0.3s linear;
  transition: all 0.3s linear;
}
.page_date.show {
    left: 0;
}

.date_item {
  max-width: 7.5rem;
  margin: 0 auto;
  border-bottom: 0.02rem solid #EBEBEB;
}

.date_item .year_month {
  text-align: center;
  color: #535353;
  font-size: 0.36rem;
  font-weight:bold;
  line-height:0.94rem;
}

.date_item .week_list {
  margin-bottom: 0.27rem;
  padding: 0 0.25rem;
  display: flex;
  height: 0.6rem;
  line-height: 0.6rem;
  background: #F8F8F8;
  text-align: center;
}

.date_item .week_list span {
  display: inline-block;
  flex:1;
  font-size: 0.3rem;
  color: #979797;
}

.date_item .date_list {
  margin: 0 0.25rem;
  padding-bottom:0.27rem;
}

.date_item .date_list a {
  float: left;
  margin:0.04rem;
  width: 0.9rem;
  height: 0.9rem;
  line-height: 0.9rem;
  text-align: center;
  color: #535353;
  font-size: 0.34rem;
  -webkit-border-radius: 0.09rem;
  border-radius: 0.09rem;
}

.date_item .date_list a.festival {
  color: #F13E56;
  font-size: 0.24rem;
}

.date_item .date_list a.disabled {
  color: #D3D3D3;
  cursor: default;
}

.date_item .date_list a.cur {
  background: #2C7CF9;
  color: #fff;
}
</style>
