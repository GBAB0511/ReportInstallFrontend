<template>
  <!-- 开账复核 -->
  <div class="BatchOpeningReview">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
      <!-- index页面 -->
      <!-- <div class="bread-contain-right">
        <el-button @click="exportExcel" size="mini" icon="el-icon-upload2" type="primary">导出</el-button>
      </div> -->
      <div class="bread-contain-right">
        <el-button type="primary" size="mini" class='' @click="review">复核</el-button>
        <el-button type="primary" size="mini" class='' @click="change">变更</el-button>
        <el-button type="primary" size="mini" class='' @click="deleteDetail(1)">重抄</el-button>
        <el-button type="primary" size="mini" class='' @click="deleteDetail(0)">取消</el-button>
      </div>
    </div>

    <!-- index页面 -->
    <div v-if="indexShow" class="index-page">
      <div class="toolbar" style="outline:none" tabindex="0" @keydown="enterEvents($event)">
        <el-form :inline="true" size="mini" :model="tableQuery" class="demo-form-inline">
          <!-- <el-form-item label="营业区域：">
            <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" @change="changeBusinessArea" :options="businessArea" :show-all-levels="false" :props="props">
            </el-cascader>
          </el-form-item>

          <el-form-item label="用水类型：">
            <el-cascader v-model="tableQuery.useWaterType" :options="useWaterTypeOptions" :show-all-levels="false" clearable :props="props">
            </el-cascader>
          </el-form-item>

          <el-form-item label="册本号：">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.bookNo" placeholder="请输入册本号" clearable @keydown.enter.native="search"></el-input>
          </el-form-item>

          <el-form-item label="抄表员：">
            <el-select v-model="tableQuery.readerAccount" placeholder="请选择" class="shouldWater" clearable>
              <el-option-group v-for="group in meterReaderList" :key="group.businessAreaName" :label="group.businessAreaName">
                <el-option v-for="item in group.userInfos" :key="item.userAccount" :label="item.userName" :value="item.userAccount">
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>

          <el-form-item label="模糊查询：" class="width-200">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" placeholder="装表地址\用户编号\客户编号\客户名称" clearable @keydown.enter.native="search"></el-input>
          </el-form-item>-->

          <el-form-item label='开账时间：' class="dateAndTime">
            <el-date-picker v-model="Time" @change="getDatePicker" type="daterange" value-format="yyyy-MM-dd" range-separator="至" :clearable="true" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="模糊查询：" class="item">
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.fuzzyQuery" placeholder="用户编号、客户名称" @keydown.enter.native="search" class="userNo"></el-input>
          </el-form-item>

          <el-form-item label="营业区域：" class="item">
            <el-cascader ref="cascader" clearable v-model="tableQuery.businessArea" :options="businessArea" :show-all-levels="false" :props="tprops" @change="changeBusinessArea" class="shouldWater">
            </el-cascader>
          </el-form-item>

          <el-row>
            <el-col :span="3">
              <el-form-item label="抄表员：">
                <el-select v-model="tableQuery.meterReadingStaffName" placeholder="请选择" @change="changeMeterReadingStaff" clearable>
                  <el-option-group v-for="group in staffAccounts" :key="group.businessAreaName" :label="group.businessAreaName">
                    <el-option v-for="item in group.userInfos" :key="item.userName" :label="item.userName" :value="item.userName">
                    </el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="册本：" class="width-150">
                <el-select v-model="tableQuery.bookNos" multiple placeholder="请选择" filterable clearable>
                  <span slot="prefix" v-if="showbookNos!=''">{{showbookNos}}</span>
                  <el-option-group v-for="group in bookNos" :key="group.index" :label="group.areaStaffName">
                    <el-option v-for="item in group.baseBookListVOList" :key="item.index" :label="item.bookNo" :value="item.bookNo">
                      <span style="float: left">{{ item.bookNo }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.bookName }}</span>
                    </el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="3">
              <el-form-item label="是否税票：">
                <el-select v-model="tableQuery.vatFlag" placeholder="请选择" clearable>
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="用水类型：">
                <el-cascader v-model="tableQuery.waterTypeId" :options="useWaterTypeOptions" :show-all-levels="false" clearable :props="props" class="shouldWater">
                </el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="有阶梯费：">
                <el-select v-model="tableQuery.isHaveLadder" placeholder="请选择" clearable>
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="应收水量：">
            <el-select v-model="tableQuery.more" placeholder="请选择">
              <el-option v-for="item in moreOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.shouldWaterAmountStart" placeholder="应收水量" class="shouldWaterInput"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="tableQuery.less" placeholder="请选择">
              <el-option v-for="item in lessOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.shouldWaterAmountEnd" placeholder="应收水量" @keydown.enter.native="search" class="shouldWaterInput"></el-input>
          </el-form-item>
          <el-form-item label="应收水费：">
            <el-select v-model="tableQuery.moreMoney" placeholder="请选择">
              <el-option v-for="item in moreOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.shouldAmountStart" placeholder="应收水费" class="shouldWaterInput"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="tableQuery.lessMoney" placeholder="请选择">
              <el-option v-for="item in lessOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="tableQuery.shouldAmountEnd" placeholder="应收水费" class="shouldWaterInput"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button class='searchBtn' @click="search" icon="el-icon-search"></el-button>
          </el-form-item>

        </el-form>
      </div>
      <div class="kl-table" :style="{height: maxHeight + 'px'}">
        <el-table v-if="tableShow" highlight-current-row :max-height="maxHeight" stripe border :data="tableData.list" show-summary :summary-method='getTotal' class="BatchOpeningReview-table" @sort-change='getSort' @selection-change="getSelectList" @row-click="handleTableCellClick" :cell-style="cellStyle">

          <!--<el-table-column type="selection" width="50" fixed="left"></el-table-column>

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="userNo" min-width="110" label="用户编号" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="clickableTip">
                {{ scope.row.userNo }}
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="ctmName" min-width="120" label="客户名称" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="ctmAddr" min-width="150" label="客户地址" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="meterReadingStaffName" min-width="100" label="抄表员" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="meterReadingDate" min-width="150" label="抄表日期" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="accountPeriod" min-width="80" label="账期" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="priorPeriodNum" min-width="100" label="上期读数" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="currendPeriodNum" min-width="100" label="本期读数" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="useWaterTypeName" min-width="150" label="用水类型" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="realityWater" min-width="100" label="水量" show-overflow-tooltip>
          </el-table-column>
          <template v-for='(col) in costList'>
            <el-table-column show-overflow-tooltip :prop="col.costNameEn" :label="col.costName" :key="col.costNo" v-if="col.costName.length>0" min-width="120">
            </el-table-column>
          </template>
          <el-table-column prop="priceJ1" min-width="70" label="阶梯单价1" show-overflow-tooltip :formatter="format"></el-table-column>
          <el-table-column prop="priceJ2" min-width="70" label="阶梯单价2" show-overflow-tooltip :formatter="format"></el-table-column>
          <el-table-column prop="priceJ3" min-width="70" label="阶梯单价3" show-overflow-tooltip :formatter="format"></el-table-column>
          <el-table-column prop="priceJ4" min-width="70" label="阶梯单价4" show-overflow-tooltip :formatter="format"></el-table-column>
          <el-table-column prop="priceJ5" min-width="70" label="阶梯单价5" show-overflow-tooltip :formatter="format"></el-table-column>
          <el-table-column prop="priceJ6" min-width="70" label="阶梯单价6" show-overflow-tooltip :formatter="format"></el-table-column>
          <el-table-column prop="priceJ7" min-width="70" label="阶梯单价7" show-overflow-tooltip :formatter="format"></el-table-column>
          <el-table-column prop="priceJ8" min-width="70" label="阶梯单价8" show-overflow-tooltip :formatter="format"></el-table-column>
          <el-table-column prop="waterJ1" min-width="70" label="阶梯水量1" show-overflow-tooltip :formatter="format"></el-table-column>
          <el-table-column prop="waterJ2" min-width="70" label="阶梯水量2" show-overflow-tooltip :formatter="format"></el-table-column>
          <el-table-column prop="waterJ3" min-width="70" label="阶梯水量3" show-overflow-tooltip :formatter="format"></el-table-column>
          <el-table-column prop="waterJ4" min-width="70" label="阶梯水量4" show-overflow-tooltip :formatter="format"></el-table-column>
          <el-table-column prop="waterJ5" min-width="70" label="阶梯水量5" show-overflow-tooltip :formatter="format"></el-table-column>
          <el-table-column prop="waterJ6" min-width="70" label="阶梯水量6" show-overflow-tooltip :formatter="format"></el-table-column>
          <el-table-column prop="waterJ7" min-width="70" label="阶梯水量7" show-overflow-tooltip :formatter="format"></el-table-column>
          <el-table-column prop="waterJ8" min-width="70" label="阶梯水量8" show-overflow-tooltip :formatter="format"></el-table-column>
          <el-table-column prop="receivableMoney" min-width="120" label="费用合计" fixed="right" show-overflow-tooltip>
          </el-table-column>-->

          <el-table-column type="selection" width="60" fixed="left"></el-table-column>

          <el-table-column type="index" label="NO." width="50" fixed="left" :index="indexMethod">
          </el-table-column>

          <el-table-column prop="userNo" min-width="130" label="用户编号" fixed="left" show-overflow-tooltip>
            <template slot-scope="scope">
              <span style="color: #409eff; cursor: pointer;" @click="toDetail(scope.row.userNo)">{{scope.row.userNo}}</span>
            </template>
          </el-table-column>

          <el-table-column prop="ctmName" min-width="200" label="客户名称" fixed="left" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="linkTel" min-width="130" label="手机号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="realityWater" min-width="120" label="应收水量" :sort-orders="['descending','ascending',null]" :sortable="'custom'" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="total" min-width="120" label="合计费用" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="subTotal" min-width="120" label="综合水费" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>

          <el-table-column prop="ctmAddr" min-width="200" label="客户地址" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>

          <el-table-column prop="accountPeriod" min-width="100" label="账期" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="meterReadingDate" min-width="100" label="抄表日期" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="meterReadingStaffName" min-width="100" label="账单抄表员" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="bookNo" min-width="100" label="册本号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="chargeStaffName" min-width="100" label="收费员名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="waterTypeName" min-width="200" label="用水类型" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="meterTypeName" min-width="100" label="水表分类" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="setMeterAddr" min-width="200" label="装表地址" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="businessArea" min-width="120" label="营业区域" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="baseWaterTotal" min-width="120" label="基本水费" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column :prop="item.costAttr" :label="item.costName" min-width="150" v-for="(item,index) in costNameList" :key="'info_'+index" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
            <template slot-scope="scope">
              <span style="color:black;">{{ scope.row.costList[index] && scope.row.costList[index].money }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="waterJ1" min-width="110" label="一阶水量" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="priceJ1" min-width="110" label="一阶水价" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="ladderJ1" min-width="110" label="一阶金额" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>

          <el-table-column prop="waterJ2" min-width="110" label="二阶水量" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="priceJ2" min-width="110" label="二阶水价" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="ladderJ2" min-width="110" label="二阶金额" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>

          <el-table-column prop="waterJ3" min-width="110" label="三阶水量" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="priceJ3" min-width="110" label="三阶水价" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="ladderJ3" min-width="110" label="三阶金额" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>

          <el-table-column prop="waterJ4" min-width="110" label="四阶水量" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="priceJ4" min-width="110" label="四阶水价" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="ladderJ4" min-width="110" label="四阶金额" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>

          <el-table-column prop="waterJ5" min-width="110" label="五阶水量" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="priceJ5" min-width="110" label="五阶水价" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="ladderJ5" min-width="110" label="五阶金额" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>

          <el-table-column prop="waterJ6" min-width="110" label="六阶水量" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="priceJ6" min-width="110" label="六阶水价" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>
          <el-table-column prop="ladderJ6" min-width="110" label="六阶金额" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>

          <el-table-column prop="penaltyMoney" min-width="120" label="违约金" show-overflow-tooltip :sort-orders="['descending','ascending',null]" :sortable="'custom'">
          </el-table-column>

          <el-table-column prop="priorPeriodNum" min-width="80" label="上期始码" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="currendPeriodNum" min-width="80" label="本期止码" show-overflow-tooltip>
          </el-table-column>

          <el-table-column prop="comments" min-width="180" label="备注" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="vatFlag" min-width="80" label="是否税票" show-overflow-tooltip>
          </el-table-column>

        </el-table>

      </div>
      <!-- 分页 -->
      <div class="block">
        <div class="noteReminder chargeRemind"><span style="color:#606266;font-size:14px">合计金额：</span><span style="color:#30B110;font-size:14px">{{receivableMoney}}</span>；<span style="color:#606266;font-size:14px">笔数：</span><span style="color:#30B110;font-size:14px">{{calculateNum}}</span>；<span style="color:#606266;font-size:14px">水量：</span><span style="color:#30B110;font-size:14px">{{calculateWater}}</span></div>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[20, 100, 500, 1000]" :page-size="tableQuery.pageCount" layout="total, sizes, prev, pager, next, jumper" :total="tableData.total"></el-pagination>
      </div>
    </div>
    <el-dialog title="变更" :visible.sync="showChange" v-if="showChange" append-to-body @close="closeChangeDialog">
      <div class="toolbar">
        <el-form size="mini" :model="formData" ref="ruleForm" :inline="true" class="formBill">
          <el-form-item label="新用水类型：" class="f2">
            <el-cascader v-model="formData.newUseWaterType" :options="waterTypeData" :show-all-levels="false" :props="props" @change="changeWaterType"></el-cascader>
          </el-form-item>
          <el-form-item label="水价版本：" class="f2"> 
            <el-select clearable v-model="formData.usePriceVersion" placeholder>
              <el-option v-for="item in waterPriceData" :key="item.id" :label="item.effectiveDate+':'+item.remark" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <!--el-form-item label="更新年水量：" prop="updateYearWater" class="f2">
            <el-select clearable v-model="formData.updateYearWater" placeholder>
              <el-option :key="0" label="否" :value="0"></el-option>
              <el-option :key="1" label="是" :value="1"></el-option>
            </el-select>
          </el-form-item-->
          <el-form-item label="不计阶梯：" prop="firstMeterRead" class="f2">
            <input type="checkbox" v-model="formData.firstMeterRead" />
          </el-form-item>
          <br>
          <el-form-item label="复核原因：" prop="comments" class="f2">
            <el-input type="textarea" v-model="formData.comments" placeholder="请输入" :rows="4" style="width:400px" />
          </el-form-item>
        </el-form>
      </div>
      <!--div class="kl-table" :style="{height: maxHeight + 'px'}">
          <el-table highlight-current-row :max-height="maxHeight" stripe border :data="detailList" class="change-tables-table">
            <el-table-column prop="ctmName" min-width="120" label="客户名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="userNo" min-width="100" label="用户编号"></el-table-column>
            <el-table-column prop="accountPeriod" min-width="80" label="账单年月"></el-table-column>
            <el-table-column prop="costName" min-width="80" label="费用类型"></el-table-column>
            <el-table-column prop="proceedsMoney" min-width="80" label="金额"></el-table-column>
            <el-table-column prop="penaltyMoney" min-width="80" label="违约金"></el-table-column>
            <el-table-column prop="chargeTime" min-width="120" label="销账时间"></el-table-column>
          </el-table>
        </div-->
      <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submit()">确 定</el-button>
        <el-button type="info" size="mini" plain @click="closeChangeDialog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "BatchOpeningReview",
  components: {

  },
  data () {
    return {
      moreOptions: [
        {
          value: "大于等于",
          label: "大于等于"
        },
        {
          value: "大于",
          label: "大于"
        },
        {
          value: "等于",
          label: "等于"
        },
      ],
      lessOptions: [
        {
          value: "小于等于",
          label: "小于等于"
        },
        {
          value: "小于",
          label: "小于"
        },
        {
          value: "等于",
          label: "等于"
        },
      ],
      meterReaderList: [],
      // 主页面显示与隐藏
      indexShow: true,

      // 列表数据
      tableData: {},
      totalData: {},
      costNameList: [],
      costNoList: [],
      bookNos: [],
      staffAccounts: [],
      businessAreaName: '',
      //查询条件对象
      tableQuery: {
        page: 1,
        pageCount: 20,
        bookNos: [],
        fuzzyQuery: '',
        waterTypeId: '',
        businessArea: '',
        shouldAmountStart: '',
        shouldAmountEnd: '',
        vatFlag: '',
        shouldWaterAmountStart: "",
        shouldWaterAmountEnd: "",
        meterReadingStaffName: '',
        more: '大于等于',
        less: '小于',
        moreMoney: '大于等于',
        lessMoney: '小于',
        isHaveLadder:'',
      },
      showbookNosData: [],
      Time: [],
      // 查询条件日期
      businessArea: [],
      props: {//树结构格式
        value: 'id',
        label: 'name',
        emitPath: false,
        checkStrictly: true,
      },
      tprops: {
        value: 'id',
        label: 'name',
        emitPath: false,
        checkStrictly: true,
      },
      // 数据字典数据
      dictionaryData: {},
      useWaterTypeOptions: [],//用水类型下拉框
      waterPriceData:[],
      //面包屑
      crumbsData: {
        titleList: [{ title: "开帐复核" }, { title: "开帐复核" }]
      },
      tableShow: false,
      maxHeight: 0,
      selectList: [],
      openAccountDate: [],
      showChange: false,
      detailList: [],
      formData: {
        usePriceVersion: "",
        newUseWaterType: "",
        firstMeterRead: false,
        comments: '',
      },
      // 收费提醒
      receivableMoney: 0,  // 应缴金额
      calculateNum: 0,// 笔数
      accountPeriods: [], // 账期集合
      calculateWater: 0, // 水量
    };
  },
  mounted () {
    // 侧边栏
    eventBus.$emit('asideMenuShow', 'reportMenuShow4')
    let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1).toString() : '0' + (time.getMonth() + 1)
    let lastDay = new Date(time.getFullYear(), month, 0).getDate()
    this.Time = [time.getFullYear() + "-" + month + '-01', time.getFullYear() + "-" + month + "-" + lastDay];

    //data 里面定义一个axHeight 用于设置table的高度，增加一个v-if事件用于渲染吗，监听maxHeight 的变化控制v-if的变量

    this.common.changeTable(this, ".BatchOpeningReview .index-page", [
      ".BatchOpeningReview .toolbar",
      ".BatchOpeningReview .block"
    ]);
    this.SelectUseWaterTypeOptions()
    this.businessAreaSelect();
    this.getMeterReader();
    this.getCostList();
  },
  created () {
    let time = new Date()
    let month = (time.getMonth() + 1) > 9 ? (time.getMonth() + 1).toString() : '0' + (time.getMonth() + 1)
    let lastDay = new Date(time.getFullYear(), month, 0).getDate();
    this.openAccountDate = [time.getFullYear() + "-" + month + '-01', time.getFullYear() + "-" + month + "-" + lastDay];

  },
  computed: {
    showbookNos () {
      return this.showbookNosData && this.showbookNosData.filter(item => this.tableQuery.bookNos.includes(item.bookNo)).map(item => item.bookNo).join(', ')
    },
  },
  methods: {
    enterEvents (e) {
      if (e.keyCode == 13) {
        this.init()
        this.$refs.select1.blur()
        this.$refs.select2.blur()
        this.$refs.select3.blur()
      }
    },
    businessAreaSelect () {   //营业所下拉框
      let _this = this
      let params = {
        "busicode": "BusinessAreaTree",
        "data": {

        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = this.getArr1(res)
        _this.businessArea = data.children;
      })
    },
    //树结构数据处理
    getArr1 (data) {
      function abc (arr) {
        arr.map(i => {
          if (i.isParent === false) {
            delete i.children;
          } else {
            abc(i.children);
          }
        });
      }
      abc(data.children);
      return data;
    },
    //用水类型下拉框
    SelectUseWaterTypeOptions () {
      let params = {
        "busicode": "WaterTypeTree",
        "data": {
        },
      }
      this.$api.fetch({
        params,//参数
      }).then(res => {
        let data = this.getArr(res.children)
        this.useWaterTypeOptions = data;
        this.waterTypeData = data
      })
    },
    //抄表员下拉框数据
    getMeterReader () {
      let _this = this;
      let params = {
        busicode: "PostUserList",
        data: {
          postNo: "2",
          businessArea: this.tableQuery.businessArea
        },
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          _this.staffAccounts = res;
        });
    },
    // 返回合计数据
    getTotal (param) {
      // let arr = ['合计', '']
      // for (const key in this.totalData) {
      //   if (this.totalData[key] != '合计') {
      //     arr.push(this.totalData[key])
      //     /*if(key === 'costList') {
      //       this.totalData.costList.forEach(item=>{
      //           arr.push(item.money)
      //       })
      //     }*/
      //   }
      // }
      // console.log(arr);
      // return arr
      let vm = this;
      let sums = [];
      var selectedColm = param.columns;
      let newArray = ['合计', '']
      selectedColm.forEach(a => {
        if (vm.totalData[a.property] || vm.totalData[a.property] == 0 || vm.totalData[a.property] == '0') {//与表格列进行匹配
          newArray.push(vm.totalData[a.property])
        } else {
          if (a.property != undefined) {//序号列不push
            newArray.push('')
          }
        }
      });
      sums = newArray;
      sums[2] = ''
      return sums;
    },
    getCostList () {
      let params = {
        busicode: "CostList",
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          this.costNoList = res;
        });
    },
    //树结构数据处理
    getArr (data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].isParent === false) {
          delete data[i].children
        } else {
          this.getArr(data[i].children)
        }
      }
      return data
    },
    // 列表初始化
    init () {
      let _this = this;
      if (this.tableQuery.meterReadingStaffName === '全部') {
        this.tableQuery.meterReadingStaffName = '';
      }
      let params = {
        busicode: "MrOpenAccountReViewList",
        data: this.tableQuery
      };
      params.data.groupCode = localStorage.getItem('companyNo')
      this.$api
        .fetch({
          params //参数
        })
        .then(res => {
          _this.tableData = res.detail
          _this.totalData = res.total
          _this.costNameList = res.costNameList
          _this.tableData.list.forEach(item => {
            item.total = this.formatFloat(item.total)
            item.subTotal = this.formatFloat(item.subTotal)
            item.baseWaterTotal = this.formatFloat(item.baseWaterTotal)
            item.waterJ1 = this.removeZero(item.waterJ1)
            item.priceJ1 = this.removeZero(item.priceJ1)
            item.waterJ2 = this.removeZero(item.waterJ2)
            item.priceJ2 = this.removeZero(item.priceJ2)
            item.waterJ3 = this.removeZero(item.waterJ3)
            item.priceJ3 = this.removeZero(item.priceJ3)
            item.waterJ4 = this.removeZero(item.waterJ4)
            item.priceJ4 = this.removeZero(item.priceJ4)
            item.waterJ5 = this.removeZero(item.waterJ5)
            item.priceJ5 = this.removeZero(item.priceJ5)
            item.waterJ6 = this.removeZero(item.waterJ6)
            item.priceJ6 = this.removeZero(item.priceJ6)
            if (item.priceJ1 !== "") {
              item.priceJ1 = this.formatFloat(item.priceJ1)
            }
            if (item.priceJ2 !== "") {
              item.priceJ2 = this.formatFloat(item.priceJ2)
            }
            if (item.priceJ3 !== "") {
              item.priceJ3 = this.formatFloat(item.priceJ3)
            }
            if (item.priceJ4 !== "") {
              item.priceJ4 = this.formatFloat(item.priceJ4)
            }
            if (item.priceJ5 !== "") {
              item.priceJ5 = this.formatFloat(item.priceJ5)
            }
            if (item.priceJ6 !== "") {
              item.priceJ6 = this.formatFloat(item.priceJ6)
            }
            item.costList.forEach(child => {
              child.money = this.formatFloat(child.money)
            })
            item.penaltyMoney = this.formatFloat(item.penaltyMoney)
          })

          _this.totalData.total = this.formatFloat(_this.totalData.total)
          _this.totalData.subTotal = this.formatFloat(_this.totalData.subTotal)
          _this.totalData.znFee = this.formatFloat(_this.totalData.znFee)
          _this.totalData.ecFee = this.formatFloat(_this.totalData.ecFee)
          _this.totalData.wsWater = this.formatFloat(_this.totalData.wsWater)
          _this.totalData.bzsWater = this.formatFloat(_this.totalData.bzsWater)
          _this.totalData.wasteFee = this.formatFloat(_this.totalData.wasteFee)
          _this.totalData.baseWaterTotal = this.formatFloat(_this.totalData.baseWaterTotal)
          _this.totalData.penaltyMoney = this.formatFloat(_this.totalData.penaltyMoney)
        })
    },

    // 导出
    exportExcel () {
      let params = {
        "busicode": "ProceedsDetailReportExport",
        "data": this.tableQuery,
        token: sessionStorage.getItem('token'),
        sysType: '002'
      }
      window.open(this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
    // 查询
    search () {
      this.tableQuery.page = 1;
      this.init();
    },
    //用水价格下拉框
    WaterPriceList (id) {
      var _this = this;
      var params = {
        busicode: "WaterPriceList",
        data: {
          waterTypeId: id,
          page: 1,
          pageCount: 999,
          processState: 'END',
          status: '1',
        } //流程状态、紧急程度
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
       
               _this.waterPriceData = res.list;
        
       
        });
    },
    changeWaterType (val) {
      this.WaterPriceList(val)
    },
    //分页
    handleSizeChange (val) {
      //显示多少数据一页
      this.tableQuery.pageCount = val
      this.tableQuery.page = 1
      this.init();
    },
    handleCurrentChange (val) {
      //显示多少页码
      this.tableQuery.page = val
      this.init();
    },
    indexMethod (index) {
      //获取表格序号
      return (this.tableQuery.page - 1) * this.tableQuery.pageCount + (index + 1);
    },

    getSort (sort) {
      console.log(sort);
      if (sort.prop === '智能表改造费') {
        sort.prop = 'znFee'
      } else if (sort.prop === '二次供水服务费') {
        sort.prop = 'ecFee'
      } else if (sort.prop === "不征税自来水") {
        sort.prop = 'bzsWater'
      } else if (sort.prop === '污水费') {
        sort.prop = 'wsWater'
      } else if (sort.prop === '垃圾费') {
        sort.prop = 'wasteFee'
      }
      if (sort.prop === 'waterJ1' || sort.prop === 'priceJ1' || sort.prop === 'waterJ2' || sort.prop === 'priceJ2' || sort.prop === 'waterJ3' || sort.prop === 'priceJ3'
        || sort.prop === 'waterJ4' || sort.prop === 'priceJ4' || sort.prop === 'waterJ5' || sort.prop === 'priceJ5' || sort.prop === 'waterJ6' || sort.prop === 'priceJ6') {
        sort.prop = sort.prop.substring(0, 5) + '_' + sort.prop.substring(5);
      }
      if (sort.prop === 'ctmAddr') {
        sort.prop = 'ctm_addr'
      } else if (sort.prop === 'ctmName') {
        sort.prop = 'ctm_name'
      }
      if (sort.prop === 'chargeTime') {
        sort.prop = 'CHARGE_TIME'
      }
      if (sort.order === 'descending') {
        this.tableQuery.sort = 'a.' + sort.prop + ' DESC';
      } else if (sort.order === 'ascending') {
        this.tableQuery.sort = 'a.' + sort.prop + ' ASC';
      } else {
        this.tableQuery.sort = null;
      }
      this.init();
    },
    // 快捷查询
    toDetail (userNo) {
      let routeUrl = this.$router.resolve({ path: '/UserInfoSearchDetail' });
      sessionStorage.setItem('userNo', userNo)
      window.open(routeUrl.href, '_blank');
      sessionStorage.removeItem('userNo')
    },
    formatFloat (num) {
      var value = Math.round(parseFloat(num) * 100) / 100;
      var arrayNum = value.toString().split(".");
      if (arrayNum.length == 1) {
        return value.toString() + ".00"
      }
      if (arrayNum.length > 1) {
        //小数点右侧 如果小于两位则补一个0
        if (arrayNum[1].length < 2) {
          return value.toString() + "0";
        }
        return value;
      }
    },
    removeZero (value) {
      if (value == 0) {
        return value = ''
      } else {
        return value
      }
    },
    review () {
      var _this = this;
      this.$confirm('将复核该预开帐账单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = []
        let meterReadingIds = []
        _this.selectList.forEach(item => {
          let billDetailIds = item.billDetailId.split(',')
          data = data.concat(billDetailIds)
          meterReadingIds.push(item.meterReadingId)
        })
        var params = {
          busicode: "MrOpenAccountReview",
          data: { billDetailIds: data, meterReadingId: meterReadingIds }//流程状态、紧急程度
        };
        this.$api
          .fetch({
            params: params //参数
          })
          .then(res => {
            this.$message({
              type: "success",
              message: "已成功生成账单!"
            });
          });
      }).catch((res) => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    deleteDetail (val) {
      var _this = this;
      console.log(_this.selectList);
      this.$confirm('将删除预开帐账单' + (val == 1 ? '及抄表数据' : '') + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {}
        data.meterReadingIds = _this.selectList.map(item => { return { meterReadingId: item.meterReadingId, waterPriceId: item.waterPriceId } })
        data.status = val
        var params = {
          busicode: "MrOpenAccountReViewDel",
          data: data//流程状态、紧急程度
        };
        this.$api
          .fetch({
            params: params //参数
          })
          .then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
      }).catch((res) => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    submit () {
      var _this = this;

      let data = JSON.parse(JSON.stringify(_this.formData))
      data.meterReadingIds = _this.selectList.map(item => { return { meterReadingId: item.meterReadingId, waterPriceId: item.waterPriceId } })
      data.firstMeterRead = (data.firstMeterRead == true ? 1 : 0);
      var params = {
        busicode: "MrOpenAccountReviewSave",
        data: data//流程状态、紧急程度
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.$message({
            type: "success",
            message: "已生成复核记录!"
          });
          _this.showChange = false
        });
    },
    change () {
      var _this = this;
      console.log(_this.selectList);
      if (_this.selectList.length == 0) {
        this.$message({
          type: "error",
          message: "未选中需要复核的账单!"
        });
        return
      }
      this.formData.newUseWaterType = _this.selectList[0].useWaterType;
      this.formData.usePriceVersion = _this.selectList[0].waterPriceId;
      console.log(this.formData);
         _this.showChange = true

      this.changeWaterType(this.formData.newUseWaterType)
      /*
      var params = {
        busicode: "MrOpenAccountReViewQuery",
        data: _this.selectList
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.detailList = res;
          _this.showChange = true
        });*/
   
    },
    closeChangeDialog () {
      this.showChange = false
    },
    // 抄表员数据获取
    getReadingStaff () {
      var _this = this;
      var params = {
        "busicode": "PostUserList",
        "data": {
          "postNo": "2",
          businessArea: this.tableQuery.businessArea
        },
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          _this.meterReaderList = res;
        });
    },

    // 营业区域改变
    changeBusinessArea () {
      if (this.tableQuery.businessArea) {
        this.getBooks();
      } else {
        this.bookNos = [];
      }
      this.getMeterReader();
    },
    changeMeterReadingStaff () {
      this.getBooks();
    },
    getBooks () {
      // if (this.tableQuery.meterReadingStaffName){
      let params = {
        busicode: 'baseAllBooks',
        data: {
          businessArea: this.tableQuery.businessArea,
          meterReadingStaff: this.tableQuery.meterReadingStaffName,
        }
      };
      this.$api
        .fetch({
          params, //参数
        })
        .then((res) => {
          this.tableQuery.bookNos = []
          this.bookNos = [...res];
          this.showbookNosData = []
          this.bookNos.forEach(item => {
            item.baseBookListVOList.forEach(child => {
              this.showbookNosData.push(child)
            })
          })
        });
      // }else {
      //   this.bookNos = [];
      //   this.showbookNosData = [];
      // }

    },

    // 勾选
    getSelectList (e) {

      this.selectList = e
      this.receivableMoney = 0
      this.accountPeriods = []
      this.calculateNum = 0
      this.calculateWater = 0
      this.selectList.forEach(item => {
        this.receivableMoney += Number(item.total || 0)
        // let userAndAccountPeriod = {
        //   userNo: item.userNo,
        //   accountPeriod: item.accountPeriod
        // }
        // if (JSON.stringify(this.accountPeriods).indexOf(JSON.stringify(userAndAccountPeriod)) !== -1) {
        // } else {
        //   this.accountPeriods.push(userAndAccountPeriod)
        //   this.calculateNum++
        // }
        this.calculateNum++
        this.calculateWater += Number(item.realityWater || 0)
      })
      this.receivableMoney = this.receivableMoney.toFixed(2)   //保留两位小数
    },
    handleTableCellClick (row, cell, event) {
      //把这个flag 变成当前的行的私有物,这样一来,每次变化的时候, 变化的都是你当前行的布尔值, 
      // row.flag = !row.flag;  
      // this.$refs.eltableCurrentRow.toggleRowSelection(row,row.flag);    
      const len = row.rowspan != undefined ? row.rowspan : 1
      const ind = this.tableData.list.findIndex(item => item.id === row.id)
      var select = []
      for (let i = ind; i < ind + len; i++) {
        select.push(this.tableData.list[i])
      }
      if (this.selectList.some(item => select.some(val => val.id === item.id))) { //取消该账期勾选
        this.getSelectList(this.selectList.filter(item => select.every(val => val.id !== item.id)))
        select.forEach(item => {
          this.$refs.eltableCurrentRow.toggleRowSelection(item, false);
        })
      } else { //恢复该账期勾选
        this.getSelectList(this.selectList.concat(select))
        this.selectList.concat(select).forEach(item => {
          this.$refs.eltableCurrentRow.toggleRowSelection(item, true);
        })
      }
    },
    cellStyle (data) {
      return "cursor:pointer;"
    },

    // 跳转快捷查询
    toQuickSearch (row, column, cell, event) {
      //   console.log(row, column, cell, event)
      //   if (column.label == "用户编号") {
      //     sessionStorage.setItem('userNo', row.userNo)
      //     window.open('#/UserInfoSearchDetail');
      //   }
    }
  },
  watch: {
    maxHeight () {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    },
    Time (val) {
      if (val && val.length > 0) {
        this.tableQuery.startAccountPeriod = val[0]
        this.tableQuery.endAccountPeriod = val[1]
      }else{
        this.tableQuery.startAccountPeriod = ""
        this.tableQuery.endAccountPeriod = ""
      }
    }
  }
};
</script>
<style lang="scss" scoped>
$imgWidth: 200px;
$theme-color: #297acc;
.BatchOpeningReview {
  width: 100%;
  height: 100%;
  .index-page {
    height: calc(100% - 41px);
  }
  .clickableTip {
    color: #297acc;
  }
}
/deep/ {
  .el-table {
    .el-table__fixed {
      // 左固定列
      height: auto !important;
    }
    .el-table__fixed-right {
      // 右固定列
      height: auto !important;
    }
    .el-table__body-wrapper {
      z-index: 2;
    }
  }
}

/deep/ {
  // 第一行
  .item {
    width: 22%;
    .el-form-item__content {
      width: calc(100% - 73px);
    }
  }
  .dateAndTime {
    width: 25%;
    .el-form-item__content {
      width: 75%;
      .el-date-editor {
        width: 100%;
      }
    }
  }
  .shouldWater {
    width: 100%;
    .el-input__inner {
      width: 100%;
    }
  }

  // 第二行
  .el-col-3 {
    width: auto;
  }

  // 第三行
  .shouldWaterInput {
    width: auto;
  }
}
.userNo >>> .el-input__inner {
  width: 100%;
}
.chargeRemind {
  margin-left: 50px;
  .el-form-item__content {
    color: #606266;
  }
}
.noteReminder {
  width: 30%;
  float: left;
  text-align: left !important;
  line-height: 32px;
}
/deep/ {
  .el-table__body .el-table__row {
    td:nth-child(5),
    td:nth-child(6),
    td:nth-child(13),
    td:nth-child(29),
    td:nth-child(30),
    td:nth-child(31),
    td:nth-child(32),
    td:nth-child(33),
    td:nth-child(34) {
      .cell {
        text-align: right !important;
      }
    }
  }
  .el-table__header {
    th:nth-child(5),
    th:nth-child(6),
    th:nth-child(13),
    th:nth-child(29),
    th:nth-child(30),
    th:nth-child(31),
    th:nth-child(32),
    th:nth-child(33),
    th:nth-child(34) {
      .cell {
        text-align: right !important;
      }
    }
  }
  .el-table__footer {
    td:nth-child(5),
    td:nth-child(6),
    td:nth-child(13),
    td:nth-child(29),
    td:nth-child(30),
    td:nth-child(31),
    td:nth-child(32),
    td:nth-child(33),
    td:nth-child(34) {
      .cell {
        text-align: right !important;
      }
    }
  }
}
</style>
