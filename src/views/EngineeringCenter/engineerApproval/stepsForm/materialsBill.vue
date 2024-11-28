<template>
  <div class="materialsBill">
    <legend class="legendColumn">材料清单</legend>
    
    <div style="margin-right:20px;margin-bottom:5px;float:right">
      <el-button size="mini" icon="el-icon-plus" type="primary" @click="showAddDia" :disabled="disabled">选择材料</el-button>
      <el-button v-if="materialOperation" @click="exportExcel" :disabled="disabled" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
    </div>
     <div class="kl-table" :style="{maxHeight: 400 + 'px'}">
      <el-table highlight-current-row stripe border :max-height="380" :data="tableData">
        <el-table-column type="index" fixed="left" label="NO." width="50" :index="indexMethod"></el-table-column>
        <el-table-column prop="materialName" min-width="80" label="材料名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="materialNo" min-width="80" label="材料编号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="specs" min-width="80" label="规格">
        </el-table-column>
         <el-table-column prop="unit" min-width="80" label="单位" >
        </el-table-column>
         <el-table-column prop="price" min-width="80" label="单价" align="right">
        </el-table-column>
        <el-table-column prop="quantity" min-width="80" label="数量">
          <template slot="header">
            <span style="color: red">*</span>
            <span style="color:#111">数量</span>
          </template>
          <template slot-scope="scope">
            <el-input :disabled="disabled" size="mini" oninput="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'').replace(/\D/g,'');if(value.length>30)value=value.slice(0,30)"
              v-model="scope.row.quantity"  @input="e => input = inputChangeMethod(e, scope)">
            </el-input>
          </template>
        </el-table-column>
         <el-table-column prop="materialMoney" min-width="80" label="金额" align="right">
        </el-table-column>
        
        <el-table-column prop="materialType" min-width="80" label="类型">
          <template slot="header">
            <span style="color: red">*</span>
            <span style="color:#111">类型</span>
          </template>
          <template slot-scope="scope">
            <el-select :disabled="disabled" size="mini" v-model="scope.row.materialType" @change="changeMaterialType()">
              <el-option label="表前材料" :value="1"></el-option>
              <el-option label="表后材料" :value="0"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" align="center">
          <template slot-scope="scope">
            <el-button :disabled="disabled" type="text" size="mini" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="sumStyle">
        <span >合计：{{sumAccount}}</span>
      </div>
    </div>
    <el-dialog title="选择材料" :visible.sync="showAddUserNoDialog" class="button-dialog" append-to-body>
      <div class="toolbar">
        <el-form inline size="mini">
          <el-form-item label="模糊查询：" class="width-200" style="margin-left:20px;">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" size="mini" @keydown.enter.native="searchDia" v-model="tableQueryDia.fuzzyQuery" placeholder="请输入材料名称" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="searchBtn" style="background-color: #faa646;color: #fff" @click="searchDia" icon="el-icon-search"></el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="kl-table" :style="{ height: 460 + 'px' }">
        <el-table highlight-current-row stripe border :data="tableDataDia.list" ref="tableDataDia" :max-height="450" @selection-change="selectTableRow">
          <el-table-column type="selection" width="50" fixed="left"></el-table-column>
          <el-table-column type="index" fixed="left" label="NO." width="50" :index="indexMethodDia"></el-table-column>
          <el-table-column prop="materialName" min-width="80" label="材料名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="materialNo" min-width="80" label="材料编号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="specs" min-width="80" label="规格">
          </el-table-column>
          <el-table-column prop="unit" min-width="80" label="单位">
          </el-table-column>
          <el-table-column prop="price" min-width="80" label="单价" align="right">
          </el-table-column>
          <el-table-column prop="remarks" min-width="80" label="描述" show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="tableQueryDia.page" :page-sizes="[20, 100, 500, 1000]"
          :page-size="tableQueryDia.pageCount" layout="total, sizes, prev, pager, next, jumper"
          :total="tableDataDia.total">
        </el-pagination>
      </div>
      <div class="dialog-footer" slot="footer">
        <el-button type="primary" size="mini" @click="handleSubmit">确 定</el-button>
        <el-button size="mini" @click="handleClose">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["dict","editData","disabled", "operation"],
  components: {
  },
  data () {
    return {
      form: {
      },
      // 弹出框中的查询条件
      tableQueryDia: {
        page: 1,
        pageCount: 20,
        fuzzyQuery: "",//模糊查询
        status: 1, // 弹出框要查询已经启用的数据
      },
      showAddUserNoDialog: false, // 添加用户弹出框
      sumAccount: 0,//合计
      remainingAmount: 0,//剩余金额
      tableData: [], //表格是数据
      tableDataDia: {}, // 添加用户弹出框中的数据
      selectTable: [], // 选中的用户
      materialOperation: true,
    };
  },
  mounted(){
    if (this.editData) {
      this.form = { ...this.editData }
    }
    if(this.form.consultId){
        this.getMaterial();
    }
  },
  methods: {
    keyupEvent(e){
      e.target.value = e.target.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3').replace(/\ +/g,'').replace(/[\r\n]/g,'').replace(/[^\d|\.]/g, '');
    },
    searchDia(){
      this.tableQueryDia.page = 1;
      this.tableQueryDia.pageCount = 20;
      this.getMaterialList();
    },
    // 获得材料清单的内容
    getMaterial() {
      let params = {
        busicode: "PjMeterMaterialList",
        data: {
          pjId: this.form.consultId
        }
        //收款状态
      };
      this.$api.fetch({
        params: params //参数
      }).then(res => {
        this.tableData = res;
        this.changeMethod();
      });
    },
    // 导出内容
    exportExcel(){
      let params = {
        busicode: 'PjMeterMaterialExport',
        "data": {
          pjId: this.form.consultId,
        },
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open(this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)));
    },
    validateMaterialsBill(){
      if(this.tableData.length > 0){
        for(let i=0;i<this.tableData.length;i++){
          if(this.tableData[i].quantity == "" || this.tableData[i].quantity == undefined){
            return "第"+ (i + 1) + "行的数量不能为空";
          }
          if(this.tableData[i].quantity == 0 ){
            return "第"+ (i + 1) + "行的数量不能为0";
          }
          if(String(this.tableData[i].materialType) == "" || this.tableData[i].materialType == undefined){
            return "第"+ (i + 1) + "行的类型不能为空";
          }
        }
      }
      return "";
    },
    // 这里是用来给编制结算的时候用的
    saveMBill(){
      let _this = this;
      return new Promise(resolve => {
        let tempData = [];
        if(this.tableData.length > 0){
          this.tableData.forEach(item=>{
            tempData.push({
              pjMaterialId: item.pjMaterialId,
              materialType: item.materialType,
              quantity: item.quantity,
              price: item.price,
              materialMoney: item.materialMoney,
              pjId: _this.form.consultId, // 单据的id
            })
          })
        }
        let params = {
          busicode: "PjMeterMaterialSave",
          data: tempData
        };
        _this.$api.fetch({
          params: params //参数
        })
        .then(res => {
          _this.$message({
            type: "success",
            message: "保存成功"
          });
          resolve(true);//只有两个接口都调用成功的时候才返回true
        }).catch(err=>{
          resolve(false);
        });
      })
    },
    // 计算合计的金额
    changeMethod(){
      let tmepSumAccount = 0; // 要重置一下金额在进行计算
      this.tableData.forEach(item=>{
        // 每行的金额相加
        if(isNaN(Number(item.materialMoney))){
          item.materialMoney = 0;
        }
        tmepSumAccount = tmepSumAccount + Number(item.materialMoney);
      })
      this.sumAccount = Number(tmepSumAccount).toFixed(2);
    },
    changeMaterialType(){
      this.changeMethod();
      let tempBudgetMatrialBefore = 0;
      let tempBudgetMatrialAfter = 0;
      this.tableData.forEach(item=>{
        if(item.materialType == 1){
          // 1是表前
          tempBudgetMatrialBefore = tempBudgetMatrialBefore + Number(item.materialMoney);
        }else if(item.materialType == 0){
          // 0是表后
          tempBudgetMatrialAfter = tempBudgetMatrialAfter + Number(item.materialMoney);
        }
      })
      eventBus.$emit("BudgetMatrial",{
        budgetMatrialBefore: Number(tempBudgetMatrialBefore).toFixed(2),
        budgetMatrialAfter: Number(tempBudgetMatrialAfter).toFixed(2)
      })
    },
    inputChangeMethod(val,row){
      // 计算输入行的金额
      this.tableData[row.$index].materialMoney = Number(Number(val) * Number(row.row.price)).toFixed(2);
      // 要自动计算合计
      this.changeMethod();
      this.changeMaterialType();
    },
    // 添加用户弹出框中勾选的用户
    selectTableRow(val){
      this.selectTable = val; // 获得选中的用户
    },
    getMaterialList(){
      let _this = this;
      let params = {
        busicode: "PjMaterialList",
        data: this.tableQueryDia,
      };
      this.$api.fetch({
        params: params //参数
      }).then(res => {
        _this.tableDataDia = res;
      });
    },
    showAddDia(){
      this.getMaterialList();//添加用户弹出框的用户信息
      this.showAddUserNoDialog = true;
    },
    handleSubmit(){
      if(this.selectTable.length == 0){
        this.$message({
          type: "warning",
          message: "请先勾选材料"
        });
        return;
      }
      // 勾选数据之后回显到页面上
      let tempTableData = JSON.parse(JSON.stringify(this.tableData));
      this.selectTable.forEach(item=>{
        let exist = false;
        if(tempTableData.length > 0){
          tempTableData.forEach(item2=>{
            if(item.pjMaterialId == item2.pjMaterialId){
              exist = true;
            }
          })
        }
        if(exist == false){
          item.materialMoney = item.price;
          item.materialType = 1;
          item.quantity = 1;
          this.tableData.push(item);
        }
      })
      // 要计算合计
      this.changeMethod();
      this.changeMaterialType();
      this.handleClose();
    },
    // 删除行
    deleteRow(index, row) {
      this.tableData.splice(index, 1);
      this.changeMethod(); // 删除行要重新计算合计
      this.changeMaterialType();
      /*
      this.$confirm("是否确认删除该行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = {
          busicode: "PjMeterMaterialDelete",
          data: {
            id: row.id
          }
        };
        this.$api.fetch({
          params: params //参数
        }).then(res => {
          this.tableData.splice(index, 1);
          this.changeMethod(); // 删除行要重新计算合计
          this.changeMaterialType();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });*/
    },
    handleClose(){
      // 弹出框关闭
      this.showAddUserNoDialog = false;
      this.tableQueryDia.page = 1;
      this.tableQueryDia.pageCount = 20;
      this.tableQueryDia.fuzzyQuery = "";
      this.$refs.tableDataDia.clearSelection();
    },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQueryDia.pageCount = val;
      this.tableQueryDia.page = 1;
      this.getMaterialList();
    },
    handleCurrentChange(val) {
      //显示多少页码
      this.tableQueryDia.page = val;
      this.getMaterialList();
    },
    indexMethod(index) {
      //获取表格序号
      return (
        (index + 1)
      );
    },
    indexMethodDia(index) {
      //获取表格序号
      return (
        (this.tableQueryDia.page - 1) * this.tableQueryDia.pageCount + (index + 1)
      );
    },
  }
};
</script>

<style lang="scss" scoped>
.materialsBill {
  // height: 92%;
  // overflow: scroll;
  overflow-x: hidden;
  .el-table__row .is-right {
    .cell {
      text-align: right !important;
    }
  }
  .button-group{
    float: right;
  }
  .sumStyle{
    margin: 15px;
    float: right;
    margin-right: 32%;
    font-size: 14px;
  }
}
</style>
