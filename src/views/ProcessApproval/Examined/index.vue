<template>
    <div class="Examined">
        <mydestop></mydestop>
    </div>
</template>
<script>
import mydestop from "@/views/ProcessApproval/mydestop"

export default {
    name:"Examined",
    components:{
        mydestop
    }
}
</script>
<style lang="scss">
.Examined{
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    padding: 10px;
}
</style>
