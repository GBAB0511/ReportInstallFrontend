<template>

  <div class="BookInfoUserEdit">
    <el-dialog title="添加" :visible.sync="addVisible" v-if="addVisible" append-to-body @close="closeDialog1" :close-on-click-modal="false" class="button-dialog">
      <QuestionSearchUser @addBtnChange="addBtnChange" ref="QuestionSearchUser"></QuestionSearchUser>
      <div slot="footer" class="dialog-footer"  ref="ruleForm">
        <el-button type="primary" size="mini" @click="addRow">确 定</el-button>
        <el-button type="info" size="mini" @click="closeDialog1">返 回</el-button>
      </div>
    </el-dialog>
      <div class="toolbar">
        <el-form :inline="true" size="mini" class="demo-form-inline width-150">
         <el-form-item label="用水类型：">
            <el-cascader
              ref="cascader-a"
              v-model="userQuery.useWaterType"
              :options="useWaterTypeOptions"
              :show-all-levels="false"
              clearable
              :props="props">
            </el-cascader>
          </el-form-item>

          <el-form-item label="用户编号：">
       <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="userQuery.userNo" placeholder="用户编号" @keydown.enter.native="iniuserGroupList" size="mini" clearable></el-input>
          </el-form-item>
           <el-form-item label="用户名称：">
       <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="userQuery.ctmName" placeholder="用户名称" @keydown.enter.native="iniuserGroupList" size="mini" clearable></el-input>
          </el-form-item>
           <el-form-item label="装表地址：">
       <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="userQuery.setupMeterAddr" placeholder="装表地址" @keydown.enter.native="iniuserGroupList" size="mini" clearable></el-input>
          </el-form-item>
          <el-form-item label="排序号：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" v-model="userQuery.sortStart" placeholder="" clearable size="mini"></el-input>
          </el-form-item><span class="separator">~</span>
          <el-form-item label="">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')" v-model="userQuery.sortEnd" placeholder="" clearable size="mini"></el-input>
          </el-form-item>
          <el-form-item>
           <el-button size="mini" class='searchBtn' @click="init()" icon="el-icon-search"></el-button>
          </el-form-item>
        </el-form>
        <div class="bread-contain-class">
      <!-- <div class="bread-contain-left"> 共{{ totalUser }}个用户</div> -->
       <div class="bread-contain-left"><span>册本号：</span>{{bookNo}}；<span>册本名称：</span>{{bookName}}；<span>合计：</span>{{totalUser}}/户</div>
       <div class="bread-contain-right">
         <el-button size="mini" type="primary" @click="copyCell()">复制</el-button>
        <el-button size="mini" type="primary" @click="save()">保存</el-button>
        <el-button size="mini" type="primary" @click="addUser()">添加用户</el-button>
      </div>
      </div>
        </div>
        <div class="kl-table" :style="{ height: maxHeight + 'px' }">
          <!-- <el-table center stripe border :data="userData.list" :max-height="maxHeight"  class="wuserInfo-table">
            <el-table-column fixed="left" align="center" type="index" label="NO." width="80" :index="indexMethod"></el-table-column>

            <el-table-column fixed="left" prop="userNo" min-width="150" label="用户编号" show-overflow-tooltip></el-table-column>

            <el-table-column fixed="left" prop="ctmName" min-width="230" label="客户名称" show-overflow-tooltip></el-table-column>

            <el-table-column align="left" prop="setupMeterAddr" min-width="360" label="装表地址" show-overflow-tooltip></el-table-column>

              <el-table-column prop="meterReadingCycle" min-width="120" label="抄表周期" >
            <template slot-scope="scope">
              <el-select v-model="scope.row.meterReadingCycle"  @focus="setCopyVal(scope)">
                <el-option v-for="item in dictionaryData" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
            <el-table-column  prop="nextMonthid" min-width="120" label="下次抄表月份" >
          <template slot-scope="scope" >
              <el-date-picker   @focus="setCopyVal(scope)" v-model="scope.row.nextMonthid" type="month" class="month-picker"
              format="yyyy-MM" size="mini" value-format="yyyyMM"
                placeholder="选择日期" >
              </el-date-picker>
            </template>

          </el-table-column>
            <el-table-column prop="lastMonthid" min-width="110" label="上次抄表月" show-overflow-tooltip></el-table-column>
            <el-table-column prop="businessArea" min-width="110" label="营业区域" show-overflow-tooltip></el-table-column>

            <el-table-column prop="useWaterType" min-width="150" label="用水类型" show-overflow-tooltip></el-table-column>

            <el-table-column prop="status" min-width="100" label="用户状态" show-overflow-tooltip></el-table-column>

            <el-table-column label="操作" fixed="right" width="60">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click.native="delte(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table> -->
          <ux-grid stripe border
            :max-height="maxHeight"
            :data="userData.list" class="change-tables-table" highlight-current-row>

            <ux-table-column type="index" title="NO." min-width="80" fixed="left" :index="indexMethod">
            </ux-table-column>

            <ux-table-column field="userNo" min-width="150" title="用户编号" show-overflow-tooltip resizable>
              <template slot-scope="scope">
                <span style="color: #409eff; cursor: pointer;" @click="toDetail(scope.row.userNo)">{{scope.row.userNo}}</span>
              </template>
            </ux-table-column>

            <ux-table-column field="sortNo" min-width="80" title="排序号" resizable>
            </ux-table-column>

            <ux-table-column field="ctmName" min-width="230" title="客户名称" resizable>
            </ux-table-column>

            <ux-table-column field="setupMeterAddr" min-width="360" title="装表地址" resizable>
            </ux-table-column>

            <ux-table-column field="meterReadingCycle" min-width="150" title="抄表周期" >
              <template slot-scope="scope">
                <el-select v-model="scope.row.meterReadingCycle"  @change="setCopyVal(scope)">
                  <el-option v-for="item in dictionaryData" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </template>
            </ux-table-column>

            <ux-table-column field="nextMonthid" min-width="150" title="下次抄表月份" >
              <template slot-scope="scope" >
                <el-date-picker @change="setCopyVal(scope)" v-model="scope.row.nextMonthid" type="month" class="month-picker"
                format="yyyy-MM" size="mini" value-format="yyyyMM"
                  placeholder="选择日期" >
                </el-date-picker>
              </template>
            </ux-table-column>

            <ux-table-column field="lastMonthid" min-width="110" title="上次抄表月" resizable>
            </ux-table-column>

            <ux-table-column field="businessArea" min-width="110" title="营业区域" resizable>
            </ux-table-column>

            <ux-table-column field="factoryNo" min-width="110" title="表身码" resizable>
            </ux-table-column>

            <ux-table-column field="meterType" min-width="110" title="水表分类" resizable>
            </ux-table-column>

            <ux-table-column field="useWaterType" min-width="150" title="用水类型" resizable>
            </ux-table-column>

            <ux-table-column field="status" min-width="100" title="用户状态" resizable>
            </ux-table-column>

            <ux-table-column title="操作" fixed="right" width="60" resizable>
              <template slot-scope="scope">
                <el-button type="text" @click="delte(scope.row)">删除</el-button>
              </template>
            </ux-table-column>

          </ux-grid>
        </div>
    <!-- <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="userQuery.page" :page-sizes="[500, 1000, 2000]"
        :page-size="userQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="userData.total">
        </el-pagination>
      </div> -->
  </div>
</template>
<script>
import QuestionSearchUser from "./QuestionSearchUser";
export default {
  name: "BookInfoUserEdit",
  props: ["bookNo",'bookName'],
  components: {
      QuestionSearchUser
  },
  data() {
    return {
      props: {
        //树结构格式
        value: "id",
        label: "name",
        checkStrictly: true,
      },
      dictionaryData:{},
       useWaterTypeOptions:[],//用水类型下拉框
        userQuery:{
          useWaterType:[],
          userNo:"",
          ctmName:"",
          setupMeterAddr:"",
            page:1,
            pageCount:999999,
          sortStart: '',
          sortEnd: '',
        },
        totalUser:0,
        maxHeight:100,
        userData:{},
        addVisible:false,
        addBtn:false,
        copyVal:{},
       // 日期选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
    }
  },
  mounted() {
     this.SelectUseWaterTypeOptions();
     this.getReadCycleList();
      this.init();
  },
  methods: {
    setCopyVal(scope){//保存当前焦点输入框的值
      this.copyVal = {
        col:scope.column.property,
        val : scope.row[scope.column.property]
       };
    },
    copyCell(){
     let copyval = this.copyVal;
    for(let idx in this.userData.list){ //把对应的单元格data重新更新
      this.userData.list[idx][copyval.col] = copyval.val;
    }
    },
     save() {
      let _this = this
      let paramsArr = this.userData.list.map(item=>{
        return {userNo:item.userNo,meterReadingCycle:item.meterReadingCycle,nextMonthid:item.nextMonthid}
      })
      let params = {
        "busicode": "ReadConfigSave",
        "data": paramsArr,
      }
      this.$api.fetch({
        params: params,
      }).then(res => {
        _this.$message({
          message: '保存成功！',
          type: 'success'
        });
        _this.init()
      })
    },
        //用水类型下拉框
    SelectUseWaterTypeOptions() {
      let params = {
        "busicode": "WaterTypeTree",
        "data": {
        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = this.getArr(res.children)
        this.useWaterTypeOptions = data;
      })
    },
        // 抄表周期数据
    getReadCycleList() {
      var _this = this
      var params = {
        "busicode": "ReadCycleList",
        "data": {}// 抄表周期
      }
      this.$api.fetch({
        params: params,//参数
      }).then(res => {
        _this.dictionaryData = res
      })
    },
        //树结构数据处理
    getArr(data) {
      function abc(arr) {
        arr.map(i => {
          if (i.isParent === false) {
            delete i.children;
          } else {
            abc(i.children);
          }
        });
      }
      abc(data);
      return data;
    },
    init(){
      let _this = this;
      let params = {
        busicode: "UserInfoList",
        data: {
            bookNo:this.bookNo,
            useWaterType:this.userQuery.useWaterType,
            userNo:this.userQuery.userNo,
            ctmName:this.userQuery.ctmName,
              setupMeterAddr:this.userQuery.setupMeterAddr,
            page:this.userQuery.page,
            pageCount:this.userQuery.pageCount,
            sortStart:this.userQuery.sortStart,
            sortEnd:this.userQuery.sortEnd,
        }
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          _this.userData = res;
          _this.totalUser = res.total
          this.common.changeTable(this, '.BookInfoUserEdit',
            ['.BookInfoUserEdit .toolbar',
            '.BookInfoUserEdit .block',
            '.MeterReadingCircuit .bread-contain',
            '.BookInfoUserEdit .bread-contain-right'])
            })
    },
    addRow(){
      let list = this.$refs.QuestionSearchUser.selectData;
      let userNos = []
      list.forEach(element => {
        userNos.push(element.userNo);
      });
      let data = {
        userGroupNo:this.bookNo,
        userNos:userNos
      }
      let params = { busicode: "BookUserAdd", data: data };
      this.$api
        .fetch({ params })
        .then(res => {
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success'
          });
          this.closeDialog1();
          this.init()
          this.addBtn = true
          this.addVisible=false
        })

    },
    addBtnChange(val){
      this.addBtn = val
    },
    iniuserGroupList(){

    },
    addUser(){
        this.addVisible=true
    },
    delte(row){
      let data = {
        userGroupNo:null,
        userNos:[row.userNo]
      }
      let params = { busicode: "BookUserAdd", data: data };

      this.$api
        .fetch({ params })
        .then(res => {
          this.$notify({
            title: '成功',
            message: '已从删除用户',
            type: 'success'
          });
          this.init()
        })
    },
      //分页
    // handleSizeChange(val) { //显示多少数据一页
    //   this.userQuery.pageCount = val
    //   this.userQuery.page = 1
    //   this.init()
    // },
    // handleCurrentChange(val) {  //显示多少页码
    //   this.userQuery.page = val
    //   this.init()
    // },
    indexMethod(index) {//获取表格序号
      return  index+1;

    },
    closeDialog1(){
        this.addVisible=false
    },
    closeDialog() { //关闭会话
      this.init()
    },
    toDetail(userNo){
      // window.open('#/UserInfoSearchDetail','')
      //  this.$router.push('/UserInfoSearchDetail')
      let routeUrl = this.$router.resolve({ path: '/UserInfoSearchDetail'});
      sessionStorage.setItem('userNo',userNo)
      window.open(routeUrl.href, '_blank');
      sessionStorage.removeItem('userNo')
    },
  },
  watch: {
    maxHeight() {
      this.tableShow = false
      this.$nextTick(() => {
        this.tableShow = true
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.BookInfoUserEdit {
  width: 100%;
  height: 100%;
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 8px;
  }
  .el-form-item__content{
    line-height: 55px!important;
  }
  .el-form-item__label{
    line-height: 55px!important;
  }
  .el-form-item__error{
    line-height: 0px!important;
    padding-top:0px;
  }
  .kl-table{
    margin-top: 40px;
  }
}
.formBill-Two {
  margin-top: 10px;
}
.bookInfo-editForm {
  .el-form-item {
    margin-bottom: 30px !important;
  }
}
.el-popper[x-placement^=bottom] {
  margin: 0;
}
.bread-contain-left{
  float: left;
 width: 45%;
 height: 40px;
 padding: 1%;
 font-size: 14px;
 span{
   color: gray;
 }
}
</style>
