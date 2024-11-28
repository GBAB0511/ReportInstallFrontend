
<template>
    <div class="StatementAnalysisReport">
        <section class="StatementAnalysisReportCon" v-show="StatementAnalysisReport">
            <div class="StatementAnalysisReportConTop">
                <aside class="StatementAnalysisReportConL">
                    <div class="choooseArea" v-if="areaShow" @click="areashowWay($event)">
                        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  size="mini" placeholder="营业区域" @focus="areashowWay($event)">
                            
                        </el-input>
                        <i class="el-icon-arrow-down arrowIcon"></i>
                        
                        <div class="choooseAreaCon">
                            <aside class="AreaL">
                                <h4>
                                    <el-radio v-model="AreaPro" @change="area" label="1">省份</el-radio>
                                    <el-radio v-model="AreaPro" @change="area" label="2">片区</el-radio>
                                </h4>
                                <div class="checkboxGroup">
                                    <el-checkbox :indeterminate="isIndeterminate" v-model="areaAll" @change="areaAllChange">全选</el-checkbox>
                                    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                                        <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
                                    </el-checkbox-group>
                                </div>
                            </aside>
                            <aside class="AreaR">
                                <h4>公司</h4>
                                <div class="checkboxGroup">
                                    <el-checkbox :indeterminate="isCompanys" v-model="companyAll" @change="companyAllChange">全选</el-checkbox>
                                    <el-checkbox-group v-model="checkedCompanys" @change="handleCheckedCompanysChange">
                                        <el-checkbox v-for="Companys in Companys" :label="Companys" :key="Companys">{{Companys}}</el-checkbox>
                                    </el-checkbox-group>
                                </div>
                            </aside> 
                            <i class="areaTriangle"></i>
                             <i class="companyTriangle"></i>
                        </div>
                        
                    </div>
                    <el-cascader
                        ref="cascader"
                        expand-trigger="hover"
                        size="mini"
                        :options="SelectionIndicatorsOptions"
                        v-model="SelectionIndicators"
                        placeholder="选择指标"
                        :show-all-levels="false"
                        @change="SelectionIndicatorsHandle"
                        >
                    </el-cascader>
                    <!-- <el-select v-model="SelectionIndicators" @change="SelectionIndicatorsHandle" size="mini" placeholder="选择指标">
                        <el-option
                        v-for="item in SelectionIndicatorsOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select> -->
                    <el-select v-model="AnalyticalApproach" @change="AnalyticalApproachHandle" size="mini" placeholder="分析方式">
                        <el-option
                        v-for="item in AnalyticalApproachOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <el-date-picker
                        v-model="month"
                        type="month"
                        size="mini"
                        value-format="yyyyMM"
                        placeholder="201908">
                    </el-date-picker>
                </aside>
                <aside class="StatementAnalysisReportConR">
                    <el-radio v-model="tableOrEcharts" label="1" @change="tableOrEchartsChange">表格</el-radio>
                    <el-radio v-model="tableOrEcharts" label="2" @change="tableOrEchartsChange">图表</el-radio>
                </aside>

            </div>
            <div class="StatementAnalysisReportConCon">
                <div id="indexEcharts"></div>
            </div>
            
        </section>
        <div class="StatementAnalysisReportPie" v-show="StatementAnalysisReport">
            <ul>
                <li v-for="(v, i) in ReportPies" :key="i" :id="v.id"></li>
            </ul>
        </div>
        <div class="StatementAnalysisReportTable" v-show="!StatementAnalysisReport">
            <h3 class="StatementAnalysisReportConTop">
                <span class="StatementAnalysisReportConL">{{tableTitle}}</span>
                <aside class="StatementAnalysisReportConR">
                    <el-radio v-model="tableOrEcharts" label="1" @change="tableOrEchartsChange">表格</el-radio>
                    <el-radio v-model="tableOrEcharts" label="2" @change="tableOrEchartsChange">图表</el-radio>
                </aside>
            </h3>
            <div class="kl-table" :style="{height: maxHeight + 'px'}">
             <el-table
                v-if="tableShow"
                :max-height="maxHeight"         
                stripe
                border
                :data="histroyData.list"
           
                class="StatementAnalysisReport-table">

                <!-- <el-table-column 
                    type="index"  label="NO."
                    width="50" 
                    fixed="left"
                    >
                </el-table-column> -->

                <el-table-column
                    prop="month"
                    min-width="100"
                    :label="tableLable">
                </el-table-column>
                
                <el-table-column
                    prop="current"
                    min-width="80"
                    :label="echartCategoryCustomLegend[0]">

                </el-table-column>

                <el-table-column
                    prop="samePeriod"
                    min-width="100"
                    :label="echartCategoryCustomLegend[1]">
                </el-table-column>
                                
                <el-table-column
                    prop="percent"
                    min-width="150"
                    :label="ChainType+'（%）'">

                </el-table-column>

                <!-- <el-table-column
                    prop="meterTime"
                    min-width="100"
                    label="换表日期">
                </el-table-column>

                <el-table-column
                    prop="peo"
                    min-width="100"
                    label="换表员">
                </el-table-column>

                <el-table-column
                    prop="getMeter"
                    min-width="80"
                    label="换表数量">
                </el-table-column>

                <el-table-column
                    prop="fixValue"
                    min-width="80"
                    label="完成数量">
                </el-table-column>

                <el-table-column
                    prop="fixValue"
                    min-width="80"
                    label="制单日期">

                </el-table-column>

                <el-table-column
                    prop="fixValue"
                    min-width="80"
                    label="制单人">
                </el-table-column> -->
                <!-- <el-table-column class="cell" label="操作" fixed="right" width="180">
                    <template slot-scope="scope">
                        <el-button type="text" @click="backfill(scope.$index, scope.row)">回填</el-button>
                        <span  >|</span>
                        <el-button type="text" class="noclick">审批</el-button>
                        <span  >|</span>
                        <el-button type="text">打印</el-button>
                        <span  >|</span>
                        <el-button type="text" class="noclick" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column> -->

                </el-table>
               
            </div>
             <!-- 分页 -->
                <!-- <div class="block">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="1"
                        :page-sizes="[20, 100, 500, 1000]"
                        :page-size="20"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="histroyData.total">
                    </el-pagination>
                </div> -->
        </div>
    </div>
</template>
<script>
export default {
    name:"StatementAnalysisReport",
    props:{
        areaShow:{
            type:Boolean,
            default:true
        }
    },
    data(){
        return{
            month:"",
            ManagementArea:"",
            ManagementAreaOptions:[],
            SelectionIndicatorsOptions:[],
            SelectionIndicators:"",
            AnalyticalApproach:"按时间同比",
            AnalyticalApproachOptions:[
                {
                    label:"按水司同比",
                    value:"按水司同比"
                },
                {
                    label:"按水司环比",
                    value:"按水司环比"
                },
                {
                    label:"按水司年累计同比",
                    value:"按水司年累计同比"
                },
                {
                    label:"按时间同比",
                    value:"按时间同比"
                },
                {
                    label:"按时间环比",
                    value:"按时间环比"
                },
            ],
            AnalyticalApproachOptions1:[
                {
                    label:"按时间同比",
                    value:"按时间同比"
                },
                {
                    label:"按时间环比",
                    value:"按时间环比"
                },
            ],
            tableOrEcharts:"2",
            ReportPies:[
                {
                    id:'selWater'
                },
                {
                    id:'caliberMeter'
                },
                {
                    id:'customers'
                },
                // {
                //     id:'customersEngineer'
                // },
                // {
                //     id:'waterPrice'
                // },
            ],
            StatementAnalysisReport:true,
            tableTitle:"",
            tableShow:false,
            maxHeight:0,
            histroyData:{
                
            },
            AreaPro:"1",
            areaAll: false,
            companyAll: false,
            checkedCities: ['江苏省', '广东省', '广西壮族自治区', '海南省'],
            cities: ['江苏省', '广东省', '广西壮族自治区', '海南省'],
            isIndeterminate: true,
            isCompanys:true,
            checkedCompanys:  ['宝应水司', '常平水司', '清溪水司', '丰顺水司','高邮水司','高州水司','南沙水司',
            '儋州滨海','儋州水司','梅州水务','汕头水司','遂溪水务','梧州水司','盱眙水司','仪征水司'],
            Companys: ['宝应水司', '常平水司', '清溪水司', '丰顺水司','高邮水司','高州水司','南沙水司',
            '儋州滨海','儋州水司','梅州水务','汕头水司','遂溪水务','梧州水司','盱眙水司','仪征水司'],
            choooseAreaConShow:false,
            xData: ['12月','11月','10月','9月','8月','7月','6月','5月','4月','3月','2月','1月'],
            seriesType:'line',
            tableLable:"月份",
            yData1:[120, 132, 101, 134, 90, 230, 210, 101, 134, 90, 230, 210],
            yData2:[220, 182, 191, 234, 290, 330, 310, 182, 191, 234, 290, 330],
            echartCategoryCustomLegend:['本期','同期'],
            ChainType:"同比",
            saleWaterData: [],
            caliberMeterData: [],
            customerData: []
        }
        
        
    },
    created(){
        this.month = this.common.date('month')
        this.getKpiUniqueTree()
    },
    mounted(){
        // this.customersEngineer();
        // this.waterPrice();
         //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
        if(!this.areaShow){
            this.AnalyticalApproachOptions = this.AnalyticalApproachOptions1;
            
        }
      
        this.common.changeTable(this,'.StatementAnalysisReport .kl-table',['.StatementAnalysisReport .block']);
        // this.refs.choooseAreaInput.addEventListener('click',function(event){
        // 　　 event=event||window.event;
        // this.choooseAreaConShow = true;
        // 　　event.stopPropagation();
        // })

        
       
      
    },
    methods:{
        getKpiUniqueTree() {
            const params = {
                busicode: 'KpiUniqueTree',
                data: 'callcenter'
            }
            this.$api.fetch({
                params
            }).then(res => {
                this.SelectionIndicatorsOptions = res
                this.SelectionIndicators = this.SelectionIndicatorsOptions[0].children[0].value
                this.$nextTick(() => {
                    const SelectionIndicators = this.$refs.cascader.getCheckedNodes(true)[0].label
                    this.tableTitle = SelectionIndicators + '-' + this.AnalyticalApproach;
                    this.echartCategoryCustom();
                    this.getPieCharData()
                })
                
            })
        },
        // 折线图
        async echartCategoryCustom(){
            const params = {
                busicode: 'NtelligentAnalysisLine',
                data: {
                    month: this.month,
                    kpiUnique: this.$refs.cascader.getCheckedNodes(true)[0].value
                }
            }
            const data = await this.$api.fetch({params})
            if(this.AnalyticalApproach === '按时间同比') {
                this.yData1 = data.yearOnYearChar.current
                this.yData2 = data.yearOnYearChar.samePeriod
                this.histroyData.list = data.yearOnYearTable
            } else {
                this.yData1 = data.monthOnMonthChar.current
                this.yData2 = data.monthOnMonthChar.samePeriod
                this.histroyData.list = data.monthOnMonthTable
            }
             let myChart = this.$echarts.init(document.getElementById('indexEcharts'))
                let option = {
                    title: {
                        text: this.tableTitle,
                        x:"center",
                        textStyle: {
                            fontWeight: "normal",
                            fontSize: 16
                        },
                    },
                    color:['#f77a76 ', '#66b5f0'],
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:this.echartCategoryCustomLegend,
                        y:"top",
                        x:"right"
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '8%',
                        // containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        // boundaryGap: false,
                        data:this.xData,
                        axisTick: {
                            alignWithLabel: true
                        }
                    },
                    yAxis: {
                        type: 'value',
                        // axisLabel:{
                        //     formatter:'{value} (万吨)'
                        // }
                    },
                    series: [
                        {
                            name:this.echartCategoryCustomLegend[0],
                            type:this.seriesType,
                            stack: '',
                            data:this.yData1,
                            lineStyle: {
                                width: 3 
                            },
                             barWidth: '20%',
                            // data:[120, 132, 101, 134, 90, 230, 210, 101, 134, 90, 230, 210],
                        },
                        {
                            name:this.echartCategoryCustomLegend[1],
                            type:this.seriesType,
                            stack: '',
                            data:this.yData2,
                            lineStyle: {
                                width: 3 
                            },
                             barWidth: '20%',
                            // data:[220, 182, 191, 234, 290, 330, 310, 182, 191, 234, 290, 330],
                        },

                    ]
                };

             myChart.setOption(option)
            window.addEventListener('resize', function () {
                myChart.resize()
            })
        },
        
        getPieCharData() {
            const params = {
                busicode: 'CallCenterChar',
                data: {
                    month: this.month,
                    kpiUnique: this.$refs.cascader.getCheckedNodes(true)[0].value
                }
            }
            this.$api.fetch({
                params
            }).then(res => {
                this.saleWaterData = res.complaintType;
                this.caliberMeterData = res.customerType;
                this.customerData = res.businessCount;
                this.selWater()
                this.caliberMeter()
                this.customers()
            })
        },
        
        // 投诉次数-按类型
        selWater(){
            let myChart = this.$echarts.init(document.getElementById('selWater'))
            let option = {
                title: {
                    text: '投诉次数-按类型',
                    x:'center',
                    textStyle: {
                        fontWeight: "normal",
                        fontSize: 14
                    },
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}：{c}(次) <br/>{a}：{d}%"
                },
                legend: {
                    type: 'scroll',
	        	    orient: 'vertical',
	            	show: true,
                    right: 0,
                    top: 20,
                    bottom: 20,
                    textStyle: {
                        fontSize: 12
                    },
                    data:(this.saleWaterData && this.saleWaterData.length > 0 ? this.saleWaterData.map(item => item.name) : [])
                },
                color:['#f77a76 ', '#66b5f0',  '#a1de8e',  '#98adff',   '#ffca64',   '#78d8cc'],
                series: [
                    {
                        name:'占比',
                        type:'pie',
                        radius: ['45%', '65%'],
                        // radius:'55%',
                        center:['40%','60%'],
                        avoidLabelOverlap: false,
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
                        data:this.saleWaterData
                    }
                ]
            };
            myChart.setOption(option)
            window.addEventListener('resize', function () {
                myChart.resize()
            })
    
        },
        // 投诉次数-按客户类型
        caliberMeter(){
            let myChart = this.$echarts.init(document.getElementById('caliberMeter'))
            let option = {
                title: {
                    text: '投诉次数-按客户类型',
                    x:'center',
                    textStyle: {
                        fontWeight: "normal",
                        fontSize: 14
                    },
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}：{c}(次) <br/>{a}：{d}%"
                },
                legend: {
                    type: 'scroll',
	        	    orient: 'vertical',
	            	show: true,
                    right: 0,
                    top: 20,
                    bottom: 20,
                    textStyle: {
                        fontSize: 12
                    },
                    data:(this.caliberMeterData && this.caliberMeterData.length > 0 ? this.caliberMeterData.map(item => item.name) : [])
                },
                color:[   '#ffca64',   '#78d8cc','#f77a76 ', '#66b5f0',  '#a1de8e',  '#98adff',],
                series: [
                    {
                        name:'占比',
                        type:'pie',
                        radius: ['45%', '65%'],
                        // radius:'55%',
                        center:['40%','60%'],
                        avoidLabelOverlap: false,
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
                        data:this.caliberMeterData
                    }
                ]
            };
            myChart.setOption(option)
            window.addEventListener('resize', function () {
                myChart.resize()
            })
    
        },
        // 业务数量-按类型
        customers(){
            let myChart = this.$echarts.init(document.getElementById('customers'))
            let option = {
                title: {
                    text: '业务数量-按类型',
                    x:'center',
                    textStyle: {
                        fontWeight: "normal",
                        fontSize: 14
                    },
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}：{c}(次) <br/>{a}：{d}%"
                },
                legend: {
                    type: 'scroll',
	        	    orient: 'vertical',
	            	show: true,
                    right: 0,
                    top: 20,
                    bottom: 20,
                    textStyle: {
                        fontSize: 12
                    },
                    data:(this.customerData && this.customerData.length > 0 ? this.customerData.map(item => item.name) : [])
                },
                color:['#f77a76 ', '#66b5f0',  '#a1de8e',  '#98adff',   '#ffca64',   '#78d8cc','#ccc','#fff664 '],
                series: [
                    {
                        name:'占比',
                        type:'pie',
                        radius: ['45%', '65%'],
                        // radius:'55%',
                        center:['40%','60%'],
                        avoidLabelOverlap: false,
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
                        data:this.customerData
                    }
                ]
            };
            myChart.setOption(option)
            window.addEventListener('resize', function () {
                myChart.resize()
            })
    
        },
        // 大客户、一般客户安装工程收入占比
        customersEngineer(){
            let myChart = this.$echarts.init(document.getElementById('customersEngineer'))
            let option = {
                title: {
                    text: '大客户、一般客户安装工程收入占比',
                    x:'center',
                    textStyle: {
                        fontWeight: "normal",
                        fontSize: 14
                    },
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}：{c}(万吨) <br/>{a}：{d}%"
                },
                legend: {
                    type: 'scroll',
	        	    orient: 'vertical',
	            	show: true,
                    right: 0,
                    top: 20,
                    bottom: 20,
                    textStyle: {
                        fontSize: 12
                    },
                    data:['居民','非居民','特种','区域']
                },
                color:['#f77a76 ', '#66b5f0',  '#a1de8e',  '#98adff',   '#ffca64',   '#78d8cc'],
                series: [
                    {
                        name:'占比',
                        type:'pie',
                        radius: ['50%', '70%'],
                        // radius:'55%',
                        center:['40%','60%'],
                        avoidLabelOverlap: false,
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
                            {value:335, name:'居民'},
                            {value:310, name:'非居民'},
                            {value:234, name:'特种'},
                            {value:135, name:'区域'},
           
                        ]
                    }
                ]
            };
            myChart.setOption(option)
            window.addEventListener('resize', function () {
                myChart.resize()
            })
    
        },
        // 各类水费收入占比
        waterPrice(){
            let myChart = this.$echarts.init(document.getElementById('waterPrice'))
            let option = {
                title: {
                    text: '各类水费收入占比',
                    x:'center',
                    textStyle: {
                        fontWeight: "normal",
                        fontSize: 14
                    },
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}：{c}(万吨) <br/>{a}：{d}%"
                },
                legend: {
                    type: 'scroll',
	        	    orient: 'vertical',
	            	show: true,
                    right: 0,
                    top: 20,
                    bottom: 20,
                    textStyle: {
                        fontSize: 12
                    },
                    data:['居民','非居民','特种','区域']
                },
                color:['#f77a76 ', '#66b5f0',  '#a1de8e',  '#98adff',   '#ffca64',   '#78d8cc'],
                series: [
                    {
                        name:'占比',
                        type:'pie',
                        radius: ['50%', '70%'],
                        // radius:'55%',
                        center:['40%','60%'],
                        avoidLabelOverlap: false,
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
                            {value:335, name:'居民'},
                            {value:310, name:'非居民'},
                            {value:234, name:'特种'},
                            {value:135, name:'区域'},
           
                        ]
                    }
                ]
            };
            myChart.setOption(option)
            window.addEventListener('resize', function () {
                myChart.resize()
            })
    
        },
        // 显示图标还是表格
        tableOrEchartsChange(val){
            if(val==="1"){
                this.StatementAnalysisReport = false;
                 if(this.AnalyticalApproach.startsWith('按时间')){
                    this.tableLable = "月份";
                }else{
                    this.tableLable = "水司名称";
                }
            }else{
                this.StatementAnalysisReport = true;
            }
            
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
        SelectionIndicatorsHandle(val){
            const SelectionIndicators = this.$refs.cascader.getCheckedNodes(true)[0].label
            this.tableTitle = SelectionIndicators + '-' + this.AnalyticalApproach;

            this.echartCategoryCustom();
            this.getPieCharData()
        },
        AnalyticalApproachHandle(val){
            this.tableTitle = this.SelectionIndicators+'-'+val;
            if(val.startsWith('按水司')){
                this.xData = ['宝应', '常平', '清溪', '丰顺','高邮','高州','南沙',
                '儋州滨海','儋州','梅州水','汕','遂溪','梧州','盱眙','仪征'];
            }else{
                this.xData=['12月','11月','10月','9月','8月','7月','6月','5月','4月','3月','2月','1月'];
            }
            if(val.endsWith('环比')){
                this.seriesType = 'bar';
                this.echartCategoryCustomLegend = ['本期','上期'];
                this.ChainType = "环比";
            }else{
                this.seriesType = 'line';
                this.echartCategoryCustomLegend = ['本期','同期'];
                this.ChainType = "同比";
            }
            this.echartCategoryCustom();
        },
        areaAllChange(val) {
            this.checkedCities = val ? this.cities : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.areaAll = checkedCount === this.cities.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
        },
        companyAllChange(val) {
            this.checkedCompanys = val ? this.Companys : [];
            this.isCompanys = false;
        },
        handleCheckedCompanysChange(value) {
            let checkedCount = value.length;
            // this.companyAll = checkedCount === this.Companys.length;
            // this.isIndeterminate = checkedCount > 0 && checkedCount < this.Companys.length;
        },
        area(val){
            if(val==="2"){
                this.checkedCities= ['梅州片区', '常平片区', '肇庆片区', '梧州片区','儋州片区','湛江片区','清溪水司',
                '宝应水司','高邮水司','仪征水司','南沙水司','徐州供水','盱眙水司','汕头水司','盐城水务'];
                this.cities= ['梅州片区', '常平片区', '肇庆片区', '梧州片区','儋州片区','湛江片区','清溪水司',
                '宝应水司','高邮水司','仪征水司','南沙水司','徐州供水','盱眙水司','汕头水司','盐城水务'];
            }else{
                this.checkedCities= ['江苏省', '广东省', '广西壮族自治区', '海南省'];
                this.cities= ['江苏省', '广东省', '广西壮族自治区', '海南省'];
            }
        },
        areashowWay(event){
            // this.choooseAreaConShow = true;
            let area = document.getElementsByClassName('choooseAreaCon')
            let areaCon = document.getElementsByClassName('choooseAreaCon')
            event=event||window.event;
            areaCon[0].style.display = "block";
        　　event.stopPropagation();
            document.addEventListener('click',function(event){
                
            　　event=event||window.event;
                // this.choooseAreaConShow = false;
                areaCon[0].style.display = "none";
            　　event.stopPropagation();
      
            })
            area[0].addEventListener('click',function(event){
            　　event=event||window.event;
                // this.choooseAreaConShow = true;
                areaCon[0].style.display = "block";
            　　event.stopPropagation();
            })
     
            
        }

    },
    watch:{
        maxHeight(){
            this.tableShow = false
            this.$nextTick(()=>{
            this.tableShow = true
            })
        },
    },

}
</script>
<style lang="scss">
@import "../../assets/styles/scss/base/fn";
$theme-color:#297acc;
.StatementAnalysisReport{
    width: 100%;
    height: 100%;
    .StatementAnalysisReportCon,.StatementAnalysisReportTable{
        width: 100%;
        height: 60%;
        .StatementAnalysisReportConTop{
            width: calc(100% - 30px);
            height: 50px;
            zoom: 1;
            border-bottom:5px solid #eaf4ff;
            padding:10px 15px;
            z-index: 15;
            &:after{
                @include _clearBoth()
            }
            .StatementAnalysisReportConL{
                float: left;
                .el-date-editor{
                    width: 160px !important;
                }
                .el-select-dropdown__item{
                    height: auto !important;
                }
                .el-select,.el-cascader{
                    margin-right: 15px;
                    width: auto;
                }
                .choooseArea{
                    position: relative;
                    display: inline-block;
                    background: #fff;
                    .arrowIcon{
                        position: absolute;
                        top: 8px;
                        right: 10px;
                        font-size: 14px;
                        color: #C0C4CC;
                    }
                    .areaTriangle::before,.areaTriangle::after{
                        display: block;
                        content: '';
                        position: absolute;
                        left: 15px;
                        top: -15px;
                        width: 0;
                        height:0;
                        border: 8px solid transparent;
                        z-index: 1122;
                    }
                    
                    .areaTriangle:before{
                        border-bottom-color:rgba(0,0,0,0.5);
                    }
                    .areaTriangle:after{
                        border-bottom-color:#fff;
                    }
                     .companyTriangle::before,.companyTriangle::after{
                        display: block;
                        content: '';
                        position: absolute;
                        left: 162px;
                        top: 15px;
                        width: 0;
                        height:0;
                        border: 8px solid transparent;
                        z-index: 1122;
                    }
                    
                    .companyTriangle:before{
                        border-right-color:rgba(0,0,0,0.5);
                    }
                    .companyTriangle:after{
                        border-right-color:#fff;
                    }
                    .choooseAreaCon{
                        position:absolute;
                        background: #fff;
                        top: 38px;
                        left: 0px;
                        width: 350px;
                        display: none;
                        z-index:111;
                        zoom: 1;
                        &:after{
                            @include _clearBoth()
                        }
                        .AreaL{
                            float: left;
                            border:1px solid #E4E7ED;
                            margin-right: 15px;
                            width: 140px;
                        }
                        .AreaR{
                            float:left;
                            border:1px solid #E4E7ED;
                            width: 140px;
                        }
                        .AreaL,.AreaR{
                            padding:10px;
                            height: 350px;
                            overflow: auto;
                            h4{
                                margin-bottom: 5px;
                            }
                            .el-checkbox{
                                width: 100%;
                                margin-right: 0px;
                            }
                        }
                    }
                }
            }
            .StatementAnalysisReportConR{
                float: right;
                height: 30px;
                line-height: 30px;
            }
        }
        .StatementAnalysisReportConCon{
            width: calc(100% - 30px);
            padding: 0 15px;
            height: calc(100% - 50px);
            #indexEcharts{
                width: 100%;
                height: 100%;
            }
        }
        
    }
    .StatementAnalysisReportPie{
        width: 100%;
        height: 40%;
        ul{
            width: 100%;
            height:100%;
            background: #eaf4ff;
            li{
                float:left;
                width: calc(33.3% - 10px);
                height: calc(100% - 25px);
                background: #fff;
                margin: 10px 5px 5px 5px;
                padding:5px 0px;
                text-align: center;
            }
        }
    }
    .StatementAnalysisReportTable{
        width: 100%;
        height: 100%;
        .StatementAnalysisReportConTop{
            span{
                font-size: 16px;
                line-height: 30px;
            }
        }
        .kl-table{
            width: calc(100% - 20px);
            height:calc(100% - 20px);
            padding:10px;
        }
    }
}
</style>

