<template>
  <div class="QuestionSearchUser">
    <div class="toolbar">
      <el-form
        :inline="true"
        size="mini"
        :model="tableQuery"
        class="demo-form-inline"
      >
        <el-form-item label="结构地址：">
          <el-select
            v-model="tableQuery.adminArea"
            filterable
            remote
            clearable
            reserve-keyword
            ref="addrselect"
            placeholder="请输入关键词"
            :remote-method="adminAreaDataOptions"
            :loading="false">
            <template v-for="item in adminAreaData">
              <el-option
                :key="item.fullName"
                :label="item.fullName"
                :value="item.fullName">
              </el-option>
            </template>
               <template slot="empty">
              <p class="el-select-dropdown__empty">
                无数据
              </p>
              <div style="position: sticky; bottom: 0px;background: #fff;padding-right: 10px;">
                <div style="height:30px;line-height: 30px;text-align:right" >
                  <span  style="cursor: pointer;" @click="showAddrAddDialog">
                    <i class="el-icon-plus"></i>
                  <span>添加</span>
                  </span>
                </div>
              </div>
              </template>
              <div style="position: sticky; bottom: 0px;background: #fff;padding-right: 10px;">
                <div style="height:30px;line-height: 30px;text-align:right" >
                  <span  style="cursor: pointer;" @click="showAddrAddDialog">
                    <i class="el-icon-plus"></i>
                  <span>添加</span>
                  </span>
                </div>
              </div>
          </el-select>
        </el-form-item>
        <el-form-item label="营业区域：">
            <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessAreaData" :show-all-levels="false" :props="props">
            </el-cascader>
          </el-form-item>
        <el-form-item label="地址详情：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" 
            v-model="tableQuery.setupMeterAddr"
            placeholder="请输入地址详情"
          ></el-input>
        </el-form-item>
        <el-form-item label="册本号：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" 
            v-model="tableQuery.bookNo"
            placeholder="请输入册本号"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户编号：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" 
            v-model="tableQuery.userNo"
            placeholder="请输入用户编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户名称：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" 
            v-model="tableQuery.ctmName"
            placeholder="请输入用户名称"
          ></el-input>
        </el-form-item>
               <!-- 抄表员 -->
            <el-form-item class="readingStaff" label="抄表员：">
              <el-select v-model="tableQuery.meterReadingStaffAccount" size="mini" placeholder="抄表员">
                <el-option v-for="item in meterReaderList" :key="item.userAccount" :label="item.userName" :value="item.userAccount"></el-option>
              </el-select>
            </el-form-item>

        <!--el-form-item label="模糊查询：">
          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" placeholder></el-input>
        </el-form-item-->
        <el-form-item>
          <el-button
            class="searchBtn"
            @click="demand"
            icon="el-icon-search"
          ></el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="kl-table" :style="{ height: maxHeight + 'px' }">
      <el-table
        stripe
        border
        v-if="tableShow"
        :max-height="maxHeight"
        :data="tableData.list"
        class="wuserInfo-table"
        highlight-current-row
        @selection-change="selectOne"
      >
        <el-table-column type="selection" width="50"> </el-table-column>
        <el-table-column
          type="index"
          label="NO."
          width="50"
          fixed="left"
          :index="indexMethod"
        ></el-table-column>

        <el-table-column
          prop="userNo"
          min-width="60"
          label="用户编号"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column
          prop="ctmName"
          min-width="80"
          label="用户名称"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column
          prop="setupMeterAddr"
          min-width="80"
          label="装表地址"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column
          prop="bookNo"
          min-width="80"
          label="册本号"
        ></el-table-column>

        <!-- <el-table-column prop="ctmName" min-width="80" label="客户名称" show-overflow-tooltip></el-table-column>

        <el-table-column prop="mobile" min-width="80" label="手机号码" show-overflow-tooltip></el-table-column> -->
      </el-table>
    </div>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="tableQuery.page"
        :page-sizes="[20, 100, 500, 1000]"
        :page-size="tableQuery.pageCount"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"
      >
      </el-pagination>
    </div>
    <addrAdd :addrVisible="addrVisible" v-if="addrVisible" @closeAddrAddVisible="closeAddrAddVisible"></addrAdd>
  </div>
</template>
<script>
import commonPart from "@/views/CustomerCenter/changeMangement/commonPart"; //公告模块
import uploadFile from "@/components/uploadPic"; //上传附件
import procedure from "@/components/procedure"; //流程审核
import addrAdd from "@/components/addrAdd" //结构化地址
export default {
  name: "QuestionSearchUser",
  components: {
    commonPart,
    uploadFile,
    procedure,
    addrAdd
  },
  data() {
    return {
      props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
        emitPath:false,
      },
      businessAreaData:[],
      meterReaderList:[],
      dialogVisible: false,
      tableData: {},
      adminAreaData:[],
      tableQuery: {
        page: 1,
        pageCount: 20,
        userNo: "",
        ctmName: "",
        bookNo: "",
        fuzzyQuery: "",
        adminArea:"",
        businessArea:"",
        // setupMeterAddr:"",装表地址
      },
      selectData: {},
      tableShow: false,
      maxHeight: 0,
      addrVisible:false,
    };
  },
  mounted() {
    this.init();
     // 抄表员下拉数据
    this.getReadingStaff()
    this.selectBAreaOptions()
    eventBus.$on("ccccc", (params) => {
      this.dialogVisible = true;
    });
    this.common.changeTable(this, ".QuestionSearchUser", [
      ".QuestionSearchUser .toolbar",
      ".QuestionSearchUser .block",
    ]);
  },
  methods: {
    init() {
      let _this = this;
      let params = {
        busicode: "MrUserInfoList",
        data: _this.tableQuery,
      };
      _this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          _this.tableData = res;
        });
    },
    //营业区域
    selectBAreaOptions(id) {
      let _this = this
      let params = {
        "busicode": "BusinessAreaTree",
        "data": {

        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = _this.getArr1(res)
        _this.businessAreaData = data.children;
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
    demand() {
      this.tableQuery.page = 1;
      this.init();
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
          _this.meterReaderList = [...[{ userName: "全部" }], ...res];
        });
    },
    getBusinessAreaOptions(val) {
      val = this.common.handleTreeData(val);
    },
    adminAreaDataOptions(query) {
      if(query==null || query.length==0){
        return 
      }
      let params = { busicode: "AdminAreaQuery", data: {areaName:query,isLeaf:1} };
      this.$api
        .fetch({ params })
        .then(res => {
          this.$set(this,"adminAreaData",res.list)
        })
    },
    selectOne(currentData) {
      this.selectData = currentData;
     var addType = Object.keys(this.selectData).length == 0
     var addClass = true
      if(addType == true){
        addClass = true
      } else {
         addClass = false
      }
      this.$emit('addBtnChange',addClass)
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
    showAddrAddDialog(){
      this.$refs.addrselect.blur();
      this.addrVisible = true;
    },
    closeAddrAddVisible(){
      this.addrVisible = false;
    },
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.QuestionSearchUser {
  height: 100%;
}
</style>
