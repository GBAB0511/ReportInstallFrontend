
<template>
    <div class="echartsWaterSales">
        <div class="echartsWaterSalesTop">
            <el-select v-model="WaterDivision" placeholder="请选择水司">
                <el-option
                v-for="item in WaterDivisionOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value">
                </el-option>
            </el-select>
        </div>
        <section class="echartsWaterSalesCon" v-show="echartName==='售水量'">
            <ol>
                <li id="WaterSalessCategory"></li>
                <li id="WaterSalessPie"></li>
            </ol>
        </section>
        <section class="echartsWaterSalesCon" v-show="echartName==='业务办理'">
            <ol>
                <li id="RevenueBusinessCategory"></li>
                <li id="RevenueBusinessPie"></li>
            </ol>
        </section>
        <section class="echartsWaterSalesCon" v-show="echartName==='呼叫中心'">
            <ol>
                <li id="callCenterCategory"></li>
                <li id="callCenterPie"></li>
            </ol>
        </section>
        <section class="echartsWaterSalesCon" v-show="echartName==='收入'">
            <ol>
                <li id="userCategory"></li>
                <li id="payPie"></li>
            </ol>
        </section>
    </div>
</template>
<script>
export default {
    name:"echartsWaterSales",
    props:{
        echartName:{
            default:"",
            type:String
        }
    },
    data(){
        return{
            WaterDivision:"1",
            WaterDivisionOptions:[
                {
                    name:"南沙",
                    value:"1"
                },
                {
                    name:"梧州",
                    value:"2"
                },
                {
                    name:"肇庆",
                    value:"3"
                },
                {
                    name:"高州",
                    value:"4"
                },
                {
                    name:"梅州",
                    value:"5"
                },
                {
                    name:"清溪",
                    value:"6"
                },
                {
                    name:"水司1",
                    value:"7"
                },
                {
                    name:"水司2",
                    value:"8"
                },
                {
                    name:"水司3",
                    value:"9"
                },
                {
                    name:"水司4",
                    value:"10"
                },
                {
                    name:"水司5",
                    value:"11"
                },
                {
                    name:"水司6",
                    value:"12"
                },
                {
                    name:"水司7",
                    value:"13"
                },
                {
                    name:"水司8",
                    value:"14"
                },
                {
                    name:"水司9",
                    value:"15"
                },
                {
                    name:"水司10",
                    value:"16"
                },
                {
                    name:"水司11",
                    value:"17"
                },
                {
                    name:"水司12",
                    value:"18"
                },
            ],   
            Company:"",
            WaterSalessShow:true,
            RevenueBusinessShow:false,
            callCenterShow:false,
            name:this.echartName,
            echartPieCustomTitle:"售水量-按用水类型",
            echartPieCustomLegend:['居民','非居民','特种','区域','原水'],
            echartPieCustomData:[
                            {value:335, name:'居民'},
                            {value:310, name:'非居民'},
                            {value:234, name:'特种'},
                            {value:135, name:'区域'},
                            {value:310, name:'原水'},
           
                        ],
            echartCategoryCustomTitlt:'售水总量 (万吨)',
            echartCategoryCustomYData1:[120, 132, 101, 134, 90, 230, 210, 101, 134, 90, 230, 210],
            echartCategoryCustomYData2:[220, 182, 191, 234, 290, 330, 310, 182, 191, 234, 290, 330],
            echartPieCustom1Title:'售水收入-按用水类型',
            echartPieCustom1Legend: ['居民','非居民','特种','区域','原水'],
            echartPieCustom1Data:
             [
                        {value:135, name:'原水'},
                        {value:410, name:'居民'},
                        {value:310, name:'非居民'},
                        {value:234, name:'特种'},
                        {value:135, name:'区域'},

                    ],
            echartPieCustom1Data2:[],
            echartPayTitle:'售水收入',
            echartPayLegend:['本期','同期'],
            echartPayYData1:[20, 32, 11, 14, 90, 20, 20, 11, 14, 90, 20, 23],
            echartPayYData2:[20, 32, 1, 34, 9, 30, 10, 1, 34, 9, 3, 10],
             RevenueBusiness:"大客户业务办理及时率",
            RevenueBusinessOptions:[
                {
                    label:"业务办理总数",
                    value:"业务办理总数"
                },
                {
                    label:"大客户业务办理次数",
                    value:"大客户业务办理次数"
                },
                {
                    label:"业务办理及时率",
                    value:"业务办理及时率"
                },
                {
                    label:"大客户业务办理及时率",
                    value:"大客户业务办理及时率"
                },
            ],
            echartbusinessTitle:'大客户业务办理及时率（%）',
            echartbusinessLegend:['本期','同期'],
            echartbusinessYData1:[80, 232, 171, 174, 90, 100],
            echartbusinessYData2:[120, 12, 11, 114, 90, 230],
            echartchannelTitle:'大客户业务办理及时率',
            echartchannelLegend:['柜台','微厅','网厅','智慧营业厅'],
            echartchannelData:
            [
                {value:335, name:'柜台'},
                {value:310, name:'微厅'},
                {value:234, name:'网厅'},
                {value:135, name:'智慧营业厅'},
            ],
            callCenter:"大客户投诉处理及时率",
            callCenterOptions:[
                {
                    label:"总投诉次数",
                    value:"总投诉次数"
                },
                {
                    label:"大客户投诉次数",
                    value:"大客户投诉次数"
                },
                {
                    label:"投诉处理及时率",
                    value:"投诉处理及时率"
                },
                {
                    label:"大客户投诉处理及时率",
                    value:"大客户投诉处理及时率"
                },
                {
                    label:"呼叫中心业务总量",
                    value:"呼叫中心业务总量"
                },
            ],
            categoryTitle:'大客户投诉处理及时率（%）',
            categoryYData1:[80, 232, 171, 174, 90, 100],
            categoryYData2:[120, 12, 11, 114, 90, 230],
            echartPieCustom2Title:'大客户投诉处理及时率',
            echartPieCustom2Legend:['水质','水压','其他'],
            echartPieCustom2Data:
            [
                {value:335, name:'水质'},
                {value:310, name:'水压'},
                {value:234, name:'其他'},
            ],
        }
    },
    mounted(){
        this.echartsChange(); 
        
    },
    methods:{
        // 饼图--用水类型
        echartPieCustom(){
             let myChart = this.$echarts.init(document.getElementById('WaterSalessPie'))
            let option = {
                title: {
                    text: this.echartPieCustomTitle,
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
                    data:this.echartPieCustomLegend
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
                        data:this.echartPieCustomData
                    }
                ]
            };
            myChart.setOption(option)
            window.addEventListener('resize', function () {
                myChart.resize()
            })
    
        },
         // 饼图--缴费方式

        echartPieCustom1(){
             let myChart = this.$echarts.init(document.getElementById('payPie'))
            let option = {
                title: {
                    text: this.echartPieCustom1Title,

                    x:'center',
                    textStyle: {
                        fontWeight: "normal",
                        fontSize: 14
                    },
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}：{c} <br/>{a}：{d}%"
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
                    data:this.echartPieCustom1Legend
                },
                color:['#f77a76 ', '#66b5f0',  '#a1de8e',  '#98adff',   '#ffca64',   '#78d8cc'],
                series: [
                    {
                        name:'占比',
                        type:'pie',
                        radius: ['40%', '60%'],
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
                        data:this.echartPieCustom1Data
                    }
                ],
                // series : [
                //    {
                //         name:'缴费占比',
                //         type:'pie',
                //         radius : [20, 80],
                //         center : ['50%', '50%'],
                //         roseType : 'radius',
                //         label: {
                //             normal: {
                //                 show: false
                //             },
                //             emphasis: {
                //                 show: true
                //             }
                //         },
                //         lableLine: {
                //             normal: {
                //                 show: false
                //             },
                //             emphasis: {
                //                 show: true
                //             }
                //         },
                //         data:[
                //             {value:335, name:'现场缴费'},
                //             {value:310, name:'支付宝'},
                //             {value:234, name:'微信'},
                //             {value:135, name:'代扣'},
                //             {value:234, name:'托收'},
                //             {value:135, name:'第三方'},
           
                //         ]
                //     },
                // ]
            };
            myChart.setOption(option)
            window.addEventListener('resize', function () {
                myChart.resize()
            })
    
        },
        // 售水量
        echartCategoryCustom(){
             let myChart = this.$echarts.init(document.getElementById('WaterSalessCategory'))
                let option = {
                    title: {
                        text: '售水量(万吨)',
                        x:"center",
                        textStyle: {
                            fontWeight: "normal",
                            fontSize: 14
                        },
                    },
                    color:['#f77a76 ', '#66b5f0'],
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['本期','同期'],
                        y:"bottom"
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '10%',
                        containLabel: true
                    },
                    // toolbox: {
                    //     feature: {
                    //         saveAsImage: {}
                    //     }
                    // },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['12月','11月','10月','9月','8月','7月','6月','5月','4月','3月','2月','1月']
                    },
                    yAxis: {
                        type: 'value',
                        // axisLabel:{
                        //     formatter:'{value} '
                        // }
                    },
                    series: [
                        {
                            name:'本期',
                            type:'line',
                            stack: '总量',
                            data:[120, 132, 101, 134, 90, 230, 210, 101, 134, 90, 230, 210]
                        },
                        {
                            name:'同期',
                            type:'line',
                            stack: '',
                            data:[220, 182, 191, 234, 290, 330, 310, 182, 191, 234, 290, 330]
                        },
                        // {
                        //     name:'已收水费',
                        //     type:'line',
                        //     stack: '总量',
                        //     data:[150, 232, 201, 154, 190, 330, 410]
                        // },
                        // {
                        //     name:'售水总金额',
                        //     type:'line',
                        //     stack: '总量',
                        //     data:[320, 332, 301, 334, 390, 330, 320]
                        // }
                    ]
                };

             myChart.setOption(option)
            window.addEventListener('resize', function () {
                myChart.resize()
            })
        },
        // 收入
     
        echartPay(){
             let myChart = this.$echarts.init(document.getElementById('userCategory'))
                let option = {
                    title: {
                        text:this.echartPayTitle ,
                        x:"center",
                        textStyle: {
                            fontWeight: "normal",
                            fontSize: 14
                        },
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:this.echartPayLegend,
                        y:"bottom"
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '10%',
        
                        containLabel: true
                    },
                    color:['#f77a76 ', '#66b5f0',  '#a1de8e',  '#98adff',   '#ffca64',   '#78d8cc'],

                    // toolbox: {
                    //     feature: {
                    //         saveAsImage: {}
                    //     }
                    // },
                    xAxis: {
                        type: 'category',
                        data: ['12月','11月','10月','9月','8月','7月','6月','5月','4月','3月','2月','1月'],
                        axisTick: {
                            alignWithLabel: true
                        }
                    },
                    yAxis: {
                        // type: 'value',
                        // axisLabel:{
                        //     formatter:'{value}%'
                        // }
                    },
                    series: [
                        {
                            name:'本期',
                            type:'line',
                
                            data:this.echartPayYData1,
                            lineStyle: {
                                width: 3 
                            },
                        },
                        {
                            name:'同期',
                            type:'line',
                
                            data:this.echartPayYData2,
                            lineStyle: {
                                width: 3 
                            },
                        },
                        // {
                        //     name:'应收水费',
                        //     type:'line',
                        //     stack: '总量',
                        //     data:[220, 182, 191, 234, 290, 330, 310]
                        // },
                        // {
                        //     name:'已收水费',
                        //     type:'line',
                        //     stack: '总量',
                        //     data:[150, 232, 201, 154, 190, 330, 410]
                        // },
                        // {
                        //     name:'售水总金额',
                        //     type:'line',
                        //     stack: '总量',
                        //     data:[320, 332, 301, 334, 390, 330, 320]
                        // }
                    ]
                };

             myChart.setOption(option)
            window.addEventListener('resize', function () {
                myChart.resize()
            })
        },
        // 折线图--大客户业务办理及时率
        echartbusiness(){
             let myChart = this.$echarts.init(document.getElementById('RevenueBusinessCategory'));
            let option = {
                title : {
                    text: '大客户业务办理及时率（%）',
                    x:'center',
                    textStyle: {
                        fontWeight: "normal",
                        fontSize: 14
                    },
                },
                color:['#f77a76 ', '#66b5f0',  '#a1de8e',  '#98adff',   '#ffca64',   '#78d8cc'],
              
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    orient: 'horizontal',
                    y: 'bottom',
                    data:['本期','同期'],
                    itemWidth: 50, 
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '20%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        // data : ['南沙', '梧州', '高州', '梅州', '肇庆', '清溪', '水司1',
                        // '水司2', '水司3', '水司4', '水司5', '水司6', '水司7', '水司8',
                        // '水司9', '水司10', '水司11', '水司12', '水司13', '水司14', '水司15'],
                        // data: ['12月','11月','10月','9月','8月','7月','6月','5月','4月','3月','2月','1月'],
                        data: ['12月','11月','10月','9月','8月','7月'],

                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        // axisLabel:{
                        //     formatter:'{value}（次）'
                        // }
                        
                    }
                ],
                series : [
                    {
                        name:'本期',
                        type:'line',
                        // barWidth: '20%',
                        // data:[80, 132, 101, 134, 90, 100, 70, 101, 134, 90, 130, 110],
                        data:[80, 232, 171, 174, 90, 100],
                        lineStyle: {
                                width: 3 
                            },

                        // itemStyle:{
                        //     color:'#C33531'
                        // }

                        // data:[105, 52, 200, 334, 390, 330, 220,
                        // 100, 82, 200, 334, 390, 330, 220,
                        // 100, 82, 200, 334, 390, 330, 220]
                    },
                    {
                        name:'同期',
                        type:'line',
                        // barWidth: '20%',
                        data:[120, 12, 11, 114, 90, 230],
                        lineStyle: {
                                width: 3 
                            },
                   
                    },


                ]
            };
            myChart.setOption(option)
            window.addEventListener('resize', function () {
                myChart.resize()
            })


        },
        // 饼图--业务办理渠道

        echartchannel(){
             let myChart = this.$echarts.init(document.getElementById('RevenueBusinessPie'))
            let option = {
                title: {
                    text: this.echartchannelTitle,

                    x:'center',
                    textStyle: {
                        fontWeight: "normal",
                        fontSize: 14
                    },
                },
                tooltip: {
                    trigger: 'item',
                    formatter:  "{b}：{c}(次) <br/>{a}：{d}%"
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
                    data:this.echartchannelLegend
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
                        data:this.echartchannelData
                    }
                ]
            };
            myChart.setOption(option)
            window.addEventListener('resize', function () {
                myChart.resize()
            })
    
        },
        // 饼图--投诉类型
        echartPieCustom2(){
             let myChart = this.$echarts.init(document.getElementById('callCenterPie'))
            let option = {
                title: {
                    text: '呼叫中心业务数量-按类型',

                    x:'center',
                    textStyle: {
                        fontWeight: "normal",
                        fontSize: 14
                    },
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}：{c} <br/>{a}：{d}%"
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
                    data:['咨询','用水申请','报修报漏','举报','服务投诉','应急','表杨','其它']
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
                            {value:135, name:'咨询'},
                            {value:410, name:'用水申请'},
                            {value:335, name:'报修报漏'},
                            {value:310, name:'举报'},
                            {value:234, name:'服务投诉'},
                            {value:24, name:'应急'},
                            {value:310, name:'表杨'},
                            {value:135, name:'其它'},
                        ]
                    }
                ]
            };
            myChart.setOption(option)
            window.addEventListener('resize', function () {
                myChart.resize()
            })
    
        },
        TimelinessComplaints(){
            let myChart = this.$echarts.init(document.getElementById('callCenterPie'))
            let option = {
                title: {
                    text:this.echartPieCustom2Title ,
                    x:"center",
                    textStyle: {
                        fontWeight: "normal",
                        fontSize: 14
                    },
                },
                tooltip : {
                    formatter: "{a} <br/>{b} : {c}%"
                },
                // toolbox: {
                //     feature: {
                //         restore: {},
                //         saveAsImage: {}
                //     }
                // },
                series: [
                    {
                        name: this.echartPieCustom2Title,
                        type: 'gauge',
                        detail: {formatter:'{value}%'},
                        data: [{value: 50, name: ''}]
                    }
                ]
                
            };
            myChart.setOption(option)
            window.addEventListener('resize', function () {
                myChart.resize()
            })
        },
        // 折线图--投诉
        category(){
             let myChart = this.$echarts.init(document.getElementById('callCenterCategory'));
            let option = {
                title : {
                    text: '呼叫中心业务总量(次)',
                    x:'center',
                    textStyle: {
                        fontWeight: "normal",
                        fontSize: 14
                    },
                },
                color: ['#3398DB'],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                color:['#f77a76 ', '#66b5f0',  '#a1de8e',  '#98adff',   '#ffca64',   '#78d8cc'],

                legend: {
                    orient: 'horizontal',
                    y: 'bottom',
                    data:['本期','同期'],
                    itemWidth: 50, 
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '20%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        // data : ['南沙', '梧州', '高州', '梅州', '肇庆', '清溪', '水司1',
                        // '水司2', '水司3', '水司4', '水司5', '水司6', '水司7', '水司8',
                        // '水司9', '水司10', '水司11', '水司12', '水司13', '水司14', '水司15'],
                        // data: ['12月','11月','10月','9月','8月','7月','6月','5月','4月','3月','2月','1月'],
                        data: ['12月','11月','10月','9月','8月','7月'],

                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        // axisLabel:{
                        //     formatter:'{value}（次）'
                        // }
                    }
                ],
                series : [
                    {
                        name:'本期',
                        type:'line',
                        // barWidth: '20%',
                        // data:[80, 132, 101, 134, 90, 100, 70, 101, 134, 90, 130, 110],
                        data:[80, 232, 171, 174, 90, 100],
                        lineStyle: {
                                width: 3 
                            },

                        // itemStyle:{
                        //     color:'#C33531'
                        // }

                        // data:[105, 52, 200, 334, 390, 330, 220,
                        // 100, 82, 200, 334, 390, 330, 220,
                        // 100, 82, 200, 334, 390, 330, 220]
                    },
                    {
                        name:'同期',
                        type:'line',
                        // barWidth: '20%',
                        data:[120, 12, 11, 114, 90, 230],
                        lineStyle: {
                                width: 3 
                            },
                      
                    },
        

                ]
            };
            myChart.setOption(option)
            window.addEventListener('resize', function () {
                myChart.resize()
            })


        },
        // 业务办理及时率仪表盘
        Timeliness(){
            let myChart = this.$echarts.init(document.getElementById('RevenueBusinessPie'))
            let option = {
                title: {
                    text:this.echartchannelTitle ,
                    x:"center",
                    textStyle: {
                        fontWeight: "normal",
                        fontSize: 14
                    },
                },
                tooltip : {
                    formatter: "{a} <br/>{b} : {c}%"
                },
                // toolbox: {
                //     feature: {
                //         restore: {},
                //         saveAsImage: {}
                //     }
                // },
                series: [
                    {
                        name: this.echartchannelTitle,
                        type: 'gauge',
                        detail: {formatter:'{value}%'},
                        data: [{value: 50, name: ''}]
                    }
                ]
                
            };
            myChart.setOption(option)
            window.addEventListener('resize', function () {
                myChart.resize()
            })
        },
        echartsChange(){
            if(this.echartName==='售水量'){
                this.echartPieCustom();
                this.echartCategoryCustom();
                
            }else if (this.echartName==='业务办理'){
                this.echartbusiness();
                // this.echartchannel();
                this.Timeliness();
            }else if(this.echartName==='呼叫中心'){
                this.echartPieCustom2();
                // this.TimelinessComplaints();
                this.category(); 
            }else{
                this.echartPieCustom1();
                this.echartPay();
            }
            
            
            
            
            
        }
    },

}
</script>
<style lang="scss">
.echartsWaterSales{
    
    width: 100%;
    height: 100%;
    .echartsWaterSalesTop{
        // padding:10px 0px 0px 20px;
        height: 30px;
        margin-bottom: 10px;
        .el-input__icon{
            line-height: 28px;
        }
    }
    .echartsWaterSalesCon{
        width: calc(100% - 22px);
        height: calc(100% - 70px);
        padding:10px;
        ol{
            width: 100%;
            height: 100%;
            zoom: 1;
            &::after{
                content:"";
                display: block;
                clear: both;
            }
            & > li{
                float: left;
                width: 50%;
                height:calc(90% - 15px);
                margin-top: 15px;
            }
            & > li:nth-of-type(1),& > li:nth-of-type(2){
                margin-bottom: 15px;
                margin-top:0px;
            }
        }

    }
    .echartsRevenueBusinessCon{
        width: calc(100% - 22px);
        height: calc(100% - 70px);
        padding:10px;
        ol{
            width: 100%;
            height: 100%;
            li{
                width: 100%;
                height: 50%;
            }
        }
    }
}
</style>
