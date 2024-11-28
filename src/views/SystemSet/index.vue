<template>
  <div class="system-set">
   
    <section class="system-set-right">

      <router-view></router-view>
    </section>
  </div>
</template>
<script>

export default {
  name: "system-set",

}
</script>
<style lang="scss">
@import "../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.system-set {
  width: 100%;
  height: 100%;
  position: relative;
  .system-set-right {
    width: 100%;
    height: 100%;
    position: relative;
  }
}
</style>
