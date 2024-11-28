<template>
  <div class="MeterCycleConfig">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="EditVisible">
        <el-button size="mini" type="primary" @click="submitForm('MeterCycleConfigEditForm')">保存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="handleClose">返回</el-button>
      </div>
      <div class="bread-contain-right" v-else>
        <el-button size="mini" icon="el-icon-plus" @click="add('add')" type="primary">添加</el-button>
      </div>
    </div>

    <div v-show="EditVisible" >
      <MeterCycleConfigEdit ref="MeterCycleConfigEdit"></MeterCycleConfigEdit>
    </div>

    <div v-show="!EditVisible" >

      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="wuserInfo-table">

          <el-table-column type="index" label="NO." fixed="left" width="50" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="cycleTypeName" min-width="150" label="抄表周期类型">
          </el-table-column>

          <el-table-column prop="name" min-width="150" label="抄表周期名称">
          </el-table-column>
          
          <el-table-column prop="addMonth" min-width="150" label="周期固定月份">
          </el-table-column>

          <el-table-column prop="fixedMonth" min-width="150" label="自定义抄表月份">
          </el-table-column>

          <el-table-column prop="statusName" min-width="80" label="状态">
          </el-table-column>

          <el-table-column prop="createName" min-width="200" label="创建人名称" >
          </el-table-column>

          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click.native="add(scope.row)" style="font-size:12px;">编辑</el-button>
                 <el-button type="text" @click.native="del(scope.row.id, scope.$index)" style="font-size:12px;">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
        
      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[50, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
          </el-pagination>
        </div>
    </div>
  </div>
</template>
<script>
import MeterCycleConfigEdit from "./MeterCycleConfigEdit"

export default {
  components: {
    MeterCycleConfigEdit,
  },
  name: "MeterCycleConfig",
  data() {
    return {
      EditVisible: false,//弹出表单

      tableData: [],
      crumbsData: {  //面包屑
        titleList: [
          { title: '其他配置' },
          { title: '抄表周期配置' }
        ],
      },
      maxHeight: 0,
      tableShow: false,
      tableQuery: {
        page: 1,
        pageCount: 50,
      }
    }
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, '.MeterCycleConfig', ['.MeterCycleConfig .toolbar', '.MeterCycleConfig .block'])
    })
  },
  methods: {

    init() {
      let _this = this
      let params = {
        "busicode": "BaseReadCycleList",
        "data": this.tableQuery,
      }
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.tableData = res;

      })

    },
    // 搜索
    search() {
      this.tableQuery.page = 1;
      this.init()
    },
    // 添加按钮点击事件
    add(val) {
      // this.bankLinkShow = false;
      this.EditVisible = true;
      if (val === 'add') {
      this.$refs.MeterCycleConfigEdit.resetForm();
        this.crumbsData.titleList.push({ title: '添加', method: () => { window.histroy.back() } });
        this.common.chargeObjectEqual(this, this.$refs.MeterCycleConfigEdit.formData, 'set', 'MeterCycleConfigEdit');
      } else {
        this.crumbsData.titleList.push({ title: '编辑', method: () => { window.histroy.back() } });
        let params = {
          "busicode": "BaseReadCycleQuery",
          "data": {
            id: val.id,
          },
        }
        this.$api.fetch({
          params: params,//参数
        }).then(res => {
          // res.fixedMonth = res.fixedMonth;
          console.log(res)
          this.$refs.MeterCycleConfigEdit.editData(res);
          this.common.chargeObjectEqual(this, res, 'set', 'MeterCycleConfigEdit');
        })
      }

    },
    del(id, index){
      this.$confirm("确定删除", "提示", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
           let params = {
          "busicode": "BaseReadCycleDelete",
          "data": {
            id
          },
        }
        this.$api.fetch({
          params: params,//参数
        }).then(res => {
          this.tableData.list.splice(index, 1)
             this.$message({
                message: "删除成功",
                type: "success"
              });
              this.init()
        })
        }).catch(() => {
          this.$message({
                message: "已取消",
                type: "info"
              });
        })
    },
    // 列表的NO列
    indexMethod(index) {
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1);
    },
    handleSizeChange(val) { //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.init();
    },
    handleCurrentChange(val) {  //页码点击
      this.tableQuery.page = val;
      this.init();
    },
    closeDialog() {
      this.crumbsData.titleList.pop();
      this.EditVisible = false;
    },
    // 返回
    handleClose() {

      this.$refs.MeterCycleConfigEdit.handleClose();
    },
    //保存按钮
    submitForm(formName) {
      let type = this.crumbsData.titleList[2].title;
      this.$refs.MeterCycleConfigEdit.submitForm(formName, type);
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
.MeterCycleConfig {
  width: 100%;
  height: calc(100% - 40px);
}
</style>




