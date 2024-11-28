


<template>
  <div class="PreferentialWaterUseEdit">

    <el-form class="backfillSubmitForm" :inline="true" :model="PreferentialWaterUseEditForm" label-width="160px" ref="ruleForm" :rules="rules">
      <legend>基础信息</legend>
      <el-form-item label="用户编号：" prop="userNume">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="PreferentialWaterUseEditForm.userNume" placeholder="0102689"></el-input>

      </el-form-item>
      <el-form-item label="用户名称：" prop="userNume">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="PreferentialWaterUseEditForm.userNum" placeholder="张三"  :disabled="isEdit"></el-input>

      </el-form-item>
      <!-- <el-form-item label="册本号：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="PreferentialWaterUseEditForm.PriceStrategy" placeholder="" disabled class="read-only"></el-input>
            </el-form-item> -->
      <el-form-item label="用户地址：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="PreferentialWaterUseEditForm.isfines" placeholder=""  :disabled="isEdit"></el-input>
      </el-form-item>
      <el-form-item label="证件类型：">
        <el-select clearable v-model="PreferentialWaterUseEditForm.UpdateCodeCopye"  :disabled="isEdit" placeholder="">
          <el-option v-for="(item,index) in PreferentialWaterUseEditForm.descoptions" :key="index" :label="item.name" :value="item.value"></el-option>

        </el-select>
      </el-form-item>
      <el-form-item label="证件号码：" class='idCard' style="width: calc(46% + 10px)">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="PreferentialWaterUseEditForm.Remarks"  :disabled="isEdit" placeholder="">
          <el-button slot="append" icon="el-icon-reading"  type="primary" class="scanning-btn" size='mini'></el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="优惠策略：">
        <el-select clearable v-model="PreferentialStrategy" placeholder="" @change="getPreferentialStrategyoptions">
          <el-option v-for="(item,index) in PreferentialWaterUseEditForm.PreferentialStrategyoptions" :key="index" :label="item.name" :value="item.value"></el-option>

        </el-select>
      </el-form-item>
      
      <el-form-item label="开始日期：">

        <el-date-picker v-model="PreferentialWaterUseEditForm.year" type="date" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期：">

        <el-date-picker v-model="PreferentialWaterUseEditForm.descc" type="date" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="优惠证件编号：">
        <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  @input="e => input = inputMe(e)" v-model="PreferentialWaterUseEditForm.SubsistenceAllowances" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="优惠类型：" prop="desc" class="userAdress">
        <el-radio-group v-model="PreferentialWaterUseEditForm.desc">
          <el-radio :label="3">低保户</el-radio>
          <el-radio :label="6">优抚</el-radio>
          <el-radio :label="9">残疾军人</el-radio>
          <el-radio :label="16">烈属</el-radio>
          <el-radio :label="19">五保户</el-radio>
          <el-radio :label="17">其他</el-radio>
        </el-radio-group>

      </el-form-item>

      <!-- <el-form-item label="分类项：">
                <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="PreferentialWaterUseEditForm.CategoryItems" placeholder="-0.31"></el-input>
            </el-form-item> -->

      <legend style="margin-bottom: 10px;">优惠明细</legend>
      <el-form-item class="from-table">
        <el-table stripe border :data="histroyData.list" class="change-tables-table">

          <el-table-column type="index" label="NO." width="50" :index="indexMethod">
              </el-table-column>

              <el-table-column prop="startUsage" min-width="80" label="费用名称">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.startUsage" placeholder="请选择状态">
                      <el-option label="水费" value="0"></el-option>
                      <el-option label="垃圾费" value="1"></el-option>
                      <el-option label="污水费" value="2"></el-option>
                      <el-option label="水资源费" value="3"></el-option>
                    </el-select>
                </template>
              </el-table-column>

              <el-table-column prop="coefficientMix" min-width="100" label="最小生效范围">
                <template slot-scope="scope">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    v-model="scope.row.coefficient"
                    @input="e => input = inputMe(e)"
                    placeholder="请输入最小生效范围">
                  </el-input>
                </template>
              </el-table-column>

              <el-table-column prop="coefficientMax" min-width="100" label="最大生效范围">
                <template slot-scope="scope">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    v-model="scope.row.coefficient"
                    @input="e => input = inputMe(e)"
                    placeholder="请输入最大生效范围">
                  </el-input>
                </template>
              </el-table-column>

              <el-table-column prop="endType" min-width="100" label="优惠方式">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.endType" placeholder="请选择优惠方式">
                      <el-option label="水量按公式优惠" value="0"></el-option>
                      <el-option label="金额按公式优惠" value="1"></el-option>
                      <el-option label="封顶金额" value="2"></el-option>
                      <el-option label="封顶水量" value="3"></el-option>
                      <el-option label="固定减免产量" value="4"></el-option>
                      <el-option label="固定减免金额" value="4"></el-option>
                      <el-option label="按人口减免水量" value="4"></el-option>
                      <el-option label="按人口减免金额" value="4"></el-option>
                    </el-select>
                </template>
              </el-table-column>
<!-- 
              <el-table-column prop="price" min-width="100" label="计算单位">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.price" placeholder="请选择计算单位">
                      <el-option label="按水量" value="0"></el-option>
                      <el-option label="按百分比" value="1"></el-option>
                    </el-select>
                </template>
              </el-table-column> -->

              <el-table-column prop="coefficient" min-width="100" label="优惠值/计算公式">
                <template slot-scope="scope">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    v-model="scope.row.coefficient"
                    @input="e => input = inputMe(e)"
                    placeholder="请输入优惠值或填入计算公式">
                  </el-input>
                </template>
              </el-table-column>

              <!-- <el-table-column prop="stageMoney" min-width="100" label="优惠单价">
                <template slot-scope="scope">
                  <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  
                    v-model="scope.row.stageMoney"
                    placeholder="请输入优惠单价">
                  </el-input>
                </template>
              </el-table-column> -->

              <el-table-column label="操作" width="70">
                <template slot-scope="scope">
                  <el-button type="text" @click.native="edit(scope.$index, scope.row)" style="font-size:12px;">删除</el-button>
                </template>
              </el-table-column>

        </el-table>

      </el-form-item>

      <!-- <legend v-if="!PreferentialDetails" style="margin-top:10px;margin-bottom:10px;">
        人口明细
        <el-button type="primary" size='mini' icon="el-icon-plus" @click="addTable" style="margin-left: 86%">添加行</el-button>
      </legend>
      <el-form-item class="from-table">
        <el-table stripe border :data="histroyData.list1" v-if="!PreferentialDetails" class="change-tables-table">

          <el-table-column type="index" label="NO." width="50" fixed="left">

          </el-table-column>

          <el-table-column prop="connect" min-width="100" label="姓名">
            <template slot-scope="scope">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.meter"></el-input>
            </template>
          </el-table-column>

          <el-table-column prop="connect" min-width="100" label="证件类型">
            <template slot-scope="scope">
              <el-select  clearable v-model="scope.row.model" placeholder="">
                <el-option  v-for="(item,index) in PreferentialWaterUseEditForm.descoptions" :key="index" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column prop="connect" min-width="140" label="证件号码">
            <template slot-scope="scope">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.modifyBy">
                <el-button slot="append" icon="el-icon-reading"  type="primary" class="scanning-btn" @click="idCard()" size='mini'></el-button>
              </el-input>
            </template>

          </el-table-column>

          <el-table-column prop="connect" min-width="120" label="座机号码">
            <template slot-scope="scope">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.modifyTime"></el-input>
            </template>
          </el-table-column>

          <el-table-column prop="connect" min-width="180" label="备注">
            <template slot-scope="scope">
              <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="scope.row.protocolName"></el-input>
            </template>
          </el-table-column>

        </el-table>
      </el-form-item> -->

    </el-form>

  </div>
</template>
<script>
export default {
  name: "PreferentialWaterUseEdit",
  props:{
    isEdit:{
        type:Boolean,
    }
  },
  data() {
    return {
      PreferentialWaterUseEditForm: {
        // 查询内容
        backfillInput: [
          {
            label: "册本号码：",
            value: "",
            tips: "xx319"
          },
          {
            label: "用户地址：",
            value: "",
            tips: "登封路"
          },
          {
            label: "证件号码：",
            value: "",
            tips: "44431319901130001"
          },
          {
            label: "最后修改人：",
            value: "",
            tips: ""
          },
          {
            label: "最后修改时间：",
            value: "",
            tips: ""
          },



        ],
        PreferentialStrategy: "",
        PreferentialStrategyoptions: [
          {
            name:'优惠策略一',
            value:'1'
          },
          {
            name:'优惠策略二',
            value:'2'
          },
          // {
          //   name:'优惠策略三',
          //   value:'3'
          // }
          // {
          //   name: "水量优惠公式",
          //   value: "1"
          // },
          // {
          //   name: "水价优惠公式",
          //   value: "2"
          // },
          // {
          //   name: "封顶金额",
          //   value: "3"
          // },
          // {
          //   name: "封顶水量",
          //   value: "4"
          // },
          // {
          //   name: "减免水量",
          //   value: "5"
          // },
          // {
          //   name: "减免金额",
          //   value: "6"
          // },
          {
            name: "按人口减免水量",
            value: "7"
          },
          // {
          //   name: "按人口减免金额",
          //   value: "8"
          // },
        ],
        descoptions:[//证件类型
            {
                name:'居民身份证',
                value:'0'
            },
            {
                name:'护照',
                value:'1'
            },
            {
                name:'户口本',
                value:'2'
            },
            {
                name:'回乡证',
                value:'3'
            },
            {
                name:'台胞证',
                value:'4'
            },
        ],

        desc: "",
        descc: "",
        userNume: "",
        descoptions: [
          {
            name:'居民身份证',
            value:'0'
          },
          {
            name:'护照',
            value:'1'
          },
          {
            name:'户口本',
            value:'2'
          },
          {
            name:'回乡证',
            value:'3'
          },
          {
            name:'台胞证',
            value:'4'
          },
        ],
        userNum: "",
        PriceStrategy: "",
        isfines: "",
        UpdateCodeCopye: "0",
        Remarks: "",
        year: "",
        CategoryItems: "",
        Template: "",
        FinalModifier: "",
        FinalModificationTime: "",
        SubsistenceAllowances: ""
      },
      rules: {
        userNume: [
          { required: true, message: '请输入用户编号', trigger: 'blur' },
        ],
        desc: [
          { required: true, message: '请输入用户编号', trigger: 'blur' },
        ]
      },
      histroyData: {
        list1: [
          {},
          {},
          {},
          {}
        ],
      },
      PreferentialDetails: true,
      PreferentialStrategy: "",
      cheapTitle: '优惠明细',

    }
  },
  mounted() {
    this.init();
  },
  methods: {
    inputMe(e){
        let str=e.replace(/\ +/g,"")
        str=str.replace(/[\r\n]/g,"")
        //console.log(str);
        return str;
      },
    init() {

      this.histroyData = {
        areaId: "",
        endRow: 5,
        hasNextPage: false,
        hasPreviousPage: false,
        isFirstPage: true,
        isLastPage: true,
        list1: [{}, {}, {}],
        list: [
          {
            areaId: null,
            areaName: [],
            code: "水资源费",
            cmp: '水量优惠公式',
            concentrator: "按水量",
            connect: null,
            daytime: "水资源费",
            endTime: null,
            factoryName: "东井",
            fcode: null,
            fix: false,
            fixValue: "-",
            flux: "-",
            getMeter: 1,
            id: null,
            isxz: "全免",
            lvalue: [],
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
          },
          {
            areaId: null,
            areaName: [],
            code: "水资源费",
            cmp: '封顶金额',
            concentrator: "按水量",
            connect: null,
            daytime: "水资源费",
            endTime: null,
            factoryName: "东井",
            fcode: null,
            fix: false,
            fixValue: "-",
            flux: "-",
            getMeter: 1,
            id: null,
            isxz: "全免",
            lvalue: [],
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
          },

          {
            areaId: null,
            areaName: [],
            code: "水资源费",
            cmp: '减免水量',
            concentrator: "按百分比",
            connect: null,
            daytime: "水资源费",
            endTime: null,
            factoryName: "东井",
            fcode: null,
            fix: false,
            fixValue: "-",
            flux: "-",
            getMeter: 1,
            id: null,
            isxz: "全免",
            lvalue: [],
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
          },

          {
            areaId: null,
            areaName: [],
            code: "水资源费",
            cmp: '减免金额',
            concentrator: "按百分比",
            connect: null,
            daytime: "水资源费",
            endTime: null,
            factoryName: "东井",
            fcode: null,
            fix: false,
            fixValue: "-",
            flux: "-",
            getMeter: 1,
            id: null,
            isxz: "全免",
            lvalue: [],
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
    addTable() {
      this.histroyData.list1.push({});
    },

  },
  watch: {
    PreferentialStrategy(newval) {
      if (newval == 7 || newval == 8) {
        this.PreferentialDetails = false;
      } else {
        this.PreferentialDetails = true;
      }

    }
  }
}
</script>
<style lang="scss">
.PreferentialWaterUseEdit {
  .el-date-editor /deep/ .el-input__inner {
    width: 100% !important;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
  .el-input__icon {
    line-height: 30px;
  }
  legend {
    background: #f5f5f5;
    font-weight: 700;
    font-size: 12px;
    padding: 5px 20px;
    font-size: 14px;
  }
  .backfillSubmitForm {
    // margin-top: 15px;
  }
  .backfillSubmitForm {
    padding: .5rem 10px;
    width: 98%;
    .el-form-item {
      width: 32%;
      .el-form-item__content {
        width: 48%;
        .el-select {
          width: 100%;
        }
        .el-input__inner {
          height: 28px !important;
        }
      }
    }
    .right-btn {
      text-align: right;
      width: 100%;
    }
    .from-table {
      width: 100%;
      .el-form-item__content {
        width: 100%;
      }
    }
    .userAdress {
      width: 80%;
      .el-form-item__content {
        width: calc(100% - 160px);
        .el-form-item__label {
          width: 100px !important;
        }
        .el-textarea,
        .el-input {
          width: 30%;
        }
        .el-select {
          width: 20%;
        }
        .el-checkbox-group {
          display: inline-block;
          width: 50%;
        }
      }
    }

    .Remarks {
      width: 100%;
      .el-form-item__content {
        width: calc(100% - 160px);
      }
    }
  }
  .el-steps--horizontal {
    margin: 0 auto;
    width: 50%;
    padding-bottom: 20px;
  }
}
</style>

