<template>
  <div class="water-maintenance">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button size="mini" type="primary" @click="handleSend('all')">全部发送</el-button>
        <el-button size="mini" type="primary" @click="handleSend('some')">发送</el-button>
      </div>
    </div>
    <div class="waterMaintenanceIndex">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline" label-width="80px">
          <el-form-item label="营业区域：" class="width-150">
            <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessAreaOptions" :show-all-levels="false" :props="props">
            </el-cascader>
          </el-form-item>
          <el-form-item label="用户编号：" class="width-150">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.userNo" size="mini" placeholder="用户编号" clearable @keydown.enter.native="init" />
          </el-form-item>
          <el-form-item label="地址：" class="width-150" label-width="60px">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.ctmAddr" size="mini" placeholder="地址" clearable @keydown.enter.native="init" />
          </el-form-item>
          <el-form-item label="册本号：" class="multiInput">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.startBookNo" size="mini" placeholder="起始号码" clearable @keydown.enter.native="init" />
            <span>至</span>
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.endBookNo" size="mini" placeholder="结束号码" clearable @keydown.enter.native="init" />
          </el-form-item>
          <el-form-item label="排序号：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" v-model="tableQuery.sortStart" placeholder="" clearable size="mini"></el-input>
          </el-form-item><span class="separator">~</span>
          <el-form-item label="">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" v-model="tableQuery.sortEnd" placeholder="" clearable size="mini"></el-input>
          </el-form-item>
          <el-form-item label="抄表员：" class="width-150">
            <el-select ref="select3" v-model="tableQuery.meterReadingStaffAccount" placeholder="请选择" clearable @keydown.enter.native="search">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(item,index) in postUsers" :key="index" :label="item.userName" :value="item.userAccount"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="阶梯人数：" class="multiInput">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.startPersonNum" size="mini" placeholder="起始人数" clearable @keydown.enter.native="init" />
            <span>至</span>
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.endPersonNum" size="mini" placeholder="结束人数" clearable @keydown.enter.native="init" />
          </el-form-item>
          <el-form-item>
            <el-button class="searchBtn" @click="init" icon="el-icon-search"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table v-if="tableShow" ref="table" :max-height="maxHeight" stripe border :data="tableData.list" class="change-tables-table" @row-click="btnFlag" @selection-change="handleSelect">
          <el-table-column type="index" label="NO." fixed="left" width="50" :index="indexMethod" />
          <el-table-column type="selection" />
          <el-table-column prop="sortNo" label="排序号" min-width="80" />
          <el-table-column prop="userNo" label="用户编号" min-width="120" />
          <el-table-column prop="userName" label="用户名称" min-width="80" show-overflow-tooltip />
          <el-table-column prop="ctmAddr" label="地址" min-width="100" show-overflow-tooltip />
          <el-table-column prop="bookNo" label="册本号" min-width="100" />
          <el-table-column prop="meterReadingStaffName" label="抄表员" min-width="100" />
          <el-table-column prop="mobile" label="电话号码" min-width="100" />
        </el-table>

      </div>
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
      </div>
    </div>
    <el-dialog :visible.sync="show" title="停水内容" @close="handleClose">
      <el-input v-model="content" type="textarea" :autosize="{minRows: 3}" />
      <div slot="footer" class="footer">
        <el-button size="mini" type="primary" @click="handleSubmit">确定</el-button>
        <el-button size="mini" type="info" @click="handleClose">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      flag: false,
      props: {//树结构格式
        value: 'id',
        label: 'name',
        emitPath: false
      },
      crumbsData: {
        titleList: [
          { title: "客户通知" },
          { title: "短信通知" },
          { title: "自定义通知" }
        ]
      },
      tableQuery: {
        page: 1,
        pageCount: 20,
        businessArea: '',
        userNo: '',
        startBookNo: '',
        endBookNo: '',
        ctmAddr: '',
        startPersonNum: '',
        endPersonNum: '',
        meterReadingStaffAccount: '',
        sortStart: '',
        sortEnd: '',
      },
      // 抄表员下拉选择数据
      postUsers: [],
      dataList: [],
      tableShow: true,
      maxHeight: 0,
      tableData: {
        list: [],
        total: 0
      },
      businessAreaOptions: [],
      selected: [],
      content: '',
      show: false,
      type: ''
    }
  },
  created () {
    this.init()
    this.getPostUser();
    this.selectBAreaOptions()
    this.$nextTick(() => {
      this.common.changeTable(this, ".waterMaintenanceIndex", [
        ".waterMaintenanceIndex .toolbar",
        ".waterMaintenanceIndex .block"
      ]);
    })

  },
  methods: {
    init () {
      let params = {
        busicode: "StopWaterNoticeList",
        data: this.tableQuery
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.tableData = res;
        })
        .catch(() => {
          this.tableData = {
            list: [],
            total: 0
          }
        });
    },
    btnFlag (row, col, event) {
      row.flag = !row.flag;
      this.$refs.table.toggleRowSelection(row, row.flag);
    },
    //营业区域
    selectBAreaOptions () {
      let _this = this
      let params = {
        "busicode": "BusinessAreaTree",
        "data": {

        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = this.getArr1(res)
        this.businessAreaOptions = data.children;
      })
    },
    enterEvents(){},
    getPostUser () {
      const params = {
        busicode: 'PostUserSelect',
        data: {
          postNo: '2'
        }
      }
      this.$api.fetch({
        params
      }).then(res => {
        this.postUsers = res
      })
    },
    //树结构数据处理
    getArr1 (data) {
      function abc (arr) {
        arr.map(i => {
          if (i.isParent === false) {
            delete i.children;
          } else {
            abc(i.children);
          }
        });
      }
      abc(data.children);
      return data;
    },
    handleSelect (selection) {
      this.selected = selection
    },
    sending () {
      if (this.selected.length === 0) {
        this.$message.error('请选择至少一条记录')
        return
      }
      this.$confirm('是否确认发送？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          "busicode": "StopNoticeAllTemMessage",
          "data": {
            ...this.tableQuery,
            content: this.content,
            masTemplateId: '604ae56c5d6f1866a022abf9',
            userNoList: this.selected.map(item => item.userNo)
          }
        }
        this.$api.fetch({
          params,//参数
        }).then(res => {
          this.$message({
            dangerouslyUseHTMLString: true,
            message: '<p>短信已成功提交！</p><p class="attention">注意：短信发送时间较长，请勿重复提交，否则会导致用户收到重复短信</p>',
            type: 'success',
            offset: 250,
            duration: 4500,
            customClass: 'successTip',
          })
          this.handleClose()
          this.tableQuery.page = 1
          this.init()
        })
      }).catch(() => {
        this.$message({
          message: '取消发送',
          type: 'info'
        })
      })
    },
    sendingAll () {
      if (this.tableData.total === 0) {
        this.$message.error('当前查询条件无记录，请更换条件重新查询')
        return
      }
      this.$confirm('是否确认全部发送？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          "busicode": "StopNoticeAllTemMessage",
          "data": {
            ...this.tableQuery,
            content: this.content,
            masTemplateId: '604ae56c5d6f1866a022abf9',
            userNoList: []
          }
        }
        this.$api.fetch({
          params,//参数
        }).then(res => {
          this.$message({
            dangerouslyUseHTMLString: true,
            message: '<p>短信已成功提交！</p><p class="attention">注意：短信发送时间较长，请勿重复提交，否则会导致用户收到重复短信</p>',
            type: 'success',
            offset: 250,
            duration: 4500,
            customClass: 'successTip',
          })
          this.handleClose()
          this.tableQuery.page = 1
          this.init()
        })
      }).catch(() => {
        this.$message({
          message: '取消发送',
          type: 'info'
        })
      })
    },
    handleSend (val) {
      this.type = val
      this.show = true
    },
    handleClose () {
      this.show = false
      this.content = ''
    },
    handleSubmit () {
      if (this.content.length === 0) {
        this.$message.error('发送内容不能为空')
        return
      }
      if (this.type === 'all') {
        this.sendingAll()
      } else {
        this.sending()
      }
    },
    handleSizeChange (val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.init();
    },
    handleCurrentChange (val) {
      //显示多少页码
      if (val) {
        this.tableQuery.page = val;
        this.init();
      }
    },
    indexMethod (index) {
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
    },
    messageStateFormat (row, column) {
      const arr = ['已发', '未发', '发送成功', '发送失败']
      return arr[row[column.property]]
    }
  },
  watch: {
    maxHeight () {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
    'tableQuery.startPersonNum': {
      handler (val, oldVal) {
        if (!/^[0-9]*$/.test(val)) {
          this.tableQuery.startPersonNum = oldVal
        }
      }
    },
    'tableQuery.endPersonNum': {
      handler (val, oldVal) {
        if (!/^[0-9]*$/.test(val)) {
          this.tableQuery.endPersonNum = oldVal
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.water-maintenance {
  height: 100%;
  .waterMaintenanceIndex {
    height: calc(100% - 40px);
  }
}
.multiInput {
  width: 410px;
  .el-input {
    width: 150px !important;
    .el-input__inner{
        width: 100%;
    }
  }
}
</style>

<style lang="scss">
.successTip {
  font-size: 20px;
  .el-message__content {
    p {
      margin: 10px 5px;
      font-size: 16px;
      font-weight: 600;
    }
    .attention {
      color: #f56c6c;
    }
  }
}
.water-maintenance{
.multiInput {
  width: 410px;
  .el-input {
    width: 150px !important;
    .el-input__inner{
        width: 100%;
    }
  }
}
}
</style>
