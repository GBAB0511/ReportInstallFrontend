<template>
    <div class="deviceDialog">
        <!-- 设备编号 大厅编码选择 -->
        <el-dialog :modal-append-to-body="false" width="450px" height="400px" title="设备选择" :destroy-on-close="true" :close-on-click-modal="false"
            :visible.sync="equipmentVisible" @close="closeDialog()">
            <div style="font-size: 16px; padding: 10px 0px 20px; text-align: center;">
                <label for="device-number">窗口编号：</label>
                <el-select style="width:70%;" id="device-number" v-model="deviceNumber" placeholder="请选择窗口编号">
                    <el-option v-for="item in deviceArr" :key="item.id" :value="item.windowNo" :name="item.windowNo"></el-option>
                </el-select>
            </div>
            <div style="font-size: 16px; padding: 10px 0px 20px; text-align: center;">
                <label for="hall-code">大厅编码：</label>
                <el-input style="width:70%;" v-model="TNo" disabled></el-input>
            </div>
            <div style="text-align: center;">
                <el-button type="primary" @click="determiningDevice()">确定</el-button>
                <!-- <el-button type="info" @click="closeDialog()">取消</el-button> -->
            </div>
        </el-dialog>
    </div>
</template>
  
<script>
// import { getToken } from 'api/qiniu'

export default {
    name: 'deviceDialog',
    props: ['customerData'],
    data() {
        return {
            useType:false,
            deviceNumber: '',
            deviceArr:[],
            TNo:'',
            equipmentVisible: false,
        }
    },
    mounted(){
        this.getUserConfig()
    },
    watch:{
        deviceNumber(){
           for(let i=0;i<this.deviceArr.length;i++){
            if(this.deviceArr[i].windowNo==this.deviceNumber){
                this.TNo=this.deviceArr[i].hallCode
            }
           }
        }
    },
    methods: {
        getUserConfig(){
            var _this = this;
            var params = {
                busicode: "ConfigList",
                data: {
                    page:1,
                    pageCount:50,
                    searchContent:"EVALUATION_STATUS",
                    status:''   
                } // 收费方式,锁标记
            };
            this.$api
                .fetch({
                params: params //参数
                })
                .then(res => {
                    console.log(res.list);
                    if(res.list.length>0){
                        if(res.list[0].configValue==1){
                            this.useType=true
                            this.getDeviceSelect()
                        }else{
                            this.useType=false
                        }
                    }
                });
        },
        getDeviceSelect(){
            let params = {
                busicode: "DeviceSelect",
                data: {
                }
            };
            this.$api
                .fetch({
                    params
                })
                .then(res => {
                    this.deviceArr=res
                })
        },
        determiningDevice() {
            localStorage.setItem('windowNo',this.deviceNumber)
            localStorage.setItem('hallCode',this.TNo)
            if(this.useType==false){
                eventBus.$emit('deviceSbumit')
                return
            }
            console.log(this.customerData);
            let params = {
                busicode: "EvaluationSend",
                data: {
                    "departmentCode": "12441500196720244T",
                    "departmentName": "汕尾市供水总公司",
                    "evalProcess": 1,
                    "evalTime": undefined,
                    "hallCode": this.TNo,
                    "affairSerialNo": "12441500196720244T3442199806003202206230068",
                    "affairCode": "12441500196720244T3442199806003",
                    "affairName": "水费查缴办理",
                    "affairDealOfficer": this.customerData.ctmName,//客户名称
                    "affairApplyTime": undefined,
                    "affairDoneTime": undefined,
                    "affairHandleItem": "",  //业务办理项编码，事项如果不是业务办理项则为空
                    "userName": this.customerData.ctmName,
                    "contactPhone": this.customerData.mobile,
                    "userType": "0",   //0为个人 1为法人，若用户均为个人可以写死为个人
                    "certificateType": "10",  //若用户均使用身份证 办理可写死为身份证（10）
                    "certificateNo": this.customerData.ctmNo,   //为上一项的实际证件号码（身份证号）
                    "windowNo": this.deviceNumber,
                    "workNo": this.deviceNumber,
                    "projectType": "2",//（办件类型有1.即办件。2.承诺办件）
                    "serviceName": "水费查缴办理",
                    "serviceNumber": "1",
                    "serviceTime": "2020-03-04 12:23:22",
                    "remark": ""
                }
            };
            this.$api
                .fetch({
                    params
                })
                .then(res => {
                    eventBus.$emit('deviceSbumit')
                    this.equipmentVisible = false
                }).catch(err => {
                    eventBus.$emit('deviceSbumit')
                    this.equipmentVisible = false
                })
        },

        sendDevice() {
            console.log(this.customerData);
            console.log(this.customerData.ctmNo);
            if(this.useType==false){
                eventBus.$emit('deviceSbumit')
                return
            }
            let params = {
                busicode: "EvaluationSend",
                data: {
                    "departmentCode": "12441500196720244T",
                    "departmentName": "汕尾市供水总公司",
                    "evalProcess": 1,
                    "evalTime": undefined,
                    "hallCode": localStorage.getItem('hallCode'),
                    "affairSerialNo": "12441500196720244T3442199806003202206230068",
                    "affairCode": "12441500196720244T3442199806003",
                    "affairName": "水费查缴办理",
                    "affairDealOfficer": this.customerData.ctmName,//客户名称
                    "affairApplyTime": undefined,
                    "affairDoneTime": undefined,
                    "affairHandleItem": "",  //业务办理项编码，事项如果不是业务办理项则为空
                    "userName": this.customerData.ctmName,
                    "contactPhone": this.customerData.mobile,
                    "userType": "0",   //0为个人 1为法人，若用户均为个人可以写死为个人
                    "certificateType": "10",  //若用户均使用身份证 办理可写死为身份证（10）
                    "certificateNo": this.customerData.ctmNo,   //为上一项的实际证件号码（身份证号）
                    "windowNo": localStorage.getItem('windowNo'),
                    "workNo": localStorage.getItem('windowNo'),
                    "projectType": "2",//（办件类型有1.即办件。2.承诺办件）
                    "serviceName": "水费查缴办理",
                    "serviceNumber": "1",
                    "serviceTime": "2020-03-04 12:23:22",
                    "remark": ""
                }
            };
            this.$api
                .fetch({
                    params
                })
                .then(res => {

                    eventBus.$emit('deviceSbumit')
                }).catch(err => {
                    eventBus.$emit('deviceSbumit')
                })

        },
        closeDialog() {
            eventBus.$emit('deviceSbumit')
            this.equipmentVisible = false
        },
        showDialog() {
            if(this.useType==false){
                eventBus.$emit('deviceSbumit')
                return
            }
            this.equipmentVisible = true
        }
    }
}
</script>
  
<style rel="stylesheet/scss" lang="scss" scoped>
.editor-slide-upload {
    margin-bottom: 20px;

    /deep/ .el-upload--picture-card {
        width: 100%;
    }
}
</style>
  