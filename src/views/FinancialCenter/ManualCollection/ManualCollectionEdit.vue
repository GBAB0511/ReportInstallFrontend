
<template>
    <div class="ManualCollectionEdit">
        
        <div class="kl-table" :style="{height: maxHeight + 'px'}">
            <el-table  :max-height="maxHeight" stripe border :data="tableList.list" class="change-tables-table">

                <el-table-column type="index" label="NO." width="50" fixed="left">
                </el-table-column>

                <el-table-column prop="state" min-width="60" label="状态">
                </el-table-column>

                <el-table-column prop="engineeringState" min-width="100" label="进度">
                </el-table-column>

                <el-table-column prop="handleName" min-width="100" label="当前处理人">
                </el-table-column>

                <el-table-column prop="connect3" min-width="100" label="单据编号">
                </el-table-column>

                <el-table-column prop="connect2" min-width="100" label="单据时间">
                </el-table-column>
                
                <el-table-column prop="connect1" min-width="60" label="开始时间">
                </el-table-column>

                <el-table-column prop="engineeringState" min-width="100" label="结束日期">
                </el-table-column>

                <el-table-column prop="connect4" min-width="100" label="说明">
                </el-table-column>


            <el-table-column label="操作" fixed="right" width="80">
            <template slot-scope="scope">
                <el-button type="text" @click.native="edit(scope.$index, scope.row)">详情</el-button>
            </template>
            </el-table-column>

            </el-table>
            
        </div>
        <!-- 分页 -->
            <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="tableList.total">
            </el-pagination>
            </div>
    </div>
</template>
<script>
export default {
    name:"ManualCollectionEdit",
  components: {
  },
    data(){
        return{
            ruleForm:{
                type:[],
            },
            tableList:{
              
            tableShow:true,
            maxHeight: 0,
            tableList: {
                list: [
                    {
                    },
                ]
            },
            },
        }
    },
    mounted() {
        //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

        this.common.changeTable(this, '.ManualCollectionEdit .kl-table', [ '.ManualCollectionEdit .block'])
    },
    methods: {
        
        //分页
        handleSizeChange(val) { //显示多少数据一页
        this.tableQuery.pageCount = val
        this.tableQuery.page = 1
        this.init()
        },
        handleCurrentChange(val) {  //显示多少页码
        this.tableQuery.page = val
        this.init()
        },
        handleClose() {
            this.common.chargeObjectEqual(this,this.ruleForm,'get','ManualCollectionEdit',this.$parent.closeDialog);
        },
        editData(val){
            this.ruleForm = val;
        }
    },
    watch: {
        maxHeight() {
            this.tableShow = false
            this.$nextTick(() => {
                this.tableShow = true
            })
        },
    }
}
</script>

<style lang="scss">
.ManualCollectionEdit {
  width: 100%;
  height:100%;
  overflow-y: auto
}
</style>