<template>
  <section class="topDateSelect fontSize30">
    <div class="dateArrow ml30" @click="beforeDayClick"><i class="icon iconfont icon-xiangzuo mr5"></i>前一天</div>
    <div class="dateSelectBox colorBlue">
      <i class="icon iconfont icon-rili ml20"></i>
      <div class="departStyle" @click="dateSelect(3)"><span>{{departDateList.departShorthand}}</span> <span>{{departDateList.departDay}}</span></div>
      <i class="icon iconfont icon-zhankai mr20"></i>
    </div>
    <div class="dateArrow mr30 textRight" @click="afterDayClick">后一天<i class="icon iconfont icon-xiangyou ml5"></i></div>
    <date ref="listDate"></date>
  </section>
</template>

<script>
  import date from '../Date/date.vue';
  import { mapState, mapMutations } from 'vuex';
  export default {
    data() {
      return {}
    },
    components: {
      date
    },
    computed: {
      ...mapState({
        departDateList: state => state.list.departDateList,
        departDate: state => state.list.departDateList.departDate,
        queryAllCityList: state => state.list.queryAllCityList,   //初使化
        showCityList: state => state.list.showCityList,           //最终使用的 筛选过后的
        filterList: state => state.list.filterList                //筛选列表
      })
    },
    methods: {
      ...mapMutations([
        'upDateListDepartDate',
        'UPDATEDATETIME',
        'UPDATELOADING',
        'INIT_FLIGHTS',
        'FILTER_FLIGHTS',
        'UPDATE_FILTER'
      ]),
      //弹出日期选择插件
      dateSelect: function (n) {
        this.$refs.listDate.showDate(n);
      },
      beforeDayClick: function () {
        this.$store.commit('UPDATEDATETIME', 'pre');
      },
      afterDayClick: function () {
        this.$store.commit('UPDATEDATETIME', 'next');
      }
    }
  }

</script>
<style>
  .topDateSelect{
    width:7.5rem;
    height:1.1rem;
    background:linear-gradient(rgba(79,176,251,1),rgba(44,124,249,1));
    display: flex;
    flex-direction: row;
    justify-content:space-between;
    align-items:center;
    color: #fff;
    position: fixed;
    top:0;
    left:0;
  }
  .topDateSelect .dateArrow{
    width:1.4rem;
    /*border: 1px solid #f00;*/
  }
  .topDateSelect i{
    font-size: 0.3rem;
  }
  .topDateSelect .dateSelectBox{
    width:3.51rem;
    height:0.64rem;
    background:rgba(255,255,255,1);
    border-radius: 0.12rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .departStyle{
    height: 0.3rem;
  }
</style>
