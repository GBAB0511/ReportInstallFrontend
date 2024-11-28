<template>
  <div class="dictionary">
      <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      </div>

    	<!-- 弹出表单 组修改、添加 -->
      <el-dialog width="40%" :title="titleEquipparam" :close-on-click-modal='false'  :visible.sync="dialogFormVisible" :before-close="handleClose">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" label-position="left">
					
          <el-form-item label="组编号:" prop="code">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleForm.code" ></el-input>
          </el-form-item>

          <el-form-item label="组名称:" prop="name">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" type="text" v-model="ruleForm.name"></el-input>
          </el-form-item>
        </el-form>
				<br />
        <div slot="footer" class="dialog-footer" ref="ruleForm">
          <el-button type="info" size="mini" plain @click="submit('ruleForm');">确 定</el-button>
          <el-button type="" size="mini" plain @click="handleClose">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 弹出表单 组明细修改、添加 -->
      <el-dialog width="40%" :title="titleGroup" :close-on-click-modal='false' center :visible.sync="dialogGroup" :before-close="handleCloseGroup">
        <el-form :model="ruleFormGroup" :rules="rulesGroup" ref="ruleFormGroup" label-width="100px" class="demo-ruleForm" label-position="left">
          <el-form-item label="参数名:" prop="name">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="ruleFormGroup.name" ></el-input>
          </el-form-item>

          <el-form-item label="参数值:" prop="value">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" type="text" v-model="ruleFormGroup.value"></el-input>
          </el-form-item>
          <br />
        </el-form>

        <div slot="footer" class="dialog-footer" ref="ruleFormGroup">
          <el-button type="info" size="mini" plain @click="submitGroup('ruleFormGroup');">确 定</el-button>
          <el-button type="" size="mini" plain @click="handleCloseGroup">取 消</el-button>
        </div>
      </el-dialog>
    	<div class="kl-table">
    		<el-row :gutter="24">
          <!--组按钮、列表-->
				  <el-col :span="12">
				  	<!-- 工具栏 -->
	          <div class="toolbar">
	            <el-form :inline="true" class="demo-form-inline" size="mini">
								
								<div class="form-right">
									<el-form-item class="button-group">
											<el-button :disabled="redelBtn"  size="mini" class="remove el-icon-edit" type="primary"  @click.native="handleEdit">编辑</el-button>
											<el-button :disabled="redelBtn"  size="mini" class="remove el-icon-delete" type="primary" @click.native="del">删除</el-button>
											<el-button  size="mini" class="remove el-icon-plus" type="primary" @click="add">添加</el-button>
									</el-form-item>
								</div>
	              <!-- <el-form-item class="button-group">
	              	<el-button :disabled="redelBtn" size="mini" type="primary"  @click.native="handleEdit">修改</el-button>
	                <el-button :disabled="redelBtn" size="mini" type="danger" @click.native="del">删除</el-button>
	                <el-button class="remove" type="success" @click="add" size="mini">添加</el-button>
	              </el-form-item> -->
	            </el-form>
	          </div>
	          <!-- 表格 -->
	          <el-table
	            v-if="tableShow"
							stripe center border
	            :data="equipparamData"
	            @row-click="demand"
              highlight-current-row
              @current-change="handleCurrentChange">
							
							<!-- :row-class-name ="GroupClassName"  
							:row-style="GroupHighlight" -->
	          	<el-table-column
	              type="index"
	              label="NO."
	              width="80"
	              :index="indexMethod">
	            </el-table-column>

	            <el-table-column prop="code" label="组编号"></el-table-column>

	            <el-table-column prop="name" label="组名称"></el-table-column>

	          </el-table>
				  </el-col>

          <!--参数按钮、列表-->
				  <el-col :span="12">
				  	<!-- 工具栏 -->
	          <div class="toolbar">
	            <el-form :inline="true" :model="tableQuery" class="demo-form-inline" size="mini">
								<div class="form-right">
									<el-form-item class="button-group">
										<el-button :disabled="redelParamBtn"  size="mini" class="remove el-icon-edit" type="primary" @click.native="handleEditGroup">编辑</el-button>
										<el-button :disabled="redelParamBtn"  size="mini" class="remove el-icon-delete" type="primary" @click.native="delGroup">删除</el-button>
										<el-button :disabled="redelBtn" id="b2t2n2" class="remove el-icon-plus" type="primary" @click="addGroup" size="mini">添加</el-button>
									</el-form-item>
								</div>
	            </el-form>
	          </div>
	          <!-- 表格 -->
	          <el-table
	            v-if="tableShow"
							stripe center border
	            :data="groupData"
	            @row-click="demandgroup"
              highlight-current-row
              @current-change="handleCurrentChangeGroup">
	          	<el-table-column
	              type="index"
	              label="NO."
	              width="80"
	              :index="indexMethod"
	              >
	            </el-table-column>

	            <el-table-column prop="name" label="参数名"></el-table-column>

	            <el-table-column prop="value" label="参数值"> </el-table-column>

	          </el-table>
				  </el-col>
				</el-row>
    	</div>
    <!-- </div> -->
  </div>
</template>

<script>
  export default {
    name: "dictionary",
    data(){
    	return {
        crumbsData: {  //面包屑
          titleList: [
            { title: '基础配置', path: '/BusinessArea' },
            { title: '数据字典', method: () => { window.histroy.back() } }
          ],
        },
    		tableShow: true,
    		// maxHeight: 0,
    		dialogFormVisible : false, //表单是否显示
    		dialogGroup: false,
    		titleEquipparam: '数据字典组-添加',
				titleGroup: '分组参数-添加',
				titleGroupName:'',
				titleGroupChName:'',
    		ruleForm: { //表单数据
    			code: '',
          name:'',
        },
        rules: {  //表单验证规则
        	code: [
            { message: '请输入组编号', trigger: 'blur', required: true}//required: true,是否必填
					],
					name: [
            { message: '请输入组名称', trigger: 'blur', required: true }//required: true,是否必填
					]
				},
				ruleFormGroup: { //表单数据
    			name: '',
					value:'',
					dictId:''
        },
        rulesGroup: {  //表单验证规则
        	name: [
            { message: '请输入组名', trigger: 'blur' , required: true}//required: true,是否必填
					],
					value: [
            { message: '请输入值', trigger: 'blur' , required: true}//required: true,是否必填
					]
				},
				tableQuery: { //查询表单数据
          page: 1,
          pageCount: 20,
        },
      	historyData: {},
      	equipparamData:[
          {
            "id": "5cda829a2ce8ae6116972044",
            "code": "caliber",
            "name": "水表口径",
        },
          {
            "id": "5cda829a2ce8ae6116972044",
            "code": "sensorModel",
            "name": "传感方式",
        },
          {
            "id": "5cda829a2ce8ae6116972044",
            "code": "CRM",
            "name": "拆表方式",
        },
          {
            "id": "5cda829a2ce8ae6116972044",
            "code": "CPC",
            "name": "缴费渠道",
        },
        ],//父/组列表数据
    		groupData: [
        {
            "id": "5ced295d6828e230d5b484ca",
            "dictId": "5cda829a2ce8ae6116972044",
            "name": "DN8",
            "value": "8",
            "sort": 151,
            "remark": null,
            "createBy": "admin",
            "createTime": "2019-05-28 20:28:13",
            "modifyBy": null,
            "modifyTime": null
        },
        {
            "id": "5ced29646828e230d5b484cb",
            "dictId": "5cda829a2ce8ae6116972044",
            "name": "DN15",
            "value": "15",
            "sort": 152,
            "remark": null,
            "createBy": "admin",
            "createTime": "2019-05-28 20:28:20",
            "modifyBy": null,
            "modifyTime": null
        },
        {
            "id": "5ced29766828e230d5b484cc",
            "dictId": "5cda829a2ce8ae6116972044",
            "name": "DN20",
            "value": "20",
            "sort": 153,
            "remark": null,
            "createBy": "admin",
            "createTime": "2019-05-28 20:28:38",
            "modifyBy": null,
            "modifyTime": null
        },
        {
            "id": "5ced29966828e230d5b484cd",
            "dictId": "5cda829a2ce8ae6116972044",
            "name": "DN25",
            "value": "25",
            "sort": 154,
            "remark": null,
            "createBy": "admin",
            "createTime": "2019-05-28 20:29:10",
            "modifyBy": null,
            "modifyTime": null
        },
        {
            "id": "5ced29a86828e230d5b484ce",
            "dictId": "5cda829a2ce8ae6116972044",
            "name": "DN32",
            "value": "32",
            "sort": 155,
            "remark": null,
            "createBy": "admin",
            "createTime": "2019-05-28 20:29:28",
            "modifyBy": null,
            "modifyTime": null
        },
        {
            "id": "5ced29b96828e230d5b484cf",
            "dictId": "5cda829a2ce8ae6116972044",
            "name": "DN40",
            "value": "40",
            "sort": 156,
            "remark": null,
            "createBy": "admin",
            "createTime": "2019-05-28 20:29:45",
            "modifyBy": null,
            "modifyTime": null
        },
        {
            "id": "5ced29c36828e230d5b484d0",
            "dictId": "5cda829a2ce8ae6116972044",
            "name": "DN50",
            "value": "50",
            "sort": 157,
            "remark": null,
            "createBy": "admin",
            "createTime": "2019-05-28 20:29:55",
            "modifyBy": null,
            "modifyTime": null
        },
        {
            "id": "5ced29cf6828e230d5b484d1",
            "dictId": "5cda829a2ce8ae6116972044",
            "name": "DN65",
            "value": "65",
            "sort": 158,
            "remark": null,
            "createBy": "admin",
            "createTime": "2019-05-28 20:30:07",
            "modifyBy": null,
            "modifyTime": null
        },
        {
            "id": "5ced29da6828e230d5b484d2",
            "dictId": "5cda829a2ce8ae6116972044",
            "name": "DN80",
            "value": "80",
            "sort": 159,
            "remark": null,
            "createBy": "admin",
            "createTime": "2019-05-28 20:30:18",
            "modifyBy": null,
            "modifyTime": null
        },
        {
            "id": "5ced29e36828e230d5b484d3",
            "dictId": "5cda829a2ce8ae6116972044",
            "name": "DN100",
            "value": "100",
            "sort": 160,
            "remark": null,
            "createBy": "admin",
            "createTime": "2019-05-28 20:30:27",
            "modifyBy": null,
            "modifyTime": null
        },
        {
            "id": "5ced29fb6828e230d5b484d4",
            "dictId": "5cda829a2ce8ae6116972044",
            "name": "DN250",
            "value": "250",
            "sort": 161,
            "remark": null,
            "createBy": "admin",
            "createTime": "2019-05-28 20:30:51",
            "modifyBy": null,
            "modifyTime": null
        },
        {
            "id": "5ced2a016828e230d5b484d5",
            "dictId": "5cda829a2ce8ae6116972044",
            "name": "DN300",
            "value": "300",
            "sort": 162,
            "remark": null,
            "createBy": "admin",
            "createTime": "2019-05-28 20:30:57",
            "modifyBy": null,
            "modifyTime": null
        },
        {
            "id": "5ced2a0f6828e230d5b484d6",
            "dictId": "5cda829a2ce8ae6116972044",
            "name": "DN400",
            "value": "400",
            "sort": 163,
            "remark": null,
            "createBy": "admin",
            "createTime": "2019-05-28 20:31:11",
            "modifyBy": null,
            "modifyTime": null
        },
        {
            "id": "5ced2a196828e230d5b484d7",
            "dictId": "5cda829a2ce8ae6116972044",
            "name": "DN500",
            "value": "500",
            "sort": 164,
            "remark": null,
            "createBy": "admin",
            "createTime": "2019-05-28 20:31:21",
            "modifyBy": null,
            "modifyTime": null
        },
        {
            "id": "5d09d70648c2a3753708178e",
            "dictId": "5cda829a2ce8ae6116972044",
            "name": "DN150",
            "value": "150",
            "sort": 174,
            "remark": null,
            "createBy": "admin",
            "createTime": "2019-06-19 14:32:38",
            "modifyBy": null,
            "modifyTime": null
        }
        ],//子/参数列表数据
    		redelParamBtn:true,// 子/参数列表 修改删除按钮 当选中时子列表某行出现false 父修改后不消失false 父添加后为新添加那行的数据为ture 子删除后true 子修改后为false
    		redelBtn:true,// 父/组列表、修改删除按钮 子/参数列表 添加按钮 当选中时父列表某行出现false 修改后不消失false 添加后为新添加那行的数据为false 父删除后为true/取消列高亮
    		rowData:{},//父 选中行的数据 保存
				rowGroupData:{},//子 选中行数据 保存
				getGroup:'',//父 高亮
				getGroupCh:''//子 高亮
    	}
    },
    mounted() {
			this.init()
    },
    methods: {
      inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    	add(){
      	this.ruleForm.code = ''
      	this.ruleForm.name = ''
    		// this.titleEquipparam = '数据字典组-添加',
    		this.dialogFormVisible= true
    	},
      handleClose() {
      	this.ruleForm.code = ''
      	this.ruleForm.name = ''
      	this.dialogFormVisible=false
        this.$refs.ruleForm.resetFields();
      },
      addGroup(){
      	this.ruleFormGroup.name = ''
      	this.ruleFormGroup.value = ''
      	// this.titleGroup = this.titleGroupName +'组-参数添加',
      	this.dialogGroup=true
			},
      handleCurrentChange(val) {
        this.rowData = val;
      },
      handleCurrentChangeGroup(val){
        this.rowGroupData = val;
      },
      handleCloseGroup() {//关闭 添加修改 窗口
      	this.dialogGroup = false//隐藏表单
      },
			indexMethod(index) {//获取表格序号
         return (this.tableQuery.page-1)*this.tableQuery.pageCount + (index+1)
      },
    	//获取数据
			init() {
      },
      initGroup(){
      	this.dialogGroup = false//隐藏表单

      },
      demand(row, event, column){
      	let that = this
				this.redelBtn = false
				this.rowData = row
				this.getGroup=row.index
				this.titleGroupName = row.name
				this.initGroup()
      },
      demandgroup(row, event, column){
				this.redelParamBtn = false
				
				this.rowGroupData = row//点击后获取行数据
				this.getGroupCh=row.index
				this.titleGroupChName = row.name
      },
      handleEdit(){ //表格编辑
        this.dialogFormVisible = true
        // this.titleEquipparam = '数据字典组-修改'
        for(var i in this.rowData){
          this.ruleForm[i] = this.rowData[i]
        }
      },
      handleEditGroup(){
				if(this.rowGroupData.length != 0 ){
					this.dialogGroup = true;
					// this.titleGroup = this.titleGroupName +'组-参数修改'
					for(var i in this.rowGroupData){//点击行获取的数据 赋值给表单
						this.ruleFormGroup[i] = this.rowGroupData[i]
					}
				}else{
					this.$message('请选择需要修改的行！');
				}
      },
      //弹出框
      submit(formName){	//提交
      },
      del(){
      },
      submitGroup(){
      	this.dialogGroup = false//隐藏表单

      },
      delGroup(index,row){
				let val = '该操作将删除\"'+ +'\"参数，是否确定删除?'
      	this.$confirm(val, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {

         }).catch(() => {})
      }
    },
    watch: {
			rowData(val,oldVal){
				this.rowGroupData = ''
				this.getGroupCh = ''
				this.redelParamBtn = true
			}
    }
  }
</script>

<style lang="scss" >
	.dictionary{
    
		.current-row>td{
			background-color: #cfd4de !important

		}
		.kl-table{
			.dictionary-solid{
				border: 1px solid red;
				width: 100%;
				height: 100%;
			}
      .el-row{
        margin-left: 0px !important;
        .toolbar {
          padding: 10px 0px;
        }
      }
      .el-table{
        // margin-left:1rem;
      }
		}
    .el-table__body{
    	tr{
    	}
    }
    .el-dialog{
      height: 70% !important;
      .el-dialog__body{
        margin: 0px 33px;
      }
      .el-dialog__footer{
        margin-top:1rem;
        .el-button--info{
          background: #409eff;
          span{
            color: #fff;
          }
        } 
      }
    }
	}
</style>