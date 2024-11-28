<template>
    <div class="allBill">
        <mydestop></mydestop>
    </div>
</template>
<script>
import mydestop from "@/views/ProcessApproval/mydestop"
export default {
    name:"allBill",
    components:{
        mydestop
    }
}
</script>
<style lang="scss">
.allBill{
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    padding: 10px;
}
</style>
