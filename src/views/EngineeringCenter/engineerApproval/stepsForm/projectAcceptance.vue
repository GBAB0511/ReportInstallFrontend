<template>
  <div class="projectAcceptance">
    <legend class="legendColumn">工程验收</legend>
    <div class="table-panel">
      <el-table ref="table" :data="list" :span-method="spanMethod" border>
        <el-table-column prop="departBelong" label="部门" min-width="150"></el-table-column>
        <el-table-column prop="checkItem" label="验收项目" min-width="100"></el-table-column>
        <el-table-column prop="checkSubitem" label="验收子项" min-width="300"></el-table-column>
        <el-table-column prop="checkDate" label="验收时间" min-width="300">
          <template slot-scope="scope">
            <el-date-picker :disabled="disabled" value-format="yyyy-MM-dd" size="mini" v-model="scope.row.checkDate" :clearable="false"></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column prop="checkStaff" label="验收人员" min-width="80">
          <template slot-scope='scope'>
            <span v-if="scope.row.checkStaffName!=undefined&&scope.row.checkStaffName!=''">{{scope.row.checkStaffName}}</span>
            <span v-else>{{userName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="passFlag" label="验收结论" min-width="110">
          <template slot-scope="scope">
            <el-select v-model="scope.row.passFlag" @change="changeData(scope.row,scope.$index)" :disabled="disabled">
              <el-option v-for="item in dictionaryData.PROJECT_CHECK_CONCLUSION" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </template>

        </el-table-column>
        <el-table-column prop="comments" label="描述" min-width="300">
          <template slot-scope="scope">
            <el-input type="textarea" :disabled="disabled" class="comments" v-model="scope.row.comments"></el-input>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="isPjSetmtShow">
        <el-form >
          <el-form-item label="验收历史版本选择">
          <el-select v-model="selectNum">
            <el-option v-for="item in num" :key="item" :label="'第'+(item+1)+'次'" :value="item"></el-option>
          </el-select>
          </el-form-item>
          <el-form-item >
            <el-table ref="table" :data="arrData[selectNum]" :span-method="spanMethod" border>
        <el-table-column prop="departBelong" label="部门" min-width="150"></el-table-column>
        <el-table-column prop="checkItem" label="验收项目" min-width="100"></el-table-column>
        <el-table-column prop="checkSubitem" label="验收子项" min-width="300"></el-table-column>
        <el-table-column prop="checkDate" label="验收时间" min-width="300">
          <template slot-scope="scope">
            <el-date-picker :disabled="disabled" value-format="yyyy-MM-dd" size="mini" v-model="scope.row.checkDate" :clearable="false"></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column prop="checkStaff" label="验收人员" min-width="80">
          <template slot-scope='scope'>
            <span v-if="scope.row.checkStaffName!=undefined&&scope.row.checkStaffName!=''">{{scope.row.checkStaffName}}</span>
            <span v-else>{{userName}}</span>
          </template>
        </el-table-column>
          <el-table-column prop="passFlag" label="验收结论" min-width="110">
            <template slot-scope="scope">
              <el-select v-model="scope.row.passFlag" @change="changeData(scope.row,scope.$index)" :disabled="true">
                <el-option v-for="item in dictionaryData.PROJECT_CHECK_CONCLUSION" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </template>

          </el-table-column>
          <el-table-column prop="comments" label="描述" min-width="300">
            <template slot-scope="scope">
              <el-input :disabled="true" type="textarea" class="comments" v-model="scope.row.comments"></el-input>
            </template>
        </el-table-column>
      </el-table>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button
            type="info"
            size="mini"
            plain
            @click="isPjSetmtShow = false"
            >关闭</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  props: ['editData', 'disabled','currentStep','PjdepartBelong'],
  data () {
    return {
      selectNum:0,
      arrData:[],
      num:[],
      isPjSetmtShow:false,
      userName:'',
      checkPassFlag:1,
      checkPerson:'',
      checkPersonName:'',
      checkPFList:[],
      form: {
        billNo:'',
      },
      dictionaryData: [],
      list: [],
      ckeckList: []
    }
  },
  created () {
    this.getDictionary();
    if (this.editData) {
      // console.log(JSON.stringify(this.editData));
      this.form.billNo = this.editData.billNo
      // this.checkPerson=this.editData.checkInviteStaff
      // this.checkPersonName=this.editData.checkInviteStaffName
      // console.log("checkPerson",this.checkPerson);
      this.getList(this.form.billNo)
    }
  },
  mounted(){
    console.log(this.currentStep);
    this.userName=this.$store.state.userName
    eventBus.$on('acceptanceReport',item=>{
      this.printAll()
    })
    eventBus.$on('acceptanceHistory',item=>{
      this.isPjSetmtShow=true
      var params = {
        busicode: "PjCheckInfoHistory",
        data: {
          billNo:this.form.billNo
        }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.arrData=[]
          for(let mes in res){
            this.arrData.push(res[mes])
          }
          let no=this.arrData.length
          this.$set(this.num,)
          this.num=[]
          for(let i=0;i<no;i++){
            this.num.push(i)
          }
          console.log(this.num.length);
        });
    })
  },
  destroyed(){
    eventBus.$off('sendCheckStaffName')
    eventBus.$off('acceptanceReport')
    eventBus.$off('acceptanceHistory')
  },
  methods: {
    printAll (arr) {
      let params = {
        busicode: "PjCheckInfoPrint",
        data: { billNo:this.form.billNo,departBelong:this.PjdepartBelong}
      };
      this.$api.fetch({ params: params }).then(res => {
        let data = res
        for (let i = 0; i < data.length; i++) {
          this.common.printOne('view', 'PjCheckInfoPrint', '', data[i], this);
        }
        // this.$notify({
        //   title: '成功',
        //   message: '正在打印...',
        //   type: 'success'
        // })
      })

    },
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    // 数据字典数据获取
    getDictionary () {
      var _this = this;
      var params = {
        busicode: "DictionarySelect",
        data: "PROJECT_CHECK_CONCLUSION"
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.dictionaryData = res;
          //console.log('dictionary', _this.dictionaryData)
        });
    },
    changeData(data,index){
      //console.log(data);
      //console.log(this.list);
      //console.log(index);
      let m=1;
      for(let i=0;i<this.list.length;i++){

        if(i==index){
          this.list[i].passFlag=data.passFlag
        }
        if(this.list[i].passFlag==0){
          m=0
        }
      }
      this.$emit("checkPassFlag",m)
    },
    getList (id) {
      console.log('billno',this.form.billNo);
      const params = {
        busicode: 'PjCheckInfoList',
        data: {
          billNo: this.form.billNo,
          departBelong:this.PjdepartBelong
        }
      }
      this.$api.fetch({ params })
        .then(res => {
          this.list = res
          //console.log("验收list:", this.list);
          this.checkPassFlag=1
          for (let i = this.list.length - 1; i > 0; i--) {
            // 设置初始值
            if (!this.list[i].rowspan) {
              this.list[i].rowspan = 0;
            }
            if (!this.list[i].checkItemSpan) {
              this.list[i].checkItemSpan = 0;
            }

            if (this.list[i].departBelong == this.list[i - 1].departBelong) {
              // 设置rowspan
              if (this.list[i].rowspan == 0) {
                this.list[i].rowspan = 1;
              }
              this.list[i - 1].rowspan = (this.list[i].rowspan || 0) + 1;
              this.list[i].rowspan = 0;

              if (this.list[i].checkItem == this.list[i - 1].checkItem) {
                // 设置rowspan
                if (this.list[i].checkItemSpan == 0) {
                  this.list[i].checkItemSpan = 1;
                }
                this.list[i - 1].checkItemSpan = (this.list[i].checkItemSpan || 0) + 1;
                this.list[i].checkItemSpan = 0;
              } else {
                if (this.list[i].checkItemSpan == 0) {
                  this.list[i].checkItemSpan = 1;
                }
              }
            } else {
              if (this.list[i].rowspan == 0) {
                this.list[i].rowspan = 1;
              }
            }
          }
          for(let i=0;i<this.list.length;i++){
             //检查验收结果
            //console.log(this.list[i].passFlag);
            if(this.list[i].passFlag==0){
              this.checkPassFlag=0
              break
            }
          }
          this.list.forEach((item,i)=>{
            if(item.checkDate == ""){
              const date = new Date();
              this.list[i].checkDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate() > 9 ? date.getDate() : '0' + date.getDate());
            }
          })
          this.$emit("checkPassFlag",this.checkPassFlag)
          this.templateFlag = this.list && this.list.length > 0 && this.list[0].templateFlag || '0'

        })
    },
    getParams () {
      return this.list.map(item => {
        return { id: item.id, passFlag: item.passFlag, comments: item.comments, checkItem: item.checkItem, checkSubitem: item.checkSubitem, checkDate: item.checkDate, departBelong: item.departBelong, templateId: item.templateId }
      });
    },
    spanMethod ({ row, column, rowIndex, columnIndex }) {
      if (column.label === "部门") {
        return {
          rowspan: row.rowspan !== 0 ? row.rowspan || 1 : 0,
          colspan: 1,
        };
      }
      if (columnIndex != 0 && column.label === "验收项目") {
        return {
          rowspan: row.checkItemSpan !== 0 ? row.checkItemSpan || 1 : 0,
          colspan: 1,
        };
      }
    },

    validate () {
      //console.log('accept validate', this.templateFlag)
      let data = this.getParams();
      let state = true
      if (this.templateFlag == '1') {
        for(let i = 0; i < data.length; i++){ // 未通过、保留需添加描述
            if(data[i].passFlag === '0' || data[i].passFlag === '2'){
                if(data[i].comments === ''){
                    state = false;
                    break;
                }
            }
        }
        return state
      } else {

        return true
      }
    }
  },
}
</script>

<style lang="scss" scoped>

.projectAcceptance {
  /deep/ .el-dialog {
    width: 75% !important;
}
  .col-2 {
    width: calc(46% + 10px);
  }
  .table-panel {
    width: calc(100% - 30px);
    margin: 10px auto;
  }
  .comments {
    margin: 5px 0;
  }
}
</style>
