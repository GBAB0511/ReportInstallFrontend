<template>
  <div class="unionNoEdit">
    <div class="toolbar">
      <el-form :model="ruleForm" ref="ruleForm" :rules="rules" class="demo-form-inline width-150" :inline="true">
          <el-form-item label="联合编号：" prop="unionNo">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.unionNo" size="mini" clearable></el-input>
          </el-form-item>
          <el-form-item label="联合名称：" prop="unionName">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.unionName" size="mini" clearable></el-input>
          </el-form-item>    
      </el-form>
    </div>
    <div class="bread" style="width:auto;height:auto">
       <div class="bread-contain-left">
          <el-form :inline="true" size="mini" class="">
            <el-form-item class="userNo">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="userQuery.fuzzyQuery" placeholder="请输入用户编号" @keydown.enter.native="iniuserGroupList" size="mini" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="mini" class='searchBtn' @click="iniuserGroupList" icon="el-icon-search"></el-button>
            </el-form-item>
            <el-form-item>
              <div> 共{{ totalUser }}个用户</div>
              </el-form-item>
          </el-form>
        </div>
         <div class="bread-contain-right">
            <el-button size="mini" type="primary" @click="addUser()" style="margin-right:20px">添加用户</el-button>
        </div>
    </div>
    <div class="kl-table" :style="{height: maxHeight + 'px'}">
      <el-table v-if="tableShow" center stripe border :data="userData.list"  :max-height="maxHeight"  class="wuserInfo-table">
        <el-table-column align="center" type="index" label="NO." width="80"></el-table-column>

        <el-table-column prop="bookNo" min-width="120" label="册本号"></el-table-column>

        <el-table-column prop="userNo" min-width="150" label="用户编号" show-overflow-tooltip></el-table-column>

        <!-- <el-table-column prop="userNo" min-width="150" label="用户组编号" show-overflow-tooltip></el-table-column> -->

        <el-table-column prop="ctmName" min-width="230" label="客户名称" show-overflow-tooltip></el-table-column>

        <el-table-column align="left" prop="setupMeterAddr" min-width="360" label="装表地址" show-overflow-tooltip></el-table-column>

        <el-table-column prop="meterReadingStaffName" min-width="150" label="抄表员"  show-overflow-tooltip></el-table-column>

        <el-table-column prop="businessArea" min-width="110" label="营业区域" show-overflow-tooltip></el-table-column>

        <el-table-column prop="useWaterType" min-width="150" label="用水类型" show-overflow-tooltip></el-table-column>

        <el-table-column prop="status" min-width="100" label="用户状态" show-overflow-tooltip></el-table-column>

        <el-table-column label="操作" fixed="right" width="60">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click.native="delte(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="添加" :visible.sync="addVisible" v-if="addVisible" @close="closeDialog" :close-on-click-modal="false" class="button-dialog">
      <QuestionSearchUser :mainBookNo="ruleForm.bookNo" @addBtnChange="addBtnChange" ref="QuestionSearchUser"></QuestionSearchUser>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="addBtn" size="mini" @click="addRow">确 定</el-button>
        <el-button type="info" size="mini" @click="closeDialog">返 回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import QuestionSearchUser from "../userGroup/QuestionSearchUser";
export default {
  name:"unionNoEdit",
  components: {
    QuestionSearchUser
  },
  props: [
    "unionNo",
    "unionName",
    "id"
  ],
  data () {
    return {
      //表单
      ruleForm: {
        unionNo:'',
        unionName: '',
      },
      //校验规则
      rules:{
        unionNo:[{ required:true, message:"联合编号不能为空", trigger: 'change'}],
        unionName:[{ required:true, message:"联合名称不能为空", trigger: 'change'}],
      },
      // 用户数量
      totalUser:0,
      // 添加用户弹窗
      addVisible:false,
      //确认按钮
      addBtn:true,
      // 用户查询
      userQuery:{
        fuzzyQuery:"",
      },
      userData:{
        list:[]
      },
      //选择用户数组
      userNos: [],
      maxHeight: 0,
      tableShow: false,
    }
  },
  mounted () {
    this.getDetail(this.unionNo)
    this.common.changeTable(this, '.unionNoEdit', ['.unionNoEdit .toolbar', 
      '.bread-contain' ,'.unionNoEdit .bread-contain-left' 
    ])
    // this.iniuserGroupList()
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    getDetail(unionNo){
      if (unionNo !='') {
        let params = {
          "busicode": "UnionInfoUserList",
          "data": {unionNo:unionNo},
        }
        this.$api.fetch({
          params: params,//参数
        }).then(res => {
          this.ruleForm.unionNo = this.unionNo
          this.ruleForm.unionName = this.unionName
          this.userData.list = res
          this.userData.list.forEach(item => {
            this.userNos.push(item.userNo)
          })
        })
      }
    },
    iniuserGroupList(){
      let _this = this;
      let params = {
        busicode: "UserInfoList",
        data: {fuzzyQuery:this.userQuery.fuzzyQuery,page:1,pageCount:999}
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          _this.userData = res;
          _this.totalUser = res.total
        })
    },
    //添加用户
    addUser(){
      this.addVisible=true
    },
    closeDialog(){
      this.addVisible = false
    },
    addBtnChange(val){
      this.addBtn = val
    },
    // 保存
    add() {
      let _this = this;
      var data = _this.ruleForm;
  
      let isEdit = false;
      _this.$refs.ruleForm.validate(valid=>{
        if(!valid){
          isEdit=true
        }
      });
      if(isEdit){
        this.$notify({
          title: '验证失败',
          message: '当前表单必填项未完善',
          type: 'error'
          });
          return
      }
      //保存用户
      if (this.unionNo!="") {
        let dataUser = {
          unionNo:this.ruleForm.unionNo,
          unionName:this.ruleForm.unionName,
          userNoList: this.userNos,
          id: this.id
        }
        let paramUser = { busicode: "UnionInfoSave", data: dataUser };
        this.$api
          .fetch({ params:paramUser })
          .then(res => {
            this.userNos = []
            this.$emit('closeEdit')
      })
      }else{
        let dataUser = {
          unionNo:this.ruleForm.unionNo,
          unionName:this.ruleForm.unionName,
          userNoList: this.userNos
        }
        let paramUser = { busicode: "UnionInfoSave", data: dataUser };
        this.$api
          .fetch({ params:paramUser })
          .then(res => {
            this.userNos = []
            this.$emit('closeEdit')
        })
      }
      
    },
    addRow(){
      let list = this.$refs.QuestionSearchUser.selectData;
      console.log(list);
      // this.userNos = []
      if (!this.userData.list) {
        this.userData.list = list
        list.forEach(element => {
          this.userNos.push(element.userNo);
        });
      }else{
        list.forEach(element => {
          if (this.userData.list.every(item => item.userNo !== element.userNo)) {
            this.userNos.push(element.userNo);
            this.userData.list.push(element)
          }
        });
      }
      console.log(this.userData.list);
      console.log(this.userNos);
      this.closeDialog();
      this.addBtn = true
    },
    delte(row){
      // let data = {
      //   userGroupNo:null,
      //   userNos:[row.userNo]
      // }
      // let params = { busicode: "UserGroupNoDel", data: data };

      // this.$api
      //   .fetch({ params })
      //   .then(res => {
      //     this.$notify({
      //       title: '成功',
      //       message: '已从该组删除用户',
      //       type: 'success'
      //     });
      //     this.iniuserGroupList()
      //   })
      for (let i = 0; i < this.userData.list.length; i++) {
        if (this.userData.list[i].userNo == row.userNo) {
          this.userData.list.splice(i,1)
        }
      }
      // for (let i = 0; i < this.userNos.length; i++) {
      //   if (this.userData.list[i].userNo == row.userNo) {
      //     this.userData.list.splice(i,1)
      //   }
      // }
      this.userNos.forEach((item,index) => {
        if (item == row.userNo) {
          this.userNos.splice(index,1)
        }
      })
      console.log(this.userNos);
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
.unionNoEdit{
  height: 100%;
  overflow-y: auto;
  .bread-contain-left{
    float: left;
    width: 47%;
    height: 10%;
    //  margin: 1%;
    font-size: 14px;
    line-height: 32px;
      /deep/ {
        .userNo{
          margin-left: 110px;
          width: 50%;
          .el-form-item__content {
            width: 100% !important;
            .el-input__inner{
              width: 100% !important;
            }
          }
        }
      }
    }
    /deep/{
      .width-150 .el-form-item{
        width: 47%;
        .el-form-item__content{
          width: calc(100% - 100px);
          .el-input__inner{
            width: 100% !important;
          }
        }
      }
    }
}
</style>