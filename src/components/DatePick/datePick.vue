<template>
  <transition name="dateFold">
    <div class="date_contianer" >
      <p>选中的时间{{date}}</p>
    </div>
  </transition>
</template>
<script type="text/ecmascript-6">
 import { mapState, mapMutations } from 'vuex';
  export default {
    name: 'datePick',
    data(){
      return {
        date:'',
      }
    },
    computed:{
      ...mapState({
        modal: state =>state.modal.modal,
        msg: state => state.modal.msg
      })
    },
    mounted(){
      this.$root.eventHub.$on('eventClick',this.setDate)
    },
     methods: {
      ...mapMutations([
        'modalShow',
        'modalHide',
      ]),
      setDate(){
         this.$calendar.show({
             onOk(data){
                this.date = data
                 //console.log(data);
                 this.data= data.year+'-'+data.month+'-'+data.day;
                 //console.log('确定')
             },
             onCancel(){
                 //console.log('取消')
             }
         })
       },
    },

  }
</script>
<style lang="css">
 /* 模态框 */
  .date_contianer{
    position: fixed;
    z-index:4;
    left:0rem;
    bottom:0rem;
    right:0rem;
    transition:all 0.5s ease;
  }
  .dateFold-enter-active,.dateFold-leave-active{
      transition:all 0.5s ease;
  }     
  .dateFold-enter-active{
    transform:translate3d(0,0,0);
  }       
  .dateFold-enter,.dateFold-leave-active{
    transform:translate3d(0,100%,0);
  }     
  .com-calendar .cal-header{
    height:0.9rem; 
    background:linear-gradient(rgba(79,176,251,1),rgba(44,124,249,1));
  }
</style>
