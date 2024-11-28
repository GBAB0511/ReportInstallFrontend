<template>
  <div class="price-info">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="EditVisible">
        <el-button size="mini" type="primary" @click="submitForm('PriceInfoEditForm')">保存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="handleClose">返回</el-button>
      </div>
      <div class="bread-contain-right" v-else>
        <el-button size="mini" icon="el-icon-plus" @click="add('add')" type="primary">添加</el-button>
      </div>
    </div>
    <div v-if="EditVisible" class="PriceInfoEditContain">
      <PriceInfoEdit ref="PriceInfoEdit"></PriceInfoEdit>
    </div>

    <div class="toolbar">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">

        <el-form-item class="form-left">
          <el-form-item label="状态：">
            <el-select v-model="tableQuery.status" placeholder="请选择状态">
              <el-option label="全部" value=""></el-option>
              <el-option label="启用" :value="1"></el-option>
              <el-option label="停用" :value="0"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="模糊查询：" class="searchInput">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.searchContent" @keyup.enter.native="search" clearable placeholder="明细名称/费用名称"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
          </el-form-item>
        </el-form-item>
      </el-form>
    </div>
    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table v-if="tableShow" :max-height="maxHeight" stripe border :data="tableData.list" class="wuserInfo-table">
        <el-table-column type="index" label="序号" fixed="left" width="50" :index="indexMethod">
        </el-table-column>

        <el-table-column prop="detailName" min-width="80" label="策略名称">
        </el-table-column>

        <el-table-column prop="ladderType" min-width="80" label="阶梯类型">
        </el-table-column>

        <el-table-column prop="costName" min-width="80" label="费用种类">
        </el-table-column>
        

        <el-table-column prop="calculateUnit" min-width="100" label="计算单位" :formatter="formatCalculateUnit">
        </el-table-column>
        <el-table-column prop="personBase" min-width="100" label="人口基数">
        </el-table-column>
        <el-table-column prop="waterBase" min-width="100" label="水量基数">
        </el-table-column>

        <el-table-column prop="status" min-width="100" label="状态" :formatter="formatStatus">
        </el-table-column>

        <el-table-column label="操作" width="70">
          <template slot-scope="scope">
            <el-button type="text" style="font-size: 12px;" @click.native="add(scope.row)">编辑</el-button>
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
</template>
<script>
import PriceInfoEdit from "./PriceInfoEdit";
export default {
  components: {
    PriceInfoEdit
  },
  name: "price-info-index",
  data() {
    return {
      EditVisible: false, //弹出表单
      ladderTypeOptions: [], //阶梯类型
      tableData: [],
      //   查询表单
      formData: {
        detailName: "",
        costName: "",
        ladderType: "",
        calculateUnit: "",
        personBase: "",
        waterBase: "",
        status: "",
        comments: "",
        ladderlist: []
      },
      crumbsData: {
        //面包屑`
        titleList: [
          { title: "收费管理" },
          { title: "价格管理" },
          { title: "计费策略" }
        ]
      },
      rules: {
        Applicant: [
          { required: true, message: "请输入申请人", trigger: "blur" }
        ],
        applicantDate: [
          { required: true, message: "请输入申请日期", trigger: "blur" }
        ],
        engineerType: [
          { required: true, message: "请选择工程类型", trigger: "change" }
        ],
        Contacts: [
          { required: true, message: "请输入联系人", trigger: "blur" }
        ],
        documentType: [
          { required: true, message: "请输入证件类型", trigger: "blur" }
        ],
        documentNumber: [
          { required: true, message: "请输入证件号码", trigger: "blur" }
        ],
        contactNumber: [
          { required: true, message: "请输入座机号码", trigger: "blur" }
        ],
        Emergency: [
          { required: true, message: "请选择紧急程度", trigger: "change" }
        ]
      },
      ruleForm: {
        Applicant: "",
        engineerType: ""
      },
      tableShow: false,
      maxHeight: 0,
      tableQuery: {
        page: 1,
        pageCount: 50,
        status: "",
        searchContent: ""
      }
    };
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, ".price-info .price-info-right-content", [
        ".price-info .toolbar",
        ".PriceInfoEdit .block"
      ]);
    });
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    init() {
      let _this = this;
      let params = {
        busicode: "CostDetailList",
        data: this.tableQuery
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.tableData = res;
        });
      //阶梯类型
      this.$api
        .fetch({
          params: {
            busicode: "DictionarySelect",
            data: "UWJ"
          } //参数
        })
        .then(res => {
          _this.ladderTypeOptions = res;
        });
    },
    formatStatus(row) {
      //格式化状态
      return row.status == 1 ? "启用" : "停用";
    },
    formatCalculateUnit(row) {
      //格式化单位
      if (row.calculateUnit == 1) {
        return "按户";
      } else if (row.calculateUnit == 2) {
        return "按人";
      } else {
        return " ";
      }
    },
    // 搜索
    search() {
      this.tableQuery.page = 1;
      this.init();
    },
    // 添加按钮点击事件
    add(val) {
      this.EditVisible = true;
      this.$nextTick(() => {
        if (val === "add") {
          this.$refs.PriceInfoEdit.editData({
            detailName: "",
            costName: "",
            ladderType: "",
            calculateUnit: "",
            personBase: "",
            waterBase: "",
            status: "",
            comments: "",
            ladderlist: []
          });
          // this.crumbsData.titleList.push({title:'添加',method:()=>{window.histroy.back()}});
          this.common.chargeObjectEqual(
            this,
            this.formData,
            "set",
            "PriceInfoEdit"
          );
        } else {
          // this.crumbsData.titleList.push({title:'编辑',method:()=>{window.histroy.back()}});
          let _this = this;
          let params = {
            busicode: "CostDetailQuery",
            data: {
              costDetailId: val.costDetailId
            }
          };
          this.$api
            .fetch({
              params: params //参数
            })
            .then(res => {
              this.$refs.PriceInfoEdit.editData(res[0]);
              this.common.chargeObjectEqual(
                this,
                res[0],
                "set",
                "PriceInfoEdit"
              );
            });
        }
      });
    },
    // 列表的NO列
    indexMethod(index) {
      return (
        (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
      );
    },
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.init();
    },
    handleCurrentChange(val) {
      //页码点击
      this.tableQuery.page = val;
      this.init();
    },
    closeDialog() {
      // this.crumbsData.titleList.pop();
      this.EditVisible = false;
    },
    // 返回
    handleClose() {
      this.$refs.PriceInfoEdit.handleClose();
    },
    //保存按钮
    submitForm(formName) {
      let type = this.crumbsData.titleList[3].title;
      this.$refs.PriceInfoEdit.submitForm(formName, type);
    }
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    }
  }
};
</script>
<style lang="scss">
@import "../../../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.price-info {
  width: 100%;
  height: 100%;
  .PriceInfoEditContain {
    width: 100%;
    height: calc(100% - 40px);
  }
}
</style>

