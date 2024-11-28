<template>
  <div class="we-chat">
      <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <h2 class="tab-title">
          <i></i>
          微信公众号管理</h2>
      </div>
      <div class="btn-area">
        <el-button @click="add()" icon="el-icon-plus">新建</el-button>
      </div>
      <div class="we-chat-right-content">
        <div class="kl-table" :style="{height: maxHeight + 'px'}">
          <el-table 
                    v-if="tableShow" 
                    :max-height="maxHeight" 
                    stripe border 
                    :data="tableData" 
                    @cell-click="cellClick" 
                    class="wuserInfo-table">

            <el-table-column type="index" label="NO." width="50" :index="indexMethod">
            </el-table-column>

            <el-table-column prop="organName" min-width="100" label="组织机构名称">
            </el-table-column>

            <el-table-column prop="applyID" min-width="80" label="应用ID">
            </el-table-column>

            <el-table-column prop="applyKey" min-width="80" label="应用密钥">
            </el-table-column>

            <el-table-column prop="configToken" min-width="80" label="配置令牌">
            </el-table-column>

            <el-table-column prop="messApplyKey" min-width="150" label="消息加解密密钥" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="merchantCode" min-width="100" label="商户号" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="apiKey" min-width="100" label="商户apiKey" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="certiPath" min-width="120" label="证书路径" show-overflow-tooltip>
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click.native="edit(scope.$index, scope.row)" style="font-size:12px;">编辑</el-button>
                <span style="color:#e6e6e6;">|</span>
                <el-button type="text" @click.native="edit(scope.$index, scope.row)" style="font-size:12px;">查看</el-button>
              </template>
            </el-table-column>
            
          </el-table>
          
        </div>
        <!-- 分页 -->
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="histroyData.total">
            </el-pagination>
          </div>
      </div>
      <el-dialog title="微信公众号管理-新建" :visible.sync="dialogFormVisible" width="50%">
        <el-form>
          <el-row>
            <el-col offset="2" :span='22'>
              <el-form-item label="组织机构名称:" :label-width="formLabelWidth">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="form.organName" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="应用ID:" :label-width="formLabelWidth">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="form.applyID" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="应用密钥:" :label-width="formLabelWidth">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="form.applyKey" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="配置令牌:" :label-width="formLabelWidth">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="form.configToken" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="消息加解密密钥:" :label-width="formLabelWidth">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="form.messApplyKey" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="商户号:" :label-width="formLabelWidth">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="form.merchantCode" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="商户apiKey:" :label-width="formLabelWidth">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="form.apiKey" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="证书路径:" :label-width="formLabelWidth">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="form.certiPath" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogFormVisible = false" size="mini">确 定</el-button>
          <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
        </div>
      </el-dialog>
  </div>
</template>
<script>
export default {
  name: "we-chat-index",
  data() {
    return {
      dialogFormVisible:false,//弹出表单
      form: {
          organName:'',
          applyID:'',
          applyKey:"",
          configToken:'',
          messApplyKey:'',
          merchantCode:'',
          apiKey:'',
          certiPath:"",
        },
      formLabelWidth: '120px',
      crumbsData: {  //面包屑
        titleList: [
          { title: '系统管理', path: '/DatabaseManage' },
          { title: '微信公众号管理', method: () => { window.histroy.back() } }
        ],
      },
      rules: {
        Applicant: [
          { required: true, message: '请输入申请人', trigger: 'blur' }
        ],
        applicantDate: [
          { required: true, message: '请输入申请日期', trigger: 'blur' }
        ],
        engineerType: [
          { required: true, message: '请选择工程类型', trigger: 'change' }
        ],
        Contacts: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        documentType: [
          { required: true, message: '请输入证件类型', trigger: 'blur' }
        ],
        documentNumber: [
          { required: true, message: '请输入证件号码', trigger: 'blur' }
        ],
        contactNumber: [
          { required: true, message: '请输入座机号码', trigger: 'blur' }
        ],
        Emergency: [
          { required: true, message: '请选择紧急程度', trigger: 'change' }
        ],
      },
      ruleForm: {
        Applicant: '',
        engineerType: ''
      },
      options6: [
        {
          value: 12,
          label: '用水报装'
        },
      ],
      histroyData: {},
      maxHeight: 0,
      tableShow: false,
      tableData:[
        {
          organName:'广州南沙水务',
          applyID:'wx666792d74b442664',
          applyKey:"daf59336f304b4195d960a4a6c55aa24",
          configToken:'gdh2',
          messApplyKey:'QMc4iJ8gRNJkvWJBxiRHT3ucbkzDpH4kKEXR53pC9pp',
          merchantCode:'wx666792d74b442665',
          apiKey:'wx666792d74b442666',
          certiPath:"wx666792d74b442667",
          id: null,
          page: 1,
          pageCount: 20,
        },
        {
          organName:'广州北沙水务',
          applyID:'wx666792d74b442664',
          applyKey:"daf59336f304b4195d960a4a6c55aa24",
          configToken:'gdh3',
          messApplyKey:'QMc4iJ8gRNJkvWJBxiRHT3ucbkzDpH4kKEXR53pC9pp',
          merchantCode:'wx666792d74b442665',
          apiKey:'wx666792d74b442666',
          certiPath:"wx666792d74b442667",
          id: null,
          page: 1,
          pageCount: 20,
        },
        {
          organName:'广州西沙水务',
          applyID:'wx666792d74b442664',
          applyKey:"daf59336f304b4195d960a4a6c55aa24",
          configToken:'gdh4',
          messApplyKey:'QMc4iJ8gRNJkvWJBxiRHT3ucbkzDpH4kKEXR53pC9pp',
          merchantCode:'wx666792d74b442665',
          apiKey:'wx666792d74b442666',
          certiPath:"wx666792d74b442667",
          id: null,
          page: 1,
          pageCount: 20,
        },
      ],
    }
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.$changeTable(this, '.we-chat .we-chat-right', ['.we-chat .table-top'])
    })
  },
  methods: {
    init() {

      this.histroyData = {
        areaId: "",
        endRow: 5,
        hasNextPage: false,
        hasPreviousPage: false,
        isFirstPage: true,
        isLastPage: true,
        list: [
          {
            areaId: null,
            areaName: "东深小区",
            code: "C7551990000003",
            concentrator: "",
            connect: null,
            daytime: "2019-07-02",
            endTime: null,
            factoryName: "东井",
            fcode: null,
            fix: false,
            fixValue: "-",
            flux: "-",
            getMeter: 1,
            id: null,
            isxz: "未抄",
            lvalue: "-",
            meter: null,
            model: null,
            modifyBy: null,
            modifyTime: null,
            offset: 0,
            page: 1,
            pageCount: 20,
            position: "1栋3单元",
            protocolName: null,
            rowNumber: 0,
            sensorModel: null,
            sn: null,
            status: "未上传",
            totalPage: 0,
            type: 5,
            unusual: null,
            usn: "00",
            waterGroup: null,
          },
          {
            areaId: null,
            areaName: "东深小区",
            code: "C7551990000003",
            concentrator: "",
            connect: null,
            daytime: "2019-07-02",
            endTime: null,
            factoryName: "东井",
            fcode: null,
            fix: false,
            fixValue: "-",
            flux: "-",
            getMeter: 1,
            id: null,
            isxz: "未抄",
            lvalue: "-",
            meter: null,
            model: null,
            modifyBy: null,
            modifyTime: null,
            offset: 0,
            page: 1,
            pageCount: 20,
            position: "1栋3单元",
            protocolName: null,
            rowNumber: 0,
            sensorModel: null,
            sn: null,
            status: "未上传",
            totalPage: 0,
            type: 5,
            unusual: null,
            usn: "00",
            waterGroup: null,
          },
          {
            areaId: null,
            areaName: "东深小区",
            code: "C7551990000003",
            concentrator: "",
            connect: null,
            daytime: "2019-07-02",
            endTime: null,
            factoryName: "东井",
            fcode: null,
            fix: false,
            fixValue: "-",
            flux: "-",
            getMeter: 1,
            id: null,
            isxz: "未抄",
            lvalue: "-",
            meter: null,
            model: null,
            modifyBy: null,
            modifyTime: null,
            offset: 0,
            page: 1,
            pageCount: 20,
            position: "1栋3单元",
            protocolName: null,
            rowNumber: 0,
            sensorModel: null,
            sn: null,
            status: "未上传",
            totalPage: 0,
            type: 5,
            unusual: null,
            usn: "00",
            waterGroup: null,
          },
          {
            areaId: null,
            areaName: "东深小区",
            code: "C7551990000003",
            concentrator: "",
            connect: null,
            daytime: "2019-07-02",
            endTime: null,
            factoryName: "东井",
            fcode: null,
            fix: false,
            fixValue: "-",
            flux: "-",
            getMeter: 1,
            id: null,
            isxz: "未抄",
            lvalue: "-",
            meter: null,
            model: null,
            modifyBy: null,
            modifyTime: null,
            offset: 0,
            page: 1,
            pageCount: 20,
            position: "1栋3单元",
            protocolName: null,
            rowNumber: 0,
            sensorModel: null,
            sn: null,
            status: "未上传",
            totalPage: 0,
            type: 5,
            unusual: null,
            usn: "00",
            waterGroup: null,
          }
        ],
        navigateFirstPage: 1,
        navigateLastPage: 1,
        navigatePages: 8,
        navigatepageNums: Array(1),
        nextPage: 0,
        pageNum: 1,
        pageSize: 20,
        pages: 1,
        prePage: 0,
        size: 5,
        startRow: 1,
        total: 5,
      }
    },
    add(){//添加
      this.dialogFormVisible = true;
    },
    edit(){
      this.dialogFormVisible = true;
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
@import "../../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.we-chat {
  .btn-area{
    .el-button{
      float: right;
    }
  }
  .we-chat-right-content {
    height: 87%;
    overflow-y: auto;
  }
  .kl-table {
    padding: 0px 20px;
    .block {
      text-align: right;
      padding: 10px 0px;
    }
  }
  .el-dialog {
    .el-dialog__body{
      .el-form-item{
        .el-form-item__content{
          .el-input{
            width: 25rem;
          }
        }
      }
    }
    .el-dialog__footer{
      margin-top: .8rem;
    }
  }
}
</style>


