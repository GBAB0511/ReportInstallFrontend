<template>
    <div class="NewAccountOpening">


                <div class="toolbar">
                    <el-form :inline="true" size="mini" :model="formData" class="demo-form-inline">
                        <!-- <el-form-item class="form-left">

                            <el-form-item label="模糊查询：">
                                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formData.con" placeholder="工程编号/户名/地址"></el-input>
                            </el-form-item>
    
                            <el-form-item>
                                
                                <el-button class='searchBtn'  @click="demand" icon="el-icon-search"></el-button>
                            </el-form-item>
                            
                        </el-form-item> -->
                        
                        <el-form-item class="form-right">
                            <el-button  size="mini" type="primary">保存</el-button>
                            <el-button  size="mini" type="primary" @click="InsertRows">插入行</el-button>
                            <el-button  size="mini" icon="el-icon-document-copy" type="primary">整列复制</el-button>
                            <el-button  size="mini" icon="el-icon-download" type="primary">导入</el-button>
           
                        
                        
                        </el-form-item>
                    </el-form>
                </div>
                <div class="kl-table" :style="{height: maxHeight + 'px'}">
                <el-table
                    v-if="tableShow"
                    highlight-current-row
                    :max-height="maxHeight"         
                    stripe
                    border
                    :data="histroyData.list"
                    class="change-tables-table">

                    <el-table-column 
                        type="index"  label="NO."
                        width="50" 
                        fixed="left"
                      >
                    </el-table-column>

                    <el-table-column
                        min-width="150"
                        label="册本*">
                        <template slot-scope="scope">
                            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                            v-model="scope.row.endTime"
                            placeholder="请输入册本"
                            @input="e => input = inputMe(e)"
                            >
                            </el-input>
                        </template>
                    </el-table-column>

                    <el-table-column
                        prop="code"
                        min-width="180"
                        label="用户编号*">
                        <template slot-scope="scope">
                            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                            v-model="scope.row.areaId"
                            placeholder="请输入用户编号"
                            @input="e => input = inputMe(e)"
                            >
                            </el-input>
                        </template>
                    </el-table-column>

                    <el-table-column
                        prop="lvalue"
                        min-width="200"
                        label="用户地址*">
                        <template slot-scope="scope">
                            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                            v-model="scope.row.factoryName"
                            @input="e => input = inputMe(e)"
                            placeholder="请输入用户地址"
                            >
                            </el-input>
                        </template>
                    </el-table-column>

                    <el-table-column
                        prop="fixValue"
                        min-width="180"
                        label="行政区域*">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.id" placeholder="请选择行政区域">
                                <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>

                    <el-table-column
                        prop="flux"
                        min-width="180"
                        label="营业区域*">
                        
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.meter" placeholder="请选择营业区域">
                                <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                       
                    </el-table-column>

                    <el-table-column
                        prop="fixValue"
                        min-width="180"
                        label="座机号码">
                        <template slot-scope="scope">
                            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                            v-model="scope.row.fixValue"
                            @input="e => input = inputMe(e)"
                            >
                            </el-input>
                        </template>
                    </el-table-column>

                    <el-table-column
                        prop="flux"
                        min-width="180"
                        label="短信手机">
                        <template slot-scope="scope">
                            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                            v-model="scope.row.modifyTime"
                            @input="e => input = inputMe(e)"
                            >
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="code"
                        
                        min-width="150"
                        label="身份证号">
                        <template slot-scope="scope">
                            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                            v-model="scope.row.protocolName"
                            @input="e => input = inputMe(e)"
                            >
                            </el-input>
                        </template>
                    </el-table-column>

                    <el-table-column
                        prop="daytime"
                        min-width="100"
                        label="价格分类*">
                        <template slot-scope="scope">
                            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                            v-model="scope.row.sensorModel"
                            @input="e => input = inputMe(e)"
                            >
                            </el-input>
                        </template>
                    </el-table-column>

                    <el-table-column
                        prop="areaName"
                        min-width="180"
                        label="用水性质*">
                        <template slot-scope="scope">
                            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                            v-model="scope.row.sn"
                            @input="e => input = inputMe(e)"
                            >
                            </el-input>
                        </template>

                    </el-table-column>

                    <el-table-column
                        prop="lvalue"
                        min-width="200"
                        label="缴费方式*">
                        <template slot-scope="scope">
                            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                            v-model="scope.row.unusual"
                            @input="e => input = inputMe(e)"
                            >
                            </el-input>
                        </template>
                    </el-table-column>

                    <el-table-column
                        prop="fixValue"
                        min-width="180"
                        label="表类型*">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.waterGroup" placeholder="请选择表类型">
                                <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>

                    <el-table-column
                        prop="flux"
                        min-width="180"
                        label="出厂编号">
                        <template slot-scope="scope">
                            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                            v-model="scope.row.flux"
                            @input="e => input = inputMe(e)"
                            >
                            </el-input>
                        </template>
                    </el-table-column>

                    <el-table-column
                        prop="fixValue"
                        min-width="80"
                        label="口径*">
                        <template slot-scope="scope">
                            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                            v-model="scope.row.fcode"
                            @input="e => input = inputMe(e)"
                            >
                            </el-input>
                        </template>
                    </el-table-column>

                    <el-table-column
                        prop="flux"
                        min-width="180"
                        label="立户日期*">
                        <template slot-scope="scope">
                            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                            v-model="scope.row.daytime"
                            @input="e => input = inputMe(e)"
                            >
                            </el-input>
                        </template>
                    </el-table-column>

                    <el-table-column
                        prop="flux"
                        min-width="80"
                        label="人/户数">
                        <template slot-scope="scope">
                            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                            v-model="scope.row.pageCount"
                            @input="e => input = inputMe(e)"
                            >
                            </el-input>
                        </template>
                    </el-table-column>

                    <el-table-column class="cell" label="操作" fixed="right" width="85">
                        <template slot-scope="scope">
                        <!-- size="mini" type="warning" plain -->
                        <el-button type="text" @click="edit(scope.$index, scope.row)">复制</el-button>
                        <span  >|</span>
                        <el-button type="text" class="noclick" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
                        <!-- <el-button type="text" @click.native="edit(scope.$index, scope.row)">修正</el-button> -->
                        </template>
                    </el-table-column>

                    </el-table>
                    
                </div>
                <!-- 分页 -->
                    <div class="block">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="1"
                            :page-sizes="[20, 100, 500, 1000]"
                            :page-size="20"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="histroyData.total">
                        </el-pagination>
                    </div>

    </div>
</template>
<script>
export default {
    name:"OpenAccount",
    data(){
        return{
            activeName: 'EngineeringAccountOpening',
            crumbsData :{  //面包屑
                titleList:[
                    {title:'客户中心',path:'/OpenAccount'},
                    {title:'开户',method:()=>{window.histroy.back()}},
                    {title:'工程开户',method:()=>{window.histroy.back()}}
                ],
                
            },
            formData:{
                con:"",
                watermeterWarehouse:"",
                watermeterWarehouseOptions:[],
                waterMeterManufacturer:"",
                waterMeterManufacturerOptions:[],
                waterMeterType:"",
                waterMeterTypeOptions:[],
                waterMeterCaliber:"",
                waterMeterCaliberOptions:[],
                waterMeterStatus:"",
                waterMeterStatusOptions:[],
                subordinateDepartments:"",
                subordinateDepartmentsOptions:[]

            },
            tableShow:false,
            maxHeight:0,
            histroyData:{
                
            },

        }
    },
    mounted(){
        this.init();
        //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      
      this.common.changeTable(this,'.OpenAccount .kl-table',['.OpenAccount .toolbar','.OpenAccount .block','.OpenAccount .bread-contain'])
    },
    methods:{
        inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
        init(){
            
            this.histroyData = {
                areaId:"",
                endRow: 5,
                hasNextPage: false,
                hasPreviousPage: false,
                isFirstPage: true,
                isLastPage: true,
                list: [
                    {
                        areaId: null,
                        areaName: "陈银新",
                        code: "18010003",
                        concentrator: "",
                        connect: 1110,
                        daytime: "20190702",
                        endTime: null,
                        factoryName: "西郊寨中第五村陈屋",
                        fcode: 15,
                        fix: false,
                        fixValue: "18948800086",
                        flux: "20190708",
                        getMeter: 1,
                        id: null,
                        isxz: "未抄",
                        lvalue: "-",
                        meter: null,
                        model: null,
                        modifyBy: null,
                        modifyTime: null,
                        offset: 0,
                        page: 1,
                        pageCount: 20,
                        position: "1栋3单元",
                        protocolName: null,
                        rowNumber: 0,
                        sensorModel: null,
                        sn: null,
                        status: "未上传",
                        totalPage: 0,
                        type: 5,
                        unusual: null,
                        usn: "00",
                        waterGroup: null,
                        options:[]
                    },
                    {
                        areaId: null,
                        areaName: "张银新",
                        code: "18010005",
                        concentrator: "",
                        connect: 1111,
                        daytime: "20190702",
                        endTime: null,
                        factoryName: "江南黄金花园12栋106房",
                        fcode: 15,
                        fix: false,
                        fixValue: "18948800087",
                        flux: "20190708",
                        getMeter: 1,
                        id: null,
                        isxz: "未抄",
                        lvalue: "-",
                        meter: null,
                        model: null,
                        modifyBy: null,
                        modifyTime: null,
                        offset: 0,
                        page: 1,
                        pageCount: 20,
                        position: "1栋3单元",
                        protocolName: null,
                        rowNumber: 0,
                        sensorModel: null,
                        sn: null,
                        status: "未上传",
                        totalPage: 0,
                        type: 5,
                        unusual: null,
                        usn: "00",
                        waterGroup: null,
                        options:[]
                    },
                    {
                        areaId: null,
                        areaName: "李银新",
                        code: "18010004",
                        concentrator: "",
                        connect: 1112,
                        daytime: "20190702",
                        endTime: null,
                        factoryName: "教师新村重教路侯屋",
                        fcode: 15,
                        fix: false,
                        fixValue: "18948800046",
                        flux: "20190708",
                        getMeter: 1,
                        id: null,
                        isxz: "未抄",
                        lvalue: "-",
                        meter: null,
                        model: null,
                        modifyBy: null,
                        modifyTime: null,
                        offset: 0,
                        page: 1,
                        pageCount: 20,
                        position: "1栋3单元",
                        protocolName: null,
                        rowNumber: 0,
                        sensorModel: null,
                        sn: null,
                        status: "未上传",
                        totalPage: 0,
                        type: 5,
                        unusual: null,
                        usn: "00",
                        waterGroup: null,
                        options:[]
                    },
                ],
                navigateFirstPage: 1,
                navigateLastPage: 1,
                navigatePages: 8,
                navigatepageNums: Array(1),
                nextPage: 0,
                pageNum: 1,
                pageSize: 20,
                pages: 1,
                prePage: 0,
                size: 5,
                startRow: 1,
                total: 5,
            }
        },
        handleClick(tab, event) {
            if(tab.name==="NewAccountOpening"){
                this.crumbsData.titleList[2].title=  '新开户'

            }else{
                 this.crumbsData.titleList[2].title =  '工程开户'
            }

        },
        demand() {  //查询
        // this.tableQuery.page = 1
        // this.tableQuery.pageCount = 20
        this.init()
      },
      //   导出
      exportExcel(){
    //   	let listData = {}
    //   	this.tableQuery.pageCount = this.historyData.total ===0? 20:this.historyData.total
    //     let params ={
    //       "busicode":"MeterReadingList",
    //       "data": this.tableQuery
    //     }
    //     this.$api.fetch({
    //       apiUrl: 'interface.api',//路径
    //       method: 'post',//请求方法
    //       params:params,//参数
    //       needErrorCallback:true
    //     }).then(res =>{
    //     	if(res.code===0){
    //         listData = res.data
    //         if (!listData.list[0]) {
	//         		this.$notify({
	//               title: '警告',
	//               message:'表格没有相关数据',
	//               type: 'error'
	//             })
	//         	} else {
	//         		import('@/vendor/Export2Excel').then(excel => {
	// 			        const tHeader = ['水表编号', '抄表日期', '所属小区','厂家编号','厂家','型号', '当日读数', '修正读数', '当日水量', '数据状态',  '用户编号','集中器编号','用户地址']
	// 			        const filterVal = ['code', 'daytime', 'areaName','fcode','factoryName','model','lvalue', 'fixValue','flux', 'status', 'usn', 'concentrator', 'position']
	// 			        const list = listData.list
	// 			        const data = this.formatJson(filterVal, list)
	// 			        excel.export_json_to_excel({
	// 			          header: tHeader,
	// 			          data,
	// 			          filename: this.tableQuery.daytime + '抄表数据',
	// 			          autoWidth: '100'
	// 			        })
	// 			      })
	//         		this.tableQuery.pageCount = 20
	//         	}
    //       }
    //     })
      },
      //分页
      handleSizeChange(val) { //显示多少数据一页
        // this.tableQuery.pageCount = val
        // this.tableQuery.page = 1
        this.init()
      },
      handleCurrentChange(val) {  //显示多少页码
        // this.tableQuery.page = val
        this.init()
      },
    //   开户
      add(){
          this.init()
      },

        // 插入行
        InsertRows(){
            this.histroyData.list.push({})
        },
        // 删除行
        deleteRow(index, row){
            this.$confirm('是否确认删除该行?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.histroyData.list.splice(index,1)
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        }
    },
    watch:{
        maxHeight(){
        this.tableShow = false
        this.$nextTick(()=>{
          this.tableShow = true
        })
      },
    }
}
</script>
<style lang="scss">
.OpenAccount{
    width: 100%;
}
</style>