<template>
  <div class="backfillSubmitEdit">
    <div class="submit_edit_left">
      <div class="submit_edit_left_msg">
        <div class="msg_content">
          <span>用户编号：</span>
          <span>{{activeData.userNo}}</span>
        </div>

        <div class="msg_content">
          <span>用户名称：</span>
          <span>{{activeData.ctmName}}</span>
        </div>

        <div class="msg_content">
          <span>用户地址：</span>
          <span>{{activeData.ctmAddr}}</span>
        </div>

        <div class="msg_content">
          <span>旧表水表编号：</span>
          <span>{{activeData.oldMeterNo}}</span>
        </div>

        <div class="msg_content">
          <span>旧表水表表身号：</span>
          <span>{{activeData.oldFactoryNo}}</span>
        </div>

        <div class="msg_content">
          <span>水表口径：</span>
          <span>{{activeData.oldMeterBore}}</span>
        </div>

        <div class="msg_content">
          <span>上期抄码：</span>
          <span>{{activeData.upperNum}}</span>
        </div>
      </div>

      <div class="submit_edit_left_content">
        <el-form :model="activeData" ref="leftForm" label-width="120px" :rules="rules">
          <div class="my-input">
            <el-form-item label="换表日期：" prop="replaceDate">
              <el-date-picker v-model="activeData.replaceDate" size="mini" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </div>

          <div class="my-input">
            <el-form-item label="换表员：" size="mini" prop="replaceStaff">
              <el-select v-model="activeData.replaceStaff" placeholder="请选择">
                <el-option v-for="item in replaceStaffData" :key="item.userAccount" :label="item.userName" :value="item.userAccount">
                </el-option>
              </el-select>
            </el-form-item>
          </div>

          <div class="my-input">
            <el-form-item label="旧表底码：" prop="oldMeterNum">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="activeData.oldMeterNum" size="mini" @blur="blurTest('old')" type="Number"></el-input>
            </el-form-item>
          </div>

          <div class="my-input">
            <el-form-item label="新表编号：" prop="newMeterNo">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="activeData.newMeterNo" size="mini" clearable></el-input>
            </el-form-item>
          </div>

          <div class="my-input">
            <el-form-item label="新表起码：" prop="newMeterNum">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="activeData.newMeterNum" size="mini" clearable type="Number" @blur="blurTest('new')"></el-input>
            </el-form-item>
          </div>

          <div class="my-input">
            <el-form-item label="余量：" prop="margin">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="activeData.margin" size="mini" readonly="readonly" clearable></el-input>
            </el-form-item>
          </div>

          <div class="my-input">
            <el-form-item label="旧表处理方式：" size="mini" prop="oldHandleWay">
              <el-select v-model="activeData.oldHandleWay" placeholder="请选择">
                <el-option v-for="item in dictionaryData.OMD" :key="item.value" :label="item.name" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>

          <div class="my-input">
            <el-form-item label="备注：" prop="comments">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="activeData.comments" size="mini" clearable></el-input>
            </el-form-item>
          </div>

          <div class="my-input">
            <el-form-item>
              <el-button size="mini" type="primary">上传附件</el-button>
              <el-button size="mini" @click="submit()" type="primary">保存</el-button>
            </el-form-item>
          </div>

        </el-form>
      </div>

    </div>
    <div class="submit_edit_right">
      <el-form :inline="true" class="formBill" label-width="130px">

        <el-form-item class="form-left">
          <el-form-item class="search-input">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableDataParams.fuzzyQuery" placeholder="请输入用户编号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class='searchBtn' size="mini" @click="search" icon="el-icon-search"></el-button>
          </el-form-item>
        </el-form-item>

        <el-form-item label="单据编号：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model=" selectData.billNo" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="单据日期：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  class="read-only" disabled="disabled" v-model=" selectData.billDate" placeholder=""></el-input>
        </el-form-item>

        <legend class="legendColumn">换表信息</legend>

        <el-form-item label="计划完工日期：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="selectData.planFinishDate" size="mini" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="换表员：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="selectData.replaceStaffName" size="mini" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="换表类型：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="selectData.replaceTypeName" size="mini" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="水表数量：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="selectData.meterAmount" size="mini" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <el-form-item label="已回填数量：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="selectData.backfillAmount" size="mini" placeholder="" disabled class="read-only"></el-input>
        </el-form-item>
        <br>

        <div class="kl-table">
          <el-table highlight-current-row stripe highlight-current-row border :data="tableData" @row-click="rowClick">

            <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
            </el-table-column>

            <el-table-column prop="userNo" min-width="80" label="用户编号">
            </el-table-column>

            <el-table-column prop="ctmName" min-width="80" label="用户名称">
            </el-table-column>

            <el-table-column prop="ctmAddr" min-width="150" label="用户地址">
            </el-table-column>

            <el-table-column prop="oldMeterBore" min-width="80" label="水表口径">
            </el-table-column>

            <el-table-column min-width="100" prop="upperNum" label="上期抄码" show-overflow-tooltip>
            </el-table-column>

            <el-table-column min-width="80" prop="oldMeterNum" label="旧表底码" show-overflow-tooltip>
            </el-table-column>

            <el-table-column min-width="80" prop="newMeterNo" label="新表编号" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="newMeterNum" min-width="80" label="新表起码">
            </el-table-column>

            <el-table-column prop="margin" min-width="80" label="余量" show-overflow-tooltip>
            </el-table-column>

            <el-table-column min-width="140" prop="replaceDate" label="换表日期">
            </el-table-column>

            <el-table-column min-width="120" label="旧表水表编号" prop="oldMeterNo" show-overflow-tooltip>
            </el-table-column>

            <el-table-column min-width="120" label="旧表水表表身号" prop="oldFactoryNo" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="oldHandleWayName" min-width="120" label="旧表处理方式" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="comments" min-width="150" label="备注" show-overflow-tooltip>
            </el-table-column>

            <el-table-column label="操作" fixed="right" width="80">
              <template slot-scope="scope">
                <el-button type="text" @click="backfill(scope.$index, scope.row)">查看附件</el-button>
              </template>
            </el-table-column>

          </el-table>
          <!-- 分页 -->
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
            </el-pagination>
          </div>
        </div>
      </el-form>
    </div>

  </div>
</template>
<script>
import commonPart from "@/views/CustomerCenter/changeMangement/commonPart"; //公告模块
import uploadFile from "@/components/uploadPic"; //上传附件
import procedure from "@/components/procedure"; //流程审核
export default {
  name: "backfillSubmitEdit",
  props: ['backfillSubmitEditNeedData'],
  components: {
    uploadFile,
    procedure,
    commonPart
  },
  data() {
    return {
      // 数据字典
      dictionaryData: {},
      //接受父页面传过来的数据
      formData: {},
      // 表单校验
      rules: {
        newMeterNo: [{ required: true, message: "新表编号未填", trigger: "blur" }],
        replaceDate: [{ required: true, message: "换表日期未选", trigger: "blur" }],
        replaceStaff: [
          { required: true, message: "抄表员未选", trigger: "blur" }
        ],
        oldMeterNum: [{ required: true, message: "旧表底码未填", trigger: "blur" }],
        oldMeterNo: [{ required: true, message: "新表编号未填", trigger: "blur" }],
        newMeterNum: [{ required: true, message: "新表起码未填", trigger: "blur" }],
        margin: [{ required: true, message: "余量未填", trigger: "blur" }],
        oldHandleWay: [{ required: true, message: "旧表处理方式未选", trigger: "blur" }],
        comments: [{ required: true, message: "备注未填", trigger: "blur" }],
      },
      tableQuery: {
        page: 1,
        pageCount: 20,
      },
      // 列表数据
      tableData: [],
      // 列表数据入参
      tableDataParams: {
        receiptId: this.backfillSubmitEditNeedData.id,
      },
      // 点击的数据
      activeData: {
        userNo: '',
        ctmName: '',
        userAddr: '',
        oldMeterNo: '',
        oldFactoryNo: '',
        meterBore: '',
        upperNum: '',
        replaceDate: '',
        replaceStaff: '',
        oldMeterNum: '',
        newMeterNo: '',
        newMeterNum: '',
        margin: '',
        oldHandleWay: '',
        comments: '',
      },
      // 换表信息
      selectData: {},
      tableShow: false,
      maxHeight: 0,
      leftData: {
        OldTableProcessingOptions: [
          {
            label: "邓万",
            value: "1"
          },
          {
            label: "邓亿",
            value: "2"
          },
          {
            label: "邓兆",
            value: "3"
          }
        ]
      },

      // 列表中已回填数据（点击了保存）的新表编号
      savedCheck: [],
      // 换表员下拉数据
      replaceStaffData: [],

    };
  },
  mounted() {
    this.init();
    // var myDate = new Date();
    // myDate.getFullYear(); //获取完整的年份(4位,1970-????)
    // myDate.getMonth(); //获取当前月份(0-11,0代表1月)
    // myDate.getDate();
    // var month = myDate.getMonth() + 1;
    // for (let i = 0; i < this.tableData.length; i++) {
    //   this.tableData[i].meter = myDate.getFullYear() + "-" + month + "-" + myDate.getDate();
    // }
  },
  methods: {
    init() {
      // 列表信息数据
      this.getTableData()
      // 换表信息数据
      this.getMsChgList()
      // 数据字典数据
      this.getDictionary()
      // 换表员数据
      this.getReplaceStaffData()
    },
    // 获取列表数据以及左侧默认第一行数据信息
    getTableData() {
      let _this = this;
      let params = {
        busicode: "MsChgQuery",
        data: this.tableDataParams
      };
      _this.$api.fetch({
        params,//参数
      }).then(res => {
        _this.tableData = res.list

        if (_this.tableData.length > 0) {
          _this.activeData = _this.tableData[0]
          // 获取列表所有数据的新表编号，用来判断该数据是否修改过
          for (let i = 0; i < _this.tableData.length; i++) {
            _this.savedCheck[i] = _this.tableData[i].newMeterNo
          }
        } else {
          // 点击的数据
          _this.activeData = {
            userNo: '',
            ctmName: '',
            userAddr: '',
            oldMeterNo: '',
            oldFactoryNo: '',
            meterBore: '',
            upperNum: '',
            replaceDate: '',
            replaceStaff: '',
            oldMeterNum: '',
            newMeterNo: '',
            newMeterNum: '',
            margin: '',
            oldHandleWay: '',
            comments: '',
          }
        }
      })
    },

    //获取换表信息
    getMsChgList() {
      let _this = this;
      let data = {
        id: this.backfillSubmitEditNeedData.id,
        receiptType: 1,
      }
      let params = {
        busicode: "MsChgList",
        data,
      };
      this.$api.fetch({
        params,//参数
      }).then(res => {
        _this.selectData = res.list[0]
      })
    },
    // 数据字典（查询框）
    getDictionary() {
      var _this = this
      var params = {
        "busicode": "DictionarySelect",
        "data": "OMD"//（旧表处理方式）
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
    // 获取换表员数据
    getReplaceStaffData() {
      let _this = this;
      let params = {
        busicode: "PostUserSelect",
        data: { "postNo": "4" }
      };
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        _this.replaceStaffData = res
      })
    },
    //输入框失去焦点效验
    blurTest(str) {
      if (str == 'old') {
        if (parseFloat(this.activeData.oldMeterNum) >= parseFloat(this.activeData.upperNum)) {
          this.activeData.margin = parseFloat(this.activeData.oldMeterNum) - parseFloat(this.activeData.upperNum);
        } else {
          this.activeData.oldMeterNum = '';
          this.activeData.margin = '';
          this.$message({
            message: '旧表底码应大于上期抄码',
            type: 'warning'
          });
        }
      } else {
        if (parseFloat(this.activeData.newMeterNum) < 0) {
          this.$message({
            message: '新表起码应该大于0',
            type: 'warning'
          });
          this.activeData.newMeterNum = '';
        }
      }
    },
    //保存提交
    submit() {
      let _this = this;
      this.$refs['leftForm'].validate((valid) => {
        if (valid) {
          // 入参数据处理
          let saveData = {}
          saveData.receiptId = _this.backfillSubmitEditNeedData.id
          saveData.replaceDate = _this.activeData.replaceDate
          saveData.oldMeterNum = _this.activeData.oldMeterNum
          saveData.oldMeterNo = _this.activeData.oldMeterNo
          saveData.newMeterNum = _this.activeData.newMeterNum
          saveData.newMeterNo = _this.activeData.newMeterNo
          saveData.margin = _this.activeData.margin
          saveData.oldHandleWay = _this.activeData.oldHandleWay
          saveData.comments = _this.activeData.comments
          saveData.userNo = _this.activeData.userNo
          // 换表员value
          saveData.replaceStaff = _this.activeData.replaceStaff
          // 换表员name
          _this.replaceStaffData.forEach(item => {
            if (_this.activeData.replaceStaff == item.userAccount) {
              saveData.replaceStaffName = item.userName
            }
          })
          console.log(saveData.replaceStaffName)

          let params = {
            busicode: "MsChgBackfill",
            data: [saveData],
          };
          _this.$api.fetch({
            params,//参数
          }).then(res => {
            _this.init()

          })
        } else {
          this.$message({
            message: '数据未填完整！',
            type: 'warning'
          });
          return false;
        }
      });
    },
    // 返回前判断是否有数据尚未回填，提醒用户
    closeDialog() {
      let _this = this
      // 默认savedCheck不存在null
      let savedCheckNull = false
      for (let i = 0; i < this.savedCheck.length; i++) {
        if (this.savedCheck[i] === null) {
          savedCheckNull = true
          _this.$confirm('尚有数据未回填，是否确认退出？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            _this.$parent.backfillVisible = false
            _this.$parent.ChangeTablesShow = true
            _this.$parent.init()
          }).catch(() => {

          })
          break
        }
      }
      // 如果savedCheck不存在null，则表示所有数据已回填，可以直接退出
      if (!savedCheckNull) {
        _this.$parent.backfillVisible = false
        _this.$parent.ChangeTablesShow = true
        _this.$parent.init()
      }


    },
    // 点击列表的某一行
    rowClick(row, column, event, $index) {
      this.activeData = JSON.parse(JSON.stringify(row))
    },
    // 下载模板按钮
    exportExcel() {
      var _this = this
      var params = {
        busicode: "MsChgDownload",
        data: {
          receiptType: 1
        },
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      console.log('http://' + window.location.host + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
      window.open( window.location.host + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
    // 查询
    search() {
      this.init()
    },






    // 搜索
    demand() { },
    // 下载模板
    // downFile() {
    //   // var elemIF = document.createElement("iframe")
    //   // elemIF.src =  `${this.url}/fileDown.htm?importType=1`
    //   // elemIF.style.display = "none"
    //   // document.body.appendChild(elemIF)
    // },
    // 上传模板
    // uploading() {
    //   // this.uploadingVisible = true
    // },
    indexMethod(index) {
      //获取表格序号
      return (
        (this.tableQuery.pageCount - 20) * this.tableQuery.page + (index + 1)
      );
    },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      // this.tableQuery.pageCount = val
      // this.tableQuery.page = 1
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      // this.tableQuery.page = val
      this.init();
    },
    cellClick(row, column, cell, event) {
      //点击文件名
      let that = this;
    }
  }
};
</script>
<style lang="scss">
@import "../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.backfillSubmitEdit {
  height: calc(100% - 10px);
  .submit_edit_left {
    padding-top: 10px;
    width: 27%;
    display: inline-block;
    float: left;
    border-right: 1.5px solid #eaf4ff;
    height: calc(100% - 10px);
    .submit_edit_left_msg {
      font-size: 14px;
      border-bottom: 1.5px solid #eaf4ff;
      border-left: none;
      .msg_content {
        margin-left: 20px;
        padding-bottom: 10px;
        width: 100%;
      }
    }
    .submit_edit_left_content {
      font-size: 14px;
      padding-right: 15px;
      .el-input--mini {
        // width: 85%;
        .el-input__inner {
          width: 100% !important;
        }
      }
      .el-select {
        width: 100%;
      }
    }
    .el-form-item {
      margin-bottom: 0px;
    }
  }
  .submit_edit_right {
    width: 72%;
    display: inline-block;
    padding: 3px;
  }
  .formBill .el-form-item {
    width: 27%;
    margin-bottom: 8px;
  }
  .formBill .form-left {
    .el-form-item__content {
      width: 100%;
      .search-input {
        width: 63%;
      }
    }
  }
}
</style>
