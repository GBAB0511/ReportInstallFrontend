
<template>
  <div class="WaterPrice">

    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-if="EditVisible">
        <el-button size="mini" type="primary" v-if="EditRight"  @click="submitForm('WaterPriceEditFrom')">暂存</el-button>
        <el-button icon="el-icon-caret-left" size="mini" @click="handleClose">返回</el-button>
      </div>
      <div class="bread-contain-right" v-else>
        <el-button size="mini" icon="el-icon-plus" @click="add('add')" type="primary">添加</el-button>
      </div>
    </div>
    
    <WaterPriceEdit v-if="EditVisible" ref="WaterPriceEdit"></WaterPriceEdit>

    <div v-else class="indexContent">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
            <el-form-item label="状态：">
              <el-select ref="select1" v-model="tableQuery.status" placeholder="请选择状态">
                <el-option label="全部" value=""></el-option>
                <el-option label="启用" :value="1"></el-option>
                <el-option label="停用" :value="0"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="用水类型：" class="searchInput">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.waterTypeName " @keyup.enter.native="search" clearable placeholder="用水类型"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
            </el-form-item>

        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row :max-height="maxHeight" v-if="tableShow" stripe border :data="tableData.list" class="wuserInfo-table">

          <el-table-column type="index" label="NO." fixed="left" width="50" :index="indexMethod">
          </el-table-column>
          <el-table-column prop="waterTypeNo" min-width="100" label="用水类型编号">
          </el-table-column>

          <el-table-column prop="waterTypeName" min-width="100" label="用水类型名称">
          </el-table-column>
          <el-table-column prop="remark" min-width="100" label="描述">
          </el-table-column>

          <el-table-column prop="effectiveDate" min-width="100" label="生效时间">
          </el-table-column>

          <el-table-column prop="status" min-width="80" label="状态" :formatter="formatStatus">
          </el-table-column>
          
          <el-table-column prop="processState" min-width="80" label="审批状态" :formatter="formatProcessState">
          </el-table-column>
          <el-table-column prop="processName" min-width="100" label="节点名称">
          </el-table-column>
          
          <el-table-column prop="processHandleMan" min-width="100" label="当前处理人">
          </el-table-column>

          <el-table-column label="操作" width="85">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click.native="add(scope.row)">编辑</el-button>
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

  </div>
</template>
<script>
import WaterPriceEdit from "./WaterPriceEdit";
export default {
  name: "WaterPrice-index",
  components: {
    WaterPriceEdit
  },
  data() {
    return {
      EditVisible: false, //弹出表单
      EditRight:true,//编辑权限
      formData: {
        waterTypeId: "",
        effectiveDate: "",
        status: "",
        details: []
      },
      tableData: [],
      crumbsData: {
        //面包屑
        titleList: [
          { title: "收费管理" },
          { title: "价格管理" },
          { title: "用水价格" }
        ]
      },
      maxHeight: 0,
      tableShow: false,
      tableQuery: {
        page: 1,
        pageCount: 50,
        status: "",
        waterTypeName: ""
      }
    };
  },
  mounted() {
    // 侧边栏
    eventBus.$emit("asideMenuShow", "businessMenuShow4");
    this.init();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, ".WaterPrice .WaterPrice-right-content", [
        ".WaterPrice .toolbar",
        ".WaterPrice .block"
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
    enterEvents(e){
         if(e.keyCode == 13){
           this.init()
           this.$refs.select1.blur()
         }
    },
    init() {
      let _this = this;
      let params = {
        busicode: "WaterPriceList",
        data: this.tableQuery
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.tableData = res;
        });
    },
    // 搜索
    search() {
      this.tableQuery.page = 1;
      this.init();
    },
    // 添加按钮点击事件
    add(val) {
      // this.bankLinkShow = false;
      this.EditVisible = true;
      this.EditRight = true;
      this.$nextTick(() => {
        this.$refs.WaterPriceEdit.EditRight=true;
        if (val === "add") {
          //费用类型
          let _this = this;
          let params = {
            busicode: "CostNameSelect",
            data: {}
          };
          this.$api
            .fetch({
              params: params //参数
            })
            .then(res => {
              this.$refs.WaterPriceEdit.costNameOptions = res;
              let handleData ={
                waterTypeId: "",
                effectiveDate: "",
                status:1,
                details: []};
              //给明细表设置初始值  
              for(let i=0;i<res.length;i++){
                handleData.details[i]={costId:res[i].id,costName:res[i].name,
                  fixedMoneyUnit:"2",ladderType:"1",fixedPriceUnit:"1",ladderCalculateWay:"1",ladders:[]};
              }
              this.$refs.WaterPriceEdit.editData(handleData);
              //加载流程界面
              this.$refs.WaterPriceEdit.getHtmlData();
              this.common.chargeObjectEqual(
                _this,
                _this.formData,
                "set",
                "WaterPriceEdit"
              );
            });

        } else {
          let _this = this;
          let params = {
            busicode: "WaterPriceQuery",
            data: {
              id: val.id
            }
          };
          this.$api
            .fetch({
              params: params //参数
            })
            .then(res => {
              let handleData = res.WaterPricebean;
              this.$refs.WaterPriceEdit.costNameOptions = res.costlist;
              this.$refs.WaterPriceEdit.editData(handleData);
              //当流程状态为空或当前处理于起草结点时可编辑
              debugger
              if(handleData.processState!=undefined && handleData.processState!='' 
                &&handleData.processState!='draft'){
                this.EditRight=false;
                this.$refs.WaterPriceEdit.EditRight=false;
              }
              //加载流程界面
              this.$refs.WaterPriceEdit.getHtmlData();
              this.common.chargeObjectEqual(
                _this,
                handleData,
                "set",
                "WaterPriceEdit"
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
    
    formatStatus(row) {
      return row.status == 1 ? "启用" : "禁用"
    },
    formatProcessState(row){
      if(row.processState=='END'){
        return '审批结束';
      }else if(row.processState=='CANCEL'){
        return '废弃';
      }else{
        return '审批中';
      }
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
      this.$refs.WaterPriceEdit.handleClose();
    },
    //保存按钮
    submitForm(formName) {
      this.$refs.WaterPriceEdit.submitForm(formName,true);
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
$imgWidth: 200px;
$theme-color: #297acc;
.WaterPrice {
  width: 100%;
  height: 100%;
}
</style>


