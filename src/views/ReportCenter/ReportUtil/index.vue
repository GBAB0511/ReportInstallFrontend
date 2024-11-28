<template>
  <div class="ReportUtil">

    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
    </div>

    <div class="company-content">
      <div class="company-left">
        <div class="left-container" id="tree">
          <div class="database">
            <el-tree
              :data="treeData"
              node-key="id"
              :default-expanded-keys="expandKeys"
              empty-text="暂无数据"
            >
          </el-tree>
          </div>
          <div class="history">
             <el-tree
              :data="historyData"
              empty-text="暂无数据"
              node-key="id"
              :default-expanded-keys="expandHistory"
              :expand-on-click-node="false"
              @node-click="historyQuery"
            >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span :title="node.label" class="history-node-label">{{ node.label }}</span>
              <el-button
                v-if="node.isLeaf"
                type="text"
                size="mini"
                class="remove-button"
                icon="el-icon-delete"
                @click.prevent.stop="remove(data)">
              </el-button>
              </span>
            </el-tree>
          </div>
        </div>
      </div>

      <div class="company-right">
        <div class="toolbar">
          <div class="button-group">
            <el-button size="mini" class="searchBtn" @click="search" icon="el-icon-search"></el-button>
            <el-button size="mini" type="primary" @click="formatSQL">格式化</el-button>
            <el-button size="mini" type="primary" @click="save">保存</el-button>
            <el-button size="mini" type="primary" @click="exportExcel">导出</el-button>
            <el-button size="mini" @click="reset">重置</el-button>
          </div>
          <el-input size="mini" v-model="tableQuery.sql" type="textarea" :rows="6"/>
      </div>

      <div class="kl-table" :style="{height: maxHeight + 'px'}">
          <el-table highlight-current-row stripe border :max-height="maxHeight" :data="tableData.list">
            <el-table-column
              v-for="(item, index) in keys"
              :key="index" :prop="keys[index]"
              :label="keys[index]"
              min-width="120px"
              show-overflow-tooltip
              ></el-table-column>
          </el-table>
        </div>
        <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { format } from 'sql-formatter';
export default {
  data() {
    return {
      crumbsData: {
        //面包屑
        titleList: [{ title: "统计报表" }, { title: "报表工具" }]
      },
      treeData: [],
      expandKeys: [],
      historyData: [],
      expandHistory: [],
      tableQuery: {
        sql: '',
        pageCount: 20,
        page: 1
      },
      tableData: {
        list: [],
        total: 0
      },
      keys: [],
      maxHeight: 200
    }
  },
  mounted() {
    this.initTree()
    this.getHistoryData()
    this.$nextTick(() => {
      this.common.changeTable(this, ".ReportUtil .company-right", [
        ".ReportUtil .toolbar",
        ".ReportUtil .block"
      ]);
    })
  },
  methods: {
    search() {
      const params = {
            busicode: 'ReportQueryResult',
            data: this.tableQuery
          }
          this.$api.fetch({params})
            .then(res => {
              this.tableData = res
              this.keys = this.tableData.list.length > 0 ? Object.keys(this.tableData.list[0]) : []
            })
    },
    exportExcel() {
      if(!this.tableQuery.sql || this.tableQuery.sql.length == 0) {
        this.$message({
          type: 'warning',
          message: '请输入要查询的SQL语句'
        })
        return
      }
      let params = {
          busicode: "ReportQueryResultExport",
          data: {
            sql: this.tableQuery.sql
            } ,
          token: sessionStorage.getItem("token"),
          sysType: '002',
        }
        window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURIComponent(JSON.stringify(params)))
    },
    formatSQL() {
      if(!this.tableQuery.sql || this.tableQuery.sql.length === 0) {
        this.$message({
          type: 'warning',
          message: '内容为空！'
        })
        return
      }
      this.tableQuery.sql = format(this.tableQuery.sql, {uppercase: true})
    },
    save() {
      if(!this.tableQuery.sql || this.tableQuery.sql.length === 0) {
        this.$message({
          type: 'warning',
          message: '内容为空！'
        })
        return
      }
      this.$prompt('请输入名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputErrorMessage: '邮箱格式不正确'
        }).then(({ value }) => {
          if(!value || value.length === 0) {
            this.$message({
              type: 'warning',
              message: '名称不能为空！'
            });
            return
          }
          if(value.length > 50) {
            this.$message({
              type: 'warning',
              message: '输入名称过长，不能超过50个字符！'
            });
            return
          }
          const params = {
            busicode: 'ReportQuerySave',
            data: {
              "sql":this.tableQuery.sql,
	            "sqlName": value
            }
          }
          this.$api.fetch({params})
            .then(res => {
              this.$message({
                type: 'success',
                message: '保存成功'
              });
              this.getHistoryData()
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消保存'
          });       
        });
    },
    initTree() {
      const params = {
        busicode: 'DataBaseTableList',
        data: {}
      }
      this.$api.fetch({params})
        .then(res => {
          this.treeData = [res]
          this.expandKeys = [res.id]
        })
    },
    getHistoryData() {
      const params = {
        busicode: 'ReportQueryList',
        data: {}
      }
      this.$api.fetch({params})
        .then(res => {
          this.historyData = [res]
          this.expandHistory = [res.id]
        })
    },
    remove(data) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = {
            busicode: 'ReportQueryDelete',
            data: {
              id: data.id
            }
          }
          this.$api.fetch({params})
            .then(res => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getHistoryData()
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    historyQuery(data) {
      this.tableQuery = {
        sql: data.sql,
        page: 1,
        pageCount: 20
      }
    },
    reset() {
      this.tableQuery = {
        sql: '',
        page: 1,
        pageCount: 20
      }
    },
    handleSizeChange(val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val;
      this.tableQuery.page = 1;
      this.search();
    },
    handleCurrentChange(val) {
    //显示多少页码
      if (val) {
        this.tableQuery.page = val;
        this.search();
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.ReportUtil {
  height: 100%;
  width: 100%;
  .left-container {
    height: 100%;
    width: 100%;
    .database, .history {
      height: 60%;
      padding: 4px;
      overflow: auto;
      border-bottom: 1px solid #EAEBEC;
    }
    .history {
      height: 40%;
      .custom-tree-node {
        display: flex;
        width: 100%;
        overflow: hidden;
        .history-node-label {
          width: 10px;
          line-height: 28px;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
          flex-grow: 1;
        }
        .remove-button {
          justify-content: end;
          color:red;
        }
      }
    }
  }
  .button-group {
    margin-bottom: 6px;
  }
}
</style>