<template>
  <div class="MeterRelationship" v-if="dialogTableVisible">
    
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" ref="ruleForm" >
        <el-button size="mini" type="primary" @click="submit();">保存</el-button>
        <el-button size="mini" type="primary" @click="delSubmit();">删除</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
    </div>


      <div class="toolbar" >
      <el-form :rules="rules" :inline="true" size="mini" ref="queryForm" :model="rowData" class="demo-form-inline">
        <el-form-item >
          <span><b>用户编号：</b>{{rowData.userNo}}</span>
        </el-form-item>
        <el-form-item>
          <span><b>客户名称：</b>{{rowData.ctmName}}</span>
        </el-form-item>
        <el-form-item>
          <span><b>装表地址：</b>{{rowData.setupMeterAddr}}</span>
        </el-form-item>
        <el-form-item>
          <span><b>用水类型：</b>{{rowData.useWaterType}}</span>
        </el-form-item>
           <el-row >
        <el-form-item label="总表水量计算比例：" prop="fatherMeterRatio" class="width-300">
               <el-input
            v-model="rowData.fatherMeterRatio"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="分摊方式：" prop="shareWay" class="shareWay">
          <el-select clearable v-model="rowData.shareWay"  placeholder="请选择分摊方式" >
            <el-option v-for="(item,index) in dictionaryData.CSW" :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item style="float: right;">
          <el-button size="mini" type="primary" @click="add">添加分表</el-button>
        </el-form-item>
           </el-row>
      </el-form>
    </div>
    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table highlight-current-row stripe border v-if="tableShow" :max-height="maxHeight" :data="tableData2.list"
        @selection-change="handleSelectionChange">>

        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column type="index" label="NO." width="50" :index="indexMethod">
        </el-table-column>

        <el-table-column prop="bookNo" min-width="100" label="册本号">
        </el-table-column>

        <el-table-column prop="userNo" min-width="100" label="用户编号" show-overflow-tooltip>

        </el-table-column>

        <el-table-column prop="ctmName" min-width="100" label="客户名称">
        </el-table-column>

        <el-table-column prop="useWaterType" min-width="100" label="用水类型">
        </el-table-column>

        <el-table-column prop="setupMeterAddr" min-width="100" label="装表地址">
        </el-table-column>
   

        <!--
        <el-table-column prop="goldLevel" min-width="100" label="分摊比例(%)" v-if='activeName !== "third"'>
          <template slot-scope="scope">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.goldLevel"></el-input>
          </template>
        </el-table-column>-->

        <el-table-column label="操作" fixed="right" width="85">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="delRow(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
    </div>
    <div class="block">
        <el-pagination @size-change="handleSizeChange" 
        @current-change="handleCurrentChange" 
        :current-page="formData5.page" 
        :page-sizes="[20, 100, 500, 1000]" 
        :page-size="formData5.pageCount" 
        layout="total, sizes, prev, pager, next, jumper" 
        :total="tableData2.total">
        </el-pagination>
      </div>
    <el-dialog title="添加" width="80%" top="10vh" :visible.sync="addVisible" v-if="addVisible" @close="closeDialog1" :close-on-click-modal="false">
      <QuestionSearchUser ref="QuestionSearchUser"></QuestionSearchUser>
      <div slot="footer" class="dialog-footer"  ref="ruleForm">
        <el-button type="primary" size="mini" @click="addRow">确 定</el-button>
        <el-button type="info" size="mini" @click="closeDialog1">返 回</el-button>
      </div>
    </el-dialog>
  </div>

  <div class="MeterRelationship" v-else>
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" >
        <!-- <el-button size="mini" type="primary" @click="add">添加</el-button> -->
        <el-button size="mini" type="primary" @click="weihu" :v-if="true">维护</el-button>
      </div>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="总分表设置" name="first" class="first">
        <first ref="first" v-if="this.activeName === 'first'"></first>
      </el-tab-pane>

      <el-tab-pane label="监控表设置" name="third" class="first">
        <third ref="third" v-if="this.activeName === 'third'"></third>
      </el-tab-pane>
      <el-tab-pane label="消防表设置" name="fourth" class="first">
        <fourth ref="fourth" v-if="this.activeName === 'fourth'"></fourth>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>
<script>
import third from "./third";
import fourth from "./fourth";
import first from "./first";
import QuestionSearchUser from "./QuestionSearchUser";
export default {
  name: "MeterRelationship",
  components: {
    QuestionSearchUser,
    third,
    fourth,
    first,
  },
  data() {
    return {
      tableData: [],
      tableData1: [],
      tableData2: [],
      checked: false,
      tableShow: false,
      maxHeight: 0,
      userNo:"",
      tableQuery: {
        page: 1,
        pageCount: 20,
        checked: "",
        businessAbode: "",
        userNo: "",
        accountPeriod: "202024",
        meterReadingStaff: "",
        activeType: "4",
        fuzzyQuery:"",
        fuzzyQuery1:"",
      },
      tableQuery1: {
        page: 1,
        pageCount: 20,
        checked: "",
        businessAbode: "",
        userNo: "",
        accountPeriod: "202024",
        meterReadingStaff: "",
        activeType: "4",
        fuzzyQuery:"",
        fuzzyQuery1:"",
      },
      dialogTableVisible: false,
      addVisible: false,
      //公司组件树
      treeDatas: {
        // 树数据
        tree: [
          {
            books: [],
            businessAbode: "",
            showName: "全部"
          }
        ],
        // 树的label和children 字段分别是对应的什么字段
        defaultProps: {
          label: "showName",
          children: "books"
        },
        // 输入框的一些选项
        inputProp: {
          // 是否显示input框
          showSearch: true,
          // placeholder提示
          Inp_placeholder: "请输入节点"
        },
        // 根节点名称
        rootName: "全部",
        // 返回的字段
        sendTreeProp: [
          "businessAbodeName",
          "businessAbode",
          "books",
          "totalWater",
          "totalUser",
          "showName",
          "meterReadingAmount",
          "bookNo",
          "bookName",
          "abnormalAmount"
        ],
        // 默认展开某一个节点
        defaultOpen: {
          // 节点的唯一key
          nodeKey: "businessAbode"
          // 默认展开的节点 ，和key对应
          // nodeItem:'',
        }
      },
      crumbsData: {
        //面包屑
        titleList: [
          // { title: '基础信息', path: '/BusinessArea' },
          {title: "水表配置",},
          {title: "水表关系",},
          // { title: '总分表设置', method: () => { window.histroy.back() } }
        ]
      },
      isActive: false, //控制高级查询内容的显示
      formData: {},
      formData1: {},
      formData2: {},
      formData3: {},
      formData4: {},
      formData5: {
        userNo:"",
        page:1,
        pageCount:20,
      },
      formData6: {},
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      waterAddVisible: false, //综合查询的显示和隐藏
      ruleFormData: {},
      backfillVisible: false,
      ruleForm: {},
      activeName: "first",
      weihuNo:"",
      delList:[],
      selectData:[],
      rowData:{},
      dictionaryData:[],
        rules:{
        fatherMeterRatio: [
          { required: true, message: '请填写总表水量计算比例', trigger: 'blur' }
        ],
          shareWay: [
          { required: true, message: '请选择分摊方式', trigger: 'change' }
        ]
      }
    };
  },
  mounted() {
    this.init();
    this.backTreeData();
    this.getDictionarySelect();
    // 侧边栏

            
    
  },
  methods: {
    // 数据字典
    getDictionarySelect() {
      var dictionaryDataParams = {
        busicode: "DictionarySelect",
        data: "CSW"
      };
      this.$api.fetch({ params: dictionaryDataParams }).then(res => {
        this.$set(this, "dictionaryData",res);
      }).catch(res => {
        this.$set(this, "dictionaryData",[]);
      });
    },
    init() {
      this.getLeftListData();
    },
    RightList(val) {
      this.tableQuery.userNo=val.userNo;
      this.getRightListData(val);
    },
    addRow(){
      var list=this.$refs.QuestionSearchUser.selectData;
      list.forEach(element => {
        let data = JSON.parse(JSON.stringify(element));
        data.setupMeterAddr=element.ctmAddr;
        this.tableData2.list.push(data);
        this.closeDialog1();
      });
      
    },
    delRow(index,row){
      let _this=this;
      this.$confirm("是否确认删除该行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          _this.delMethod([row]);
        })
        .catch(() => {
          this.$notify({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    search(){
      let _this = this;
      if(this.formData5.userNo==='' || this.formData5.userNo===null){
        this.formData5.userNo=this.weihuNo
      }
      let params = {
        busicode: "MrRelRightList",
        data: this.formData5
      };    
      _this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          this.tableData2 = res;
          if(this.tableData2.list.length==0){
             this.$notify({
              title: '提示',
              message: '不存在该用户编号的分表',
              type: 'warning'
            });
          }
        });
    },
    weihu() {
      let _this = this;
      var rowNo;
      if(_this.activeName=="first"){
        rowNo=this.$refs.first.rowData.userNo;
        _this.rowData=this.$refs.first.rowData;
      }else if(_this.activeName=="third"){
        rowNo=this.$refs.third.rowData.userNo;
        _this.rowData=this.$refs.third.rowData;
      }else if(_this.activeName=="fourth"){
        rowNo=this.$refs.fourth.rowData.userNo;
        _this.rowData=this.$refs.fourth.rowData;
      }
      this.weihuNo = rowNo;
      // this.crumbsData.titleList.push({ title: '维护', method: () => { window.histroy.back() } });
      if(typeof(rowNo)!='undefined'){
        this.dialogTableVisible = true;
        this.userNo=rowNo;
        let params = {
          busicode: "MrRelRightList",
          data: { userNo: this.userNo }
        };
        if(_this.activeName=="first"){
          this.crumbsData={
            titleList: [
              {title: "水表配置",},
              {title: "水表关系",},
              {title: "总分表维护",},
            ]
          }
        }else if(_this.activeName=="third"){
          this.crumbsData={
            titleList: [
              {title: "水表配置",},
              {title: "水表关系",},
              {title: "监控表维护",},
            ]
          }
        }else if(_this.activeName=="fourth"){
          this.crumbsData={
            titleList: [
              {title: "水表配置",},
              {title: "水表关系",},
              {title: "消防表维护",},
            ]
          }
        }
        _this.$api
          .fetch({
            params //参数
          })
          .then(res => {

            this.tableData2 = res;
            this.formData5.userNo="";
          });
      }else{
        this.$notify({
              title: '提示',
              message: '请先选择总表的一行数据',
              type: 'warning'
            });
      }
    },
    //树接口
    backTreeData() {
      let _this = this;
      let params = {
        busicode: "DmaTreeIsLeaf",
        data: {
          accountPeriod: _this.tableQuery.accountPeriod, //账期
          meterReadingStaff: _this.tableQuery.meterReadingStaff //抄表员
        }
      };
      _this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          _this.treeDatas.tree[0].books = res;
        });
    },
    clearData() {
      (this.tableData = []),
        (this.tableData1 = []),
        (this.tableQuery = {
          page: 1,
          pageCount: 20,
          checked: "",
          businessAbode: "",
          userNo: "",
          accountPeriod: "202024",
          meterReadingStaff: "",
          activeType: ""
        });
    },

    //获取左边列表数据
    getLeftListData() {
      let _this = this;
      if(_this.activeName=='first'){
        this.tableQuery.activeType=4
      }else if(_this.activeName=='third'){
        this.tableQuery.activeType=3
      }else{
        this.tableQuery.activeType=2
      }
      let params = {
        busicode: "MrRelLeftList",
        data: this.tableQuery
      };
      _this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          this.tableData = res;
          eventBus.$emit('asideMenuShow', 'basicsMenuShow2')
    this.common.changeTable(this, '.MeterRelationship', 
    ['.MeterRelationship .bread-contain', '.MeterRelationship .toolbar','.MeterRelationship .block'])
        });
    },
    //获取右边边列表数据
    getRightListData(val) {
      let _this = this;
      _this.tableQuery.userNo=val.userNo;
      let params = {
        busicode: "MrRelRightList",
        data: _this.tableQuery
      };
      _this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          this.tableData1 = res;
        });
    },
    add() {
      this.addVisible = true;
    },
    handleClick() {
      this.clearData();
      if (this.activeName == "first") {
        // this.$set(this.crumbsData.titleList[3],'title','监控表设置')// this.$set(this.crumbsData.titleList[3],'title','监控表设置')
        this.tableQuery.activeType = "4";
        this.tableQuery1.activeType = "4";
      } else if (this.activeName == "third") {
        // this.$set(this.crumbsData.titleList[3],'title','消防表设置')
        this.tableQuery.activeType = "3";
        this.tableQuery1.activeType = "3";
      } else if (this.activeName == "fourth") {
        // this.$set(this.crumbsData.titleList[3],'title','总分表设置')
        this.tableQuery.activeType = "2";
        this.tableQuery1.activeType = "2";
      }
      this.getLeftListData();
    },
    demand() {
      
    },
    handleSelectionChange(val){
      this.selectData=val;
    },
    //   导出
    exportExcel() {
      
    },
    //分页
    handleSizeChange(val) {
      //显示多少数据一页
      this.formData5.pageCount = val
      this.formData5.page = 1
      this.search();
    },
    handleCurrentChange(val) {
      //显示多少页码
      this.formData5.page = val
      this.search();
    },
    //   查看历史
    viewHistory(index, row) {},
    cellClick(row, column, cell, event) {
      //点击文件名
      let that = this;
    },
    indexMethod(index) {
      //获取表格序号
      return (
        (this.formData5.page - 1) * this.formData5.pageCount + (index + 1)
      );
    },
    closeDialog1() {
      //关闭会话
      this.addVisible= false;

    },
    closeDialog() {
      //关闭会话
      this.waterAddVisible = false;
      this.backfillVisible = false;
      this.dialogTableVisible = false;
      this.addVisible= false;
      this.crumbsData={
          titleList: [
            {title: "水表配置",},
            {title: "水表关系",},
          ]
        }
      // this.crumbsData.titleList.splice(3, 1);
      this.init();
    },
    delSubmit(){
      let _this=this;
      _this.$confirm("是否确认移除所选子表?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          _this.delMethod(_this.selectData);
          
        }).catch(() => {
          _this.$notify({
            type: "info",
            message: "已取消删除"
          });
        });
      
    },
    delMethod(val) {
      //提交
      let _this = this;
      let params = {
        busicode: "MrRelRightSave",
        data: {
          "list": [],
          "userNo":_this.userNo,
          "delList": val,
          "shareWay":this.rowData.shareWay,
          "fatherMeterRatio":this.rowData.fatherMeterRatio
        }
      };
      _this.$api.fetch({
          params //参数
        }).then(res => {
          _this.search();
          this.$notify({
            type: "success",
            message: "删除成功"
          });
        });
    },
    //弹出框
    submit() {
     this.$refs['queryForm'].validate((valid) => {
          if (valid) {
          //提交
      let _this = this;
      let params = {
        busicode: "MrRelRightSave",
        data: {
          "list":_this.tableData2.list,
          "userNo":_this.userNo,
          "delList":[],
          "shareWay":this.rowData.shareWay,
          "fatherMeterRatio":this.rowData.fatherMeterRatio
        }
      };
      _this.$api.fetch({
          params //参数
        }).then(res => {
          this.$notify({
            type: "success",
            message: "保存成功"
          });
          //this.weihu();
          this.closeDialog();
        });
            
          } else {
            return false;
          }})

    },
    // 编辑
    edit() {
      this.backfillVisible = true;
    },
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
<style lang="scss" >
.MeterRelationship {
  width: 100%;
  height: 100%;
 & > .toolbar{
     padding: 0 20px ;
     min-height: 90px ;
     .shareWay  .el-input__inner{
       width: 200px;
     }
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 8px;
  }
  .first {
    height: 100%;
    display: flex;
    .first-right {
      width: 20%;
      height: 100%;
    }
    .first-center {
      width: 40%;
      height: 100%;
    }
    .first-left {
      width: 40%;
      height: 100%;
    }
  }
  .el-tabs__content{
    height:91%;
  }
  .el-tabs{
    height:95%;
  }
  .el-tabs__nav {
    margin-left: 20px;
  }
  .meter-type {
    font-weight: bolder;
    display: inline-block;
    line-height: 30px;
    height: 100%;
    font-size: 1rem;
  }
  .el-dialog__wrapper{
    overflow: hidden!important;
  }
}
</style>
