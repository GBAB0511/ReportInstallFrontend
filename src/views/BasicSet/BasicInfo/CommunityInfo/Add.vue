<template>
  <div class="community-info">
      <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <h2 class="tab-title">
          <i></i>
          小区信息</h2>
      </div>
      <div class="btn-area">
        <div class="btn-area-right">
          <el-form :inline="true" size="mini" :model="formInline" class="demo-form-inline">
            <el-form-item label="所属街区：">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formInline.document" placeholder="请输入所属街区"></el-input>
            </el-form-item>
            <el-form-item label="模糊查询：">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formInline.namw" placeholder="小区名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class='searchBtn'  icon="el-icon-search"></el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="btn-area-left">
          <el-button @click="add()" icon="el-icon-plus">新建</el-button>
          <el-button @click="add()" icon="el-icon-delete" class="btn-ex">删除</el-button>
        </div>
      </div>
      <div class="community-info-right-content">
        <div class="kl-table" :style="{height: maxHeight + 'px'}">
          <el-table 
                    v-if="tableShow" 
                    :max-height="maxHeight" 
                    stripe border center
                    :data="tableData" 
                    @cell-click="cellClick" 
                    class="wuserInfo-table">

            <el-table-column type="index" label="NO." width="50" :index="indexMethod">
            </el-table-column>

            <el-table-column min-width="45" type="selection" ></el-table-column>

            <el-table-column prop="areaCode" min-width="100" label="小区名称">
            </el-table-column>

            <el-table-column prop="areaName" min-width="80" label="所属街区">
            </el-table-column>

            <el-table-column prop="areaValue" min-width="80" label="排序号" show-overflow-tooltip>
            </el-table-column>

            <el-table-column label="操作" width="70">
              <template slot-scope="scope">
                <el-button type="text" @click.native="edit(scope.$index, scope.row)" style="font-size:12px;">编辑</el-button>
              </template>
            </el-table-column>
            
          </el-table>
          
        </div>
        <!-- 分页 -->
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="histroyData.total">
            </el-pagination>
          </div>
          <el-dialog title="小区信息-增加" :visible.sync="dialogFormVisible" width="50%">
            
            <el-form :model="form">
              <el-row>
                <el-col offset="2" :span="20">
                  <el-form-item label="小区名称:">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                              v-model="form.name"
                              @input="e => input = inputMe(e)"
                              placeholder="请输入小区名称">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col offset="2" :span="20">
                  <el-form-item label="所属小区:">
                    <el-select v-model="form.region" placeholder="请选择所属小区">
                      <el-option label="东深小区" value="shanghai"></el-option>
                      <el-option label="天心小区" value="beijing"></el-option>
                      <el-option label="羽坛小区" value="shenzhen"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col offset="2" :span="20">

                  <el-form-item label="排序号:">
                    <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                              v-model="form.desc"
                              @input="e => input = inputMe(e)"
                              placeholder="请输入排序号">
                    </el-input>
                  </el-form-item>

                </el-col>
              </el-row>

              
              
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="dialogFormVisible = false" size='mini'>保存</el-button>
              <el-button @click="dialogFormVisible = false" size='mini'>返回</el-button>
            </div>
          </el-dialog>
      </div>
  </div>
</template>
<script>
export default {
  name: "community-info-index",
  data() {
    return {
      dialogFormVisible:false,//弹出表单
      form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
      formLabelWidth: '100px',
      //   查询表单
      formInline: {
        con: '',
        document: '',
        proposer:"",
        application:""
      },
      crumbsData: {  //面包屑
        titleList: [
          { title: '基础配置', path: '/BusinessArea' },
          { title: '基础信息', path: '/BusinessArea' },
          { title: '小区信息', method: () => { window.histroy.back() } }
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
          areaName: "东深小区",
          areaCode: "C7551990000003",
          areaValue:'1',
          id: null,
          page: 1,
          pageCount: 20,
        },
        {
          areaName: "天心小区",
          areaCode: "C7551990000004",
          areaValue:'2',
          id: null,
          page: 1,
          pageCount: 20,
        },
        {
          areaName: "羽坛小区",
          areaCode: "C7551990000005",
          areaValue:'3',
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
      this.$changeTable(this, '.community-info .community-info-right', ['.community-info .table-top'])
    })
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
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
        total: 3,
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
@import "../../../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.community-info {
  .my-input {
    width: 25%;
    display: inline-block;
    padding-left: 4%;
    .el-input__inner {
      width: 100%;
    }
    .el-form-item {
      margin-bottom: 15px;
    }
  }
  .btn-area{
    .btn-area-right{
      .el-form {
        .el-form-item__label{
          margin-top:1.2rem;
          margin-left: 1.1rem;
        }
        .el-input{
          padding: 1.3rem 0 0 0 !important;
          .el-input__inner{
            width: 7.5rem;
          }
        }
        .el-button{
          width: 3rem;
        }
      }
    }
  }
  .community-info-right-content {
    height: 87%;
    overflow-y: auto;
    .el-dialog{
      height: 70% !important;
      .el-dialog__body{
        padding:20px;
        .info{
          background: #666;
          color:#fff;
          height: 1.5rem;
          line-height: 1.5rem;
          padding:0 1rem;
          font-size: 14px;
        }
        .el-form-item__content{
          height: 2.5rem;
          width: 90%;
          .el-input {
            width: 25rem;
            // margin-top:.5rem;
            margin-left:1.2rem;
            .el-input__inner{
              width: 25rem !important;
            }
          }
          .el-textarea{
            width: 75%;
            margin-left:1rem;
          }
        }
        .el-form-item__label{
          width: 5rem;
          font-size: 12px;
        }
      }
      .el-dialog__footer{
        margin-top: 2rem;
      }
    }
  }
  .kl-table {
    padding: 0px 20px;
    .block {
      text-align: right;
      padding: 10px 0px;
    }
  }
  .el-dialog{
    .el-dialog__body{
      padding:20px;
      .info{
        background: #666;
        color:#fff;
        height: 1.5rem;
        line-height: 1.5rem;
        padding:0 1rem;
        font-size: 14px;
      }
      .el-form-item__content{
        height: 2.5rem;
        .el-input {
          width: 10rem;
          // margin-top:.5rem;
          margin-left:1.2rem;
          .el-input__inner{
            width: 10rem !important;
          }
        }
      }
      .el-form-item__label{
        font-size: 12px;
        
      }
    }
    .el-dialog__footer{
      margin-top: 2rem;
    }
  }
}
</style>