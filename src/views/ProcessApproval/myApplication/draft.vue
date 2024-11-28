<template>
    <div class="draft">
        <mydestop></mydestop>
    </div>
</template>
<script>
import mydestop from "@/views/ProcessApproval/mydestop"
export default {
    name:"draft",
    components:{
        mydestop
    }
}
</script>
<style lang="scss">
.draft{
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    padding: 10px;
}
</style>
