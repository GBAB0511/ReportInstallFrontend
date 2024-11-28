<template>
    <div class="discard">
        <mydestop></mydestop>
    </div>
</template>
<script>
import mydestop from "@/views/ProcessApproval/mydestop"
export default {
    name:"discard",
    components:{
        mydestop
    }
}
</script>
<style lang="scss">
.discard{
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    padding: 10px;
}
</style>
