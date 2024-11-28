<template>
  <!-- 工程中心-施工材料 -->
  <div class="ConstructionMaterials">

    <el-dialog title="选择模板" width="80%" :visible.sync="SelectTemplateDialog" @close='closeTemplateDialog' class="button-dialog dialog">
      <!-- 工具栏 -->
      <div class="toolbar">
        <span>模板：</span>
        <el-select v-model="tableQuery.templateId" @change="gettemplateId()" size="mini" clearable>
          <el-option v-for="item in templateDateOption" :key="item.templateId" :label="item.templateName" :value="item.templateId"></el-option>
        </el-select>

        <div class="button-group">
          <!-- <el-button class='searchBtn' icon="el-icon-search"></el-button> -->
          <el-button type="primary" size="mini">打印材料单</el-button>
          <el-button type="primary" size="mini" @click="DataDerivation">导出</el-button>
        </div>

      </div>

      <!-- 选择模板弹框-table 
      <div class='table-content' v-if="NotDisabled==false">
        <el-button-group class="add-line">
          <el-button type="info" size="mini" icon="el-icon-plus" @click="addTemplateRow()"></el-button>
        </el-button-group>
      </div>-->
      <div class="kl-table">
        <el-table highlight-current-row stripe border :data="templateDate" :summary-method="getSummaries" show-summary>

          <el-table-column type="index" fixed="left" label="NO." width="50" :index="indexTemplMethod"></el-table-column>

          <el-table-column prop="matrNo" min-width="100" label="材料编号">
          </el-table-column>

          <el-table-column prop="matrId" min-width="130" label="材料名称">
            <template slot-scope="scope">
              <el-cascader v-model="scope.row.matrId" :options="matrOption" :show-all-levels="false" :props="props" @change="matrTempOptionChange(scope.row,scope.$index )">
              </el-cascader>
            </template>
          </el-table-column>

          <el-table-column prop="matrMode" min-width="100" label="材料规格">
          </el-table-column>

          <el-table-column prop="matrNum" min-width="100" label="材料数量">
            <template slot-scope="scope">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  type="number" v-model="scope.row.matrNum" @input="e => input = inputMe(e)" @change="matrNumTempChange(scope.row,scope.$index )">
              </el-input>
            </template>
          </el-table-column>

          <el-table-column prop="matrUnit" min-width="100" label="材料单位">
          </el-table-column>

          <el-table-column prop="matrPrice" min-width="100" label="材料单价">
          </el-table-column>

          <el-table-column prop="matrMoney" min-width="100" label="材料总价">
          </el-table-column>

          <el-table-column prop="comments" min-width="100" label="备注">
            <template slot-scope="scope">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.comments" @input="e => input = inputMe(e)">
              </el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submitTempl">确 定</el-button>
        <el-button type="info" size="mini" plain @click="closeTemplateDialog">取 消</el-button>
      </div>
    </el-dialog>

    <div class='table-content'>
      <el-button-group class="add-line">
        <el-button type="info" size="mini" icon="el-icon-plus" :disabled='NotDisabled' @click="addRow"></el-button>
      </el-button-group>
    </div>
    <!-- 主页面 -->
    <div class="kl-table">
      <el-table v-if="tableShow" highlight-current-row :max-height="maxHeight" stripe border :data="tableData" :summary-method="getSummaries" show-summary>

        <el-table-column type="index" fixed="left" label="NO." width="50" :index="indexMethod"></el-table-column>

        <el-table-column prop="matrNo" min-width="100" label="材料编号">
        </el-table-column>

        <el-table-column prop="matrId" min-width="130" label="材料名称">
          <template slot-scope="scope">
            <el-cascader :disabled='NotDisabled' v-model="scope.row.matrId" :options="matrOption" :show-all-levels="false" :props="props" @change="matrOptionChange(scope.row,scope.$index )">
            </el-cascader>
          </template>
        </el-table-column>

        <el-table-column prop="matrMode" min-width="100" label="材料规格">
        </el-table-column>

        <el-table-column prop="matrNum" min-width="100" label="材料数量">
          <template slot-scope="scope">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  type="number" :disabled='NotDisabled' v-model="scope.row.matrNum" @input="e => input = inputMe(e)" @change="matrNumChange(scope.row,scope.$index )">
            </el-input>
          </template>
        </el-table-column>

        <el-table-column prop="matrUnit" min-width="100" label="材料单位">
        </el-table-column>

        <el-table-column prop="matrPrice" min-width="80" label="材料单价">
        </el-table-column>

        <el-table-column prop="matrMoney" min-width="140" label="材料总价">
        </el-table-column>

        <el-table-column prop="comments" min-width="100" label="备注">
          <template slot-scope="scope">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  :disabled='NotDisabled' v-model="scope.row.comments" @input="e => input = inputMe(e)">
            </el-input>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="85">
          <template slot-scope="scope">
            <el-button type="text" :disabled='NotDisabled' style='font-size:12px;' @click.native="delExecution(scope.row,scope.$index)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  //isId 单据isId
  //NotDisabled 是否可修改
  props: ["isId", "NotDisabled"],
  data() {
    return {
      //选择模板弹框
      SelectTemplateDialog: false,
      // 列表数据
      tableData: [],
      props: {//树结构格式
        value: 'id',
        label: 'matrName',
      },
      maxHeight: 0,
      tableShow: false,
      tableQuery: {
        //选择模板列表数据
        templateId: '',
      },
      templateDate: [],
      templateDateOption: [],
      matrOption:{},
    };
  },
  mounted() {
    this.getMatrOption()

    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, ".ConstructionMaterials", [
        ".ConstructionMaterials .table-content",
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
    //初始化
    init() {
      let _this = this
      let params = {
        "busicode": "PjUseMatrList",
        "data": {
          'pjId': this.isId,
          'type': "1"
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.tableData = res;
        //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
        // this.common.changeTable(this, ".ConstructionMaterials", [
        //   ".ConstructionMaterials .table-content",
        // ]);
      })
    },
    // 添加行
    addRow() {
      this.tableData.push({
        matrNo: '',//材料编号
        matrName: '',//材料名称
        matrMode: '',//材料规格
        matrNum: 0,//材料数量
        matrUnit: '',//材料单位
        matrPrice: '',//材料单价
        matrMoney: 0,//材料总价
        comments: '',//备注
      });
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      // this.common.changeTable(this, ".ConstructionMaterials", [
      //   ".ConstructionMaterials .table-content",
      // ]);
    },
    //保存按钮
    save() {
      var _this = this
      let data = [];
      for (let i = 0; i < this.tableData.length; i++) {
        //数据处理 matrName材料名称
        if (typeof _this.tableData[i].matrName == 'object') {
          // 只取数组最后一个值并转为字符串
          _this.tableData[i].matrName = _this.tableData[i].matrName.slice(-1).join()
        }
        if (typeof _this.tableData[i].matrId == 'object') {
          // 只取数组最后一个值并转为字符串
          _this.tableData[i].matrId = _this.tableData[i].matrId.slice(-1).join()
        }
        data.push({
          matrNo: _this.tableData[i].matrNo,//材料编号
          matrName: _this.tableData[i].matrName,//材料名称
          matrId: _this.tableData[i].matrId,//材料名称
          matrMode: _this.tableData[i].matrMode,//材料规格
          matrNum: _this.tableData[i].matrNum,//材料数量
          matrUnit: _this.tableData[i].matrUnit,//材料单位
          matrPrice: _this.tableData[i].matrPrice,//材料单价
          matrMoney: _this.tableData[i].matrMoney,//材料总价
          comments: _this.tableData[i].comments,//备注
        });
      }
      var params = {
        "busicode": "PjUseMatrSave",
        "data": {
          'pjId': _this.isId,
          'type': "1",
          'list': data
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.$notify({
          title: '成功',
          message: '施工材料保存成功',
          type: 'success'
        });
      })
    },
    // 资料导出
    DataDerivation() {
      if(this.templateDate.length===0){
        this.$notify({
          title: '导出失败',
          message: '未选择模板，材料单导出失败',
          type: 'error'
        });
        return
      }
      let params = {
          "busicode": "PjUseMatrExport",
          "data": {list:this.templateDate,templateId:""},
          token: sessionStorage.getItem("token"),
          sysType: '002',
        }
        window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURIComponent(JSON.stringify(params)))
    },
    // 材料名称下拉框数据获取
    getMatrOption() {
      var _this = this
      var params = {
        "busicode": "MatrTemplateTree",
        "data": ""
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        let data = _this.getArr(res.children)
        _this.matrOption = data;
        _this.init()
      })
    },
    addTemplateRow() {
      this.templateDate.push({
        matrNo: '',//材料编号
        matrName: '',//材料名称
        matrMode: '',//材料规格
        matrNum: 0,//材料数量
        matrUnit: '',//材料单位
        matrPrice: '',//材料单价
        matrMoney: 0,//材料总价
        comments: '',//备注
      });

    },
    //材料 当切换材料时，改变行值
    matrOptionChange(row, index) {
      let arrOption = this.getArrOption(row.matrId.slice(-1), this.matrOption, index)
      this.tableData[index].matrNo = arrOption.matrNo//材料编号
      this.tableData[index].matrMode = arrOption.matrMode//材料规格
      this.tableData[index].matrUnit = arrOption.matrUnit//材料单位
      this.tableData[index].matrPrice = arrOption.matrPrice//材料单价
      this.tableData[index].matrName = arrOption.matrName//材料名称
      this.matrNumChange(row, index);
    },
    //数量切换时，计算材料总价
    matrNumChange(row, index) {
      
      this.tableData[index].matrMoney = row.matrNum * row.matrPrice//材料总价
      this.tableData[index].matrMoney = this.tableData[index].matrMoney.toFixed(2)
    },
    //选择模板 当切换材料时，改变行值
    matrTempOptionChange(row, index) {
      let arrOption = this.getArrOption(row.matrId.slice(-1), this.matrOption, index)
      this.templateDate[index].matrNo = arrOption.matrNo//材料编号
      this.templateDate[index].matrMode = arrOption.matrMode//材料规格
      this.templateDate[index].matrUnit = arrOption.matrUnit//材料单位
      this.templateDate[index].matrPrice = arrOption.matrPrice//材料单价
      this.templateDate[index].matrName = arrOption.matrName//材料名称
      this.matrNumTempChange(row,index);
    },
    //选择模板 数量切换时，计算材料总价
    matrNumTempChange(row, index) {
      this.templateDate[index].matrMoney = row.matrNum * row.matrPrice//材料总价
    },

    //树结构数据处理
    getArr(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].isParent === false) {//如果不是父级
          delete data[i].children
        } else {//如果是父级
          this.getArr(data[i].children)
        }
      }
      //console.log(data)
      return data
    },

    //下拉数据处理
    getArrOption(row, data, index) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].isParent === false) {//如果不是父级 false
          if (row == data[i].id) {
            return data[i]
          }
        } else {//如果是父级 true
          if (row == data[i].id) {
          } else {
            if (this.getArrOption(row, data[i].children, index)) {
              return this.getArrOption(row, data[i].children, index)
            }
          }
        }
      }
    },
    // 选择模板展示
    showTemplateDialog() {
      this.SelectTemplateDialog = true;
      var _this = this
      var params = {
        "busicode": "GetMatrTemplateSelect",
        "data": ""
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        //选择模板下拉框值
        _this.templateDateOption = res;
      })
    },
    gettemplateId() {
      for (let i = 0; i < this.templateDateOption.length; i++) {
        if (this.tableQuery.templateId == this.templateDateOption[i].templateId) {
          this.templateDate = this.templateDateOption[i].matrs
        }
      }
    },


    // 关闭选择模板弹窗
    closeTemplateDialog() {

      this.tableQuery = {
        //选择模板列表数据
        templateId: '',
      }
      this.SelectTemplateDialog = false;
    },
    indexMethod(index) {//获取表格序号
      return (index + 1)
    },
    indexTemplMethod(index) {//获取表格序号
      return (index + 1)
    },
    getSummaries(param) {//计算汇总
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '汇总';
          return;
        }
        if (index === 7) {
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] = sums[index].toFixed(2)
            sums[index] += ' 元';
          }
        }
      });

      return sums;
    },

    delExecution(row, index) {//删除一行
      // delete this.tableData[index]
      this.tableData.splice(index, 1)
      // let num = row.userName;

    },
    indexMethod(index) {//获取表格序号
      return (index + 1)
    },

    submitTempl() {//数据保存
      this.tableData = this.templateDate
      this.SelectTemplateDialog = false
    },
  },
  watch: {
    maxHeight() {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    },
  },
}
</script>
<style lang="scss">
.ConstructionMaterials {
  height: 100%;
  .dialog {
    .el-dialog__body {
      overflow-y: auto !important;
    }
  }
  .toolbar {
    width: 100%;
    .el-select {
      width: 200px;
      input {
        width: 100%;
      }
    }
    .button-group {
      float: right;
    }
  }
  .table-content {
    height: 40px;
    width: 100%;
    
    .add-line {
      float: right;
      margin-right: 20px;
      .el-button--info {
        background: #3a8ee6;
        border-color: #3a8ee6;
      }
    }
  }
}
</style>