<template>
  <div class="IncomeBank">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="EditVisible">
        <el-button size="mini" type="primary" @click="submitForm()">保存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
      <div class="bread-contain-right" v-else>
        <el-button size="mini" icon="el-icon-plus" @click="add('add')" type="primary">添加</el-button>
      </div>
    </div>
    <IncomeBankEdit v-if="EditVisible" :isExistDefult="isExistDefult" ref="IncomeBankEdit"></IncomeBankEdit>
    <div class="IncomeBankIndex" v-else>
      <div class="kl-table">

        <el-table class="listTable" stripe center border :data="tableData.list">

          <el-table-column min-width="45" type="index" fixed="left" label="No."></el-table-column>
          <el-table-column prop="bankName" min-width="80" label="银行名称"></el-table-column>
          <el-table-column prop="bankAccount" min-width="80" label="银行账号"></el-table-column>
          <el-table-column prop="statusName" min-width="50" label="状态"></el-table-column>
          <el-table-column prop="isDefault" min-width="50" label="默认银行">
            <template slot-scope="scope">
                {{scope.row.isDefault== 1?'是':'否'}}
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="80">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click.native="add(scope.row)">编辑</el-button>
              <el-button type="text" size="mini" @click.native="del(scope.row)">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
        <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
          </el-pagination>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
import IncomeBankEdit from "./IncomeBankEdit"
export default {
  name: "IncomeBank",
  components: {
    IncomeBankEdit,
  },
  data() {
    return {
      EditVisible: false,//弹出表单
      crumbsData: {  //面包屑
        titleList: [
          { title: '其他配置', method: () => { window.histroy.back() } },
          { title: '进账银行', method: () => { window.histroy.back() } }
        ],
      },
      isExistDefult:[],
      tableData: {},
      maxHeight: 0,
      tableShow: false,
      tableData: [
      ],
      tableQuery: {
        page: 1,
        pageCount: 20
      },
      formType: "",
    }
  },
  mounted() {
    eventBus.$emit('asideMenuShow', 'basicsMenuShow6')
    this.init();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, '.overDue .kl-table', ['.overDue .block', '.overDue .toolbar'])
    })
  },
  methods: {
    init() {
      let _this = this
      let params = {
        "busicode": "IncomeBankList",
        "data": this.tableQuery,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        console.log(res)
        _this.tableData = res;

        res.list.forEach(i=>{
       if(i.isDefault == 1){
         this.isExistDefult.push(i.id);
       }
       });
        
      })
    },
    // 搜索
    search() {
      this.tableQuery.page = 1;
      //this.init()
    },
    // 添加按钮点击事件
    add(val) {
      this.EditVisible = true;
      if (val === 'add') {
        this.formType = "IncomeBankAdd"
      } else {
        this.formType = "IncomeBankUpdate"
        console.log(val)
        this.$nextTick(()=>{
              this.$refs.IncomeBankEdit.editData(val);
        })
      
      }
    },
    del(val) {
      var _this = this
      _this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          "busicode": "IncomeBankDelete",
          "data": [val.id],
        }
        _this.$api.fetch({ params: params }).then(res => {
          _this.$message({
            showClose: true,
            message: "删除成功",
            type: 'success'
          });
          _this.init();
        })
      }).catch(() => {
        //几点取消的提示
      });
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
      this.EditVisible = false;
    },
    //保存按钮
    submitForm() {
      this.$refs.IncomeBankEdit.submitForm(this.formType);
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
<style lang="scss" scoped>
.IncomeBank {
  width: 100%;
  height: 100%;
  .IncomeBankIndex {
    width: 100%;
    height: calc(100% - 41px);
  }
}
</style>
