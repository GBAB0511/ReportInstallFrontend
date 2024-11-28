<template>
  <div class="ComprehensiveQuery">
    <!-- 客户资料查询 高级查询 -->
    <div class="toolbar">
      <div class="form-right">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="add">增加</el-button>
      </div>
    </div>

    <div class="kl-table">
      <el-table :data="gridData" border>
        <el-table-column type="index" label="NO." min-width="50">
        </el-table-column>
        <el-table-column label="字段名" min-width="150">
          <template slot-scope="scope">
            <el-select v-model="scope.row.FieldName" placeholder="请选择">
              <el-option v-for="item in FieldNameoptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作符" min-width="150">
          <template slot-scope="scope">
            <el-select v-model="scope.row.Operator" placeholder="请选择">
              <el-option v-for="item in OperatorOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="查询值" min-width="150">
          <template slot-scope="scope">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.QueryValue"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="逻辑值" min-width="150">
          <template slot-scope="scope">
            <el-select v-model="scope.row.LogicalValue" placeholder="请选择">
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
  data() {
    return {
      gridData: [
        {
          FieldName: "",
          Operator: "",
          LogicalValue: "",
          QueryValue: "",
        },
      ],
      FieldNameoptions: [
        {
          label: "客户编号",
          value: "ctm_no"
        },
        {
          label: "账户编号",
          value: "account_no"
        },
        {
          label: "册本号",
          value: "book_no"
        },
        {
          label: "用户编号",
          value: "user_no"
        },
      ],
      OperatorOptions: [
        {
          label: "等于",
          value: "="
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
    }
  },
  methods: {
    add() {
      this.gridData.push({
        FieldName: "",
        Operator: "",
        LogicalValue: "",
        QueryValue: "",
      })

    },
    // 删除行
    deleteRow(index, row) {
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
  }
}
</script>
<style lang="scss">
.ComprehensiveQuery {
  padding: 5px 20px;
  .cell {
    .el-input__suffix {
      display: flex;
      align-items: center;
    }
  }
}
</style>
