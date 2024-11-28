<template>
  <div class="engineerTermination">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <div class="bread-contain-right">
        <el-button v-if="!showIndex" size="mini" @click="closeDialog">返回</el-button>
      </div>
    </div>
    <div class="pageIndex" v-if="showIndex">
      <div class="toolbar"  style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form inline size="mini" label-position="right" label-width="80px" class="multiple-floor">
           <el-form-item label="单据编号：" class="width-200">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.billNo" placeholder="" clearable></el-input>
          </el-form-item>
          <el-form-item label="工程编号：" class="width-200">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.pjBillNo" placeholder="" clearable></el-input>
          </el-form-item>

          <el-form-item label="终止节点：" class="width-200">
            <el-select ref="select2" v-model="tableQuery.nodeCode" placeholder="" clearable>
              <el-option v-for="item in dictionaryData .PCN" :key="item.key" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>


          <el-form-item label="流程状态：" class="width-200">
            <el-select ref="select3" v-model="tableQuery.processState" placeholder="" clearable>
              <el-option v-for="item in dictionaryData.PCS" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="button-group">
            <el-button class="searchBtn" @click="search" icon="el-icon-search"></el-button>
            <el-button type="primary" @click="exportExcel">导出</el-button>
          </el-form-item>
            <div v-show="isActive" class="advancedQuery">
                <el-form-item label="终止人：" class="width-200">
                    <el-input type="text" v-model="tableQuery.createName" clearable=""></el-input>
                </el-form-item>
                <el-form-item label="终止原因：" class="width-200">
                    <el-select v-model="tableQuery.terminationReason" clearable>
                      <el-option v-for="item in reason" :key="item.id" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
          </div>
          <div class="toggle-btn" @click="hidden"><i :class="isActive ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></div>
        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table highlight-current-row stripe border :max-height="maxHeight" :data="tableData.list">
          <el-table-column type="index" fixed="left" label="NO." width="50" :index="indexMethod"></el-table-column>
          <el-table-column label="操作" width="60">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="detail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="processState" min-width="80" label="流程状态" show-overflow-tooltip>
              <template slot-scope="scope">
                  <span v-if="scope.row.processState!=''" style="color:black" >{{scope.row.processState}}</span>
                  <span v-else style="color:black">草稿</span>
              </template>
          </el-table-column>
          <el-table-column prop="billNo" min-width="150" label="单据编号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="pjNo" min-width="120" label="工程编号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="pjName" min-width="120" label="工程名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="pjTypeName" min-width="80" label="工程类型" show-overflow-tooltip></el-table-column>
          <el-table-column prop="installAddr" min-width="180" label="报装地址" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ctmName" min-width="120" label="用户名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="mobile" min-width="120" label="手机号码" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createName" min-width="120" label="终止人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="nodeCodeName" min-width="120" label="终止节点" show-overflow-tooltip></el-table-column>
          <el-table-column prop="terminationReasonName" min-width="120" label="终止原因" show-overflow-tooltip></el-table-column>
          <el-table-column prop="comments" min-width="200" label="终止说明" show-overflow-tooltip></el-table-column>
          <el-table-column prop="processName" min-width="80" label="节点名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="processHandleMan" min-width="120" label="当前处理人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="billDate" min-width="100" label="终止时间" show-overflow-tooltip></el-table-column>

        </el-table>
      </div>
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
      </div>
    </div>
    <engineerTerminationEdit v-else ref="termination" :terminationData="terminationData" :hidd="hiddenBtn" />
  </div>
</template>

<script>
    import engineerTerminationEdit from './engineerTerminationEdit.vue';
    export default {
        components: { engineerTerminationEdit },
        data() {
            return {
                hiddenBtn:false,
                reason:[],
                crumbsData: {
                    //面包屑
                    titleList: [
                        { title: "工程管理" },
                        { title: "用户工程" },
                        { title: "工程终止" }
                    ]
                },
                tableQuery: {
                    billNo: '',
                    pjBillNo: '',
                    processState: '',
                    beginDate: '',
                    endDate: '',
                    page: 1,
                    pageCount: 20,
                    // settlement:'',
                    nodeCode:'',
                    terminationReason:'',//终止原因
                    createName:''//终止人
                },
                date: [],
                isActive: false,
                tableData: {
                    list: [],
                    total: 0
                },
                maxHeight: 0,
                showIndex: true,
                dictionaryData: {},
                terminationData: {}
            }
        },
        mounted() {
            const date = new Date()
            const year = date.getFullYear()
            const month = date.getMonth()
            const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
            const twoMonthAgo = month < 2 ? (year - 1).toString() + '-' + (12 - (Math.abs(month - 1) % 12)) + '-' + day : (year.toString() + '-' + (month === 11 ? '' : '0') + (month - 1)) + '-' + day
            this.date = [twoMonthAgo, this.common.date()]
            this.tableQuery.beginDate = twoMonthAgo
            this.tableQuery.endDate = this.common.date()
            this.getDictionary()
            this.init()
            this.$nextTick(() => {
                this.common.changeTable(this, ".engineerTermination", [
                    ".engineerTermination .toolbar",
                    ".engineerTermination .bread-contain",
                    ".engineerTermination .toggle-btn",
                    ".engineerTermination .block"
                ]);
            })
        },
        methods: {
          exportExcel(){
            var params = {
              busicode:'PjTerminationExport',
              data: {
                    terminationReason:this.tableQuery.terminationReason,
                    // comments:this.tableQuery.comments,
                    createName:this.tableQuery.createName,
                    nodeCode:this.tableQuery.nodeCode,
                    processState:this.tableQuery.processState,
                    billNo:this.tableQuery.billNo,
                    pjBillNo:this.tableQuery.pjBillNo,
                    page:1,
                    pageCount:999999
              },
              token: sessionStorage.getItem("token"),
              sysType: "002"
            };
            window.open(
              this.common.getExportExcelIp() +
                "/project/exportExcel.api?json=" +
                encodeURI(JSON.stringify(params))
            );
          },
            enterEvents(e){
                if(e.keyCode == 13){
                    this.init()
                    this.$refs.select1.blur()
                    this.$refs.select2.blur()
                    this.$refs.select3.blur()

                }
            },
            getSelect(val){
                console.log('1111',val)
                this.tableQuery.pjTypes = val
            },
            init() {
                var _this = this
                var params = {
                    "busicode": "PjTerminationList",
                    "data": {
                        processState:this.tableQuery.processState,
                        page: this.tableQuery.page,
                        pageCount: this.tableQuery.pageCount,
                        nodeCode:this.tableQuery.nodeCode,
                        billNo:this.tableQuery.billNo,
                        pjBillNo:this.tableQuery.pjBillNo,
                        createName:this.tableQuery.createName,
                        terminationReason:this.tableQuery.terminationReason
                    }
                }
                this.$api.fetch({
                    params: params,//参数
                }).then(res => {
                    _this.tableData= res
                })
            },

            search() {
                this.tableQuery.page = 1
                this.tableQuery.pageCount = 20
                this.init();
            },
            // 数据字典数据获取
            getDictionary() {
                var _this = this
                var params = {
                    "busicode": "DictionarySelect",
                    "data": "PJD,PQI,PPT,PCS,PROJECT_TERMINATION_REASON,PCN"
                    //工程类型、流程状态
                }
                this.$api.fetch({
                    params: params,//参数
                }).then(res => {
                    _this.dictionaryData = res
                    this.reason=res.PROJECT_TERMINATION_REASON
                })
            },
            detail(row) {
                this.terminationData = {terminationId: row.id}
                this.showIndex = false
            },
            hidden() {
                this.isActive = !this.isActive
                this.$nextTick(() => {
                    this.common.changeTable(this, ".engineerTermination", [
                        ".engineerTermination .toolbar",
                        ".engineerTermination .bread-contain",
                        ".engineerTermination .toggle-btn",
                        ".engineerTermination .block"
                    ]);
                })
            },
            indexMethod(index) {
                //获取表格序号
                return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1)
            },
            handleSizeChange(val) {
                //显示多少数据一页
                this.tableQuery.pageCount = val;
                this.tableQuery.page = 1;
                this.init();
            },
            handleCurrentChange(val) {
                //显示多少页码
                if (val) {
                    this.tableQuery.page = val;
                    this.init();
                }
            },
            closeDialog() {
                this.showIndex = true
                this.init()
            }
        },
        watch: {
            date(val) {
                if(val && val.length > 0) {
                    this.tableQuery.beginDate = val[0]
                    this.tableQuery.endDate = val[1]
                } else {
                    this.tableQuery.beginDate = ''
                    this.tableQuery.endDate = ''
                }
            }
        },
        computed: {
            fuzzyItems() {
                return this.dictionaryData.PJD && this.dictionaryData.PJD.filter(item => this.tableQuery.fuzzyItems.includes(item.value)).map(item => item.name).join('，')
            },
            pjType() {
                console.log(this.tableQuery.pjTypes)
                return this.dictionaryData.PPT && this.dictionaryData.PPT.filter(item => this.tableQuery.pjTypes.includes(item.value)).map(item => item.name).join('，')
            }
        }
    }
</script>

<style lang="scss" scoped>
  .engineerTermination {
    height: 100%;
  }
  .kl-table {
    margin-top: 15px;
  }
</style>
