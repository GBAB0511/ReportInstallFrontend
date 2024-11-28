<template>
  <div class="QuestionSearchUser">
    <div class="toolbar">
      <el-form
        :inline="true"
        size="mini"
        :model="tableQuery"
        class="demo-form-inline"
        label-width="80px"
      >
        <el-form-item label="结构地址：" class="width-150">
          <el-select
            v-model="tableQuery.adminArea"
            filterable
            remote
            clearable
            reserve-keyword
            placeholder="请输入关键词"
            ref="addrselect"
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

        <el-form-item label="地址详情：" class="width-150">
          <el-input
            v-model="tableQuery.setupMeterAddr"
            clearable
            placeholder="请输入地址详情"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户编号：" class="width-150">
          <el-input
            v-model="tableQuery.userNo"
            clearable
            placeholder="请输入用户编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="客户名称：" class="width-150">
          <el-input
            v-model="tableQuery.ctmName"
            clearable
            placeholder="请输入客户名称"
          ></el-input>
        </el-form-item>
          <el-form-item label="册本号：" prop="bookNo" class="width-150">
          <el-input

            v-model="tableQuery.bookNo"
            placeholder="请输入册本号"
            clearable
          ></el-input>
        </el-form-item>
               <!-- 抄表员 -->
            <el-form-item class="readingStaff width-150" label="抄表员：" prop="meterReadingStaffName">
              <el-select   clearable v-model="meterReadingStaffName" size="mini" placeholder="抄表员">
                <el-option v-for="item in meterReaderList" :key="item.userAccount" :label="item.userName" :value="item.userName"></el-option>
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
        @row-click="handleTableCellClick"
        ref="eltableCurrentRow"
        :cell-style="cellStyle"
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

      <!--  <el-table-column
          prop="bookNo"
          min-width="80"
          label="册本号"
        ></el-table-column> -->

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
  props: ['mainBookNo', 'mainMeterReadingStaffName','mainMeterReadingStaffAccount'],
  components: {
    commonPart,
    uploadFile,
    procedure,
    addrAdd
  },
  data() {
    return {
      meterReaderList:[],
      dialogVisible: false,
      meterReadingStaffName:"",
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
        meterReadingStaffAccount:"",
        // setupMeterAddr:"",装表地址
      },
      selectData: [],
      tableShow: false,
      maxHeight: 0,
      addrVisible:false,
    };
  },
  mounted() {
       this.init();
        this.getReadingStaff()
       console.log(this.mainBookNo);
        console.log(this.mainMeterReadingStaffName);
    if(this.mainBookNo){
      this.tableQuery.bookNo = this.mainBookNo
    }
     if(this.mainMeterReadingStaffAccount){
      // this.tableQuery.meterReadingStaffAccount = this.mainMeterReadingStaffName
      this.tableQuery.meterReadingStaffAccount = this.mainMeterReadingStaffAccount
      this.meterReadingStaffName = this.mainMeterReadingStaffName
    }
     // 抄表员下拉数据

    eventBus.$on("ccccc", (params) => {
      this.dialogVisible = true;
    });
    this.common.changeTable(this, ".QuestionSearchUser", [
      ".QuestionSearchUser .toolbar",
      ".QuestionSearchUser .block",
    ]);
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
    //  if(this.meterReadingStaffName){
    //   this.tableQuery.meterReadingStaffAccount = this.meterReadingStaffAccountName
    // }
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
    handleTableCellClick(row,cell,event){
      const len = row.rowspan != undefined? row.rowspan : 1 
      const ind = this.tableData.list.findIndex(item => item.id === row.id)
      var select = []
      for(let i = ind; i < ind + len; i++) {
        select.push(this.tableData.list[i])
      }
      if(this.selectData.some(item => select.some(val => val.id === item.id))) { //取消该账期勾选
        this.selectOne(this.selectData.filter(item => select.every(val => val.id !== item.id)))
        select.forEach(item => {
          this.$refs.eltableCurrentRow.toggleRowSelection(item, false);
        })
      } else {
        this.selectOne(this.selectData.concat(select))
        this.selectData.concat(select).forEach(item =>{
          this.$refs.eltableCurrentRow.toggleRowSelection(item, true);
        })
      }   
    },
    cellStyle(data){
      return "cursor:pointer;"
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
