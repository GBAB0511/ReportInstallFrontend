<template>
  <div class="BusinessArea">

    <div class="company-content">
      <div class="company-left">
        <auto-tree :treeData="treeDatas" @sendTreeData="backAbodeData"></auto-tree>
      </div>
      <div class="company-right BusinessAreaIndex">

        <div class="toolbar">
          <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline">
            <el-form-item class="form-left">

              <el-form-item label="区域名称：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.areaName" @keyup.enter.native="search" placeholder="请输入区域名称">
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
              </el-form-item>

            </el-form-item>
          </el-form>
        </div>
        <div class="kl-table" :style="{height: maxHeight + 'px'}">
          <el-table highlight-current-row stripe border ref="table" :data="tableData.list" @selection-change="getSelectData" v-if="tableShow" :max-height="maxHeight" class="wuserInfo-table">
            <el-table-column type="selection" width="50" fixed="left">
            </el-table-column>
            <el-table-column type="index" label="NO." width="50" :index="indexMethod">
            </el-table-column>
            <el-table-column prop="areaNo" min-width="200" label="区域编号"> </el-table-column>
            <el-table-column prop="areaName" min-width="200" label="区域名称"> </el-table-column>
            <el-table-column prop="sortNo" min-width="80" label="排序号">
            </el-table-column>
            <el-table-column prop="status" min-width="80" label="状态">
            </el-table-column>
            <el-table-column prop="areaComments" min-width="150" label="区域描述" show-overflow-tooltip>
            </el-table-column>
          </el-table>

          
        </div>
        <!-- 分页 -->
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10, 50, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
            </el-pagination>
          </div>
      </div>
    </div>
  </div>

</template>
<script>
import autoTree from '@/components/companyTree/autoTree'
export default {
  name: "BusinessArea",
    components: {
      autoTree  
  },
  props: ['parentSelectData'],
  data() {
    return {
      // 勾选数据
      selectData: [],


      formData: {
        id: "",
        businessAbodeId: "",
        areaNo: "",
        areaName: "",
        groupCode: "",
        tenantId: "",
        sortNo: "",
        status: "",
        areaComments: ""
      },
      crumbsData: {
        //面包屑
        titleList: [
          {
            title: "区域配置",
            method: () => {
              window.histroy.back();
            }
          },
          {
            title: "营业区域",
            method: () => {
              window.histroy.back();
            }
          }
        ]
      },
      treeDatas: {
        tree: [
          {
            children: [],
            id: "",
            abodeName: "全部"
          }
        ],
        defaultProps: {
          label: "abodeName",
          children: "children"
        },
        inputProp: {
          showSearch: true,
          Inp_placeholder: "请输入节点"
        },
        sendTreeProp: [
          "id",
          "abodeNo",
          "abodeName",
          "sortNo",
          "status",
          "comments",
          "groupCode",
          "tenantId"
        ],
        rootName: "根目录",
        defaultOpen: {
          nodeKey: "id"
        }
      },
      tableData: [],
      tableQuery: {
        page: 1,
        pageCount: 10,
        areaName: "",
        businessAbodeId: "",
      },
      businessAbodeId: "",
      tableShow: false,
      maxHeight: 0,
      abodeName: "",
      formType: 'add'
    };
  },
  mounted() {
    this.getAbodeDatas();
    // console.log(this.getTreeDatas)
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      // this.common.changeTable(this, '.business-area1 .business-area1-right-content', []);
      this.common.changeTable(this, ".BusinessArea .company-right", [
          ".BusinessArea .toolbar",
          ".BusinessArea .block"
        ]);
    });
  },
  methods: {
    // 列表的NO列
    indexMethod(index) {
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1);
    },
    handleSizeChange(val) { //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.init();
    },
    handleCurrentChange(val) {  //页码点击
      this.tableQuery.page = val;
      this.init();
    },
    init() {
      let _this = this;
      let params = {
        busicode: "BusinessAreaList",
        data: this.tableQuery,
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.tableData = res;
          setTimeout(() => {
            for (let i = 0; i < _this.tableData.list.length; i++) {
              for (let j = 0; j < _this.parentSelectData.length; j++) {
                if (_this.parentSelectData[j].value == _this.tableData.list[i].areaNo) {
                  _this.$refs.table.toggleRowSelection(_this.tableData.list[i], true)
                }
              }
            }
          }, 0);
        });
    },
    // 表格勾选对象数组
    getSelectData(itemList) {
      this.selectData = []
      itemList.forEach(item => {
        this.selectData.push({
          value: item.areaNo,
          name: item.areaName,
        })
      })
      console.log();
    },
    // 返回勾选数据给父页面（由父页面调用）
    setSelectData() {
      return this.selectData
    },

    // 搜索
    search() {
      this.tableQuery.page = 1;
      this.init()
    },
    // 获取左侧营业所的数据
    getAbodeDatas() {
      let _this = this;
      let params = {
        busicode: "BusinessAbodeList",
        data: {}
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.treeDatas.tree[0].children = res.list;
          this.init();
        });
    },
    // 树的点击
    backAbodeData(val) {
      let _this = this;
      this.tableQuery.page = 1;
      this.businessAbodeId = val.id;
      this.tableQuery.businessAbodeId = val.id;
      let params = {
        busicode: "BusinessAreaList",
        data: this.tableQuery,
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.tableData = res;
        });
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
<style lang="scss">
.BusinessArea {
  width: 100%;
  height: 100%;
  .BusinessAreaIndex {
    width: 100%;
    height: calc(100% - 41px);
  }
}
</style>


