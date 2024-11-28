<template>
  <div class="UnionPay">
    <!-- 互联网对账 -->
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right" v-show="!leftTableShow">
        <el-button icon="el-icon-caret-left" size="mini" @click="closeDialog">返回</el-button>
      </div>
    </div>
    <div class="toolbar" v-show="leftTableShow">
      <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
        <el-form-item label="收费日期：">
          <el-date-picker v-model="tableQuery.chargingDate" 
             format="yyyy-MM-dd" value-format="yyyy-MM-dd"  type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>

        <el-form-item label="代收单位：">
          <el-select clearable v-model="tableQuery.chargingUnit" placeholder="">
              <el-option
                v-for="item in dictionaryData.BTU"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="对账状态：">
          <el-select clearable v-model="tableQuery.checkResult" placeholder="全部">
            <el-option
              v-for="(item,index) in checkResultOption"
              :key="index"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理状态：">
          <el-select clearable v-model="tableQuery.handleFlag" placeholder="全部">
            <el-option
              v-for="(item,index) in handleFlagOptions"
              :key="index"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button class="searchBtn" @click="demand" icon="el-icon-search"></el-button>
        </el-form-item>
      </el-form>
    </div>
    <section class="kl-table">
      <div class="left-table" v-show="leftTableShow">
        <el-table
          v-if="tableShow"
          :max-height="maxHeight"
          stripe
          border
          :data="tableData.list"
          highlight-current-row
          class="change-tables-table"
        >
          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod"></el-table-column>

          <el-table-column prop="chargingDate" min-width="100" label="收费日期"></el-table-column>

          <el-table-column prop="chargingUnit" min-width="100" label="代收单位"></el-table-column>

          <el-table-column prop="chargingAmount" min-width="100" label="代收笔数"></el-table-column>

          <el-table-column prop="chargingMoney" min-width="100" label="代收金额"></el-table-column>

          <el-table-column prop="checkDate" min-width="100" label="对账日期"></el-table-column>

          <el-table-column prop="checkFile" min-width="100" label="文件名"></el-table-column>

          <el-table-column prop="checkResult" min-width="80" label="对账结果"></el-table-column>

          <el-table-column prop="handleFlag" min-width="80" label="处理标记"></el-table-column>

          <el-table-column class="cell" label="操作" fixed="right" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click.native="details(scope.$index, scope.row)">详情</el-button>
              <span v-show="scope.row.modifyBy==='2'">|</span>
              <el-button type="text" @click="handle" v-show="scope.row.modifyBy==='2'">处理</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="right-table" v-show="detalisShow">
        <el-table
          v-if="tableShow"
          :max-height="maxHeight"
          stripe
          border
          :data="histroyData.list"
          class="change-tables-table"
        >
          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod"></el-table-column>

          <el-table-column prop="code" min-width="100" label="用户编号"></el-table-column>

          <el-table-column prop="lvalue" min-width="100" label="用户名称"></el-table-column>

          <el-table-column prop="areaName" min-width="100" label="流水号"></el-table-column>

          <el-table-column prop="lvalue" min-width="100" label="销账金额"></el-table-column>

          <el-table-column prop="lvalue" min-width="100" label="支付金额"></el-table-column>

          <el-table-column prop="areaName" min-width="100" label="手续费"></el-table-column>

          <el-table-column prop="lvalue" min-width="80" label="实收金额"></el-table-column>

          <el-table-column prop="lvalue" min-width="80" label="缴费时间"></el-table-column>
        </el-table>
      </div>
      <div class="right-table" v-show="HandleShow">
        <el-table
          v-if="tableShow"
          :max-height="maxHeight"
          stripe
          border
          :data="histroyData.list"
          class="change-tables-table"
        >
          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod"></el-table-column>

          <el-table-column prop="code" min-width="100" label="用户编号"></el-table-column>

          <el-table-column prop="lvalue" min-width="100" label="用户名称"></el-table-column>

          <el-table-column prop="areaName" min-width="100" label="流水号"></el-table-column>

          <el-table-column prop="lvalue" min-width="100" label="支付金额"></el-table-column>

          <el-table-column prop="lvalue" min-width="80" label="发生时间"></el-table-column>

          <el-table-column prop="flux" min-width="80" label="异常原因"></el-table-column>

          <el-table-column prop="meter" min-width="80" label="销账金额"></el-table-column>

          <el-table-column class="cell" label="操作" fixed="right" width="180">
            <template slot-scope="scope">
              <el-button type="text" v-show="scope.row.status==='1'">转预存</el-button>
              <span v-show="scope.row.status==='1'">|</span>
              <el-button type="text" v-show="scope.row.status==='1'">退费</el-button>
              <!-- <span  >|</span> -->

              <el-button type="text" v-show="scope.row.status==='2'">取消收费</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  name: "UnionPay",
  data() {
    return {
      crumbsData: {
        //面包屑
        titleList: [
          { title: "收费管理" },
          { title: "收款对账" },
          { title: "互联网对账" }
        ]
      },
      dictionaryData:[],
      handleFlagOptions:[//0未处理，1已处理
        {
          value:'0',
          name:'未处理',
        },
        {
          value:'1',
          name:'已处理',
        }
      ],
      checkResultOption:[//1正常，2异常
        {
          value:'1',
          name:'正常',
        },
        {
          value:'2',
          name:'异常',
        }
      ],
      tableQuery: {
        "chargingDate":"",//收费日期
        "chargingUnit":"",//代收单位，数据字典BTU
        "checkResult":"",//对账结果，1正常，2异常
        "handleFlag":""//处理结果，0未处理，1已处理
      },
      // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      DateChoosevalue: [],
      tableShow: false,
      maxHeight: 0,
      histroyData: {},
      tableData:{
        list:[{}]
      },
      UnionPayVisible: false, //综合查询的显示和隐藏
      leftTableShow: true,
      detalisShow: false,
      HandleShow: false
    };
  },
  mounted() {
    // 侧边栏
    eventBus.$emit("asideMenuShow", "businessMenuShow4");
    this.init();
    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".UnionPay", [
      ".UnionPay .toolbar",
      ".UnionPay .block",
    ]);
  },
  methods: {
    init() {
      let params = {
        busicode: "FnAlipayList",
        data: this.tableQuery
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.tableData = res;
        });
    },

    demand() {
      //查询
      this.init();
    },
    
    // 数据字典数据获取
    getDictionary() {
      var params = {
        busicode: "DictionarySelect",
        data: "BTU" 
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.dictionaryData = res;
        });
    },

    indexMethod(index) {
      //获取表格序号
         return   (index+1) ;
     
    },
    closeDialog() {
      //关闭会话
      this.HandleShow = false;
      this.detalisShow = false;
      this.leftTableShow = true;
      this.init();
    },
    //弹出框
    submit() {
      //提交
      this.$refs.childUnionPay.submit();
    },
    handle() {
      this.HandleShow = true;
      this.leftTableShow = false;
    },
    details() {
      this.leftTableShow = false;
      this.detalisShow = true;
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
.UnionPay {
  width: 100%;
  height: 100%;
}
</style>