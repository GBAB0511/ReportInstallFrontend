<template>
    <div class="trial">
        <mydestop></mydestop>
    </div>
</template>
<script>
import mydestop from "@/views/ProcessApproval/mydestop"
export default {
    name:"trial",
    components:{
        mydestop
    }
}
</script>
<style lang="scss">
.trial{
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    padding: 10px;
}
</style>
