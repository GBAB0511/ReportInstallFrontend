<template>
    <div class="report-center">
        <!-- <section class="report-center-left">

           <section class="kl-container">
                <aside class="kl-aside">
                
                    <div class="nav-tree-contain">
                    <el-menu
                        class="el-menu-vertical-demo"
                        :default-active="activeIndex"
                        @select="navTreeHandleSelect"
                        :router="true"
                        unique-opened
                        open>   
                            <section v-for="(k,i) in navTree" :key="i">
                                <el-menu-item v-if="k.children.length===0" :index="k.path">{{k.name}}</el-menu-item>                
                                <el-submenu v-else :index="k.path">
                                    <template slot="title">{{k.name}}</template>
                                    <el-menu-item v-for="(v,j) in k.children" :key="j" :index="v.path">{{v.name}}</el-menu-item>
                                </el-submenu>
                            </section>
                    </el-menu>
                    </div>
                </aside>
                <div class="collapse" @click="collapse">
                    <i class="el-icon-arrow-left leftChange"></i>
                </div>
            </section>
        </section> -->
        
        <div class="report-center-con">
            <router-view></router-view>

        </div>
    </div>
</template>
<script>
export default {
    name:"report-center-index",

    

}
</script>
<style lang="scss">
  @import "../../assets/styles/scss/base/fn";
  $imgWidth: 200px;
$theme-color:#297acc;
  .report-center{
      .el-table .el-table__body tr .cell:nth-child(1) {
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    &:after{
        @include _clearBoth()
    }
    & > .report-center-con{
        float: left;
        height: 100%;
        width: 100% ;
        &:after{
            @include _clearBoth()
        }
    }

    .report-center-center{
        width: 55%;
        margin-right: 20px;
        & > .report-center-pie{
            width: 100%;
            height: 40%;
            & > li{
                padding-top: 10px;
                text-align: center;
                height: 86%;
                width: 50%;
                margin: auto;
            }
        }
        & > .report-center-centerCategory{
            width: 100%;
            height: 60%;
            padding-left: 20px;
            #CategoryCustom{
                width: 100%;
                height: 90%;
            }
        }
    }

    
  }
</style>
