
<template>
  <div class="SalesAccountEdit common-editDiv">
    <!-- 添加用户 -->
    <el-dialog title="添加" :visible.sync="addVisible" v-if="addVisible" append-to-body @close="closeAddUserDialog" :close-on-click-modal="false" class="button-dialog">
      <SelectCloseUser v-if="addVisible" ref="SelectCloseUser"></SelectCloseUser>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" @click="addRow">确 定</el-button>
        <el-button type="info" size="mini" @click="closeAddUserDialog">返 回</el-button>
      </div>
    </el-dialog>
    <!-- 欠费明细 -->
    <el-dialog class="common-dialog" title="欠费明细" :close-on-click-modal="false" :append-to-body="true" :visible.sync="DetailsArrearsShow" @close="closeDeatilsArrearsDialog">
      <DetailsArrears ref="detailsArrears" v-if="DetailsArrearsShow" :formData="ArrearsFormData"></DetailsArrears>
    </el-dialog>
    <el-form class="formBill" size="mini" :inline="true" :model="formData" label-width="130px" :rules="formDataRules" ref="salesForm">
      <!-- 单据信息 -->
      <billInfo v-if="billStute=='CloseUserUpdate'" ref="billInfo" :editType="0"></billInfo>
      <!-- 批量销户 -->
      <legend class="legendColumn">销户信息</legend>
      <el-form-item label="销户日期：" prop="cancelDate" :class="{'disable-item': NotDisabled}">
        <el-date-picker v-if="!NotDisabled" v-model="formData.cancelDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
        <span v-else>{{formData.cancelDate}}</span>
      </el-form-item>
      <el-form-item label="信息来源：" :class="{'disable-item': NotDisabled}">
        <el-select v-if="!NotDisabled" clearable v-model="formData.sourceFlag" placeholder="请选择销户类型">
          <el-option v-for="(item,index) in dictionaryData.PIS" :key="index" :label="item.name" :value="item.value"></el-option>
        </el-select>
        <span v-else>{{formData.sourceFlagName}}</span>
      </el-form-item>
      <el-form-item label="销户原因：" class="Remarks" prop="comments" :class="{'disable-item': NotDisabled}">
        <el-input v-if="!NotDisabled" type="textarea" v-model="formData.comments" placeholder></el-input>
        <span v-else>{{formData.comments}}</span>
      </el-form-item>

      <legend class="legendColumn">用户信息</legend>
      <div>
        <div class="addSalesBtn">
          <el-button size="mini" v-if="!NotDisabled" @click="clearAllInfo()" class="clearBtn">清空表格</el-button>
          <el-button size="mini" icon="el-icon-bottom" v-if="!NotDisabled" type="primary" @click="download()" class="select-btn">下载模板</el-button>
          <el-upload action="/" class="upload-demo" multiple :http-request="importExcel" v-if="!NotDisabled" :show-file-list="false">
            <el-button icon="el-icon-download" size="mini" type="primary" style="margin-left:10px">导入</el-button>
          </el-upload>
          <el-button size="mini" v-if="!NotDisabled" type="primary" @click="addUser()" class="select-btn" style="margin-left:10px">添加</el-button>
        </div>

        <el-table stripe highlight-current-row border :data="tableData.list" ref="klTableData" @row-click="rowClick">
          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod"></el-table-column>
          <el-table-column prop="userNo" min-width="100" label="用户编号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ctmName" min-width="80" label="客户地址" show-overflow-tooltip></el-table-column>
          <el-table-column prop="setupMeterAddr" min-width="120" label="装表地址"></el-table-column>
          <el-table-column prop="arrearsFlag" min-width="120" label="是否欠费"></el-table-column>
          <el-table-column prop="removeFlag" min-width="120" label="是否拆表">
            <template slot-scope="scope">
              <el-select v-model="scope.row.removeFlag" :disabled="NotDisabled" placeholder="是否拆表" @change="oldHandleWayChange">
                <el-option v-for="item in removeFlagOptions" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="businessArea" min-width="150" label="营业区域"></el-table-column>
          <el-table-column label="操作" fixed="right" width="150">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="showArrearsDetail(scope.row)" v-if="scope.row.arrearsFlag == '是'">欠费明细</el-button>
              <el-button size="mini" type="text" :disabled="NotDisabled" @click="deleteRow(scope.$index,scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="block" v-if="billStute=='OpenAccUpdate'">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 50, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
        </el-pagination>
      </div>
      <!-- 流程处理 -->
      <legend class="legendColumn">流程处理</legend>
      <div id="workflowDiv"></div>
    </el-form>
  </div>
</template>
<script>
import billInfo from "@/views/publicModule/infmtnManagement/billInfo"; // 单据信息
import DetailsArrears from "@/components/DetailsArrears/index"; //欠费明细
import SelectCloseUser from "@/components/AddUser/index"; // 选择用户
export default {
  name: "SalesAccountEdit",
  props: ["idCuster", "billStute", "userNo"],
  components: {
    billInfo,
    SelectCloseUser,
    DetailsArrears,
  },
  data () {
    return {
      uploadFileShow: true,
      uploadIcon: "el-icon-minus",
      receiptType: "USER_CLOSE",
      // searchBtnShow: true,
      addVisible: false, //添加用户
      NotDisabled: true,
      DetailsArrearsShow: false,//欠费信息
      searchUserNum: "",
      formData: {
        id: "",
        // ctmNo: "",
        // userNo: "",
        cancelDate: this.common.date(), //销户日期
        sourceFlag: "1", //信息来源
        // delayDays: "", //延期天数
        comments: "", //销户原因
        // removeFlag: 0, // 是否拆表
        // oldHandleWay: "", // 旧表处理方式
        // oldMeterNum: "", // 止码
        list: [],
      },
      //欠费明细查询条件
      ArrearsFormData: {
        userNo: '',
      },
      tableData: {
        list: [],
      },
      //打开功能下
      wayOpen: "SalesAccount",
      //是否可以填写
      userInfoEditType: 0,
      waterMEditType: 0,
      //单据信息
      billData: {},
      //用户信息
      userData: {},
      //水表信息
      waterMData: {},
      //数据字典
      dictionaryData: [],
      //用户相关信息
      // allData: [],
      approveFlag: 0,
      NotDisabled: false, //是否可编辑
      removeFlagOptions: [{ label: '否', value: "0" }, { label: '是', value: "1" }],
      oldHandleWayOptions: [{ label: '入库', value: '0' }, { label: '作废', value: '1' }], // 旧表处理方式
      formDataRules: {
        comments: [{ required: true, message: "请输入销户说明", trigger: blur }],
      },
      tableQuery: {
        id: '',
        page: 1,
        pageCount: 20
      },
      hasChange: false,
    };
  },
  mounted () {
    this.dictionaryDataOption();

    if (this.idCuster && this.idCuster.id != "") {
      console.log('详情')
      // this.searchBtnShow = false;
      this.init();
      eventBus.$emit('receiptId', this.idCuster.id)
    } else {
      console.log('新增')
      // this.searchBtnShow = true;
      let tempId = this.util.generateUUID()
      eventBus.$emit('receiptId', tempId)
      this.formData.tempId = tempId
      this.getHtmlData()
    }
  },
  methods: {
    inputMe (e) {
      let str = e.replace(/\ +/g, "")
      str = str.replace(/[\r\n]/g, "")
      return str;
    },
    init () {
      let params = {
        busicode: "CloseUserQuery",
        data: { id: this.idCuster.id }
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          this.formData = res;
          this.searchUserNum = res.userNo
          // this.initUserNo()
          //单据信息
          this.getBillData(res);
          if (
            this.formData.processState == "approval" ||
            this.formData.processState == "END" ||
            this.formData.processState == 'CANCEL'
          ) {
            this.NotDisabled = true;
            this.approveFlag = 1;
          }
          // if (this.formData.processState == 'register') {
          // this.searchBtnShow = true;
          // }
          this.getUserList();
          this.getHtmlData();
        });
    },
    getUserList () {
      let params = {
        busicode: "CloseUserDetailList",
        data: { userCloseId: this.idCuster.id }
      }
      this.$api.fetch({ params }).then(res => {
        this.tableData = res;
        this.$nextTick(() => {
          this.hasChange = false;
          console.log('change')
        })
      })
    },
    // 获取审批流前端代码
    getHtmlData () {
      let _this = this;
      //************启用流程代码************** */
      _this.common.getProcessShowView(
        "USER_CLOSE",
        "审批流配置:" +
        _this.formData.processName +
        "(" +
        _this.formData.billNo +
        ")", // 流程标题,一般是单据类型加单据编号
        _this.formData.id, // 任务id
        _this.formData.processInstanceId, // 流程实例Id，添加时可为空
        "workflowDiv",
        _this,
        () => {
          if (window.location.href.indexOf("HallBusiness") > 0 || window.location.href.indexOf("PendingTrial") > 0 || window.location.href.indexOf("WaterSideIndex") > 0) {
            // 流程中心模块触发
            _this.$parent.$parent.closeDialog();
          } else {
            // 普通模块触发
            _this.$parent.closeDialog(); // 提交后回调方法
          }
        },
        this.approveFlag, // 等于0时，先保存后提交 等于1时，直接提交
        this.billStute
      );
    },
    getBillData (res) {
      // 单据信息
      this.billData = {
        billNo: res.billNo, //单据编号
        billDate: res.billDate //单据日期
      };
      this.$refs.billInfo.init(this.billData);
    },

    dictionaryDataOption (res) {
      // 数据字典
      var dictionaryDataParams = {
        busicode: "DictionarySelect",
        data: "PIS"
      };
      this.$api.fetch({ params: dictionaryDataParams })
        .then(res => {
          this.$set(this, "dictionaryData", res);
        }).catch(res => {
          this.$set(this, "dictionaryData", []);
        });

    },
    getFormData (res, type) {
    },
    getFormbData () {
      this.formData.list = this.tableData.list;
      return this.formData
    },
    submit (type) {
      this.$refs.salesForm.validate(v => {
        if (v) {
          console.log('type', type)
          let data = this.getFormbData();
          let params = {
            busicode: type,
            data: data
          };
          console.log('params', params, 'data.list.length', data.list.length)
          if (data.list.length == 0) {
            this.$message({
              type: 'error',
              message: "请选择需要销户的用户"
            })
            return;
          }
          // return;
          this.$api.fetch({ params }).then(res => {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success'
            });
            if (window.location.href.indexOf("HallBusiness") > 0 || window.location.href.indexOf("PendingTrial") > 0 || window.location.href.indexOf("WaterSideIndex") > 0) {
              // 流程中心模块触发
              this.$parent.$parent.closeDialog();
            } else {
              // 普通模块触发
              this.$parent.closeDialog(); // 提交后回调方法
            }
          });
        }
      })
    },

    async BeforeSubmit () {
      return new Promise(resolve => {
        this.$refs.salesForm.validate(v => {
          if (v) {
            if (this.tableData.list.length == 0) {
              resolve('用户列表为空，无法提交')
            } else {
              resolve('')
            }
          } else {
            resolve('销户信息必填项未填，无法提交')
          }
        })


      })
    },
    // initUserNo () {

    //用户编号查询
    // if (this.searchUserNum == "") {
    //   this.$message({
    //     message: "用户编号不能为空。",
    //     type: "warning"
    //   });
    //   return;
    // }
    // let status = 7
    // if (this.formData.processState == "END") {
    //   status = ''
    // }
    // let data = {
    //   userNo: this.searchUserNum,
    //   status: status,//状态为9查询除销户以外的
    // };
    // let params = { busicode: "UserSelect", data };
    // this.$api
    //   .fetch({
    //     params //参数
    //   })
    //   .then(res => {
    //     this.allData = res
    //     this.formData.ctmNo = res.ctmInfo.ctmNo
    //     this.formData.userNo = res.userInfo.userNo
    //     if (this.formData.removeFlag == 1 && this.formData.oldMeterNum == "") { //为拆表且止码为空，默认使用最后抄码
    //       this.$set(this.formData, 'oldMeterNum', res.userInfo.lastReadingNum);
    //     }
    //     this.getFormData(res)
    //     this.getDataLength()
    //     this.$refs.uploadFiles.editUserNo(res.userInfo.userNo)
    //   });
    // },

    getDataLength () {
      let params = {
        busicode: "ChargeLackDetail",
        data: {
          userNo: this.searchUserNum
        }
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          if (res.length > 0) {
            this.$notify({
              title: "费用未结清提醒",
              message: "此用户费用未结清！",
              type: "warning"
            });
          }
        });
    },
    oldHandleWayChange (val) {
    },
    // 欠费详情
    showArrearsDetail (row) {
      console.log(row);
      this.ArrearsFormData.userNo = row.userNo;
      this.DetailsArrearsShow = true;
      // this.$refs.detailsArrears.init();
    },
    // 删除行
    deleteRow (index, row) {
      console.log('index', this.tableData.list.length);
      if (this.tableData.list.length > 0) {
        this.$confirm('是否确认删除该行?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableData.list.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    //获取表格序号
    indexMethod (index) {
      return (
        this.tableQuery.pageCount * (this.tableQuery.page - 1) + (index + 1)
      );
    },
    addRow () {
      // let list = this.$refs.SelectCloseUser.selectData.filter(item => {
      //   return this.tableData.list.indexOf(item) != -1
      // });
      if (!Array.isArray(this.$refs.SelectCloseUser.selectData) || this.$refs.SelectCloseUser.selectData.length == 0) {
        this.$message({
          type: "error",
          message: "请选择用户"
        })
        return;
      }
      //调接口方式
      // let list = this.$refs.SelectCloseUser.selectData.map(item => {
      //   return {
      //     userNo: item.userNo,
      //     removeFlag: "",
      //     ctmName: item.ctmName,
      //     ctmAddr: item.ctmAddr,
      //     setupMeterAddr: item.setupMeterAddr,
      //     businessArea: item.businessArea
      //   }
      // });
      // console.log('list', list)
      // let params = {
      //   busicode: "CloseUserDetailInsert",
      //   data: []
      //     // list: [],
      // }
      // if (this.tableData.list.length == 0) { // 列表为空，直接传全部
      //   params.data = list
      // } else { // 去重
      //   let userNoList = this.tableData.list.map(item => {
      //     return item.userNo;
      //   })
      //   console.log("userNoList", userNoList)
      //   list.forEach(item => {
      //     if (userNoList.indexOf(item.userNo) == -1) {
      //       params.data.push(item);
      //     }
      //   })
      // }
      // console.log('params', params);
      // if (params.data.length == 0) {
      //   this.closeAddUserDialog();
      //   this.$notify({
      //     title: '成功',
      //     message: '选择的用户已存在列表中！',
      //     type: 'success'
      //   });
      //   return;
      // }
      // this.$api.fetch({ params }).then(res => {
      //   console.log('res', res);
      //   res.list.forEach(item => {
      //     this.tableData.list.push(item)
      //   })
      //   this.closeAddUserDialog();
      //   this.$notify({
      //     title: '成功',
      //     message: '操作成功',
      //     type: 'success'
      //   });
      // })

      // 直接添加方式
      let list = this.$refs.SelectCloseUser.selectData.map(item => {
        return {
          userNo: item.userNo,
          removeFlag: "0", // 默认不拆表
          ctmName: item.ctmName,
          ctmAddr: item.ctmAddr,
          setupMeterAddr: item.setupMeterAddr,
          businessArea: item.businessArea,
          arrearsFlag: item.arrearsFlag,
        }
      });
      if (this.tableData.list.length == 0) { // 列表为空，直接添加
        this.tableData.list = list;
      } else {
        // 列表不为空，去重
        let userNoList = this.tableData.list.map(item => { // 已存在列表中的用户
          return item.userNo;
        })
        list.forEach(item => {
          if (userNoList.indexOf(item.userNo) == -1) {
            this.tableData.list.push(item)
          }
        })
      }
      this.closeAddUserDialog();
      this.$notify({
        title: '成功',
        message: '添加成功',
        type: 'success'
      });
    },
    // 点击列表的某一行
    rowClick (row, column, event, $index) {

    },
    closeAddUserDialog () {
      this.addVisible = false
    },
    //清空表格
    clearAllInfo () {
      this.$confirm('确定清空表格数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        this.tableData.list = [];
        this.$message({
          type: 'success',
          message: "清空成功",
        })
      }).catch(e => {
        this.$message({
          type: 'info',
          message: "已取消",
        })
      })

    },
    // 下载模板
    download () {
      var params = {
        busicode: "CloseUserExport",
        data: {},
        token: sessionStorage.getItem("token"),
        sysType: "002"
      };
      window.open(
        this.common.getExportExcelIp() +
        "/project/exportExcel.api?json=" +
        encodeURIComponent(JSON.stringify(params))
      );
    },
    importExcel (file) {
      let _this = this;
      let params = {
        busicode: "CloseUserImport",
        type: 'import',
        data: {
          file: file.file
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        console.log('import res', res)
        let userNoList = this.tableData.list.map(item => {
          return item.userNo;
        })
        let message = "导入成功";
        res.userCloseList.forEach(item => {
          if (userNoList.indexOf(item.userNo) == -1) {
            this.tableData.list.push({
              userNo: item.userNo,
              removeFlag: item.removeFlag == "是" ? '1' : '0',
              ctmName: item.ctmName,
              ctmAddr: item.ctmAddr,
              setupMeterAddr: item.setupMeterAddr,
              businessArea: item.businessArea,
              arrearsFlag: item.arrearsFlag,
            });
          }else{
            message = "导入成功，重复用户未导入";
          }
        })
        this.$message({
          type: "success",
          message: message
        });
      })
    },
    // 添加用户
    addUser () {
      this.addVisible = true;
    },
    // 关闭欠费明细
    closeDeatilsArrearsDialog () {

    }
  },
  watch: {
    "tableData.list": {
      handler (newVal, oldVal) {
        this.hasChange = true;
        console.log('this.hasChange', this.hasChange);
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.SalesAccountEdit {
  height: 100%;
  .submitEditRight {
    display: block;
    margin: 0 10px 10px 10px;
  }
  .submitEditRightNone {
    display: block;
    margin: 0 10px 10px 10px;
  }
  .clearBtn {
    // border: none;
    background-color: #faa646;
    color: #fff;
  }
  .addSalesBtn {
    float: right;
    margin: 0px 10px 5px 10px;
  }
  .upload-demo {
    display: inline-block;
  }
}
</style>
