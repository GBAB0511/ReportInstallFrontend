<template>
  <!-- 多户查询 -->
  <div class="multipleUser">
    <div class="mul-left">
      <el-input
        type="textarea"
        placeholder="请输入"
        v-model="userOptions"
        @keyup.enter.native="init"
        :autosize="{ minRows: 26, maxRows: 26}"
        @input="e => input = inputMe(e)"
      ></el-input>
    </div>

    <div class="mul-right">
      <el-table stripe border :data="tableData" class="change-tables-table">
        <el-table-column type="index" label="NO." width="50" :index="indexMethod" fixed="left"></el-table-column>

        <el-table-column prop="ctmNo" min-width="120" label="客户编号"></el-table-column>

        <el-table-column prop="accountNo" min-width="120" label="账户编号"></el-table-column>

        <el-table-column prop="ctmName" min-width="120" label="客户名称"></el-table-column>

        <el-table-column prop="payWay" min-width="80" label="缴费方式"></el-table-column>

        <el-table-column prop="userNo" min-width="120" label="用户编号"></el-table-column>

        <el-table-column prop="setupMeterAddr" min-width="150" label="装表地址" show-overflow-tooltip></el-table-column>

        <el-table-column prop="useWaterType" min-width="100" label="用水类型" show-overflow-tooltip></el-table-column>

        <el-table-column prop="isArrearage" min-width="80" label="是否欠费" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: "multipleUser",
  props: ["multipleUserId"],
  components: {},
  data() {
    return {
      userOptions: null,
      userInputOptions: "",
      tableData: []
    };
  },
  mounted() {},
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    init() {
  //  let arr = this.userOptions.replace(/\n/g, ",").split(",").filter(word => word != "");
    let newArr = []; //一个新的临时数组 

  //  this.userOptions = newArr.join(',');
  let newstr = this.userOptions;
  let  strarr = this.userOptions.split(/\n+|,\n*/gm);//分割去除换行后的户号列表数组
  let  after="",before="";
    for(let i = 0; i < strarr.length; i++){ 
    //如果当前数组的第i已经保存进了临时数组，那么跳过， 
    //否则把当前项push到临时数组里面 
    if ((newArr.indexOf(strarr[i]) == -1)&&strarr[i]!==""){//去重
        newArr.push(strarr[i]);
    } 
    }  
    for(let j in newArr ){
      let idx = newstr.indexOf(newArr[j]);//当前要检查的户号
         before =  newstr.substr(0,idx+newArr[j].length) //先保留首个当前户号及之前的字符串
        after =  newstr.slice(before.length).replace(new RegExp(newArr[j]+",|"+newArr[j]+"\n",'gm'),'');//删除掉当前户号之后的所有当前户号
        console.log(newstr.slice(before.length),'********currt',newArr[j])
      
        newstr = before + after; //两端字符串连接
        console.log("before",before,'----after',after)
    }
    this.userOptions = newstr;
    console.log(newstr)
      let params = {
        busicode: "ChargeManyUserQuery",
        data: newArr
      };
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          if (res && res.length>0) {
            this.tableData = res;
          }else{
            this.tableData = []
          }
        })
        .catch((err)=>{
          this.tableData = []
        });
    },
     indexMethod(index) {
      //获取表格序号
      return index + 1;
    }
  },
  watch: {
  }
};
</script>
<style lang="scss">
.multipleUser {
  height: 100%;
  width: 100%;
  margin: 0 auto;
  padding: 10px 0px;
  .mul-left {
    width: 20%;
    height: 100%;
    float: left;
    padding-right: 10px;
  }
  .mul-right {
    border: 1px solid #aebbc342;
    width: 80%;
    height: 100%;
    float: left;
  }
}
</style>
