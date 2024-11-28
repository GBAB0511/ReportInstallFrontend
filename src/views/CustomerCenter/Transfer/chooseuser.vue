<template>
  <div class="chooseuser">
    <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline">
      <el-form-item label="用户编号：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="formData.con" placeholder="用户编号"></el-input>
      </el-form-item>
      <el-form-item>

        <el-button class='searchBtn' @click="demand" icon="el-icon-search"></el-button>
      </el-form-item>
    </el-form>

    <div class="kl-table">
      <el-table highlight-current-row stripe border :data="histroyData.list">

        <el-table-column type="index" label="NO." width="50" :index="indexMethod">
        </el-table-column>

        <el-table-column prop="code" min-width="100" label="客户编号">
        </el-table-column>

        <el-table-column prop="areaName" min-width="100" label="账户编号">
        </el-table-column>

        <el-table-column prop="areaName" min-width="100" label="册本号">
        </el-table-column>

        <el-table-column prop="code" min-width="100" label="用户编号">
        </el-table-column>

        <el-table-column prop="concentrator" min-width="120" label="用户名称">

        </el-table-column>

        <el-table-column prop="daytime" min-width="120" label="用户地址">
        </el-table-column>

        <el-table-column prop="factoryName" min-width="80" label="营业区域">
        </el-table-column>

        <el-table-column prop="factoryName" min-width="80" label="行政区域">
        </el-table-column>

        <el-table-column prop="factoryName" min-width="80" label="营业区域">
        </el-table-column>

        <!-- <el-table-column prop="fcode" min-width="120" label="街区名称">
                </el-table-column> -->

        <el-table-column prop="fcode" min-width="150" label="联系人" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="fix" min-width="100" label="座机号码" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="fix" min-width="100" label="手机号码" show-overflow-tooltip>
        </el-table-column>

        <!-- <el-table-column prop="fcode" min-width="100" label="停水联系人">
                </el-table-column>

                <el-table-column prop="fcode" min-width="180" label="停水座机号码">
                </el-table-column> -->

        <el-table-column prop="flux" min-width="80" label="传真号码">
        </el-table-column>

        <el-table-column prop="isxz" min-width="80" label="邮箱地址">
        </el-table-column>

        <el-table-column prop="lvalue" min-width="80" label="证件类型">
        </el-table-column>

        <el-table-column prop="fixValue" min-width="120" label="证件号码">
        </el-table-column>

        <el-table-column prop="fcode" min-width="120" label="立户日期" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="meter" min-width="150" label="供水合同号" show-overflow-tooltip>
        </el-table-column>

        <!-- <el-table-column prop="model" min-width="100" label="签订日期" show-overflow-tooltip>
                </el-table-column> -->

        <el-table-column prop="modifyBy" min-width="180" label="抄表周期">
        </el-table-column>

        <el-table-column prop="offset" min-width="80" label="缴费方式">
        </el-table-column>

        <el-table-column prop="offset" min-width="80" label="发票类型">
        </el-table-column>

        <el-table-column prop="fixValue" min-width="120" label="行业分类" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="fixValue" min-width="150" label="用水类型" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="fixValue" min-width="100" label="阶梯人口" show-overflow-tooltip>
        </el-table-column>
        <!-- <el-table-column prop="protocolName" min-width="100" label="容量水价">
                </el-table-column>

                <el-table-column prop="sensorModel" min-width="100" label="增值税标记">
                </el-table-column>

                <el-table-column prop="sn" min-width="120" label="加压标记">
                </el-table-column> -->

        <el-table-column prop="offset" min-width="80" label="装表地址">
        </el-table-column>

        <el-table-column prop="page" min-width="80" label="装表位置">
        </el-table-column>

        <el-table-column prop="modifyTime" min-width="100" label="水表编号">
        </el-table-column>

        <el-table-column prop="modifyTime" min-width="100" label="水表口径">
        </el-table-column>

        <el-table-column prop="modifyTime" min-width="100" label="水表厂家">
        </el-table-column>

        <el-table-column prop="modifyTime" min-width="100" label="水表型号">
        </el-table-column>

        <el-table-column prop="rowNumber" min-width="80" label="水表类型">
        </el-table-column>

        <el-table-column prop="sensorModel" min-width="80" label="用水对象">
        </el-table-column>

        <el-table-column prop="sensorModel" min-width="80" label="水表用途">
        </el-table-column>

        <el-table-column prop="sensorModel" min-width="80" label="计量方式">
        </el-table-column>

        <el-table-column prop="fixValue" min-width="80" label="投递标记">
        </el-table-column>

        <el-table-column prop="fixValue" min-width="80" label="投递人">
        </el-table-column>

        <el-table-column prop="fcode" min-width="100" label="投递人地址">
        </el-table-column>

        <el-table-column prop="position" min-width="100" label="投递邮政编码">
        </el-table-column>

        <el-table-column prop="sensorModel" min-width="120" label="装表日期" show-overflow-tooltip>
        </el-table-column>

        <!-- <el-table-column prop="status" min-width="150" label="换表日期" show-overflow-tooltip>
                </el-table-column> -->

        <el-table-column prop="totalPage" min-width="100" label="拆表日期" show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="type" min-width="180" label="停用日期">
        </el-table-column>

        <el-table-column prop="unusual" min-width="100" label="注销日期">
        </el-table-column>

        <el-table-column prop="unusual" min-width="80" label="用户状态">

        </el-table-column>

        <el-table-column prop="unusual" min-width="80" label="最后抄码">
        </el-table-column>

        <el-table-column prop="fixValue" min-width="150" label="备注" show-overflow-tooltip>
        </el-table-column>

        <!-- <el-table-column label="操作" fixed="right" width="85">
                <template slot-scope="scope">

                    <el-button type="text" @click.native="details(scope.$index, scope.row)">详情</el-button>
                </template>
                </el-table-column> -->

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
  name: "chooseuser",
  data() {
    return {
      formData: {
        con: "",
        checkList: ""
      },
      histroyData: {

      },
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    init() {
      this.formData = {
        watermeterWarehouse: "",
        watermeterWarehouseOptions: [],
        con: "",
        reason: ""
      };
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
            waterGroup: null,
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
    closeDialog() { //关闭会话
      this.waterChoooseVisible = false
      this.init()
    },
    //弹出框
    submit(formName) {	//提交
      this.$refs.childWaterEditor.submit()
      // this.waterChoooseVisible = false;
    },
    indexMethod(index) {//获取表格序号
      //    return  (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1) ;
      return (this.histroyData.pageSize - 20) * this.histroyData.pages + (index + 1);

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
  }
}
</script>

<style lang="scss">
.chooseuser {
  padding: 10px;
  width: calc(100% - 20px);
}
</style>
