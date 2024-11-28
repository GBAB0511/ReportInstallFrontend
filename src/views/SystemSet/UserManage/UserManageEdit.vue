
<template>
    <div class="UserManageEdit common-bdiv">

        <div class="backfillSubmitForm">
        <!-- class="formBill-Two" -->
        <el-form  :inline="true"  size="mini" :model="rowData"  label-width="150px">
            <el-form-item label="用户名称：" prop="userName" style="width:30%">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="rowData.userName" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="岗位：" prop="postNo" style="width:30%">
                <el-select v-model="postNoCheck" multiple placeholder="请选择岗位">
                  <span slot="prefix">{{postNoCheckName}}</span>
                  <el-option v-for="item in postData.list" :key="item.postNo" :label="item.postName" :value="item.postNo"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态：" prop="status"  style="width:30%">
                <el-select v-model="status"  placeholder="请选择状态" >
                    <el-option label="启用" value="0" key="0"></el-option>
                    <el-option label="停用" value="1" key="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="营业区域："  style="width:30%">
            <el-cascader ref="cascader" clearable v-model="rowData.businessArea" :options="businessAreaData" :show-all-levels="false" :props="props"> 
            </el-cascader>
          </el-form-item>
            <legend class="common-legend">所属角色</legend>
            <div class="fixCheckbox">
                <el-checkbox-group v-model="roleCodeCheck">
                    <el-checkbox  name="roleCode" v-if="item.roleName !== '超级管理员'" v-for="item in roleData" :key="item.roleCode" :label="item.roleCode">{{item.roleName}}</el-checkbox>
                </el-checkbox-group>
            </div>
        </el-form>
        </div>
    </div>
</template>
<script>
export default {
    name:"UserManageEdit",
    props: ["rowData"],
    components:{
    },
    data(){
        return{
            roleCodeCheck: this.rowData.roleCode,
            postNoCheck:this.rowData.postNo,
            status:this.rowData.status,
            businessArea:this.rowData.businessArea,
            postData:{},
            roleData:[],
            businessAreaData: [], //营业区域下拉框
            props: {
        emitPath:false,
      },
        }
    },
    computed: {
      postNoCheckName() {
        return this.postData.list && this.postData.list.filter(item => this.postNoCheck.includes(item.postNo)).map(item => item.postName).join(', ')
      }
    },
    mounted(){
        this.init();
        this.selectBAreaOptions();
        this.roleInit();
    },
    methods:{
        init(){
            var params = {
                busicode: "PostList",
                data:{page:1, pageCount:9999, status:1},
            }
              this.$api.fetch({
               params: params,//参数
              }).then(res=> {
                this.postData=res
              })
            },
            roleInit(){
                var params = {
                busicode: "PubRoleList",
                data:{},
              }
              this.$api.fetch({
               params: params,//参数
              }).then(res => {
                this.roleData=res;
            })
        },
        submitUpload() {
            this.$refs.upload.submit();
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        //营业区域
        selectBAreaOptions(id) {
            let _this = this
            let params = {
                "busicode": "BusinessAreaTree",
                "data": {

                },
            }
            this.$api.fetch({
                params,//参数
            }).then(res => {
                let data = this.getArr1(res)
                _this.businessAreaData = data.children;
            })
        },
        //树结构数据处理
        getArr1(data) {
            function abc(arr) {
                arr.map(i => {
                    i.label = i.name
                    i.value = i.code
                    if (i.isParent === false) {
                        delete i.children;
                    } else {
                        abc(i.children);
                    }
                });
            }
            abc(data.children);
            return data;
        },
    }
}
</script>
<style lang="scss">
.UserManageEdit{
    .backfillSubmitForm{
        .el-form-item{
            width: 60%;
            margin-top:20px;
            .el-form-item__content{
                width:calc(100% - 150px)
            }
            input{
                width:100%;
            }
            .el-cascader{
                width:100%
            }
        }

        .fixCheckbox{
            margin:0px 20px;
            .el-checkbox{
                width:100px;
            }
        }
    }
}
</style>

