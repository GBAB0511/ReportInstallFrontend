<template>
  <div class="cost-project">
    
      <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      </div>
      <div v-show="!EditVisible" class="cost-project-right-content">

        <div class="kl-table">
            <el-table 
                      v-if="tableShow" 
                      :max-height="maxHeight" 
                      stripe border 
                      :data="tableData" 
                      class="wuserInfo-table">

              <el-table-column type="index" label="NO." width="50" :index="indexMethod" fixed>
              </el-table-column>
              <el-table-column label="启用" width="70">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.used"
                    @change="change(scope.row)"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column prop="costNo" min-width="80" label="费用类型编号">
              </el-table-column>
              <el-table-column prop="costName" min-width="100" label="费用类型名称" show-overflow-tooltip>
                
              </el-table-column>
              <el-table-column prop="comments" min-width="200" label="备注" show-overflow-tooltip>
                
              </el-table-column>
            </el-table>
        </div>
      </div>
  </div>
</template>
<script>
export default {
  name: "cost-project-index",
  data() {
    return {
      EditVisible:false,//弹出表单
      tableData:[

      ],
      crumbsData: {  //面包屑
        titleList: [
          { title: '基础信息', path: '/BusinessArea' },
          { title: '其它配置', path: '/WaterType' },
          { title: '费用类型', method: () => { window.histroy.back() } }
        ],
      },
      maxHeight: 0,
      tableShow: false,
    }
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, '.cost-project .cost-project-right-content', [])
    })
  },
  methods: {
    init() {
      let _this = this;
      let params = {
          "busicode": "CostList",
          "data":{},
      }
      this.$api.fetch({
      params: params,//参数
      
      }).then(res => {
          _this.tableData = res;
          
      })
      
    },
    change(row){
      let _this = this;
          let params = {
              "busicode": "CostUpdate",
              "data": {
                id:row.id,
                status:row.used?"1":"0"
              },
          }
          this.$api.fetch({
            params: params,//参数
          }).then(res => {
          })
    },
      // 列表的NO列
      indexMethod(index) {
        return index+1;
      },
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
@import "../../../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.cost-project {
  width: 100%;
  height: 100%;
}
</style>

