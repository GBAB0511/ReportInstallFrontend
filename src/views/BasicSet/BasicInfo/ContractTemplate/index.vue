<template>
  <div class="contractTemplate">
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
      <div class='indexPage' style="height:100%">
        <ContractTemplateEdit v-if="EditVisible" ref="ContractTemplateEdit"></ContractTemplateEdit>
        <div class="contractTemplateIndex" v-else>
        <div class="kl-table" :style="{height: maxHeight + 'px'}">

            <el-table class="change-tables-table" border stripe :data="tableData.list" :max-height="maxHeight">

              <el-table-column min-width="45" type="index" fixed="left" label="No."></el-table-column>

              <el-table-column prop="templateName" min-width="80" label="模板名称"></el-table-column>
              <el-table-column prop="type" :formatter="formatType" min-width="80" label="合同类型"></el-table-column>
              <el-table-column prop="createTime" :formatter="formatTime" min-width="80" label="创建时间"></el-table-column>

              <el-table-column width="120" label="操作" fixed="right">
                <template slot-scope="scope">
                  <el-button width="50" size="mini" type="text"  @click.native="add(scope.row)">编辑</el-button>
                  <el-button size="mini" type="text" @click="viewAttachment(scope.row)" >查看附件</el-button>
                </template>
              </el-table-column>

            </el-table>
            

          </div>
          <!-- 分页 -->
            <div class="block">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]"  layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
              </el-pagination>
            </div>
        </div>
      </div>
      <el-dialog title="查看附件" :visible.sync="viewAttachmentShow"  v-if="viewAttachmentShow"  :close-on-click-modal="false" class="button-dialog" @close="closeDialog1">
      <el-table :data="attachmentData" center>
        <!-- <el-table-column property="date" label="日期" width="150"></el-table-column>
        <el-table-column property="name" label="姓名" width="200"></el-table-column>-->
        <el-table-column property="accessoryName" label="文件名"></el-table-column>
        <el-table-column class="cell" label="操作" fixed="right" width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="download(scope.row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="info" size="mini" plain @click="closeDialog1">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ContractTemplateEdit from "./ContractTemplateEdit"
export default {
  name: "overDue",
  components:{
     ContractTemplateEdit,
  },
  data() {
    return {
      attachmentDataList:[],
      EditVisible:false,//弹出表单
      crumbsData: {  //面包屑
        titleList: [
          { title: '模板配置', method: () => { window.histroy.back() } },
          { title: '合同模板', method: () => { window.histroy.back() } }
        ],
      },
      tableData: {},
      maxHeight: 0,
      tableShow: false,
      tableData:[
      ],
      tableQuery:{
        page:1,
        pageCount:20,
      },
      formType:"",
      viewAttachmentShow:false,
      attachmentData:[],
    }
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, '.contractTemplate', ['.contractTemplate .block','.contractTemplate .bread-contain'])
    })
  },
  methods: {
    // 格式化状态
    formatType(row) {
      return row.type == 1 ? "供水合同" : (row.type == 2 ? "施工合同" :"")
    },
    formatTime(row){
      return row.createTime.slice(0,10)
    }, 
    init() {
      let _this = this
      // let params = {
      //     "busicode": "ProcessTimeConfigList",
      //     "data": this.tableQuery,
      // }
      let params = {
          "busicode": "ContractTemplateList",
          "data": this.tableQuery,
      }
      this.$api.fetch({
      params: params,//参数
      }).then(res => {
          _this.tableData = res;
      })
    },
     // 搜索
    search(){
      this.tableQuery.page = 1;
      //this.init()
    },
    // 添加按钮点击事件
      add(val) { 
        this.EditVisible = true;
        if(val==='add'){
          this.formType="ContractTemplateAdd"
        }else{
       let params1 = {
        busicode: "ReceiptAccessoryList",
        data: {
          receiptType: "contract_template",
          receiptId: val.id
        }
      };

      this.$api
        .fetch({
          params: params1 //参数
        })
        .then(res => {
          this.attachmentDataList = res;
          this.formType="ContractTemplateUpdate"
          let params = {
            "busicode": "ContractTemplateQuery",
            "data": { id:val.id, },
          }
          this.$api.fetch({ params: params }).then(res => {
            res.fileDataList = this.attachmentDataList
            this.$refs.ContractTemplateEdit.editData(res);
          })

        });
 
        }
      },
      // 列表的NO列
      indexMethod(index) {
        return (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
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
      closeDialog(){
        this.EditVisible = false;
      },
      //保存按钮
      submitForm() {
        this.$refs.ContractTemplateEdit.submitForm(this.formType);
      },
      // 查看附件按钮
    viewAttachment(row) {
      this.viewAttachmentShow = true;
      let _this = this;
      let params = {
        busicode: "ReceiptAccessoryList",
        data: {
          receiptType: "contract_template",
          receiptId: row.id
        }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.attachmentData = res;
        });
    },
    // 查看附件弹出框下载按钮
    download(row) {
      window.open(row.accessoryMetadata.accessoryPath);
    },
    closeDialog1(){
      this.viewAttachmentShow = false;
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
.contractTemplate {
  width: 100%;
  height: 100%;
  .contractTemplateIndex {
    width: 100%;
    height: calc(100% - 41px);
    .el-button {
      width:30% !important;
    }
  }
}
</style>
