<template>
  <div class="Meter-Reading-Center">
    <section class="Meter-Reading-Center-right">
      <MeterReadingCircuit v-if="$route.path==='/MeterReadingCenter'"></MeterReadingCircuit>
      <router-view v-else></router-view>
    </section>
  </div>
</template>
<script>
import MeterReadingCircuit from '../MeterReadingCenter/MeterReadingCircuit'
export default {
  name: "Meter-Reading-Center-index",
  components: {
    MeterReadingCircuit
  },
}
</script>
<style lang="scss">
@import "../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.Meter-Reading-Center {
  height: 100%;
  &:after {
    @include _clearBoth();
  }
  .Meter-Reading-Center-right{
    width: 100%;
    height: 100%;
  }

}
</style>
