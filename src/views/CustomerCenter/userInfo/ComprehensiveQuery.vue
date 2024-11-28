<template>
  <div class="ComprehensiveQuery">
    <!-- 客户资料查询 高级查询 -->
    <div class="toolbar">
      <div class="form-right">
        <el-button icon="" size="mini" @click="reset">重置</el-button>
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="add">增加</el-button>
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
            <el-cascader v-if="scope.row.type === 'cascader'" v-model="scope.row.queryValue" :options="scope.row.options" :show-all-levels="false" clearable :props="scope.row.props">
            </el-cascader>
            <el-date-picker v-if="scope.row.type === 'date'" v-model="scope.row.queryValue" value-format="yyyy-MM-dd"></el-date-picker>
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
  </div>
</template>
<script>
export default {
  name: "ComprehensiveQuery",
  props: ['tableQuery'],
  data () {
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
          label: "账户编号",
          value: "a.account_no",
          type: 'input'
        },
        {
          label: "imei" ,
          value: "d.imei",
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
            value: "id",
            label: "name",
            checkStrictly: true,
            emitPath: false,
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
            checkStrictly: true,
            emitPath: false,
          },
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
          label: "水表分类",
          value: "d.METER_TYPE",
          type: 'dict',
          dictType: 'MMT',
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
          label: "最后抄码",
          value: "a.last_reading_num",
          type: 'input'
        },
        {
          label: "抄表员",
          value: "b.meter_reading_staff_account",
          type: 'select',
          options: 'meterReaderList',
          props: {
            value: 'userAccount',
            label: 'userName'
          }
        },
        {
          label: "优惠策略",
          value: "a.PREF_STRATEGY_ID",
          type: 'select',
          options: 'strategyData',
          props: {
            value: 'id',
            label: 'strategyName'
          }
        },
        {
          label: "装表地址",
          value: "a.SETUP_METER_ADDR",
          type: 'input'
        },

        {
          //   label: "水司银行名称",
          label: "子账户银行",
          value: "e.open_account_bank",
          type: 'select',
          options: 'BankData',
          props: {
            value: 'id',
            label: 'name'
          }
        },
        {
          //   label: "水司银行账号",
          label: "子账户编号",
          value: "a.bank_sub_account",
          type: 'input'
        },
          {
          label: "水表用途",
          value: "a.meter_use",
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
      meterBoreOptions: [],
      dictDataOptions: [],
      maxHeight: 300,
      meterReaderList: [],
      strategyData: [],
      bankData: [],
    }
  },
  created () {
    this.getDictDataOptions()
    this.SelectUseWaterTypeOptions()
    this.getBusinessAreaData()
    this.getMeterFactory()
    this.getBoreValueData()
    this.getReadingStaff()
    this.getStrategy()
    this.getBankData()
    this.$nextTick(() => {
      this.common.changeTable(this, '.ComprehensiveQuery', ['.ComprehensiveQuery .toolbar'])
    })
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    add () {
      this.gridData.push({
        fieldName: "",
        operator: "",
        logicalValue: "AND",
        queryValue: "",
        type: 'input'
      })

    },
    // 删除行
    deleteRow (index, row) {
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
    handleSelect (row) {
      const field = this.FieldNameoptions.find(item => item.value === row.fieldName)
      const type = field.type
      let options = []
      if (type === 'select' || type === 'cascader') {
        options = this[field.options]
      } else if (type === 'dict') {
        options = this.dictDataOptions[field.dictType]
      }
      this.$set(row, 'type', type)
      this.$set(row, 'options', options)
      this.$set(row, 'props', field.props)
      console.log(row)
    },
    getDictDataOptions () {
      let params = {
        "busicode": "DictionarySelect",
        "data": 'CUS,WMT,TPW,MMT'
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        this.dictDataOptions = res
        console.log(this.dictDataOptions)
      })
    },
    //用水类型下拉框
    SelectUseWaterTypeOptions () {
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
    getArr (data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].isParent === false) {
          delete data[i].children
        } else {
          this.getArr(data[i].children)
        }
      }
      return data
    },
    //营业区域下拉框
    getBusinessAreaData (id) {
      let _this = this
      let params = {
        "busicode": "BusinessAreaTree",
        "data": {

        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = this.getArr1(res)
        this.businessAreaDataOptions = data.children;
      })
    },
    //树结构数据处理
    getArr1 (data) {
      function abc (arr) {
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
    //获取优惠策略列表
    getStrategy () {
      var params = {
        "busicode": "PrefStrategyList",
        "data": {
          "page": 1,
          "pageCount": 999
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.strategyData = res.list
      })
    },
    //获取子账户银行下拉数据
    getBankData () {
      var params = {
        "busicode": "BankTree",
        "data": {
          "page": 1,
          "pageCount": 999
        }
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        this.BankData = res.children
      })
    },
    // 水表厂家下拉数据
    getMeterFactory () {
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
    getBoreValueData () {
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
    // 抄表员数据获取
    getReadingStaff () {
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
          _this.meterReaderList = [...res];
        });
    },
    reset () {
      this.gridData = [
        {
          fieldName: "",
          operator: "=",
          logicalValue: "AND",
          queryValue: "",
          type: 'input'
        },
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
.ComprehensiveQuery {
  height: 100%;
  padding: 5px 20px;
  .toolbar {
    .form-right {
      margin-bottom: 6px;
    }
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
  }
}
</style>
