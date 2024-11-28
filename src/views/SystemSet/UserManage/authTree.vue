<template>
  <div class="auth-tree">
    <div class="top">
      <h2>组织结构树</h2>
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText"
      >
      </el-input>
      <el-tree class="filter-tree department"
       :data="data"
       :props="defaultProps"
       @node-click="handleNodeClick"
       ref="tree2">
      </el-tree>
    </div>

    <div class="bottom">
      <h2>{{department}}</h2>
      <!-- <el-tree
        :data="data2"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps2">
      </el-tree> -->
     <!-- <el-radio v-model="userId" v-for="item in userData" :key="item.id" :label="item.id">{{item.name}}</el-radio>-->
     <el-checkbox :disabled="checkAllShow" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
     <el-checkbox-group v-model="userList">

        <el-checkbox
          v-for="item in userData"
          :label="item.loginid"
          :key="item.code"
        >{{item.name}}</el-checkbox>
    </el-checkbox-group>
    </div>
    <div class="buttons">
        <el-button size="small" type="warning" @click="getSyncUser">同步</el-button>
        <el-button size="small" type="primary" @click="getCheckedNodes">添加</el-button>
        <!-- <el-button size="small" type="info" plain @click="resetChecked">退出</el-button> -->

        <el-button size="small" type="info" plain @click="off">退出</el-button>
    </div>

  </div>

</template>

<script>
	  import axios from 'axios'
    export default {
      name: "auth-tree",
      data(){
        return {
          checkAllShow:true,
          filterText:'',
          data:[],
          defaultProps: {
            children: 'children',
            label: 'name'
          },
          data2: [],
          defaultProps2: {
            children: 'children',
            label: 'name'
          },
          department:'组织人员',
          isIndeterminate:true,
          checkAll: false,


          // 人员数组
          userData: [],
          // 选中人员的id
          userId: '',
          userList: [],
        }
      },
      mounted() {
        this.randerTree()
      },
      methods: {
        // 处理树标题的展示
        filterNode(value, data) {
          if (!value) return true;
          return data.name.indexOf(value) !== -1;
        },
        handleCheckAllChange(val) {
          var _this = this;
          _this.isIndeterminate = false;

          if (val) {
            this.userData.forEach(function(item, index) {
              if (index >= 0) {
                _this.userList.push(item.code);
              }
            });
          }else{
            this.userList = [];
          }
      },
      getSyncUser(){
      axios({
        method: 'post',
        url: process.env.NODE_ENV == "development" ? '/sys/synchronization.htm' : '/project/sys/synchronization.htm',
        data:{},
        headers : {
          "returntype" : "ajax/json"
        },
       }).then((res) =>{
        if(res=='执行失败'){
          this.$message({
            type: 'error',
            message: '同步失败'
          })
        }else{
          this.$message({
            type: 'success',
            message: '同步成功'
          })
        }
        this.randerTree()
          }).catch(() => {
        })
      },
        // tree函数点击事件
        handleNodeClick(data) {

          // eventBus.$emit('treeClickData', data.id,data.name)
          // this.$parent.treeClickData.id = data.id
          // this.$parent.treeClickData.name = data.name
          this.department = data.name;
          let _this = this;
          console.log(data)
          this.getStaff({code: data.code,name:this.filterText}).then(res=>{
            //_this.data2 = JSON.parse(res.data.staffOfDepartment)
          })
        },
        // 数组去重
        distinct (arr){
          var i, obj = {}, result = [], len = arr.length;
          for(i = 0; i< arr.length; i++){
            if(!obj[arr[i]]){ //如果能查找到，证明数组元素重复了
              obj[arr[i]] = 1;
              result.push(arr[i]);
            }
          }
          return result;
        },
        //处理总数据
        dealData(data) {
	        let parentData = [];
	        let parentCode = [];
	        for(let i of data){
	          parentCode.push(i.parentcode)
          }
          parentCode = this.distinct(parentCode);

	        for(let j of parentCode){
	          for(let k in data){
	            if(data[k].code===j){
	              if(typeof data[k].children === 'undefined'){
	                data[k].children= []
	              }
	              parentData.push(data.splice(k,1)[0])
	            }
	          }
          }
	        for(let n in parentData){
	          for(var m=0;m<data.length; m++){
	            if(parentData[n].code===data[m].parentcode){
	              parentData[n].children.push(data.splice(m,1)[0]);
	              m--
	            }
	          }
	        }
	        return parentData
	      },
        // 生成组织结构数
        randerTree() {
          var token = sessionStorage.getItem('token');
          console.log(window.location.href,process.env)
        	axios({
					    method: 'post',
					    url: process.env.NODE_ENV == "development" ? 'dep/json.htm?id=-1' : '/project/dep/json.htm?id=-1',// 开发 ：打包
					    headers : {
	              "returntype" : "ajax/json"
	            },
					}).then((res)=>{
            this.data = res.data[0].children;
				})
        },
        // 获取职员列表
        getStaff({code, name}) {
          let _this = this
          var token = sessionStorage.getItem('token');
          var url = "staff.htm?departmentCode=" + code + "&name=" + name;
          return new Promise(resolve => {
          	axios({
					    method: 'post',
					    url:process.env.NODE_ENV === 'development' ? '/dep/' + url : '/project/dep/' + url,
              headers : {
                "returntype" : "ajax/json"
              }
						}).then(res =>{
              resolve(res.data);
              _this.userData = res.data
              _this.checkAllShow= _this.userData.length > 0 ? false : true;
            });
          })
        },
        getCheckedNodes() {
          var token = sessionStorage.getItem('token');
          var orgId = localStorage.getItem('orgId')
          let _this = this
          if(this.userList.length === 0){
            this.$message({
              message: '请先选择至少一名职员',
              type: 'warning'
            });
            return false;
          }
          var params = {
            busicode: "PubOrgUserAdd",
            data:{
              account: this.userList,
              companyNo: localStorage.getItem('companyNo')
            }
          }
          this.$api.fetch({
           params: params,//参数
          }).then(res => {
            this.$notify({
              title: '成功',
              message: '添加成功，已过滤调重复账号',
              type: 'success'
            });
            this.off();
            this.$emit("add-success")
          })
        },
       getCheckedKeys() {
          console.log(this.$refs.tree.getCheckedKeys());
        },
        setCheckedNodes() {
          this.$refs.tree.setCheckedNodes([{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 9,
            label: '三级 1-1-1'
          }]);
        },
        setCheckedKeys() {
          this.$refs.tree.setCheckedKeys([3]);
        },
        resetChecked() {
          this.$refs.tree.setCheckedKeys([]);
          if(this.$parent.activeBlur){
            this.$parent.activeBlur()
          }
          if(this.$parent.showTreeClick){
            this.$parent.showTreeClick()
          }
          this.data2 = [];
          this.department = '组织人员';
          this.randerTree();
        },
        // 关闭树
        off(){
          this.userId = '';
          this.userList = [];
          this.userData = [];
          this.data2 = [];
          this.department = '组织人员';
          this.randerTree();
          this.$parent.authTreeShow = false
        },
      },
      watch: {
        filterText(val) {
          this.getStaff({code:'',name: val})
        }
      }
    }
</script>

<style lang="scss" scoped>
  .auth-tree{
    background: #fff;
    h2{
      padding: 0;
      margin: 0;
      background: #3193f5;
      color: #fff;
      font-size: 16px;
      height: 40px;
      line-height: 40px;
      padding-left: 20px;
    }

    height: 100%;
    .top{
      height: calc(50% - 25px);
      .el-tree{
        height: calc(100% - 80px);
        overflow-y: scroll;
      }
    }
    .bottom{
      height: calc(50% - 25px);

        overflow-y: scroll;

    }
    .buttons{
      padding: 5px;
      text-align: center;
    }
    .el-radio {
      display: block;
      margin-top: 10px;
      margin-left: 5px;
    }
    .el-checkbox{
      display: block;
      margin-top: 10px;
      margin-left: 5px;
    }
  }
</style>
