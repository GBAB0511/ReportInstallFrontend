

<template>

  <!-- <div class="DataChange" v-if="DataChangeVisible">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button type="primary" size="mini">上传附件</el-button>
        <el-button type="primary" size="mini" @click="submit('ruleForm');">保 存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog('ruleForm')">返回</el-button>
      </div>
    </div>
    <DataChangeEdit ref="childDataChange"></DataChangeEdit>
  </div> -->

  <div class="DataChange">

    <span class="childBox" v-if="DataChangeVisible">
      <div class="DataChange">
        <div class="bread-contain">
          <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
          <div class="bread-contain-right">
            <el-button type="primary" size="mini">上传附件</el-button>
            <el-button type="primary" size="mini" @click="submit('ruleForm');">保 存</el-button>
            <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog('ruleForm')">返回</el-button>
          </div>
        </div>
        <DataChangeEdit ref="childDataChange"></DataChangeEdit>
      </div>
    </span>

    <span class="childBox" v-if="DataChangeAddVisible">
      <!-- 弹出表单选择用户 -->
    	<el-dialog :title="chooseuserName" :visible.sync="chooseuserVisible" :close-on-click-modal="false" class="addDialog" @close="closeChooseuser">
            <chooseuser
                ref="childWaterEditor" 
                
            ></chooseuser>
    		<div slot="footer" class="dialog-footer" ref="ruleForm">
		      <el-button type="primary" size="mini" plain @click="submit;">确 定</el-button>
		      <el-button type="info" size="mini" plain @click="closeChooseuser">取 消</el-button>
		    </div>
    	</el-dialog>
      <div class="DataChange">
        <div class="bread-contain">
          <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
          <div class="bread-contain-right">
            <el-button type="primary" size="mini">上传附件</el-button>
            <el-button type="primary" size="mini" @click="submit('ruleForm');">保 存</el-button>
            <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog('ruleForm')">返回</el-button>
          </div>
        </div>
        <DataChangeAdd ref="childDataChange"></DataChangeAdd>
      </div>
    </span>

    <span v-if="!DataChangeVisible && !DataChangeAddVisible">
      <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <div class="bread-contain-right">
          <el-button icon="el-icon-plus" @click="dataChangeAdd" size="mini" type="primary">添加</el-button>
          <!-- <el-button @click="exportExcel" icon="el-icon-upload2" size="mini" type="primary">导出</el-button> -->
        </div>
      </div>
      <div class="toolbar">
        <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline">

          <el-form-item class="form-left">
            <el-form-item label='受理日期：'>
              <el-date-picker v-model="DateChoosevalue" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :picker-options="pickerOptions" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="审批状态：">
              <el-select clearable v-model="formData.watermeterWarehouse" placeholder="未审">
                <el-option v-for="(item,index) in formData.watermeterWarehouseOptions" :key="index" :label="item.name" :value="item.value"></el-option>

              </el-select>
            </el-form-item>
            <el-form-item label="模糊查询：" class="searchInput">
              <el-tooltip class="item" effect="dark" content="受理单号、用户编号、用户名称、受理人" placement="top">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.con" clearable size="mini"></el-input>
              </el-tooltip>
            </el-form-item>

            <el-form-item>

              <el-button class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
            </el-form-item>

          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row v-if="tableShow" :max-height="maxHeight" stripe border :data="histroyData.list" class="change-tables-table">
          <!--             
            <el-table-column 
                type="selection" 
                width="50" 
                fixed="left"
        >
            </el-table-column> -->

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="code" min-width="150" label="审批状态">
          </el-table-column>

          <el-table-column prop="fixValue" min-width="80" label="受理日期">
          </el-table-column>

          <el-table-column prop="connect" min-width="100" label="受理单号">
          </el-table-column>

          <el-table-column prop="connect" min-width="80" label="用户编号">

          </el-table-column>

          <el-table-column prop="lvalue" min-width="100" label="用户名称">
          </el-table-column>

          <el-table-column prop="lvalue" min-width="200" label="用户地址">
          </el-table-column>

          <el-table-column prop="lvalue" min-width="100" label="联系人">
          </el-table-column>

          <el-table-column prop="lvalue" min-width="120" label="座机号码">
          </el-table-column>

          <el-table-column prop="fixValue" min-width="80" label="用水类型">
          </el-table-column>

          <!-- <el-table-column prop="desc" min-width="150" label="变更描述">
          </el-table-column> -->

          <el-table-column prop="flux" min-width="80" label="受理人">
          </el-table-column>

          <el-table-column prop="fixValue" min-width="80" label="审核日期">
          </el-table-column>

          <el-table-column prop="flux" min-width="80" label="审核人">
          </el-table-column>

          <el-table-column prop="desc" min-width="150" label="备注">
          </el-table-column>

          <el-table-column class="cell" label="操作" fixed="right" width="140">
            <template slot-scope="scope">
              <!-- size="mini" type="warning" plain -->
              <el-button type="text" @click="edit(scope.$index, scope.row)">编辑</el-button>
              <span  >|</span>
              <el-button type="text">审核</el-button>
              <span  >|</span>
              <!-- <el-button type="text">明细</el-button>
              <span  >|</span> -->

              <el-button type="text" class="noclick" @click="deleteRow(scope.$index, scope.row)">删除</el-button>

            </template>
          </el-table-column>

        </el-table>
        
      </div>
      <!-- 分页 -->
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="histroyData.total">
          </el-pagination>
        </div>
    </span>

  </div>
</template>
<script>
// import DataChangeEdit from './DataChangeEdit'
import DataChangeAdd from './DataChangeAdd'
import chooseuser from "../Transfer/chooseuser"
import DataChangeEdit from "@/components/userInfo/ctmInfo.vue"
export default {
  name: "DataChange",
  components: {
    DataChangeEdit,
    DataChangeAdd,
    chooseuser
  },
  data() {
    return {
      chooseuserName:"选择用户",
      chooseuserVisible:false,
      DataChangeAddVisible: false,
      crumbsData: {  //面包屑
        titleList: [
          { title: '客户中心', path: '/DataChange' },
          { title: '变更', method: () => { window.histroy.back() } },
          { title: '用户资料变更', method: () => { window.histroy.back() } }
        ],

      },
      formData: {
        con: "",
        watermeterWarehouse: "",
        watermeterWarehouseOptions: [
          {
            name: "全部",
            value: "1"
          },
          {
            name: "已审",
            value: "2"
          },
          {
            name: "未审",
            value: "3"
          },
          {
            name: "删除",
            value: "4"
          },
        ],
        waterMeterManufacturer: "",
        waterMeterManufacturerOptions: [],
        waterMeterType: "",
        waterMeterTypeOptions: [],
        waterMeterCaliber: "",
        waterMeterCaliberOptions: [],
        waterMeterStatus: "",
        waterMeterStatusOptions: [],
        subordinateDepartments: "",
        subordinateDepartmentsOptions: []

      },
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      DateChoosevalue: [],
      tableShow: false,
      maxHeight: 0,
      histroyData: {

      },
      DataChangeVisible: false,  //综合查询的显示和隐藏
      DataChangeName: '用户资料编辑',
      ruleFormData: {},

    }
  },
  mounted() {
    this.init();
    if(this.$route.query.source==="userInfo"){
      this.dataChangeAdd();
    }
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, '.water-meter-inquiry .kl-table', ['.water-meter-inquiry .toolbar', '.water-meter-inquiry .block', '.water-meter-inquiry #crumbs'])
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
            code: "未审批",
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
            desc:"手机号码由123456789变成987456321",
          },
          {
            areaId: null,
            areaName: "东深小区",
            code: "未审批",
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
            desc:"",
          },
          {
            areaId: null,
            areaName: "东深小区",
            code: "未审批",
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
            desc:"",
          },

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

    demand() {  //查询
      // this.tableQuery.page = 1
      // this.tableQuery.pageCount = 20
      this.init()
    },
    //   导出
    exportExcel() {
    },
    //分页
    handleSizeChange(val) { //显示多少数据一页
      // this.tableQuery.pageCount = val
      // this.tableQuery.page = 1
      this.init()
    },
    handleCurrentChange(val) {  //显示多少页码
      // this.tableQuery.page = val
      this.init()
    },

    cellClick(row, column, cell, event) { //点击文件名
      let that = this;

    },
    indexMethod(index) {//获取表格序号
      //    return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
      return (this.histroyData.pageSize - 20) * this.histroyData.pages + (index + 1);

    },
    closeDialog() { //关闭会话
      this.crumbsData.titleList.pop();
      this.DataChangeVisible = false;
      this.DataChangeAddVisible = false;
      this.backfillVisible = false;
      this.init()
    },
    closeChooseuser(){
      this.chooseuserVisible = false;
    },
    //弹出框
    submit(formName) {	//提交
      this.$refs.childDataChange.submit()
      // this.DataChangeVisible = false;
    },
    edit() {
      this.DataChangeVisible = true;
      this.crumbsData.titleList.push({ title: '编辑', method: () => { window.histroy.back() } })
    },
    dataChangeAdd(){
      this.DataChangeAddVisible = true;
      this.chooseuserVisible = true;
      this.crumbsData.titleList.push({ title: '添加', method: () => { window.histroy.back() } })
    },
    // 删除行
    deleteRow(index, row) {
      this.$confirm('是否确认删除该行?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.histroyData.list.splice(index, 1)
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
.DataChange {
  width: 97%;
  height: 100%;
  .userInfor{
    height: calc(100% - 42px) !important;
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 8px;
  }
  .childBox {
    display: inline-block;
    height: 100%;
    .DataChange {
      height: 100%;
    }
  }
}
</style>
