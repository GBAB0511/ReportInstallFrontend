<template>
    <div class="login" @keyup.enter="submitForm('ruleForm')">
        <el-container>
            <el-header class="head">
                <img src="static/images/logo.png" alt="" class="logo">
            </el-header>
            <el-main>
              <div class="mainBackground"
                    v-bind:style="tu">
                </div>
                <div class="register">
                   <div class="content">
                     <el-form :model="ruleForm" ref="ruleForm" label-width="50px" class="demo-ruleForm">
                        <span style="font-size:16px"><b>账号登录</b></span>
                        <el-form-item label="账号" prop="loginName" class="lbl">
                          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"   @input="e => input = inputMe(e)" v-model="ruleForm.loginName" class="ipt"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password" class="lbl">
                          <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" type="password" v-model="ruleForm.password" auto-complete="off" class="ipt"></el-input>
                        </el-form-item>
                        <el-form-item class="btu">
                          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                          <el-button @click="resetForm('ruleForm')">重置</el-button>
                        </el-form-item>
                      </el-form>
                   </div>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>

    export default {
        name: "login",
         data() {
          return{
              ruleForm:{
                loginName:'',
                password:'',
              },
               rules2: {
                loginName: [
                  { required: true, message: '请输入账号', trigger: 'blur'}
                ],
                password: [
                  { required: true, message: '请输入密码', trigger: 'blur'}
                ],
              },
              description:'',
              
              tu:{
                    background: 'url(static/images/banner3.jpg) 0px -111px no-repeat',
                    // backgroundSize:'101% 100%',
                    // background-repeat:'no-repeat',
                    // background-position:"-25px -374px",
                    // height:'16px',
                    // border:'3px solid red',
              },
              tu1:{
                    background:'url(static/images/banner.jpg) no-repeat 0px 0px',
                    backgroundSize:'101% 100%',
                    // border:'3px solid red',
              },
              tu2:{
                    background:'url(static/images/banner2.jpg) no-repeat 0px 0px',
                    backgroundSize:'100% 100%',
                    // border:'3px solid green',
              },
              errorClass:'',
         };
    },
    mounted(){
      this.loginName = sessionStorage.getItem('loginName')
    },
    methods: {
      inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },

      submitForm(formName) {
        let _this=this;
          
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = _this.ruleForm;
            this.$api.fetch({
              apiUrl: process.env.NODE_ENV == "development" ? 'loginOtherCustomer.api' : '/project/loginOtherCustomer.api',// 开发 ：打包
              params: params,//参数
            }).then(res => {
              sessionStorage.setItem('token',res)
              sessionStorage.setItem('loginName',_this.ruleForm.loginName)
              _this.$router.push('/')
              $("#app #firstNav #nav .navList").children('li').eq(0).addClass("active").siblings().removeClass("active")
            })
            // _this.$router.push('/waterSet')
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
}
</script>

<style lang="scss" scoped>
.login{
  height: 100%;
    .el-container{
      height: 100%;
    }
   .el-header {
    background-color: #2196f300;
    color: #333;
    text-align: center;
    line-height: 60px;
    }
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
    }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    height:100% ;
    padding:0px ;
    }
  body > .el-container {
    height: 100%;
    margin-bottom: 40px;
    }
  .logo{
    float: left;
    }
    .btu>.el-form-item__content{
      margin-left: 15px;
    }
  .mainBackground{
    background-color: #fff;
    background-size: 100% !important;
    width: 100%;
    height: 100%;
    }
  .register{
    position: absolute;
    top: 135px;
    right: 0px;
    width: 30%;
    height: 380px;
    overflow: hidden;
    margin: 50px 40px;
    }
    .text {
    font-size: 14px;
    }
  .content{
    background: rgba(255, 255, 255, 0.93);
    border-radius: 4px;
    width: 300px;
    height: 250px;
    margin-top: 10px;
    margin-left: 10px;
    border: 15px solid #00bcd400;
    }
  .item {
    padding: 18px 0;
    }
  .box-card {
    width: 480px;
    }
  ul{
    background: rgba(255, 255, 255, 0.48);
    height: 100%;
    }
  li{
    height: 10% ;
    margin: 3px;
    }
  .btu{
    .el-form-item__content{
        background-color: red;
    }
  }
  .lbl{
    margin-top: 20px;

  }

  }
</style>
  