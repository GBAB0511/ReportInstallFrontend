<template>
  <div class="BillType">
    
      <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <div class="bread-contain-right" v-if="EditVisible">
            <el-button size="mini" type="primary" @click="submitForm">保存</el-button>
            <el-button icon="el-icon-caret-left" size="mini" @click="handleClose">返回</el-button>
        </div>
        <div class="bread-contain-right" v-else>
            <el-button size="mini" icon="el-icon-plus" @click="add('add')" type="primary">添加</el-button>
        </div>
      </div>

      <div v-if="EditVisible">
        <BIlTypeEdit ref="BIlTypeEdit" :rowData="rowData" :type="type"></BIlTypeEdit>
      </div>
       
      <div v-if="!EditVisible">
        <div class="kl-table" :style="{height: maxHeight + 'px'}">
          <el-table 
            v-if="tableShow"
            highlight-current-row
            :max-height="maxHeight" 
            stripe border 
            :data="tableData.list" 
            class="wuserInfo-table">
            <el-table-column type="index" label="序号" fixed="left" width="50" :index="indexMethod">
            </el-table-column>

            <el-table-column prop="invoiceNo" min-width="80" label="票据编号">
            </el-table-column>


            <el-table-column prop="invoiceName" min-width="80" label="票据名称">
            </el-table-column>
            <el-table-column prop="type" min-width="80" label="类型" :formatter="getType">
            </el-table-column>
<!-- 
            <el-table-column prop="isPro" min-width="80" label="支持专用发票" :formatter="getIsPro">
            </el-table-column> -->

            <el-table-column prop="statusName" min-width="120" label="状态">
            </el-table-column>

            <el-table-column prop="autoPrintName" min-width="100" label="收费后自动打印">
            </el-table-column>


            <el-table-column prop="comments" min-width="120" label="备注">
            </el-table-column>

            <el-table-column label="操作" width="70">
              <template slot-scope="scope">
                <el-button type="text"  @click="add(scope.row)">编辑</el-button>
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
import BIlTypeEdit from "./BIlTypeEdit"
export default {
  components:{
      BIlTypeEdit,
  },
  name: "BillType-index",
  data() {
    return {
      EditVisible:false,//弹出表单
      tableData:{
          
      },
      //   查询表单
      formData: {
       
      },
      crumbsData: {  //面包屑`    
        titleList: [
          
          { title: '其他配置' },
          { title: '票据类型' }
        ],
      },
      tableShow: false,
      maxHeight:"",
      tableQuery:{
        page:1,
        pageCount:50,
        status:"",
        searchContent:"",
      },
      rowData:{},
      type:"",
    }
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, '.BillType', ['.BillType .toolbar','.BillType .block', '.BillType .bread-contain'])
    })
  },
  methods: {
    getType(val){
      if(val.type==0){
        return "衔头发票"
      }else if(val.type==1){
        return "电子发票"
      }
    },
    getIsPro(val){
      
      if(val.isPro==0){
        return "否"
      }else if(val.isPro==1){
        return "是"
      }
    },
    init() {
      let _this = this
      let params = {
        "busicode": "BaseInvoiceTypeList",
      }
      this.$api.fetch({
        params: params,//参数

      }).then(res => {
        this.tableData=res;
        this.tableData.list.forEach(item => {
          item.autoPrintName = item.autoPrint === "1" ? "是" : "否"
        });
      })  
    },
     // 搜索
    search(){
      this.tableQuery.page = 1;
      this.init()
    },
    // 添加按钮点击事件
      add(val) {
        if(val!="add"){
          this.rowData=JSON.parse(JSON.stringify(val));
          this.rowData.status=Number(val.status)
          this.rowData.autoPrint=Number(val.autoPrint)
          this.type="update"
        }else{
          this.rowData={type:0,isPro:1,status:0,autoPrint:0};
          this.type="add"
        }
        this.EditVisible = true;
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
      // 返回
      handleClose() {
        this.EditVisible = false;
        this.init();
      },
      //保存按钮
      submitForm() {
        this.$refs.BIlTypeEdit.submitForm(this.type);
      },
      // 添加行
      addRow(){
        this.$refs.BIlTypeEdit.addRow();
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
.BillType{
  height: 100%;
  width: 100%;
}
</style>

