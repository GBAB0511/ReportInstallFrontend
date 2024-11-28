<template>
    <div class="reportCenterCon">
        <!-- 弹出表单含添加和修改 -->
    	<el-dialog :title="WaterEditorName" :close-on-click-modal="false" :visible.sync="waterAddVisible" class="common-dialog" @close="closeDialog" >
            <WaterTablesDetails
                ref="childWaterEditor" 
            ></WaterTablesDetails>

    	</el-dialog>
        <div class="report-center-con">
            <section class="report-center-center">
                <ol class="report-center-pie">
                    <li id="pie1"></li>
    

                </ol>
                <div class="report-center-centerCategory">
                    <div class="alternative">
                        <el-radio-group v-model="radio">
                            <el-radio :label="3">按月</el-radio>
                            <el-radio :label="6">按年</el-radio>
                        
                        </el-radio-group>
                    </div>
                    <div id="CategoryCustom"></div>
                </div>
            </section>
            <section class="report-center-right">
                <div class="task-num" @click="task">
                    <img src="@/assets/images/任务.png" alt="">
                    <span><p>123</p><i>待办任务数</i></span>
                </div>
                <!-- 表格 -->
                <el-table class="listTable table-top" border stripe :data="historyData" @cell-click="cellClick"
                >

                <el-table-column align="left" prop="name" min-width="150" label="指标名称"></el-table-column>

                <el-table-column prop="value" min-width="150" label="指标值"></el-table-column>

                </el-table>
                <p class="blank" style="height:30px;"></p>
                <el-table class="listTable" v-if="tableShow" :max-height="maxHeight" border stripe :data="tableData"
                >

                <el-table-column align="left" prop="name" min-width="150" label="指标名称"></el-table-column>

                <el-table-column prop="month" min-width="130" label="本月"></el-table-column>
                <el-table-column prop="lmonth" min-width="130" label="上月"></el-table-column>

                <el-table-column prop="year" min-width="130" label="本年"></el-table-column>

                </el-table>
            </section>
        </div>
    </div>
</template>
<script>
import WaterTablesDetails from '../CenterSideIndex/WaterTablesDetails'
export default {
    name:"report-center-index",
    components:{
        WaterTablesDetails
    },
    data(){
        return{ 

            maxHeight: 0,
            tableShow:false,
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
            companyName:["南沙水司","梧州水司","梧州水司","梧州水司","梧州水司","梧州水司","梧州水司","梧州水司","梧州水司"],
            WaterEditorName:"水司总户数",
            waterAddVisible:false
        }
    },
    mounted(){
        
        this.$nextTick(()=>{
            this.echartPieCustom();

         this.echartCategoryCustom();
             //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
              this.$changeTable(this, '.reportCenterCon .report-center-right', ['.reportCenterCon .table-top','.reportCenterCon .blank','.reportCenterCon .blank',".reportCenterCon .task-num",".reportCenterCon .task-num"])
        })
    },
    methods:{
        // 饼图
        echartPieCustom(){
             let myChart = this.$echarts.init(document.getElementById('pie1'))
            let option = {
                title: {
                    text: '缴费金额',
                        x:'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'horizontal',
                    // x: 'right',
                    y:"bottom",
                    data:['微信缴费','支付宝缴费','银行代扣缴费','银行托收缴费','第三方软件缴费']
                },
                series: [
                    {
                        name:'占比',
                        type:'pie',
                        radius: ['40%', '60%'],
                        avoidLabelOverlap: false,
                        x:"center",
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '12',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:[
                            {value:335, name:'微信缴费'},
                            {value:310, name:'支付宝缴费'},
                            {value:234, name:'银行代扣缴费'},
                            {value:135, name:'银行托收缴费'},
                            {value:135, name:'第三方软件缴费'},
           
                        ]
                    }
                ]
            };
            myChart.setOption(option)
            window.addEventListener('resize', function () {
                myChart.resize()
            })
    
        },
            // 折线图
        echartCategoryCustom(){
             let myChart = this.$echarts.init(document.getElementById('CategoryCustom'))
                let option = {
                    title: {
                        text: '销售分析表',
                        x:"center"
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['缴费总金额','应收水费','已收水费','售水总金额'],
                        y:"bottom"
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '6%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['周一','周二','周三','周四','周五','周六','周日']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                         {
                            name:'缴费总金额',
                            type:'line',
                            stack: '总量',
                            data:[120, 132, 101, 134, 90, 230, 210]
                        },
                        {
                            name:'应收水费',
                            type:'line',
                            stack: '总量',
                            data:[220, 182, 191, 234, 290, 330, 310]
                        },
                        {
                            name:'已收水费',
                            type:'line',
                            stack: '总量',
                            data:[150, 232, 201, 154, 190, 330, 410]
                        },
                        {
                            name:'售水总金额',
                            type:'line',
                            stack: '总量',
                            data:[320, 332, 301, 334, 390, 330, 320]
                        }
                    ]
                };

             myChart.setOption(option)
            window.addEventListener('resize', function () {
                myChart.resize()
            })
        },
        task(){
            this.$emit("tabsShow","mydestop");
        },
        // 点击表格
        cellClick(row, column, cell, event) { //点击文件名
            if (column.label === '指标名称') {
                this.waterAddVisible = true;

            }
        },
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
  $imgWidth: 200px;
$theme-color:#297acc;
  .reportCenterCon{
      .el-table .el-table__body tr .cell:nth-child(1) {
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    &:after{
        @include _clearBoth()
    }
    & > .report-center-con{
       width: 100%;
        height: 100%;
        // width: calc(100% - 220px);
        &:after{
            @include _clearBoth()
        }
    }
    & > .report-center-left,.report-center-center,.report-center-right{
        float: left;
        height: 100%;
    }
    & > .report-center-left{
        width: 200px;
        border-right:10px solid #eaf4ff;
        .kl-container {
            position: relative;
            height: 100%;
            .kl-aside {
            position: absolute;
            left: 0px;
            top: 10px;
            width: 200px;
            z-index: 1000;
            background: #fff;
            height: calc(100% - 18px);
            color: #000;
            border-radius: 3px;
            .nav-tree-contain {
                height: 100%;
                overflow: hidden;
                width: 100%;
                .el-menu{
                width: 100%;
                border: none;
                overflow:auto;
                background: transparent;
                background: #fff;
                div{
                    height:38px;
                    li{
                        height: 38px;
                    }
                }
                .el-menu-item.is-active{
                    background: #328ED1;
                    color: #fff;
                }
                
                .el-menu-item{
                    width: 100%;
                    text-align: center;
                }
                .el-menu-item,
                .el-submenu {
                    i:first-child {
                    display: inline-block;
                    width: 15px;
                    height: 20px;
                    background-size: 100%;
                    }
                }
                li.el-submenu {
                    color: #000;
                    .el-menu {
                    background: transparent;
                    }
                    .el-submenu__title {
                    text-align: left;
                    height: 50px !important;
                    line-height: 50px !important;
                    font-size: 14px;
                    &:hover,
                    &:focus {
                        background: $theme-color;
                    }
                    }
                }
                .el-menu-item {
                    background: transparent;
                    color: #3b3a3a;
                    text-align: left;
                    height: 38px !important;
                    line-height: 38px !important;
                    font-size: 14px;
                    font-weight:700;
                    &:hover,
                    &:focus {
                    background: $theme-color;
                    }
                    &.is-active {
                    background: $theme-color;
                    color: #fff;
                    height: 38px !important;
                    line-height: 38px !important;
                    }
                }
                }
                .kr-title {
                color:#3195f4;
                cursor: pointer;
                font-size: 20px;
                font-weight: bold;
                height: 50px;
                line-height: 50px;
                padding: 0 20px;
                text-align:center
                }
            }
            .switch-btn {
                position: relative;
                width: 18px;
                height: 100%;
                float: left;
                background: rgba(0, 70, 142, 0.1);
                line-height: 100%;
                text-align: center;
                .glyphicon-menu-right,
                .glyphicon-menu-left {
                vertical-align: middle;
                background: rgb(0, 70, 141);
                color: #fff;
                height: 60px;
                line-height: 60px;
                font-weight: bolder;
                position: absolute;
                top: 50%;
                left: 3%;
                transform: translateY(-50%);
                border-radius: 0 3px 3px 0;
                }
            }
            }
            .kl-main {
            height: 100%;
            margin-left: 210px ;
            border-radius: 3px;
            background: #fff;
            .model-first-rank{
                padding:0px;
            }
        }
    }
    }
    .report-center-center{
        width: 55%;
        margin-right: 20px;
        & > .report-center-pie{
            width: 100%;
            height: 40%;
            & > li{
                padding-top: 10px;
                text-align: center;
                height: 86%;
                width: 50%;
                margin: auto;
            }
        }
        & > .report-center-centerCategory{
            width: 100%;
            height: 60%;
            padding-left: 20px;
            #CategoryCustom{
                width: 100%;
                height: 85%;
            }
        }
    }
    .report-center-right{
        width: 40%;
        padding:15px;
        height:96%;
        .table-top{
            margin-top: 20px;
            .el-table__body-wrapper tr td:nth-child(1) .cell {
                color: #3195f4;
                cursor: pointer;
            }
            .el-table__body-wrapper tr td .cell {
                text-align: center;
            }
        }
        .task-num{
            padding:8px 7px;
            border:1px solid #f5f5f5;
            border-radius: 5px;
            width: 120px;
            margin-left:auto;
            &:after{
                @include _clearBoth()
            }
            &:hover{
                background: #eaf4ff;
                cursor: pointer;
            }
            img{
                width: 30px;
                height: 32px;
                vertical-align: middle;
                float: left;
                margin-right:10px;
            }
            span{
                float:left;
            }
            p{
                color: $theme-color;
                font-size: 16px;
            }
        }
    }
    
  }
</style>
