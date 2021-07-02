<template>
  <br style="clear: both;"/>
  
    <div class="bg-dark p-4 customfooter">
      <p class="" style="color: white; font-weight: bold;">© {{ new Date().toLocaleDateString() }}</p> 
    </div>
  
</template>

<script>
export default {
  name: 'Footer'
}
</script>
<style scoped>
  /* p {
    clear: both;
  } */
  .customfooter {
    position: relative;
    top: 400px;
    left: 0px;
    width: 100%;
  }
</style>