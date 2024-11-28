<template>
  <div class="addMultipleChange">
    <!-- 客户资料查询 高级查询 -->
    <div class="toolbar">
      <div class="form-right">
        <div style="margin-bottom:10px">
          <el-button type="primary" icon="el-icon-download" size="mini" @click="exportExcel">下载</el-button>
          <el-upload action="/" class="upload-demo" multiple  :http-request="importExcel" style="display:inline-block">
            <el-button icon="el-icon-upload" size="mini" type="primary">导入</el-button>
          </el-upload>
        </div>
        <div>
          <el-button type="warning" icon="el-icon-refresh-left" size="mini" @click="reset" circle style="height:35px;width:35px"></el-button>
          <el-button type="success" icon="el-icon-plus" size="mini" @click="add" style="margin-left:0;height:35px;width:35px" circle></el-button>
        </div>

      </div>
    </div>

    <div class="kl-table">
      <el-table :data="gridData" border :max-height="maxHeight">
        <el-table-column type="index" label="NO." min-width="50">
        </el-table-column>
        <el-table-column label="字段名" min-width="150">
          <template slot-scope="scope">
            <el-select v-model="scope.row.fieldName" placeholder="请选择" @change="handleSelect(scope.row)">
              <el-option v-for="item in FieldNameoptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作符" min-width="150">
          <template slot-scope="scope">
            <el-select v-model="scope.row.operator" placeholder="请选择">
              <el-option v-for="item in OperatorOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="查询值" min-width="150">
          <template slot-scope="scope">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-if="scope.row.type === 'input' || !scope.row.type || scope.row.type === ''" v-model="scope.row.queryValue"></el-input>
            <el-select v-if="scope.row.type === 'dict' || scope.row.type === 'select'" v-model="scope.row.queryValue">
              <el-option v-for="(item,index) in scope.row.options" :key="index" :label="scope.row.type === 'dict' ? item.name : item[scope.row.props.label]" :value="scope.row.type === 'dict' ? item.value : item[scope.row.props.value]"></el-option>
            </el-select>
            <el-cascader
              v-if="scope.row.type === 'cascader'"
              v-model="scope.row.queryValue"
              :options="scope.row.options"
              :show-all-levels="false"
              clearable
              :props="scope.row.props">
            </el-cascader>
            <el-date-picker
              v-if="scope.row.type === 'date'"
              v-model="scope.row.queryValue"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column label="逻辑值" min-width="150">
          <template slot-scope="scope">
            <el-select v-model="scope.row.logicalValue" placeholder="请选择">
              <el-option v-for="item in LogicalValueoptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="150">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
    <div class="block">
      <div>
        批量修改说明:
        <br>
        1、输入查询条件，并点击下载，下载数据为excel文件，每次下载不能超过2万条
        <br>
        2、修改excel文件中的内容
        <br>
        3、导入修改后的excel文件
        <br>
        4、确认修改内容后，提交审批
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ComprehensiveQuery",
  props: ['tableQuery'],
  data() {
    return {
      gridData: [
        {
          fieldName: "",
          operator: "=",
          logicalValue: "AND",
          queryValue: "",
          type: 'input'
        },
      ],
      FieldNameoptions: [
        {
          label: "客户编号",
          value: "a.ctm_no",
          type: 'input'
        },
        {
          label: "客户名称",
          value: "a.ctm_name",
          type: 'input'
        },
        {
          label: "账户编号",
          value: "a.account_no",
          type: 'input'
        },
        {
          label: "册本号",
          value: "a.book_no",
          type: 'input'
        },
        {
          label: "用户编号",
          value: "a.user_no",
          type: 'input'
        },
        {
          label: "客户地址",
          value: "a.ctm_addr",
          type: 'input'
        },
         {
          label: "合同编号",
          value: "a.CONTRACT_NO",
          type: 'input'
        },
         {
          label: "水表编号",
          value: "a.METER_NO",
          type: 'input'
        },
         {
          label: "水表表身码",
          value: "d.FACTORY_NO",
          type: 'input'
        },
        {
          label: "用水人口",
          value: "a.LADDER_PERSON_NUM",
          type: 'input'
        },
        //  {
        //   label: "月均用水量",
        //   value: "b.ctm_addr",
        //   type: 'input'
        // },
         {
          label: "用户状态",
          value: "a.STATUS",
          type: 'dict',
          dictType: 'CUS'
        },
        {
          label: "水表类型",
          value: "a.METER_TYPE",
          type: 'dict',
          dictType: 'WMT'
        },
        {
          label: "传输方式",
          value: "d.TRANSMITTAL_MODEL",
          type: 'dict',
          dictType: 'TPW'
        },
        {
          label: '用水类型',
          value: 'a.USE_WATER_TYPE',
          type: 'cascader',
          options: 'useWaterTypeOptions',
          props: {
            value: 'id',
            label: 'name',
            emitPath: false,
            checkStrictly: true,
          },
        },
        {
          label: "营业区域",
          value: "a.BUSINESS_AREA",
          type: 'cascader',
          options: 'businessAreaDataOptions',
          props: {
            //树结构格式
            value: "id",
            label: "name",
            emitPath: false,
            checkStrictly: true,
          },
        },
        {
          label: "抄表员",
          value: "e.meter_reading_staff_account",
          type: 'select',
          options: 'meterReaderList',
          props: {
            value: 'userAccount',
            label: 'userName'
          }
        },
        {
          label: "水表厂家",
          value: "d.METER_FACTORY",
          type: 'select',
          options: 'meterFactoryDataOptions',
          props: {
            value: 'id',
            label: 'factoryName'
          }
        },
        {
          label: "水表口径",
          value: "d.METER_BORE",
          type: 'select',
          options: 'meterBoreOptions',
          props: {
            value: 'id',
            label: 'boreName'
          }
        },
        {
          label: "立户日期",
          value: "a.OPEN_DATE",
          type: 'date'
        },
        {
          label: "装表日期",
          value: "a.SETUP_METER_DATE",
          type: 'date'
        },
        {
          label: "最后抄表日期",
          value: "a.LAST_READING_DATE",
          type: 'date'
        },
        {
          label: "停用月份",
          value: "stopMonths",
          type: 'input'
        },
        {
          label: "换表日期",
          value: "a.CHANGE_METER_DATE",
          type: 'date'
        },
        {
          label: "银行卡号",
          value: "c.bank_account",
          type: 'input'
        },

      ],
      OperatorOptions: [
        {
          label: "等于",
          value: "="
        },
        {
          label: "包含",
          value: "bh"
        },
        {
          label: "不等于",
          value: "!="
        },
        {
          label: "小于",
          value: "<"
        },
        {
          label: "大于",
          value: ">"
        },
        {
          label: "大于等于",
          value: ">="
        },
        {
          label: "小于等于",
          value: "<="
        },
      ],
      LogicalValueoptions: [
        {
          label: "与",
          value: "AND"
        },
        {
          label: "或",
          value: "OR"
        },
      ],
      options: [],
      useWaterTypeOptions: [],
      businessAreaDataOptions: [],
      meterFactoryDataOptions: [],
      meterReaderList:[],
      meterBoreOptions: [],
      dictDataOptions: [],
      maxHeight: 300,
      showStructAddr: true, // 是否启用结构化地址
    }
  },
  created() {
    this.getDictDataOptions()
    this.SelectUseWaterTypeOptions()
    this.getBusinessAreaData()
    this.getMeterFactory()
    this.getBoreValueData()
    this.getReadingStaff();
    this.getclientAddrConfig();
    this.$nextTick(() => {
      this.common.changeTable(this, '.addMultipleChange', ['.addMultipleChange .toolbar','.addMultipleChange .block'])
    })
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    add() {
      this.gridData.push({
        fieldName: "",
        operator: "",
        logicalValue: "",
        queryValue: "",
        type: 'input'
      })

    },
    // 删除行
    deleteRow(index, row) {
      this.$confirm('是否确认删除该行?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.gridData.splice(index, 1)
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
    },
    exportExcel() {
      let gridData = this.gridData;
      let message = "";
      if(gridData.length > 1) {
        for (let i = 0; i < gridData.length; i++) {
          if (
            !gridData[i].fieldName ||
            gridData[i].fieldName == '' ||
            !gridData[i].operator ||
            gridData[i].operator == '' ||
            !gridData[i].logicalValue ||
            gridData[i].logicalValue == '' ||
            !gridData[i].queryValue ||
            gridData[i].queryValue == ''
          ) {
            if (!gridData[i].fieldName || gridData[i].fieldName == '') {
              message = "字段名不能为空";
            } else if (!gridData[i].operator || gridData[i].operator == '') {
              message = "操作符不能为空";
            } else if (!gridData[i].queryValue || gridData[i].logicalValue == '') {
              message = "查询值不能为空";
            } else if (!gridData[i].logicalValue || gridData[i].queryValue == '') {
              message = "逻辑值不能为空";
            }
            this.$message({
              message,
              type: "warning"
            });
            return;
          }
        }
      }
      gridData=gridData.map(item => {
        return {
          fieldName: item.fieldName,
          operator: item.operator,
          queryValue: item.queryValue,
          logicalValue: item.logicalValue
        }
      })
      console.log(gridData);
      let exportList = this.getExportList();
      if(!this.showStructAddr){
        let removeList = ["client_addr", "client_contract_addr"];
        let temp = exportList.filter(item => {
          return removeList.indexOf(item) == -1;
        })
        exportList = temp;
      }
      let params = {
          busicode: "ChangeUserExport",
          data: {
            list: gridData,
            exportList:exportList,
            } ,
          token: sessionStorage.getItem("token"),
          sysType: '002',
        }
        console.log('params',params)
        window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURIComponent(JSON.stringify(params)))
    },
    importExcel(file){
      let _this = this;
      let params = {
        busicode: "ChangeUserImport",
        type: 'import',
        data: {
          file: file.file
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.$parent.setId(res.id)
        this.$parent.showDetailMethod(true,false,false)
      })
    },
    getExportList(){
      return ["ctm_no","sort_no","ctm_name","business_area","client_addr","client_addr_detail", "ctm_type", "cert_type","cert_no","credit_level","link_tel","mobile","fax_number",
        "account_no","pay_way","account_type","open_account_bank","open_account_name","bank_account","entrust_no","entrust_contract",
        "deliver_way","deliver_addr","email_addr","bank_sn","out_no",
        "invoice_title","invoice_tax","invoice_addr","invoice_link","invoice_bank","invoice_account","vat_flag",
        "user_no","contract_no","client_contract_addr","client_contract_addr_detail","contract_date",
        "stop_water_link_man","stop_water_link_mobile","user_group_no","quota_water","comments",
        "real_estate_no","meter_reading_cycle","last_reading_num","meter_no","concentrator_no","father_meter_no",
        "meter_site","meter_bjwz","meter_bjxs","virtual_design_formulas","meter_use","use_water_object","setup_meter_date",
        "use_water_type","pref_strategy_id","pref_cert_no","pref_begin_date","pref_end_date"]
      },
    handleSelect(row) {
      const field = this.FieldNameoptions.find(item => item.value === row.fieldName)
      const type = field.type
      let options = []
      if(type === 'select' || type === 'cascader') {
        options = this[field.options]
      } else if(type === 'dict') {
        options = this.dictDataOptions[field.dictType]
      }
      this.$set(row, 'type', type)
      this.$set(row, 'options', options)
      this.$set(row, 'props', field.props)
    },
    getDictDataOptions() {
      let params = {
        "busicode": "DictionarySelect",
        "data": 'CUS,WMT,TPW'
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
       this.dictDataOptions = res
       console.log(this.dictDataOptions)
      })
    },
    // 抄表员数据获取
    getReadingStaff() {
      var _this = this;
      var params = {
        "busicode": "PostUserSelect",
        "data": { "postNo": "2" },
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          // _this.meterReaderList = [...res];
          _this.meterReaderList = [...[{ userName: "全部" }], ...res];
        });
    },
    //用水类型下拉框
    SelectUseWaterTypeOptions() {
      let params = {
        "busicode": "WaterTypeTree",
        "data": {
        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = this.getArr(res.children)
        this.useWaterTypeOptions = data;
      })
    },
    //树结构数据处理
    getArr(data){
      for (let i = 0; i< data.length; i++) {
        if(data[i].isParent === false) {
          delete data[i].children
        } else {
          this.getArr(data[i].children)
        }
      }
      return data
    },
    //营业区域下拉框
    getBusinessAreaData(id) {
      let _this = this
      let params = {
        "busicode": "BusinessAreaTree",
        "data": {},
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = this.getArr1(res)
        this.businessAreaDataOptions = data.children;
      })
    },
    //树结构数据处理
    getArr1(data) {
      function abc(arr) {
        arr.map(i => {
          if (i.isParent === false) {
            delete i.children;
          } else {
            abc(i.children);
          }
        });
      }
      abc(data.children);
      return data;
    },
    // 水表厂家下拉数据
    getMeterFactory() {
      var params = {
        "busicode": "MeterFactoryList",
        "data": {
          "page": 1,
          "pageCount": 100
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.meterFactoryDataOptions = res.list
      })
    },
    //水表口径下拉框
    getBoreValueData(){
      let params = {
        "busicode": "MeterBoreSelect",
        "data": '',
      }
      this.$api.fetch({
      params: params,//参数
      }).then(res => {
        this.meterBoreOptions = res
      })
    },
    reset() {
      this.gridData = [
        {
          fieldName: "",
          operator: "=",
          logicalValue: "AND",
          queryValue: "",
          type: 'input'
        },
      ]
    },
    getclientAddrConfig(){
        let params = {
            busicode: "ConfigList",
            data: {
                searchContent: "STRUCTURED_ADDRESS",
                status: 1
            }
        }
        this.$api
        .fetch({
          params
        })
        .then(res => {
            console.log('res', res)
          if (res.list.length && res.list[0].configValue == "1") {//为1则启用
            this.showStructAddr = true;
          }else{
            this.showStructAddr = false;
          }
        })
    },
  }
}
</script>
<style lang="scss" scoped>
.addMultipleChange {
  height: calc(100% - 42px);
  width: 100%;
  padding: 5px 20px;
  .toolbar {
    .form-right {
      margin-bottom: 6px;
      float: none;
      text-align: right;
    }
  }
  .block{
    text-align: left;
  }
  /deep/ {
    .cell {
      .el-input__suffix {
        display: flex;
        align-items: center;
      }
      .el-date-editor {
        width: 180px;
        .el-input__icon {
          line-height: 28px;
        }
      }
    }
    .upload-demo ul{
      display: none;
    }
  }
}
</style>
