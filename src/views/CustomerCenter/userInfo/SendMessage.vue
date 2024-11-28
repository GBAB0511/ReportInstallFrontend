<template>
  <div class="message-sending">
    <div class="indexContent">
        <div style="color: red">当前预期发送户数共：{{userCount}}户
            </div>
      <el-form :inline="true" size="mini" :model="formData" class="formBill-One" :rules="rules" ref="registerForm">
        <el-form-item label="发送内容：" prop="content">
          <el-input
            type="textarea"
            placeholder="请输入发送内容"
            v-model="formData.content"
            maxlength="500"
            @input="e => input = inputMe(e)"
            rows="3"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "messageSending",
  props: ['userCount',],
  components: {

  },
  data() {
    return {
      rules:{
        content:[{ required: true, message: "发送内容不能为空", trigger: "blur" }],
      },
      crumbsData: {
        //面包屑
        titleList: [{ title: "客户通知" }, { title: "短信发送" }]
      },
      formData:{},

    };
  },
  mounted() {
    
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
  },
  watch: {}
};
</script>
<style lang="scss">
.message-sending {
  width: 100%;
  height: 100%;
  .user-no {
    .el-input {
      width: 85%;
    }
  }
  .indexContent{    
    height: calc(100% - 41px);
    width: 60%;
    margin: 0 auto;
    overflow-y:hidden;
    overflow-x:hidden;
    
  }
  .el-table__body tr.current-row > td {
    background: #86e9e4 !important;
  }
  .formBill-One{
    .el-form-item{
      .el-form-item__label{
        line-height: 42px!important;
      }
    }
  }
}
</style>