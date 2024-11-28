<template>
<!-- 材料管理 -->
  <div class="materialManagement">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="AddDialog()">添加</el-button>
        <el-button type="primary" size="mini" @click="deleteCheckRow()">删除</el-button>
        <el-upload action="/" class="upload-demo" :http-request="importExcel">
          <el-button icon="el-icon-download" size="mini" type="primary">导入</el-button>
        </el-upload>
        <el-button size="mini" type="primary" icon="el-icon-upload2" @click="exportExcel">导出</el-button>
        <el-button icon="el-icon-download" size="mini" type="primary" @click="downloadExcel">下载模板</el-button>
      </div>
    </div>
    <div class="toolbar"  style="outline:none" tabindex="0">
      <el-form inline size="mini" label-position="right" label-width="80px" class="multiple-floor">
          <el-form-item label="材料名称：" class="width-200">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.materialName" placeholder="请输入材料名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="材料编号：" class="width-200">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" v-model="tableQuery.materialNo" placeholder="请输入材料编号" clearable></el-input>
        </el-form-item>
        <el-form-item class="">
          <el-button class="searchBtn" @click="search" icon="el-icon-search"></el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="kl-table" :style="{height: (maxHeight-40) + 'px'}">
      <el-table v-if="tableShow" highlight-current-row stripe border :max-height="(maxHeight-40)" :data="tableData.list" 
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" fixed="left"></el-table-column>
        <el-table-column type="index" fixed="left" label="NO." width="50" :index="indexMethod"></el-table-column>
        <el-table-column prop="materialName" min-width="100" label="材料名称" show-overflow-tooltip>
          <template slot="header">
            <span style="color: red">*</span>
            <span style="color:#111">材料名称</span>
          </template>
          <template slot-scope="scope">
          <el-input v-if="showRowEdit(scope.$index)" size="mini" clearable oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'');if(value.length>30)value=value.slice(0,30)"
            v-model="scope.row.materialName" @input="e => input = inputMe(e)">
          </el-input>
          <span style="color:black" v-else>{{scope.row.materialName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="materialNo" min-width="100" label="材料编号">
          <template slot="header">
            <span style="color:#111 !important">材料编号
              <el-tooltip placement="top" effect="dark">
                <template slot="content">
                  <div style="font-size:14px;line-height: 20px;">
                    <span>建议使用供应链系统材料编号</span>
                  </div>
                </template>
                <i class="el-icon-warning-outline"
                  style="color: #E6A23C; margin-left: 4px; font-size: 14px; font-weight: bold; vertical-align: text-bottom;"></i>
              </el-tooltip>
            </span>
          </template>
          <template slot-scope="scope">
          <el-input v-if="showRowEdit(scope.$index)" size="mini" clearable oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'');if(value.length>30)value=value.slice(0,30)"
            v-model="scope.row.materialNo" @input="e => input = inputMe(e)">
          </el-input>
          <span style="color:black" v-else>{{scope.row.materialNo}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="specs" min-width="80" label="规格">
          <template slot-scope="scope">
          <el-input v-if="showRowEdit(scope.$index)" size="mini" clearable oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'');if(value.length>30)value=value.slice(0,30)"
            v-model="scope.row.specs" @input="e => input = inputMe(e)">
          </el-input>
          <span style="color:black" v-else>{{scope.row.specs}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="unit" min-width="80" label="单位">
          <template slot-scope="scope">
          <el-input v-if="showRowEdit(scope.$index)" size="mini" clearable oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'');if(value.length>30)value=value.slice(0,30)"
            v-model="scope.row.unit" @input="e => input = inputMe(e)">
          </el-input>
          <span style="color:black" v-else>{{scope.row.unit}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="price" min-width="80" label="单价">
          <template slot="header">
            <span style="color: red">*</span>
            <span style="color:#111">单价</span>
          </template>
          <template slot-scope="scope">
            <el-input-number v-if="showRowEdit(scope.$index)" size="mini" v-model="scope.row.price" controls-position="right" :step-strictly="true" :step="0.01" :min="0" :precision="2" @keyup.native ='keyupEvent($event)'></el-input-number>
          <span style="color:black" v-else>{{scope.row.price}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" min-width="80" label="状态">
          <template slot-scope="scope">
          <el-select v-if="showRowEdit(scope.$index)" size="mini" v-model="scope.row.status" >
            <el-option label="启用" :value="1"></el-option>
            <el-option label="停用" :value="0"></el-option>
          </el-select>
          <span style="color:black" v-else>{{scope.row.status == 1 ? "启用": "停用"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" min-width="80" label="描述" show-overflow-tooltip>
          <template slot-scope="scope">
          <el-input v-if="showRowEdit(scope.$index)" size="mini" clearable oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'');if(value.length>50)value=value.slice(0,50)"
            v-model="scope.row.remarks" @input="e => input = inputMe(e)">
          </el-input>
          <span style="color:black" v-else>{{scope.row.remarks}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" v-if="showRowEdit(scope.$index)" @click="saveRow(scope.$index, scope.row)">保存</el-button>
            <el-button type="text" size="mini" v-else @click="editRow(scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]"
        :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total">
      </el-pagination>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible">
      <p style="height:400px;overflow-y:scroll;" v-html="errTip"></p>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加材料" :visible.sync="addVisible" :close-on-click-modal="false" class="button-dialog" @close="closeAddVisible()">    
      <div class="bread-contain-right">
        <el-button size="mini" type="primary" icon="el-icon-plus" @click="addRow()">添加</el-button>
        
      </div>
      <div class="kl-table" :style="{height: (maxHeight-40) + 'px'}">
        <el-table v-if="tableShow" highlight-current-row stripe border :max-height="(maxHeight-40)" :data="addDataList">
          <el-table-column type="index" fixed="left" label="NO." width="50" :index="indexMethodDia"></el-table-column>
          <el-table-column prop="materialName" min-width="100" label="材料名称" align="center">
            <template slot="header">
              <span style="color: red">*</span>
              <span style="color:#111">材料名称</span>
            </template>
            <template slot-scope="scope">
            <el-input size="mini" clearable oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'');if(value.length>30)value=value.slice(0,30)"
              v-model="scope.row.materialName" @input="e => input = inputMe(e)">
            </el-input>
            </template>
          </el-table-column>
          <el-table-column prop="materialNo" min-width="100" label="材料编号" align="center">
            <template slot="header">
              <span style="color:#111 !important">材料编号
                <el-tooltip placement="top" effect="dark">
                  <template slot="content">
                    <div style="font-size:14px;line-height: 20px;">
                      <span>建议使用供应链系统材料编号</span>
                    </div>
                  </template>
                  <i class="el-icon-warning-outline"
                    style="color: #E6A23C; margin-left: 4px; font-size: 14px; font-weight: bold; vertical-align: text-bottom;"></i>
                </el-tooltip>
              </span>
            </template>
            <template slot-scope="scope">
            <el-input size="mini" clearable oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'');if(value.length>30)value=value.slice(0,30)"
              v-model="scope.row.materialNo" @input="e => input = inputMe(e)">
            </el-input>
            </template>
          </el-table-column>
          <el-table-column prop="specs" min-width="80" label="规格" align="center">
            <template slot-scope="scope">
            <el-input size="mini" clearable oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'');if(value.length>30)value=value.slice(0,30)"
              v-model="scope.row.specs" @input="e => input = inputMe(e)">
            </el-input>
            </template>
          </el-table-column>
          <el-table-column prop="unit" min-width="80" label="单位" align="center">
            <template slot-scope="scope">
            <el-input size="mini" clearable oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'');if(value.length>30)value=value.slice(0,30)"
              v-model="scope.row.unit" @input="e => input = inputMe(e)">
            </el-input>
            </template>
          </el-table-column>
          <el-table-column prop="price" min-width="130" label="单价" align="center">
              <template slot="header">
              <span style="color: red">*</span>
              <span style="color:#111">单价</span>
            </template>
            <template slot-scope="scope">
              <el-input-number size="mini" v-model="scope.row.price" controls-position="right" :step-strictly="true" :step="0.01" :min="0" :precision="2" @keyup.native ='keyupEvent($event)'></el-input-number>
            <!-- <el-input size="mini" oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"
              v-model="scope.row.processName" @input="e => input = inputMe(e)">
            </el-input> -->
            </template>
          </el-table-column>
          <el-table-column prop="status" min-width="80" label="状态" align="center">
            <template slot-scope="scope">
            <el-select size="mini" v-model="scope.row.status" >
              <el-option label="启用" :value="1"></el-option>
              <el-option label="停用" :value="0"></el-option>
            </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="remarks" min-width="80" label="描述" align="center">
            <template slot-scope="scope">
            <el-input size="mini" clearable oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'');if(value.length>50)value=value.slice(0,50)"
              v-model="scope.row.remarks" @input="e => input = inputMe(e)">
            </el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="handleSubmit()">确 定</el-button>
        <el-button type="info" size="mini" plain @click="closeAddVisible()">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      PPTArray:[],
      crumbsData: {
        //面包屑
        titleList: [
          { title: "工程管理" },
          { title: "用户工程" },
          { title: "材料管理" }
        ]
      },
      tableQuery: {
        page: 1,
        pageCount: 20,
        fuzzyQuery: "",
        materialName: "",
        materialNo: "",
      },
      tableData: {
        list: [],
        total: 0,
      },
      maxHeight: 0,
      tableShow: false,
      showIndex: true,
      dictionaryData: {},
      selectTable: [], // 勾选的数据信息
      dialogVisible: false,
      errTip: "",
      addVisible: false, // 添加弹出框的显示跟隐藏控制
      addDataList: [], // 添加材料弹出框中的材料内容
      ischange: -1, // 用来控制行的编辑
      beforeRow: {}, // 记录之前的数据
      beforeRowIndex: -1, // 记录之前的数据的index
      currentRow: null, // 当前编辑的行
      backupData: null, // 编辑前的数据备份
      backupDataIndex: null,
    }
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
      this.common.changeTable(this, ".materialManagement", [
        ".materialManagement .kl-table",
        ".materialManagement .bread-contain",
        ".materialManagement .toolbar",
        ".materialManagement .block"
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
    keyupEvent(e){
      e.target.value = e.target.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3').replace(/\ +/g,'').replace(/[\r\n]/g,'').replace(/[^\d|\.]/g, '');
    },
    AddDialog(){
      this.addVisible = true;
      this.addDataList.push({
        materialName: "", // 材料名称
        materialNo: "", // 材料编号
        specs: "", // 材料规格
        unit: "", // 材料单位
        price: "0.00", // 材料单价
        status: 1, // 状态
        remarks: "", // 描述
        id: "", // 单据id
      })
    },
    closeAddVisible(){
      this.addVisible = false;
      this.addDataList = []; // 把内容清空
    },
    addRow(){
      // 添加行
      if(this.addDataList.length >= 100){
        this.$message({
          type: 'error',
          message: "一次不能添加超过100条材料信息！"
        })
        return;
      }
      this.addDataList.push({
        materialName: "", // 材料名称
        materialNo: "", // 材料编号
        specs: "", // 材料规格
        unit: "", // 材料单位
        price: "0.00", // 材料单价
        status: 1, // 状态
        remarks: "", // 描述
        id: "", // 单据id
      });
    },
    // 点击编辑，可以编辑行的信息
    editRow(index, row,event){
      this.ischange = index;
      // 记录下点击行的时候的信息
      if (this.currentRow && this.backupData) {
        // 取消编辑时，恢复上一行的数据
        this.currentRow = Object.assign(this.tableData.list[this.backupDataIndex], this.backupData);
      }
      this.currentRow = row;
      this.backupData = JSON.parse(JSON.stringify(row)); // 创建当前行数据的备份
      this.backupDataIndex = JSON.parse(JSON.stringify(index)); // 创建当前行数据的备份
    },
    // 保存行的数据
    saveRow(index, row){
      let tempRow = {
        id: row.id,
        materialName: row.materialName,
        materialNo: row.materialNo,
        price: row.price,
        remarks: row.remarks,
        specs: row.specs,
        status: row.status,
        unit: row.unit,
      }
      let params = {
        "busicode": "PjMaterialSave",
        "data": [tempRow],
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.$message({
          title: '成功',
          message: '保存成功',
          type: 'success'
        });
        // 保存成功之后要关闭页面
        this.addVisible = false;
        this.init(); // 保存成功之后刷新页面信息
        // 保存时，从缓存中移除该行数据副本
        this.currentRow = null;
        this.backupData = null;
        this.backupDataIndex = null;
      })
    },
    showRowEdit(index){
      if(this.ischange == index){
        return true;
      }else{
        return false;
      }
    },
    // 根据勾选的行来删除内容
    deleteCheckRow(){
      let tempIdArr = [];
      this.selectTable.forEach(item =>{
        if(item.id){
          tempIdArr.push(item.id);
        }
      })
      let params = {
        "busicode": "PjMaterialDelete",
        "data": {
          idList: tempIdArr
        },
      }
      this.$confirm("是否确认删除勾选的数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$api.fetch({
          params: params,//参数
        }).then(res => {
          this.$message({
            message: '删除成功！',
            type: 'success'
          });
          this.init(); // 删除成功之后刷新页面信息
        })
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
      
    },
    // 保存弹出框中的信息
    handleSubmit(){
      if(this.addDataList.length > 0){
        for(let i = 0;i < this.addDataList.length; i++){
          // 材料编号要唯一，由后端进行校验
          // 材料名称跟材料单价不能为空
          if(this.addDataList[i].materialName == "" || this.addDataList[i].materialName == undefined){
            this.$message({
              type: 'error',
              message: "第" + (i + 1) + "行材料名称不能为空"
            })
            return;
          }
          if(String(this.addDataList[i].price) == "" || this.addDataList[i].price == undefined){
            this.$message({
              type: 'error',
              message: "第" + (i + 1) + "行材料单价不能为空"
            })
            return;
          }
        }
      }else{
        this.$message({
          type: 'error',
          message: "没有填写材料信息，无信息可以保存"
        })
        return;
      }
      let params = {
        "busicode": "PjMaterialSave",
        "data": this.addDataList,
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.$message({
          title: '成功',
          message: '保存成功',
          type: 'success'
        });
        // 保存成功之后要关闭页面
        this.addVisible = false;
        this.init(); // 保存成功之后刷新页面信息
      }).catch(err=>{
        // 导入错误的时候要有提示信息
        this.dialogVisible = true;
        this.errTip = err.data;
      })
    },
    importExcel(file){
      let _this = this;
      let params = {
        busicode: "PjMaterialImport",
        type: 'import',
        data: {
          file: file.file
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.$message({
          type: "success",
          message: "导入成功！"
        });
        this.init();
      }).catch(err=>{
        // 导入错误的时候要有提示信息
        this.dialogVisible = true;
        this.errTip = err.data;
      })
    },
    // 导出
    exportExcel() {
      let tempIdArr = [];
      this.selectTable.forEach(item =>{
        if(item.id){
          tempIdArr.push(item.id);
        }
      })
      let params = {
        "busicode": "PjMaterialExport",
        "data": {
          idList: tempIdArr
        },
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open(this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURIComponent(JSON.stringify(params)))
    },
    // 下载模板
    downloadExcel(){
      var params = {
      busicode: "PjMaterialTemplateExport",
        data: {},
        token: sessionStorage.getItem("token"),
        sysType: "002"
      };
      window.open(this.common.getExportExcelIp() + "/project/exportExcel.api?json=" + encodeURI(JSON.stringify(params)));
    },
    init() {
      this.ischange = -1; // 初始化为都不可以编辑
      var _this = this;
      var params = {
        "busicode": "PjMaterialList",
        "data": this.tableQuery
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.tableData = res;
      }).catch(err =>{
         _this.tableData = [];
      })
    },
    // 查询
    search() {
      this.tableQuery.page = 1;
      this.tableQuery.pageCount = 20;
      this.init();
    },
    // 这里的删除是弹出框中的删除
    deleteRow(index, row) {
      this.$confirm("是否确认删除该行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.addDataList.splice(index, 1);
        // 不用在调用接口来删除，点击保存的时候统一保存即可
        this.$message({
          type: "success",
          message: "删除成功！"
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      this.tableQuery.page = val;
      this.init();
    },
    indexMethod(index) {
      //获取表格序号
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
    },
    indexMethodDia(index){
      return (index+1)
    },
    handleSelectionChange(val){
      this.selectTable = val;
    }
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.materialManagement {
  height: 100%;
}
</style>
