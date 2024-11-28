<template>
  <div class="chooseWaterMeter">
    <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline">

      <el-form-item label="装表日期：">
        <el-date-picker v-model="DateChoosevalue" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :picker-options="pickerOptions" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="模糊查询：" class="width-200">

        <el-tooltip class="item" effect="dark" content="水表编号、水表表身号、用户编号" placement="top">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.inputContent"></el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="水表厂家：">
        <el-select clearable v-model="formData.waterMeterManufacturer" placeholder="水表厂家">
          <el-option v-for="(item,index) in formData.waterMeterManufacturerOptions" :key="index" :label="item.name" :value="item.value"></el-option>

        </el-select>
      </el-form-item>

      <el-form-item label="水表类型：">
        <el-select clearable v-model="formData.waterMeterType" placeholder="水表类型">
          <el-option v-for="(item,index) in formData.waterMeterTypeOptions" :key="index" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="mini" @click.native="hidden" icon="el-icon-arrow-down upchange" class="soce-query">高级查询</el-button>
        <el-button class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
      </el-form-item>

      <!-- 高级查询 -->
      <el-form-item v-show="isActive" class="advancedQuery">
        <el-form-item label="新旧表：">
          <el-select clearable v-model="formData.waterMeterManufacturer" placeholder="新旧表">
            <el-option v-for="(item,index) in formData.waterType" :key="index" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="水表型号：">
          <el-select clearable v-model="formData.waterMeterModel" placeholder="水表型号">
            <el-option v-for="(item,index) in formData.waterMeterModelOptions" :key="index" :label="item.name" :value="item.value"></el-option>

          </el-select>
        </el-form-item>
        <el-form-item label="水表口径：">
          <el-select clearable v-model="formData.waterMeterCaliber" placeholder="水表口径">
            <el-option v-for="(item,index) in formData.waterMeterCaliberOptions" :key="index" :label="item.name" :value="item.value"></el-option>

          </el-select>
        </el-form-item>

        <el-form-item label="表读数大于：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.waterMeterModel1" type="number"></el-input>
        </el-form-item>
        <el-form-item label="已使用周期：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.waterMeterCaliber" type="number"></el-input>
        </el-form-item>
      </el-form-item>
    </el-form>

    <div class="kl-table">
      <el-table highlight-current-row stripe border center :data="histroyData.list" class="change-tables-table">

        <el-table-column type="selection" width="50" fixed="left">
        </el-table-column>

        <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
        </el-table-column>

        <el-table-column prop="code" min-width="120" label="水表编号">
        </el-table-column>

        <el-table-column prop="fcode" min-width="100" label="水表表身号">
        </el-table-column>

        <el-table-column prop="wCaliber" min-width="100" label="水表口径">
        </el-table-column>

        <el-table-column prop="wfactory" min-width="100" label="水表厂家">
        </el-table-column>

        <el-table-column prop="wtype" min-width="120" label="水表类型">
        </el-table-column>

        <el-table-column prop="wmodoel" min-width="120" label="水表型号">
        </el-table-column>

        <el-table-column prop="wState" min-width="120" label="水表状态" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="storage" min-width="150" label="注册日期" show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[20, 100, 500, 1000]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="histroyData.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "chooseWaterMeter",
  data() {
    return {
      formData: {
        con: "",
        watermeterWarehouse: "",
        waterMeterModel: "",
        waterMeterModelOptions: [
          {
            name: "LXSWN",
            value: "0"
          },
          {
            name: "LXSGY-15G",
            value: "1"
          },
          {
            name: "LXSGY",
            value: "2"
          },
          {
            name: "LXSFW",
            value: "3"
          },
          {
            name: "DG-FW001",
            value: "4"
          }
        ],
        watermeterWarehouseOptions: [
          // {
          //     name:"全部",
          //     value:"1"
          // },
          {
            name: "停用",
            value: "2"
          },
          {
            name: "启用",
            value: "3"
          }
        ],
        waterMeterManufacturer: "",
        waterMeterManufacturerOptions: [
          {
            name: "宁波",
            value: "1"
          },
          {
            name: "上海",
            value: "2"
          },
          {
            name: "梅花",
            value: "3"
          },
          {
            name: "常德",
            value: "4"
          },
          {
            name: "开封",
            value: "5"
          }
        ],
        waterType: [
          {
            name: "新表",
            value: "1"
          },
          {
            name: "轮检表",
            value: "2"
          }
        ],
        waterMeterType: "",
        waterMeterTypeOptions: [
          {
            name: "人工表",
            value: "1"
          },
          {
            name: "远程表",
            value: "2"
          }
        ],
        waterMeterCaliber: "",
        waterMeterCaliberOptions: [
          {
            name: "15",
            value: "2"
          },
          {
            name: "20",
            value: "1"
          },
          {
            name: "25",
            value: "3"
          },
          {
            name: "40",
            value: "4"
          },
          {
            name: "200",
            value: "5"
          }
        ],
        waterMeterStatus: "",
        waterMeterStatusOptions: [
          {
            name: "在库",
            value: "1"
          },
          {
            name: "在用",
            value: "2"
          },
          {
            name: "在途",
            value: "3"
          },
          {
            name: "报废",
            value: "4"
          }
        ],
        subordinateDepartments: "",
        subordinateDepartmentsOptions: [
          //  {
          //     name:"全部",
          //     value:"1"
          // },
          {
            name: "营业部",
            value: "2"
          },
          {
            name: "法务部",
            value: "3"
          }
        ]
      },
      histroyData: {},
      isActive: false,
      DateChoosevalue: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  mounted() {
    this.init();
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
            areaName: "01091012",
            code: "C7551990000003",
            concentrator: "",
            connect: null,
            daytime: "301-1003",
            endTime: null,
            factoryName: "东井",
            fcode: null,
            fix: false,
            fixValue: "02892019",
            flux: "新表",
            getMeter: 1,
            id: null,
            isxz: "未抄",
            lvalue: "龙天县9号",
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
            waterGroup: null
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
        total: 5
      };
    },
    hidden() {
      if (this.isActive == true) {
        $(".upchange")
          .addClass("el-icon-arrow-down")
          .removeClass("el-icon-arrow-up");
        this.isActive = false;
        $(".el-table--fit").css("height", "66%");
      } else {
        $(".upchange")
          .addClass("el-icon-arrow-up")
          .removeClass("el-icon-arrow-down");
        this.isActive = true;
        $(".el-table--fit").css("height", "50%");
      }
    },
    closeDialog() {
      //关闭会话
      this.waterChoooseVisible = false;
      this.init();
    },
    //弹出框
    submit(formName) {
      //提交
      this.$refs.childWaterEditor.submit();
      // this.waterChoooseVisible = false;
    },
    indexMethod(index) {
      //获取表格序号
      //    return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
      return (
        (this.histroyData.pageSize - 20) * this.histroyData.pages + (index + 1)
      );
    },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      // this.tableQuery.pageCount = val
      // this.tableQuery.page = 1
      this.init();
    },
    handleCurrentChange(val) {
      //显示多少页码
      // this.tableQuery.page = val
      this.init();
    }
  }
};
</script>

<style lang="scss">
.chooseWaterMeter {
  padding: 10px;
  .kl-table {
    padding: 0px;
    .block {
      text-align: right;
      padding: 10px 0px;
    }
  }
}
</style>
