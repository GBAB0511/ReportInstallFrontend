<template>
  <div class="BusinessAbode">

    <div class="BusinessAbodeIndex">

      <div class="kl-table" :style="{height: maxHeight + 'px'}">

        <el-table v-if="tableShow" ref="table" :max-height="maxHeight" @selection-change="getSelectData" stripe border :data="tableData.list" class="wuserInfo-table">
          <el-table-column type="selection" width="50" fixed="left">
          </el-table-column>
          <el-table-column type="index" label="NO." :index="indexMethod">
          </el-table-column>
          <el-table-column prop="abodeNo" label="营业所编号">
          </el-table-column>
          <el-table-column prop="abodeName" label="营业所名称">
          </el-table-column>
          <el-table-column prop="sortNo" label="排序号">
          </el-table-column>
          <el-table-column prop="status" label="状态">
          </el-table-column>
        </el-table>
        
      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10, 50, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
          </el-pagination>
        </div>
    </div>
  </div>
</template>
<script>

export default {
  name: "BusinessAbode",
  props: ['parentSelectData'],
  data() {
    return {
      tableData: [],
      tableQuery: {
        page: 1,
        pageCount: 10,
        abodeName: "",
      },
      // 勾选数据
      selectData: [],




      formData: {
        abodeNo: '',
        abodeName: '',
        groupCode: "",
        tenantId: "",
        sortNo: '',
        status: '',
        comments: '',
      },
      crumbsData: {  //面包屑
        titleList: [
          // { title: '基础信息', path: '/BusinessBranch' },
          { title: '区域配置', method: () => { window.histroy.back() } },
          { title: '营业所', method: () => { window.histroy.back() } }
        ],
      },
      tableShow: false,
      maxHeight: 0,
    }
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, '.BusinessAbode .kl-table', [])
    })
  },
  methods: {

    init() {
      let _this = this
      let params = {
        "busicode": "BusinessAbodeList",
        "data": this.tableQuery,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.tableData = res;
        setTimeout(() => {
          for (let i = 0; i < _this.tableData.list.length; i++) {
            for (let j = 0; j < _this.parentSelectData.length; j++) {
              if (_this.parentSelectData[j].value == _this.tableData.list[i].abodeNo) {
                _this.$refs.table.toggleRowSelection(_this.tableData.list[i], true)
              }
            }
          }
        }, 0);

      })

    },
    // 表格勾选对象数组
    getSelectData(itemList) {
      this.selectData = []
      itemList.forEach(item => {
        this.selectData.push({
          value: item.abodeNo,
          name: item.abodeName,
        })
      })
    },
    // 返回勾选数据给父页面（由父页面调用）
    setSelectData() {
      return this.selectData
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
    // 返回
    handleClose() {
      this.$refs.BusinessAbodeEdit.handleClose();
    },
    //保存按钮
    submitForm(formName) {
      this.$refs.BusinessAbodeEdit.submitForm(formName);
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
.BusinessAbode {
  width: 100%;
  height: 100%;
  .BusinessAbodeIndex {
    width: 100%;
    height: calc(100% - 41px);
  }
}
</style>

