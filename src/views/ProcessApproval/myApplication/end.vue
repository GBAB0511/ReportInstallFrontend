<template>
    <div class="end">
        <mydestop></mydestop>
    </div>
</template>
<script>
import mydestop from "@/views/ProcessApproval/mydestop"
export default {
    name:"end",
    components:{
        mydestop
    }
}
</script>
<style lang="scss">
.end{
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    padding: 10px;
}
</style>
