<template>
  <div class="engineerFeeAdjust">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <span v-if="!showIndex && GCSKConfig == '1'" >
          <el-dropdown @command="printGCSK" style="line-height:28px;">
            <el-button type="primary"  size="mini">
              <span style="color: white;">
              打印水表领用单<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="printSingleHouse">单户打印</el-dropdown-item>
              <el-dropdown-item command="multipleSingleHouse">多户打印</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
        <el-upload v-if="!showIndex && (rowData.processState=='PROCESSING'||rowData.processState=='')" class="upload-file" :show-file-list="false" multiple action="/" :http-request="uploadAttachment" style="display:inline-block;margin-right:10px;">
          <el-button size="mini" type="primary">上传附件</el-button>
        </el-upload>
        <el-button v-if="!showIndex" type="primary"  size="mini" @click="viewAttachment()" >查看附件({{AttachmentQty}})</el-button>
        <!-- <el-button v-if="(!showIndex)&&rowData.status === 1" size="mini" type="primary" @click="collect(rowData)">收款</el-button> -->
        <el-button v-if="!showIndex" size="mini" @click="closeDialog">返回</el-button>
      </div>
    </div>
    <div class="pageIndex" v-if="showIndex">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form inline size="mini" label-position="right" label-width="80px" class="multiple-floor">
          <el-form-item label="工程编码：" class="width-150">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.projectCode" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item label="工程名称：" class="width-150">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.projectName" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item label="收款状态：" class="width-150">
            <el-select ref="select1" v-model="tableQuery.status" clearable>
              <el-option v-for="item in dictionaryData.PROJECT_PAYMENT_STATUS" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报装日期：" class="width-250">
            <el-date-picker type="daterange" value-format="yyyy-MM-dd" v-model="date" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>

          <el-form-item class="button-group">
            <el-button class="searchBtn" @click="search" icon="el-icon-search"></el-button>
            <el-button type="primary" @click="exportExcel">导出</el-button>
            <!-- <el-button type="primary" @click="handleRushRed">冲单</el-button> -->
          </el-form-item>

          <div v-show="isActive" class="advancedQuery">
            <el-form-item label="账单日期：" class="width-250">
            <el-date-picker type="daterange" value-format="yyyy-MM-dd" v-model="createTime" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
            <el-form-item label="收款日期：" class="width-250">
            <el-date-picker type="daterange" value-format="yyyy-MM-dd" v-model="paymentDate" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
            <el-form-item label="收款主体：" class="width-150">
              <el-select ref="projectChargeSelect" v-model="tableQuery.constructionUnit"  clearable>
                <el-option v-for="item in payeeData" :key="item.id" :label="item.subjectName" :value="item.subjectName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="收款渠道：" class="width-150">
              <el-select ref="paymentApproaches" v-model="tableQuery.paymentApproaches"  clearable>
                <el-option v-for="item in dictionaryData.BPC" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开票时间：" class="width-250">
              <el-date-picker type="daterange" value-format="yyyy-MM-dd" v-model="invoiceTime" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="收款人：" class="width-150">
              <el-select v-model="tableQuery.paymentStaff" clearable filterable placeholder="请选择">
                <el-option v-for="item in paymentStaffList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="toggle-btn" @click="hidden"><i :class="isActive ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></div>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row ref="table" stripe border :max-height="maxHeight" :data="tableData.list">
          <el-table-column type="index" fixed="left" label="NO." width="50" :index="indexMethod"></el-table-column>
          <el-table-column label="操作" width="110" fixed="left">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="detail(scope.row)">详情</el-button>
              <el-button v-if="(scope.row.statusName !== '待审批' &&scope.row.statusName !== '待收款' &&scope.row.processState !== 'END' && scope.row.processState !== 'CANCEL')" type="text" size="mini" @click="changeMoney(scope.row)">变更</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="statusName" min-width="80" label="收款状态" show-overflow-tooltip fixed="left">
          </el-table-column>
          <el-table-column prop="projectCode" min-width="130" label="工程编码" show-overflow-tooltip fixed="left"></el-table-column>
          <el-table-column prop="projectName" min-width="150" label="工程名称" show-overflow-tooltip fixed="left"></el-table-column>
          <el-table-column prop="projectAddress" min-width="300" label="工程地址" show-overflow-tooltip fixed="left"></el-table-column>
          <el-table-column prop="clientName" min-width="100" label="客户名称" show-overflow-tooltip fixed="left"></el-table-column>
          <el-table-column prop="projectDate" min-width="130" label="报装日期" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createTime" min-width="160" label="账单日期" show-overflow-tooltip></el-table-column>
          <el-table-column prop="paymentDate" min-width="130" label="收款日期" show-overflow-tooltip></el-table-column>
          <el-table-column prop="money" min-width="80" label="收款金额" show-overflow-tooltip></el-table-column>
          <el-table-column prop="typeName" min-width="80" label="收款类型" show-overflow-tooltip></el-table-column>
          <el-table-column prop="paymentStaff" min-width="80" label="收款人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="constructionUnit" min-width="130" label="收款主体" show-overflow-tooltip></el-table-column>
          <el-table-column prop="invoiceUrl" min-width="130" label="发票地址" show-overflow-tooltip></el-table-column>
          <el-table-column prop="invoiceNumber" min-width="130" label="票号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="invoicePerson" min-width="130" label="开票人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="invoiceTime" min-width="130" label="开票时间" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
      </div>
    </div>

    <projectProceeds ref="projectProceeds" v-else :id="detailId" :pjId="rowpjId" :dict="dictionaryData"></projectProceeds>

    <pjCollectDialog :data="rowData" @success="showIndex? init():closeDialog()" ref="pjCollectDialog"></pjCollectDialog>
    <pjCollectChangeDialog :data="rowData" @success="showIndex? init():closeDialog()" ref="pjCollectChangeDialog"></pjCollectChangeDialog>
  </div>
</template>

<script>
import projectProceeds from './projectProceeds.vue';
import pjCollectDialog from './pjCollectDialog.vue';
import pjCollectChangeDialog from './pjCollectChangeDialog.vue'

export default {
  components: { projectProceeds, pjCollectDialog,pjCollectChangeDialog},
  data () {
    return {
      crumbsData: {
        //面包屑
        titleList: [
          { title: "工程管理" },
          { title: "用户工程" },
          { title: "工程收款" }
        ]
      },
      createTime: [],
      invoiceTime: [],
      paymentDate: [],
      tableQuery: {
        projectCode: '',
        projectName: '',
        createStartDate: '',
        createEndDate: '',
        paymentStartDate: '',
        paymentEndDate: '',
        constructionUnit: "",
        paymentApproaches: "",
        invoiceStartTime: "",
        invoiceEndTime: "",
        paymentStaff: "", // 收款人
        page: 1,
        pageCount: 20
      },
      date: [],
      isActive: false,
      tableData: {
        list: [],
        total: 0
      },
      rowData: {},
      money: ' - ',
      showIndex: true,
      maxHeight: 0,
      dictionaryData: {},
      detailShow: false,
      detailId: '',
      rowpjId: "",
      selected: [],
      payeeData: [],
      AttachmentQty:0,//附件个数
      options:[{
        value: '1',
        label: '单户打印'
      }, {
        value: '2',
        label: '多户打印'
      },],
      // 打印水表领用单
      GCSKConfig: "",
      paymentStaffList: [], // 收款人数据
    }
  },
  mounted () {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
    let beforeYM = month < 2 ? (year - 1).toString() + '-' + (12 - (Math.abs(month - 1) % 12)) + '-01' : (year.toString() + '-' + (month-1) + '-01');
    const curDate = new Date(beforeYM);
    let tempDay = new Date(curDate.getFullYear(), curDate.getMonth() + 1, 0).getDate(); // 将日期设置为0，表示自动计算为本月(这里指的是前两个月)的最后一天
    let beforeDay = tempDay < day ? tempDay : day; // 判断是不是大于前两个月所在月的天数
    const twoMonthAgo = curDate.getFullYear() + '-' + (curDate.getMonth() + 1) + '-' + beforeDay;
    this.date = [twoMonthAgo, this.common.date()]
    this.tableQuery.projectStartDate = twoMonthAgo
    this.tableQuery.projectEndDate = this.common.date()
    this.getDictionary()
    this.getProjectPayee()
    this.getPaymentStaffList(); // 获得收款人数据
    this.init();
    this.getGCSK();
    this.$nextTick(() => {
      this.common.changeTable(this, ".engineerFeeAdjust", [
        ".engineerFeeAdjust .toolbar",
        ".engineerFeeAdjust .bread-contain",
        ".engineerFeeAdjust .toggle-btn",
        ".engineerFeeAdjust .block"
      ]);
    })
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    enterEvents (e) {
      if (e.keyCode == 13) {
        this.init()
        this.$refs.select1.blur()
      }
    },
    // 收款人数据获取
    getPaymentStaffList() {
      var _this = this;
      var params = {
        "busicode": "PostUserSelect",
        "data": { "postNo": "1" },
      };
      this.$api.fetch({
        params: params //参数
      }).then(res => {
        _this.paymentStaffList = res;
      });
    },
    init () {
      var _this = this
      var params = {
        "busicode": "PjCollectionList",
        "data": this.tableQuery
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.tableData = res
        for(let i=0;i<_this.tableData.list.length;i++){
          _this.tableData.list[i].projectDate=_this.tableData.list[i].projectDate.split(' ')[0]
          _this.tableData.list[i].paymentDate=_this.tableData.list[i].paymentDate.split(' ')[0]
        }
        _this.tableData.list.forEach(item => {
          _this.dictionaryData.BPT.forEach(list => {
            if (item.type == Number(list.value)) {
              item.typeName = list.name
            }
          })
        });
      })
    },
    uploadAttachment(file) {
        this.$refs.projectProceeds.uploadAttachment(file);
    },
    viewAttachment() {
        this.$refs.projectProceeds.viewAttachment('show');
    },
    search () {
      this.tableQuery.page = 1
      this.tableQuery.pageCount = 20
      this.init();
    },
    // 数据字典数据获取
    getDictionary () {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "PROJECT_PAYMENT_STATUS,BPT,BPC"
        //收款状态
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    hidden () {
      this.isActive = !this.isActive
      this.$nextTick(() => {
        this.common.changeTable(this, ".engineerFeeAdjust", [
          ".engineerFeeAdjust .toolbar",
          ".engineerFeeAdjust .bread-contain",
          ".engineerFeeAdjust .toggle-btn",
          ".engineerFeeAdjust .block"
        ]);
      })
    },
    closeDialog () {
      this.showIndex = true
      this.init()
    },
    indexMethod (index) {
      //获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
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
    back () {
      this.detailShow = false
    },
    // 导出表格内容
    exportExcel(){
      var params = {
        busicode:'PjPaymentExport',
        data: {
          ...this.tableQuery,
          page:1,
          pageCount:999999
        },
        token: sessionStorage.getItem("token"),
        sysType: "002"
      };
      window.open(this.common.getExportExcelIp() + "/project/exportExcel.api?json=" + encodeURI(JSON.stringify(params))
      );
    },
    // 打印水表领用单的配置参数
    getGCSK () {
      let _this = this;
      let params = {
        busicode: "ConfigList",
        data: {
          status: '1',
          searchContent: 'GCSK_SFXSDYAN',
        }
      };
      this.$api.fetch({
        params
      }).then(res => {
        if (res.list.length && res.list[0].configValue) {//为1则启用
          this.GCSKConfig = res.list[0].configValue;
        }
      })
    },
    printGCSK(val) {
      // 获得表格中勾选的数据
      if(this.$refs.projectProceeds.$refs.buildwaterMeter.selectList.length === 0) {
        this.$message({
          type: 'warning',
          message: '请勾选至少一条数据！'
        })
        return
      }
      // 单户打印
      if(val == "printSingleHouse"){
        for(let i = 0; i <this.$refs.projectProceeds.$refs.buildwaterMeter.selectList.length; i++){
          let params = {
            busicode: "pjChargeDocOneExport",
            data: {
              "id": this.$refs.projectProceeds.$refs.buildwaterMeter.selectList[i].id,
              "pjCollectionId": this.detailId
            },
            token: sessionStorage.getItem("token"),
            sysType: "002"
          };
          window.open(this.common.getExportExcelIp() + "/project/docInterface.api?json=" + encodeURIComponent(JSON.stringify(params)));
        }
      }else if(val == "multipleSingleHouse"){
        // 多户打印
        let tempId = [];
        this.$refs.projectProceeds.$refs.buildwaterMeter.selectList.forEach(item=> {
          tempId.push(item.id);
        })
        let params = {
          busicode: "pjChargeDocMoreExport",
          data: {
            "ids": tempId,
            "pjCollectionId": this.detailId
          },
          token: sessionStorage.getItem("token"),
            sysType: "002"
        };
        window.open(this.common.getExportExcelIp() + "/project/docInterface.api?json=" + encodeURIComponent(JSON.stringify(params)));
      }
    },
    detail (rowData) {
      this.detailId = rowData.id;
      this.rowpjId = rowData.pjId;
      this.rowData = Object.assign({}, rowData);
      this.$nextTick(() => {
        this.detailShow = true
      })
      this.showIndex = false
    },
    collect (rowData) {
      this.rowData = Object.assign({}, rowData);
      this.$nextTick(() => {
        // console.log("rowData",JSON.stringify(rowData));
        this.$refs.pjCollectDialog.pjCollectShow();
      })

    },

    changeMoney (rowData) {
      this.rowData = Object.assign({}, rowData);
      this.$nextTick(() => {
        // console.log("rowData",JSON.stringify(rowData));
        this.$refs.pjCollectChangeDialog.pjCollectChangeShow();
      })
    },


    submit () {
      this.$refs.add.submit()
    },
    close () {
      this.back()
      this.init()
    },
    handleSelection (selection) {
      this.selected = selection
    },
    // 获取工程收款主体
    getProjectPayee () {
      var _this = this
      var params = {
        "busicode": "ProjectPayeeList",
        "data": {
          page: 1,
          pageCount: 1000,
          status:1
        }
        //结算方式
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.payeeData = res.list
      })
    },
    // handleRushRed() {
    //   if(this.selected.length === 0) {
    //     this.$message({
    //       type: 'warning',
    //       message: '请勾选至少一条数据！'
    //     })
    //     return
    //   }
    //   if(this.selected.some(item => item.chargeFlag === 0)) {
    //     this.$message({
    //       type: 'warning',
    //       message: '当前勾选数据包含已冲单数据！'
    //     })
    //     return
    //   }
    //   this.$confirm('是否确认冲单?', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //       var _this = this
    //       var params = {
    //         "busicode": "PjRushRed",
    //         "data": {ids: this.selected.map(item => {
    //           return {
    //             id: item.id,
    //             receiptId: item.receiptId,
    //             chargeDate: item.chargeDate
    //           }
    //         })}
    //       }
    //       this.$api.fetch({
    //         params: params,//参数
    //       }).then(res => {
    //         this.$message({
    //           type: 'success',
    //           message: '操作成功'
    //         })
    //         this.init()
    //       })
    //     }).catch(() => {
    //       this.$message({
    //         type: 'info',
    //         message: '取消冲单'
    //       })
    //     })
    // }
  },
  watch: {
    date (val) {
      if (val && val.length > 0) {
        this.tableQuery.projectStartDate = val[0]
        this.tableQuery.projectEndDate = val[1]
      } else {
        this.tableQuery.projectStartDate = ''
        this.tableQuery.projectEndDate = ''
      }
    },
    createTime(val){
      if (val && val.length > 0) {
        this.tableQuery.createStartDate = val[0]
        this.tableQuery.createEndDate = val[1]
      } else {
        this.tableQuery.createStartDate = ''
        this.tableQuery.createEndDate = ''
      }
    },
    invoiceTime(val){
      if (val && val.length > 0) {
        this.tableQuery.invoiceStartTime = val[0];
        this.tableQuery.invoiceEndTime = val[1];
      } else {
        this.tableQuery. invoiceStartTime = '';
        this.tableQuery.invoiceEndTime = '';
      }
    },
    paymentDate(val){
      if (val && val.length > 0) {
        this.tableQuery.paymentStartDate = val[0]
        this.tableQuery.paymentEndDate = val[1]
      } else {
        this.tableQuery.paymentStartDate = ''
        this.tableQuery.paymentEndDate = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.engineerFeeAdjust {
  height: 100%;
}
.kl-table {
  margin-top: 15px;
}
// 固定区域盖住了横向滚动条，固定部分的滚动条会被禁用，需要加层级
/deep/ .el-table__body-wrapper{
  z-index: 2;
}
</style>
