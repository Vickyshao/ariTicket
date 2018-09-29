<template>
  <div class="fly_status">
    <img src="./fly.png" v-if="flyIcon==='0'||flyIcon===0" alt="">
    <!--<img src="./transfer.png" v-if="flyIcon === 2" alt="">-->
    <img src="./stop.png" v-if="flyIcon!='0'" alt="">
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'fly-status',
    props:['flyIcon']
  }
</script>
<style>
  .fly_status img{
    width:1.67rem;
  }

</style>
