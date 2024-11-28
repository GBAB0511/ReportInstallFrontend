<template>
    <!-- 我的桌面 -->
    <div class="mydestop">
        
        <el-form :inline="true" size="mini" :model="formInline" class="demo-form-inline">
            <el-form-item label="模糊查询：" class="isactive searchInput">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="formInline.con" placeholder="模糊查询"></el-input>
            </el-form-item>
            <el-form-item label="选择单据类：">
                <el-cascader v-model="formInline.document" :options="options" :show-all-levels="false"></el-cascader>
                 <el-select v-model="formInline.document" placeholder="选择单据类">
                <el-option v-for="(v,i) in formInline.options" :label="v.name" :value="v.value" :key="i"></el-option>
            
                </el-select> 
            </el-form-item>
            <el-form-item label="选择申请人：">
                <el-select v-model="formInline.proposer" placeholder="选择申请人">
                    <el-option v-for="(v,i) in formInline.options" :label="v.name" :value="v.value" :key="i"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button  class="searchBtn"  icon="el-icon-search"></el-button>
            </el-form-item>
        </el-form>
        <div class="applicationDate">
            <p class="isactive">申请日期：</p>
            <ul>
                <li v-for="(v, i) in applicationDate" :key="i">{{v}}</li>
            </ul>
        </div>
        <div class="applicationDate">
            <p class="isactive">关联类型：</p>
            <ul>
                <li v-for="(v, i) in associatedType" :key="i">{{v}}</li>
            </ul>
        </div>
       
        <div class="myDeskConBtn">

            <aside class="btn-right">
                <el-button type="primary" size="mini" icon="el-icon-refresh">刷新</el-button>
            </aside>
            <!-- 表格-->
            <el-table class="listTable dataTable" border stripe :data="listTable">
                
                <el-table-column min-width="45" type="index" fixed="left" label="No." ></el-table-column>
                
                <el-table-column prop="applicationTime" min-width="100" label="申请时间"></el-table-column>
                <el-table-column prop="updateTime" min-width="100" label="更新时间"></el-table-column>

                <el-table-column prop="workflowname" min-width="80" label="单据名称"></el-table-column>

                <el-table-column prop="applicationUser" min-width="80" label="申请人"></el-table-column>
                <el-table-column min-width="130" label="主题">
                    <template slot-scope="scope">
                        <span>{{scope.row.themeTitle}}</span>&nbsp;&nbsp;&nbsp;
                        <span style="color:#328ED1;">{{scope.row.themeCon}}</span>
                    </template>
                </el-table-column>
                <el-table-column min-width="280" label="当前节点">
                    <template slot-scope="scope">
                        <span style="color:green;">{{scope.row.stepStart}}</span>&nbsp;&nbsp;&nbsp;
                        <span>{{scope.row.stepEnd}}</span>
                    </template>
                </el-table-column>

                <el-table-column min-width="100" label="操作">
                    <template slot-scope="scope">                                         
                        <el-button type="text"  plain  v-if="processingStatus ==='commission'">审批</el-button>
                        <!-- <span style="color:#e6e6e6;" v-if="scope.row.getAllConc ===1">|</span> -->
                        <el-button type="text"  plain  v-if="processingStatus ==='completed'"  @click.native="details(scope.$index, scope.row)">详情</el-button>
                    </template>
                </el-table-column>

            </el-table>

            
        </div>
        
    </div>
</template>
<script>
export default {
    name:"mydestop",
    data() {
      return {
        options:[
            { 
                label: '工程管理', 
                value: '222', 
                children: [
                { label: '用水需求咨询', value: '22' }, 
                { label: '内部工程', value: '222' }, 
                ] 
            },
            { 
                label: '客户管理', 
                value: '122', 
                children: [
                { label: '用户资料变更', value: '121' }, 
                { label: '用水类型变更', value: '122' }, 
                { label: '用水人口变更', value: '123' }, 
                { label: '优惠用水变更', value: '124' },
                { label: '缴费方式变更', value: '125' }, 
                { label: '开票资料变更', value: '126' }, 
                ] 
            },
            { 
                label: '表计管理', 
                value: '222', 
                children: [
                { label: '换表', value: '321' }, 
                { label: '复装', value: '322' }, 
                { label: '校表', value: '323' }, 
                ] 
            }
        ],
        //   办理状态
          processingStatus:"commission",
          tabsTitle:[
            {
                label:"待办",
                name:"commission"
            },
            // {
            //     label:"办理中",
            //     name:"inProject"
            // },
            {
                label:"已办结",
                name:"completed"
            }
          ],
        //   打印方式
          printCheckList:"",
        //   结存方式

          paymentTypeModel:"",
        pinventoryTypeModel:"",
        //   缴费类型
        pinventoryType:[
            {
                  label:1,
                  value:"全额找零"
              },
              {
                  label:2,
                  value:"零头结存"
              },
              {
                  label:3,
                  value:"结存清零"
              },
        ],
        paymentType:[
            {
                label:1,
                value:"现金"
            },
            {
                label:2,
                value:"支票"
            },
            {
                label:3,
                value:"刷卡"
            },
            {
                label:4,
                value:"转账"
            },
            {
                label:5,
                value:"锁定"
            },
        ],
        //   表格的高度
          maxHeight: 0,
        //   控制表格的显示
          tableShow:false,
        //   关联类型
          associatedType:["全部","我发起的","我经办的"],
        //   申请日期
          applicationDate:["全部","今天","3天内","7天内","30天内","指定时间"],
        //   查询表单
        formInline: {
            con: '',
            document: [],
            proposer:"",
            application:"",
            options:[]
        },
        tabsActiveName: 'home',
        // tabs标签页
        tabsData:[
            {
                label:"KPI",
                name:"home"
            },
             {
                label:"我的桌面",
                name:"mydestop"
            },
            {
                label:"综合业务",
                name:"comprehensiveBusiness"
            },
        ],
        listTable:[
            {
                applicationTime:"2019-06-03 12.27",
                updateTime:"2019-06-03 14:05",
                applicationUser:"张三",
                workflowname:"用水需求咨询",
                themeTitle:"用水需求咨询",
                themeCon:"SS00001",
                stepStart:"登记（张三）",
                stepEnd:"勘察（李四）",
                getAllConc:0,    

            },
            {
                applicationTime:"2019-06-03 12.27",
                updateTime:"2019-06-03 14:05",
                applicationUser:"张三",
                workflowname:"用户资料变更",
                themeTitle:"用户资料变更",
                themeCon:"YY00001",
                stepStart:"登记（张三）",
                stepEnd:"部门领导审批（李四）",
                getAllConc:1,

            },
            {
                applicationTime:"2019-06-03 12.27",
                updateTime:"2019-06-03 14:05",
                applicationUser:"张三",
                workflowname:"换表",
                themeTitle:"换表",
                themeCon:"HH00001",
                stepStart:"登记（张三）",
                stepEnd:"部门领导审批（李四）",
                getAllConc:0,

            },
        ],
    // 第一个表格
        tableData:[
            {
                name:"缴费总金额",
                month:"100万",
                lmonth:"100万",
                year:"100万"
            },
            {
                name:"微信缴费金额",
                month:"10万",
                lmonth:"10万",
                year:"10万"
            },
            {
                name:"支付宝缴费金额",
                month:"10万",
                lmonth:"10万",
                year:"10万"
            },
            {
                name:"银行代扣缴费金额",
                month:"10万",
                lmonth:"10万",
                year:"10万"
            },

            {
                name:"银行托收缴费金额",
                month:"10万",
                lmonth:"10万",
                year:"10万"
            },
            {
                name:"第三方软件缴费金额",
                month:"10万",
                lmonth:"10万",
                year:"10万"
            },

            {
                name:"预存缴费金额",
                month:"10万",
                lmonth:"10万",
                year:"10万"
            },
            {
                name:"现金缴费金额",
                month:"10万",
                lmonth:"10万",
                year:"10万"
            },
            {
                name:"非现场缴费金额",
                month:"10万",
                lmonth:"10万",
                year:"10万"
            },
            {
                name:"水费回收率",
                month:"80%",
                lmonth:"80%",
                year:"80%"
            },
            {
                name:"应收水费",
                month:"10万",
                lmonth:"10万",
                year:"10万"
            },
            {
                name:"已收水费",
                month:"10万",
                lmonth:"10万",
                year:"10万"
            },
            {
                name:"欠费户数",
                month:"10万",
                lmonth:"10万",
                year:"10万"
            },
            {
                name:"欠费金额",
                month:"10万",
                lmonth:"10万",
                year:"10万"
            },
            {
                name:"污拉费回收率",
                month:"80%",
                lmonth:"80%",
                year:"80%"
            },
                {
                name:"应收回污拉费",
                month:"10万",
                lmonth:"10万",
                year:"10万"
            },
            {
                name:"已收回污拉费",
                month:"10万",
                lmonth:"10万",
                year:"10万"
            },
            {
                name:"污拉欠费户数",
                month:"10万",
                lmonth:"10万",
                year:"10万"
            },
            {
                name:"污拉欠费金额",
                month:"10万",
                lmonth:"10万",
                year:"10万"
            },
            {
                name:"售水总金额",
                month:"10万",
                lmonth:"10万",
                year:"10万"
            },
            {
                name:"抄表总水量",
                month:"10吨",
                lmonth:"10吨",
                year:"10吨"
            },
            {
                name:"工程总收入",
                month:"10万",
                lmonth:"10万",
                year:"10万"
            },
            {
                name:"工程总数量",
                month:"10单",
                lmonth:"10单",
                year:"100单"
            },
            {
                name:"工程处理及时率",
                month:"10单",
                lmonth:"10单",
                year:"100单"
            },
        ],
    // 第二个表格
        historyData:[
            {
                name:"用户存数",
                value:"100万"
            },
            {
                name:"预存余额",
                value:"100万"
            },
            {
                name:"微厅关注数",
                value:"100万"
            },
            {
                name:"网厅注册树",
                value:"100万"
            },
            {
                name:"在用水表数量",
                value:"100万"
            },
            {
                name:"在库水表数量",
                value:"100万"
            },
        ],
        radio: 3,
    };
    },
    mounted(){

        this.$nextTick(()=>{
             //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
              this.common.changeTable(this, '.water-side .mydestop', ['.water-side .demo-form-inline','.water-side .applicationDate','.water-side .applicationDate'])
        })
    },
    methods: {
      tabsHandleClick(tab, event) {
    
      },

    //   详情
      details(index, row){

      },
     
        tabsShow(val){
            this.tabsActiveName = val;
        }
    },
    watch:{
         maxHeight() {
            this.tableShow = false
            this.$nextTick(() => {
                this.tableShow = true
            })
        },
    }
}
</script>
<style lang="scss">
@import "../../assets/styles/scss/base/fn";
    .mydestop{

        .isactive{
            color: #328ED1;
            font-weight: 700;
            & > .el-form-item__label{
                color: #328ED1;
                font-weight: 700;
            }
        }
        
        .el-input .el-input__inner {
            height: 28px;
            line-height: 28px;
        }
        .applicationDate{
            padding:8px 0;
            border-bottom:1px dashed #ccc;
            &:after{
                @include _clearBoth()
            }
            & > p{
                float: left;
                padding:3px 0px;
                
            }
            & > ul{
                float: left;
                padding-left: 10px;
                &:after{
                    @include _clearBoth()
                }
                & > li{
                    float: left;
                    padding:3px 24px;
                    border-radius: 2px;
                }
                & > li:first-child{
                    background: #328ED1;
                    color: #fff;
                }
            }
        }
        .myDeskConBtn{
            padding-top: 10px;
            .btn-right{
                text-align: right;
            }
        }
        .dataTable{
            margin-top: 10px;
            width: 100% !important;
        }
        .water-side-left,.water-side-center,.water-side-right{
            float: left;
            height: 100%;
        }
        
        .home{
            width: 100%;
            height: 100%;
            &:after{
                @include _clearBoth()
            }
            .water-side-con{
                width: 100%;
                height: 100%;
                zoom: 1;
                &:after{
                    @include _clearBoth()
                }
            }
            .water-side-center{
                width: 55%;
                margin-right: 20px;
                height: 100%;
            & > .water-side-pie{
                    width: 100%;
                    height: 40%;
                    zoom: 1;
                    &:after{
                        @include _clearBoth()
                    }
                    & > li{
                        padding-top: 10px;
                        text-align: center;
                        height: 86%;
                        width: 50%;
                        margin: auto;
                    }
                }
                & > .water-side-centerCategory{
                    width: 100%;
                    height: 60%;
                    padding-left: 20px;
                    #CategoryCustom{
                        width: 100%;
                        height: 90%;
                    }
                }
            }
            .water-side-right{
                width: 40%;
                padding:15px;
                height:96%;
                .table-top{
                    margin-top: 20px;
                }
            }
            .el-table .el-table__body tr .cell:nth-child(1) {
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        .el-tabs__header.is-top{
            margin: 0px;
        }
        .el-tabs.el-tabs--border-card.el-tabs--top{
            height: 100%;
            .el-tabs__content{
                height: calc(100% - 68px);
                #pane-home{
                    height:100%;
                    .reportCenterCon{
                        height:100%;
                    }
                }
            }
        }

    }
</style>