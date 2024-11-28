<template>
    <div class="echartsDetails">
        <!-- <div class="echartsDetailsTop">
            <el-select v-model="WaterDivision" placeholder="请选择水司">
                <el-option
                v-for="item in WaterDivisionOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value">
                </el-option>
            </el-select>
        </div>
        <section class="echartsDetailsCon">
            <div id="pie"></div>
            <div id="WaterSaless"></div>
        </section> -->
        <div class="echartsDetailsCon">
            <el-checkbox-group 
                v-model="checkedCities1"
                :min="1"
                :max="7">
                <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
            </el-checkbox-group>
        </div>
    </div>
</template>
<script>
export default {
    name:"echartsDetails",
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
            checkedCities1: [],
            cities: ['售水量','收入','水费回收率','报装业务及时率','投诉及时率','售水服务及时率','用户总数']
        }
    },
    mounted(){
        // this.echartPieCustom();
        // this.echartCategoryCustom();
    },
    methods:{
        // 饼图--呼叫中心
        echartPieCustom(){
             let myChart = this.$echarts.init(document.getElementById('pie'))
            let option = {
                title: {
                    text: this.echartName,

                    x:'center',
                    textStyle: {
                        fontWeight: "normal",
                        fontSize: 14
                    },
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'horizontal',
                    y: 'bottom',
                    data:['咨询','投诉','建议','需求']
                },
                series: [
                    {
                        name:'占比',
                        type:'pie',
                        // radius: ['50%', '70%'],
                        radius:'55%',
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
                            {value:335, name:'咨询'},
                            {value:310, name:'投诉'},
                            {value:234, name:'建议'},
                            {value:135, name:'需求'},
           
                        ]
                    }
                ]
            };
            myChart.setOption(option)
            window.addEventListener('resize', function () {
                myChart.resize()
            })
    
        },
        // 售水量
        echartCategoryCustom(){
             let myChart = this.$echarts.init(document.getElementById('WaterSaless'))
                let option = {
                    title: {
                        text:this.echartName,
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
                        data:[this.echartName,`同比${this.echartName}`],
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
                        axisLabel:{
                            formatter:'{value}' 
                        }
                    },
                    series: [
                        {
                            name:this.echartName,
                            type:'line',
                            stack: '总量',
                            data:[120, 132, 101, 134, 90, 230, 210, 101, 134, 90, 230, 210]
                        },
                        {
                            name:`同比${this.echartName}`,
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
    },
    watch:{
        // echartName(newval){
        //     if(newval==="售水量"){
        //         this.Company = '(万吨)'
        //     }else{
        //         this.Company = '%'
        //     }
        // }
    }
}
</script>
<style lang="scss">
.echartsDetails{
    
    width: 100%;
    height: 90%;
    .echartsDetailsTop{
        padding:10px 0px 0px 20px;
        height: 30px;
        .el-input__icon{
            line-height: 28px;
        }
    }
    .echartsDetailsCon{
        width: 100%;
        height: calc(100% - 50px);
        margin:10px auto;
        // & > div{
        //     width: 100%;
        //     height: 50%;
        // }
        .el-checkbox-group{
            padding:10px;
            width: calc(100% - 20px);
            height:  calc(100% - 30px);
        }
    }
}
</style>
