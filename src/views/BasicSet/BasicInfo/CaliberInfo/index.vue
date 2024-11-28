<template>
  <div class="caliber-info">
        
      <div class="bread-contain">
        <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
        <div class="bread-contain-right" v-if="EditVisible">
            <el-button size="mini" type="primary" @click="submitForm('CaliberInfoEditForm')">保存</el-button>
            <el-button icon="el-icon-caret-left" size="mini" @click="handleClose">返回</el-button>
        </div>
        <div class="bread-contain-right" v-else>
            <el-button size="mini" icon="el-icon-plus" @click="add('add')" type="primary">添加</el-button>
        </div>
      </div>
      
      <div v-show="EditVisible">
        <CaliberInfoEdit ref="CaliberInfoEdit"></CaliberInfoEdit>
      </div>

      <div v-show="!EditVisible" class="caliber-info-right-content" >
          <div class="toolbar">
              <el-form :inline="true" size="mini" class="demo-form-inline">
                  <el-form-item class="form-left">

                      <el-form-item label="口径值：" class="">
                        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="tableQuery.boreValue" clearable size="mini" placeholder="口径值" @keyup.enter.native="search"></el-input>
                      </el-form-item>

                      <el-form-item>
                          
                          <el-button class='searchBtn'  @click="search" icon="el-icon-search"></el-button>
                      </el-form-item>
                      
                  </el-form-item>

              </el-form>
          </div>
          <div class="kl-table">

              <el-table 
                        v-if="tableShow" 
                        :max-height="maxHeight"
                        highlight-current-row
                        stripe border 
                        :data="tableData" 
                        class="wuserInfo-table">

                <el-table-column type="index" label="NO." width="50" :index="indexMethod">
                </el-table-column>
                
                <el-table-column prop="boreName" min-width="80" label="口径名称">
                </el-table-column>

                <el-table-column prop="boreValue" min-width="100" label="口径值">
                </el-table-column>


                <el-table-column prop="maxFlux" min-width="100" label="最大流量">
                </el-table-column>
                <el-table-column prop="meterPlaces" min-width="120" label="表码位数">
                </el-table-column>
                <el-table-column prop="oldChangeCycle" min-width="120" label="旧表换表周期">
                </el-table-column>

                <el-table-column prop="newChangeCycle" min-width="120" label="新表换表周期">
                </el-table-column>

                <el-table-column prop="sortNo" min-width="100" label="排序号">
                </el-table-column>
                <el-table-column prop="status" min-width="80" label="状态">
                </el-table-column>
                
                <el-table-column prop="comments" min-width="100" label="备注" show-overflow-tooltip>
                </el-table-column>

                <el-table-column label="操作" width="70">
                  <template slot-scope="scope">
                    <el-button type="text" @click.native="add(scope.row)" style="font-size:12px;text-align:center;">编辑</el-button>
                  </template>
                </el-table-column>

              </el-table>
          </div>
        
      </div>
  </div>
</template>
<script>
import CaliberInfoEdit from "./CaliberInfoEdit"

export default {
  name: "caliber-info-index",
  components:{
      CaliberInfoEdit,
  },
  data() {
    return {
      EditVisible:false,//弹出表单
      formData:{
        boreName:"",
        boreValue:"",
        maxFlux:'',
        meterPlaces:'',
        oldChangeCycle:'',
        newChangeCycle:'',
        comments:"",
        status:"",
        sortNo:""
      },
      crumbsData: {  //面包屑
        titleList: [
          { title: '基础信息', path: '/BusinessArea' },
          { title: '水表配置', method: () => { window.histroy.back() } },
          { title: '水表口径', method: () => { window.histroy.back() } }
        ],
      },
      maxHeight: 0,
      tableShow: false,
      tableData:[
        {
          name: "DN15",
          value:  "15",
          cumulative:'7000',
          number:'4',
          oldWeek:'72',
          newWeek:'72',
          resident:"-",
          nonResident:"-",
        }, {
          name: "DN20",
          value:  "20",
          cumulative:'11000',
          number:'4',
          oldWeek:'72',
          newWeek:'72',
          resident:"-",
          nonResident:"-",
        },
      ],
      tableQuery:{
        boreValue:"",
        page:1,
        pageCount:999
      }
    }
  },
  mounted() {
    this.init();
    this.$nextTick(() => {
      //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量
      this.common.changeTable(this, '.caliber-info .caliber-info-right-content', ['.caliber-info .block','.caliber-info .toolbar'])
    })
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    init() {
      let _this = this
      let params = {
          "busicode": "MeterBoreList",
          "data": this.tableQuery,
      }
      this.$api.fetch({
      params: params,//参数
      
      }).then(res => {
          _this.tableData = res.list;
          
      })
      
    },
     // 搜索
    search(){
      this.init()
    },
    // 添加按钮点击事件
      add(val) {
        // this.bankLinkShow = false;
        this.EditVisible = true;
        if(val==='add'){
          this.$refs.CaliberInfoEdit.editData({
            boreName:"",
            boreValue:"",
            maxFlux:'',
            meterPlaces:'',
            oldChangeCycle:'',
            newChangeCycle:'',
            comments:"",
            status:"",
            sortNo:""
          });
          this.crumbsData.titleList.push({title:'添加',method:()=>{window.histroy.back()}});
          this.common.chargeObjectEqual(this,this.formData,'set','CaliberInfoEdit');
        }else{
          this.crumbsData.titleList.push({title:'编辑',method:()=>{window.histroy.back()}});
          let _this = this;
          let params = {
              "busicode": "MeterBoreQuery",
              "data": {
                boreId:val.boreId,
              },
          }
          this.$api.fetch({
            params: params,//参数
          }).then(res => {
            this.$refs.CaliberInfoEdit.editData(res);
            this.common.chargeObjectEqual(this,res,'set','CaliberInfoEdit');
          })
        }
        
      },
      // 列表的NO列
      indexMethod(index) {
        return index+1 ;
      },
      closeDialog(){
        this.crumbsData.titleList.pop();
        this.EditVisible = false;
      },
      // 返回
      handleClose() {
        
        this.$refs.CaliberInfoEdit.handleClose();
      },
      //保存按钮
      submitForm(formName) {
        let type = this.crumbsData.titleList[3].title;
        this.$refs.CaliberInfoEdit.submitForm(formName,type);
      },
  },
  watch: {
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
@import "../../../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.caliber-info {
  width: 100%;
  height: 100%;
  .caliber-info-right-content {
    width: 100%;
    height: calc(100% - 40px);
    .kl-table{
      padding: 0px 20px;
      width: calc(100% - 40px);
      .block {
        text-align: right;
        padding: 10px 0px;
    }

    }
  }
}
</style>
