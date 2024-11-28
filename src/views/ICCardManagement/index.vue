<template>
  <div class="ICCardManagement">
    <div class="bread-contain">
      <publicCrumbs :crumbsData="crumbsData"></publicCrumbs>
    </div>
    <el-row :style="{ height: 'calc(100% - 40px)' }">
      <el-col
        :span="13"
        :style="{ height: '100%', borderRight: '2px solid #eaf4ff' }"
      >
        <div class="toolbar">
          <el-form
            :inline="true"
            size="mini"
            @submit.native.prevent
            class="demo-form-inline"
          >
            <el-form-item label="" class="width-150">
              <el-input
                v-model="fuzzyQuery"
                placeholder="请输入户号/IC卡号"
                @keydown.enter.native="search"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="searchBtn" @click="search" icon="el-icon-search"
                >查询</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="advVisible = true"
                class="soce-query"
                >高级查询</el-button
              >
               <el-button
                type="primary"
                size="mini"
                @click="repairDialogVisible = true"
                class="soce-query"
                >查看报表</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <div style="position: relative; height:100%">
          <el-tabs v-model="activeName"  class="subTables">
            <el-tab-pane
              :label="item.subMeterNo +(item.subMeterNo?'号子表':'') "
              :name="'tab' + idx"
              v-for="(item, idx) in userInfoListPlaceholder"
              :key="item.subMeterNo"
            >
              <div style="padding-left:20px">
                <el-form :inline="true" size="mini" class="formBill icBaseInfo">
                  <el-form-item label="用户编号：">
                    <span>{{ item.userNo | emptyString}}</span>
                  </el-form-item>
                   <el-form-item label="用户名称：">
                    <span>{{ item.userName | emptyString}}</span>
                  </el-form-item>
                  <el-form-item label="用户状态：">
                    <span :class="{red:item.userStatus !== '正常'}">{{ item.userStatus | emptyString}}</span>
                  </el-form-item>
                  <el-form-item label="锁定状态：">
                    <span v-if="item.lockStatus === '异常'" style="color:red">{{ item.lockStatus }}</span>
                     <span v-else>{{ item.lockStatus| emptyString }}</span>
                  </el-form-item>
                  <el-form-item label="用水类型：">
                    <span>{{ item.useWaterType | emptyString}}</span>
                  </el-form-item>
                  <el-form-item label="装表地址：" :style="{ minWidth: '64%' }">
                    <span>{{ item.userAddr | emptyString}}</span>
                  </el-form-item>
                  <el-form-item label="证件号码：">
                    <span>{{ item.certNo | emptyString}}</span>
                  </el-form-item>
                  <el-form-item label="手机号码：">
                    <span>{{ item.mobile | emptyString}}</span>
                  </el-form-item>
                   <el-form-item label="水表厂家：">
                    <span>{{ item.meterFactory | emptyString}}</span>
                  </el-form-item>
                  <el-form-item label="水表型号：">
                    <span>{{ item.meterModel | emptyString}}</span>
                  </el-form-item>
                  <el-form-item label="表身码：">
                    <span>{{ item.factoryNo| emptyString }}</span>
                  </el-form-item>
                  <el-form-item label="用户备注：">
                    <span>{{ item.comments | emptyString}}</span>
                  </el-form-item>
                  <el-form-item label="表累购量：">
                    <span>{{ item.meterBuySum | emptyString}}</span>
                  </el-form-item>
                  <el-form-item label="预存余额：">
                    <span>{{ item.prestoreBalance | emptyString}}</span>
                  </el-form-item>
                  <el-form-item
                    label="最后购水时间："
                  >
                    <span>{{ item.lastBuyTime | emptyString}}</span>
                  </el-form-item>
                  <el-form-item label="最后购水量：" >
                    <span>{{ item.lastBuyNum | emptyString}}</span>
                  </el-form-item>
                  <el-form-item label="卡累购次：" >
                    <span>{{ item.cardBuyCount | emptyString}}</span>
                  </el-form-item>
                  <el-form-item label="年购买次数：">
                    <span>{{ item.yearBuyCount | emptyString}}</span>
                  </el-form-item>
                  <el-form-item label="采样点：">
                    <span>{{ item.samplingPlace | emptyString}}</span>
                  </el-form-item>
                  <el-form-item label="限购量：">
                    <span>{{ item.limitBuyNum | emptyString}}</span>
                  </el-form-item>
                  <el-form-item label="关阀报警：">
                    <span>{{ item.closeAlarmValue | emptyString}}</span>
                  </el-form-item>
                  <el-form-item label="显示报警：">
                    <span>{{ item.showAlarmValue| emptyString }}</span>
                  </el-form-item>
                  <el-form-item label="卡累用量：">
                    <span>{{ item.useWaterSum | emptyString}}</span>
                  </el-form-item>
                  <el-form-item label="卡累购量：">
                    <span>{{ item.cardBuySum | emptyString}}</span>
                  </el-form-item>
                      <el-form-item label="营业区域：">
                    <span>{{ item.businessArea | emptyString}}</span>
                  </el-form-item>
                      <el-form-item label="表类型：">
                    <span>{{ item.meterType | emptyString}}</span>
                  </el-form-item>
                      <el-form-item label="表状态：">
                    <span>{{ item.meterStatus | emptyString}}</span>
                  </el-form-item>
                      <el-form-item label="年购水量：">
                    <span>{{ item.yearBuyNum | emptyString}}</span>
                  </el-form-item>
                </el-form>
               <span
                v-show="item.userNo"
                  size="mini"
                  style="top:0px;right:6%;position: absolute;cursor: pointer;color:#e6c63c"
                  @click="change(item.userNo)"
                  >变更></span>
                <span
                v-show="item.userNo"
                  size="mini"
                  style="top:0px;right:0px;position: absolute;cursor: pointer;color:#409eff"
                  @click="detail(item.userNo)"
                  >详情></span>
              </div>
             
     <div style="display:inline-block;position: absolute;z-index: 999;right: 0;margin-top: 5px;">
         <el-button size="mini" type="primary" icon="el-icon-full-screen" @click="showHistoryDialog(idx)">全屏</el-button>
            <el-button size="mini" type="primary" icon="el-icon-upload2" @click="exportExcel(item.userNo)">导出</el-button>
          </div>
        <el-tabs v-model="historytab" class="historytab">
     
           
          <el-tab-pane label="历史记录" name="history">
            <div
                class="kl-table historyList"
                :style="{'height':maxHeight+'px'}"
              >
              <ICHistoryList :data="item.historyList"></ICHistoryList>
              </div>
    </el-tab-pane>


  </el-tabs>
             
              <!-- 分页 -->
              <!-- <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="tableQuery.page"
            :page-sizes="[20, 100, 500, 1000]"
            :page-size="tableQuery.pageCount"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.total"
          >
          </el-pagination>
        </div> -->
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>

      <!--IC卡操作区开始-->
      <el-col :span="11" :style="{ height: '100%' }" class="icbox-container">

        <div class="top-btn">
            <div class="btn-title">快捷功能</div>
          <el-row class="main-btn">

              <el-button
              :style="{background:'url('+imgurl.icdk+')  no-repeat center ',width:'30%',color:'#fff',...this.icbtnStyle}"
            @click="readICCard"
            >读卡</el-button
          >


              <el-button
              class="word3"
               :style="{background:'url('+imgurl.icbsj+')  no-repeat center ',...this.icbtnStyle}"
                 @click="fillData"
                 v-auth="['fillData']">补数据</el-button
              >


              <el-button  @click="repair"
               :style="{background:'url('+imgurl.icwx+')  no-repeat center ',...this.icbtnStyle}"
                v-auth="['fixICWater']">维修</el-button
              >



              <el-button @click="clearICCard"
               :style="{background:'url('+imgurl.icqk+')  no-repeat center ',...this.icbtnStyle}"
                v-auth="['clearICCard']">清卡</el-button
              >


          </el-row>

          <div>
            <el-row class="other-btn">

              <el-button @click="openICCard"
               :style="{background:'url('+imgurl.ickk+')  no-repeat center ',...this.icbtnStyle1}"
                 v-auth="['openCard']">开卡</el-button
              >


              <el-button  @click="buyWater"
               :style="{background:'url('+imgurl.icgs+')  no-repeat center ',...this.icbtnStyle1}"
                v-auth="['buyWater']">购水</el-button
              >


                <el-button @click="setting"
                 :style="{background:'url('+imgurl.icszk+')  no-repeat center ',...this.icbtnStyle1}" v-auth="['setting']">设置</el-button>

                <el-button @click="queryICCard"
                 :style="{background:'url('+imgurl.iccxk+')  no-repeat center ',...this.icbtnStyle1}" v-auth="['query']">查询</el-button>


                <el-button @click="clear"
                 :style="{background:'url('+imgurl.icql+')  no-repeat center ',...this.icbtnStyle1}" v-auth="['clear']">清零</el-button>



            </el-row>
          </div>
        </div>

        <!--IC卡查询信息区开始-->
        <div class="subTableInfoContainer">
          <div
            v-for="(item) in subTableList"
            :key="item.ZhiBiaoHao"
            class="subTableInfoBox"
          >
            <!-- <div class="btn-title">子表信息{{idx+1}}</div> -->
            <div class="subTableInfo">
              <div class="item">
                <div class="label">卡号</div>
                <div class="value">{{ item.BiaoHao |emptyString}}</div>
              </div>
              <div class="item">
                <div class="label">子表号</div>
                <div class="value">{{ item.ZhiBiaoHao|emptyString }}</div>
              </div>
                 <div class="item">
                <div class="label">卡类型</div>
                <div class="value"><span v-show="item.KaLeiXin == 0">开户卡</span><span v-show="item.KaLeiXin == 1">用户卡</span>
                <span v-show="item.KaLeiXin == 2">退购卡</span><span v-show="item.KaLeiXin == 3">设置卡</span>
                <span v-show="item.KaLeiXin == 4">查询卡</span><span v-show="item.KaLeiXin == 5">清零卡</span>
                <span v-show="item.KaLeiXin == 6">总清零卡</span><span v-show="item.KaLeiXin === ''">-</span></div>
              </div>
                <div class="item">
                <div class="label">数据</div>
                <div class="value"><span v-show="item.ShuJu == 1">有数据</span><span v-show="item.ShuJu == 0">没数据</span><span v-show="item.ShuJu === ''">-</span></div>
              </div>
              <div class="item">
                <div class="label">表状态</div>
                <div class="value"><span v-show="item.BiaoZhuangTai == 1">阀门坏</span><span v-show="item.BiaoZhuangTai == 0">阀门好</span><span v-show="item.BiaoZhuangTai === ''">-</span></div>
              </div>
              <div class="item">
                <div class="label">插表</div>
                <div class="value"><span v-show="item.ChaKa == 1">已插表</span><span v-show="item.ChaKa == 0">未插表</span></div>
              </div>

              <div class="item">
                <div class="label">区域号</div>
                <div class="value">{{ item.QuYuHao|emptyString }}</div>
              </div>
              <!-- <div class="item">
                <div class="label">采样点</div>
                <div class="value">{{ item.CaiYangDian |emptyString}}</div>
              </div> -->

              <div class="item">
                <div class="label">显示报警量</div>
                <div class="value">{{ item.XianShiBaoJingLiang|emptyString }}</div>
              </div>
              <div class="item">
                <div class="label">关阀报警量</div>
                <div class="value">{{ item.GuanBiBaoJingLiang|emptyString }}</div>
              </div>
              <div class="item">
                <div class="label">限购量</div>
                <div class="value">{{ item.XianGouLiang|emptyString }}</div>
              </div>
        
              <div class="item">
                <div class="label">累计购量</div>
                <div class="value">{{ item.LeiJiGouLiang |emptyString}}</div>
              </div>
              <div class="item">
                <div class="label">累计用量</div>
                <div class="value">{{ item.LeiJiYongLiang|emptyString }}</div>
              </div>
              <div class="item">
                <div class="label">剩余量</div>
                <div class="value">{{ item.ShengYuLiang |emptyString}}</div>
              </div>
              <div class="item">
                <div class="label">过零量</div>
                <div class="value">{{ item.GuoLingLiang|emptyString }}</div>
              </div>
              <div class="item">
                <div class="label">购买次数</div>
                <div class="value">{{ item.GouMaiCiShu |emptyString}}</div>
              </div>
              <div class="item">
                <div class="label">购买量</div>
                <div class="value">{{ item.GouMaiLiang |emptyString}}</div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!--IC卡相关弹窗开始-->
    <el-dialog
      title="设置卡"
      :visible="settingVisible"
      :close-on-click-modal="false"
      width="565"
      @close="settingVisible = false"
    >
      <el-form
        size="mini"
        :model="settingFormData"
        :rules="settingFormRules"
        ref="settingForm"
        label-width="130px"
        :inline="true"
      >
        <el-form-item label="子表号：" prop="ZhiBiaoHao">
          <el-input
            v-model="settingFormData.ZhiBiaoHao"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="采样点：" prop="CaiYangDian">
          <el-select
            clearable
            v-model="settingFormData.CaiYangDian"
            placeholder="请选择"
          >
            <el-option
              v-for="item in [0.01, 0.1,1, 10,100]"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区域号：" prop="QuYuHao">
          <el-input
            v-model="settingFormData.QuYuHao"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="显示报警量：" prop="XianShiBaoJingLiang">
          <el-input
            v-model="settingFormData.XianShiBaoJingLiang"
            placeholder="请输入"
          ></el-input>
        </el-form-item>

        <el-form-item label="关闭报警量：" prop="GuanBiBaoJingLiang">
          <el-input
            v-model="settingFormData.GuanBiBaoJingLiang"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="限购量：" prop="XianGouLiang">
          <el-input
            v-model="settingFormData.XianGouLiang"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="本次购量：" prop="GouMaiLiang">
          <el-input
            v-model="settingFormData.GouMaiLiang"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" plain @click="settingSubmit('settingForm')"
          >确 定</el-button
        >
        <el-button type="info" size="mini" plain @click="settingVisible = false"
          >取 消</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="维修"
      :visible="repairVisible"
      :close-on-click-modal="false"
      width="700px"
      @close="repairVisible = false"
    >
      <el-form
      size="mini"
        :model="repairFormData"
        :rules="subTableRules"
      >
       <div class="repairFormList">
        <el-row :gutter="10" class="form-head">
        <el-col :span="3" class="form-lable"></el-col>
        <el-col :span="4">操作类型</el-col>
        <el-col :span="4">表状态</el-col>
        <el-col :span="4">表类型</el-col>
        <el-col :span="3">上期抄码</el-col>
        <el-col :span="3">本期抄码</el-col>
        <el-col :span="3">余量</el-col>
      </el-row>
             
        <el-row :gutter="10" v-for="item in userInfoList"
          :key="item.icSubMeterNo">
    <el-col  :span="3" class="form-lable" >子表{{item.icSubMeterNo}}：</el-col>
       <el-col  :span="4" > 
          <el-form-item >
           <el-select
            clearable
            v-model="repairFormData.list[item.icSubMeterNo].opsType"
            placeholder="请选择"
          >
          <el-option 
              label="无"
              value="">无</el-option>
            <el-option
              v-for="o in dictionaryData.ICOPS"
              :key="o.id"
              :label="o.name"
              :value="o.value"
            ></el-option>
          </el-select>
        </el-form-item></el-col>

                <el-col  :span="4">
                <el-form-item >
            <el-select
            clearable
            v-model="repairFormData.list[item.icSubMeterNo].meterStatus"
            placeholder="请选择"
          >
            <el-option
              v-for="s in dictionaryData.ICMMS"
              :key="s.id"
              :label="s.name"
              :value="s.value"
            ></el-option>
          </el-select>
             </el-form-item>   
        </el-col> 
          <el-col  :span="4">
            <el-form-item  >
             <el-select
            clearable
            v-model="repairFormData.list[item.icSubMeterNo].meterType"
            placeholder="请选择"
          >
            <el-option
              v-for="t in dictionaryData.ICMMT"
              :key="t.id"
              :label="t.name"
              :value="t.value"
            ></el-option>
          </el-select>
        </el-form-item>   
              </el-col>
                <el-col  :span="3">
         <el-form-item >
          <el-input
               v-model="repairFormData.list[item.icSubMeterNo].lastReadNum"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
              </el-col>
            <el-col  :span="3">
         <el-form-item >
          <el-input
              v-model="repairFormData.list[item.icSubMeterNo].curReadNum"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
              </el-col>
                <el-col  :span="3">
         <el-form-item >
          <el-input
           v-model="repairFormData.list[item.icSubMeterNo].margin"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
              </el-col>
        </el-row>
          </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" plain @click="repairSubmit"
          >确 定</el-button
        >
        <el-button type="info" size="mini" plain @click="repairVisible = false"
          >取 消</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="查询"
      :visible="queryVisible"
      :close-on-click-modal="false"
      width="30%"
      @close="queryVisible = false"
    >
      <el-form size="mini" label-width="130px" :model="queryFormData" ref="queryForm" :rules="queryFormRules">
        <el-form-item label="区域号：" prop="areaNo">
          <el-input
            v-model="queryFormData.areaNo"
            placeholder="请输入区域号"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" plain @click="querySubmit('queryForm')"
          >确 定</el-button
        >
        <el-button type="info" size="mini" plain @click="queryVisible = false"
          >取 消</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="清零"
      :visible="clearVisible"
      :close-on-click-modal="false"
      width="30%"
      @close="clearVisible = false"
    >
      <el-form size="mini" label-width="80px" :model="clearFormData" ref="clearForm" :rules="clearFormRules">
        <el-form-item label="区域号：" prop="areaNo">
          <el-input
            v-model="clearFormData.areaNo"
            placeholder="请输入区域号"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" plain @click="clearSubmit('clearForm')"
          >确 定</el-button
        >
        <el-button type="info" size="mini" plain @click="clearVisible = false"
          >取 消</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="高级搜索"
      :visible="advVisible"
      :close-on-click-modal="false"
      class="common-dialog"
      style="height:660px"
      @close="advVisible = false"
    >
      <el-form size="mini" :model="advTableQuery" :inline="true" style="margin: 6px 25px;" @submit.native.prevent>
        <el-form-item label="客户名称：" class="width-150">
          <el-input
            v-model="advTableQuery.ctmName"
            placeholder="客户名称"
             @keydown.enter.native="advSearch"
          ></el-input>
        </el-form-item>
          <el-form-item label="客户地址：" class="width-150">
          <el-input
            v-model="advTableQuery.ctmAddress"
            placeholder="客户地址"
             @keydown.enter.native="advSearch"
          ></el-input>
        </el-form-item>
          <el-form-item label="手机号：" class="width-150">
          <el-input
            v-model="advTableQuery.mobile"
            placeholder="手机号"
             @keydown.enter.native="advSearch"
          ></el-input>
        </el-form-item>
          <el-form-item label="证件号：" class="width-150">
          <el-input
            v-model="advTableQuery.certNo"
            placeholder="证件号"
             @keydown.enter.native="advSearch"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="searchBtn" @click="advSearch" icon="el-icon-search"
            ></el-button
          >
        </el-form-item>
            </el-form>
        <div
          class="kl-table advList"
        >
          <el-table
            :height="450"
            center
            stripe
            border
            :data="advList.list"
            @row-dblclick="advListRowClick"
            class="wuserInfo-table"
          >
            <el-table-column
              align="center"
              type="index"
              label="NO."
              width="50"
              :index="indexMethod"
            ></el-table-column>
            <el-table-column
              prop="userNo"
              min-width="100"
              label="用户编号"
            ></el-table-column>
            <el-table-column
              prop="ctmName"
              min-width="100"
              label="客户名称"
            ></el-table-column>
            <el-table-column
              prop="icCardNo"
              min-width="100"
              label="IC卡号"
            ></el-table-column>
            <el-table-column
              prop="mobile"
              min-width="100"
              label="手机号"
            ></el-table-column>
            <el-table-column
              prop="certNo"
              min-width="150"
              label="证件号"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="ctmAddr"
              min-width="200"
              label="客户地址"
              show-overflow-tooltip
            ></el-table-column>
          </el-table>
           <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="advTableQuery.page"
            :page-sizes="[50, 100, 500, 1000]"
            :page-size="advTableQuery.pageCount"
            layout="total, sizes, prev, pager, next, jumper"
            :total="advList.total"
          >
          </el-pagination>
        </div>
        </div>
  
    </el-dialog>

    <el-dialog
      title="客户详情"
      :visible="userInfoVisible"
      v-if="userInfoVisible"
      :close-on-click-modal="false"
      width="99%"
      @close="userInfoVisible = false"
    >
      <userInfoEdit
        class="common-dialog"
        ref="userInfoEdit"
        :formDataUserNo="userNo"
      ></userInfoEdit>
    </el-dialog>

     <el-dialog
      title="客户变更"
      :visible="userInfoChangeVisible"
      v-if="userInfoChangeVisible"
      :close-on-click-modal="false"
      width="60%"
      @close="userInfoChangeVisible = false"
    >
      <userInfoChangeEdit
        class="common-dialog"
        ref="userInfoChangeEdit"
        :formDataUserNo="userNo"
        :listData="userInfoListPlaceholder"
      ></userInfoChangeEdit>
       <div slot="footer" class="dialog-footer" ref="ruleForm">
        <el-button type="primary" size="mini" plain @click="submitUserChangeForm">保 存</el-button>
        <el-button type="info" size="mini" plain @click="closeUserChangeDialog">取 消</el-button>
      </div>
    </el-dialog>
    
    <el-dialog
      title="购水"
      :visible="buyWaterVisible"
      v-if="buyWaterVisible"
      :close-on-click-modal="false"
      width="99%"
      @close="closeBuyWater"
    >
      <buyWaterToolBlock
        :userInfoList="userInfoList"
        @buyWaterSubmit="buyWaterSubmit"
        @verifyMeterType="verifyMeterType"
      ></buyWaterToolBlock>
    </el-dialog>

    <el-dialog
      title="历史记录"
      :visible="historyDialogVisible"
      v-if="historyDialogVisible"
     :fullscreen="true"
      @close="historyDialogVisible = false"
    >
     <ICHistoryList :data="historyData"></ICHistoryList>
    </el-dialog>

     <el-dialog
     append-to-body
      title="维修换表报表"
      :visible="repairDialogVisible"
      v-if="repairDialogVisible"
      @close="repairDialogVisible = false"
      class="button-dialog"
      :close-on-click-modal="false"
    >
     <ICRepairList ref="SelectUserTable"></ICRepairList>
    </el-dialog>

  </div>
</template>
<script>
import userInfoEdit from "../CustomerCenter/userInfo/userInfoEdit";
import buyWaterToolBlock from "./buyWaterToolBlock";
import ICHistoryList from "./ICHistoryList";
import ICRepairList from '@/components/ICRepairList'
import userInfoChangeEdit from '@/components/userInfoChangeEdit'

import { nextTick } from 'q';
import vauth from '@/assets/js/authVueDirective.js';
export default {
  name: "ICCardManagement",
  components: {
    buyWaterToolBlock,
    userInfoEdit,
    ICHistoryList,
    ICRepairList,
    userInfoChangeEdit
  },
  data() {
    return {
      activeName: "tab0", //默认tab
      historyData:[],
      repairData:[],//维修换表列表
      subMeterNoMap:{},
      icbtnStyle:{
      'background-position-x':'initial',
      'background-size':'cover',
      },
        icbtnStyle1:{
      'background-size':'contain',
      },
      userNo: "",
      crumbsData: {
        //面包屑
        titleList: [{ title: "业务管理" }, { title: "IC卡管理" }]
      },
      subTableRules: {
        repairTableList: [{
          type: "array",
          required: true,
          message: "请选择需要维修的子表",
          trigger: "change"
        }],
        changeTableList: [{
          type: "array",
          required: true,
          message: "请选择需要更换的子表",
          trigger: "change"
        }]
      },
  
      changeVisible: false,
      queryVisible: false,
      clearVisible: false,
      repairVisible: false,
      userInfoVisible: false,
      userInfoChangeVisible: false,
      historyDialogVisible:false,
      repairDialogVisible:false,
      imgurl:{//按钮背景
          icbsj:require("@/assets/images/icbsj.png"),
          iccxk:require("@/assets/images/iccxk.png"),
          icdk:require("@/assets/images/icdk.png"),
          icgs:require("@/assets/images/icgs.png"),
          ichb:require("@/assets/images/ichb.png"),
          ickk:require("@/assets/images/ickk.png"),
          icqk:require("@/assets/images/icqk.png"),
          icql:require("@/assets/images/icql.png"),
          icszk:require("@/assets/images/icszk.png"),
          icwx:require("@/assets/images/icwx.png")
      },
      settingFormData: {
        //设置卡
        //设置初始
        QuYuHao: "9999",
        ZhiBiaoHao: "",
        CaiYangDian: "1",
        XianShiBaoJingLiang: "",
        GuanBiBaoJingLiang: "",
        XianGouLiang: "",
        GouMaiLiang: ""
      },
        settingFormRules: {
        //设置卡
        //设置初始
        QuYuHao: [{required: true,message: "请输入区域号"}],
        ZhiBiaoHao: [{required: true,message: "请输入子表号"}],
        CaiYangDian: [{ 
          required: true,
          message: "请选择采样点",
          trigger: "change"}],
        XianShiBaoJingLiang: [{required: true,message: "请输入显示报警量"}],
        GuanBiBaoJingLiang:[{required: true,message: "请输入关闭报警量"}],
        XianGouLiang: [{required: true,message: "请输入限购量"}],
        GouMaiLiang:[{required: true,message: "请输入购买量"}]
      },

      queryFormData: { areaNo: "9999" },
      clearFormData: { areaNo: "9999" },
      queryFormRules:{areaNo:[{required: true,message: "请输入区域号"}]},
      clearFormRules:{areaNo:[{required: true,message: "请输入区域号"}]},
      repairFormData: {list:{}},
      settingVisible: false,
      fuzzyQueryAdv: "",
      advList: {},
      subTableList: [],
      icCardNo: "",
      buyWaterVisible: false,
      advVisible: false,

      advTableQuery: {
        ctmName:"",
       ctmAddress:"",
         mobile:"",
        certNo:"",
        page: 1, //当前页码
        pageCount: 50 //当前页展示多少条数据
      },
      historytab:'history',
      fuzzyQuery: "",
      maxHeight: 150,
      dictionaryData:{},
      tableShow: false,
      tableData: {
        list: []
      },
      loadingShow: false,
      userInfoList: [], //左信息
      userInfoListPlaceholder: [],
      userInfoListPlaceholderObj: {
        //左信息为空时的占位
        cardBuySum: "",
        certNo: "",
        closeAlarmValue: "",
        comments: "",
        factoryNo: "",
        historyList: [],
        icCardNo: "",
        lastBuyNum: "",
        lastBuyTime: "",
        limitBuyNum: "",
        lockStatus: "",
        meterBuySum: "",
        meterModel: "",
        mobile: "",
        prestoreBalance: "",
        samplingPlace: "",
        showAlarmValue: "",
        subMeterNo: "",
        useWaterSum: "",
        useWaterType: "",
        userAddr: "",
        userNo: "",
        userName:"",
        meterFactory:"",
        userStatus: "",
        yearBuyCount: "",
        meterStatus:"",
        yearBuyNum:"",
        meterType:"",
        businessArea:""
      },
      meterType:0,
    icWriteTemplate: {
    ShuJu: "0",
    ChaKa: "0",
    KaLeiXin: "0",
    QuYuHao: "9999",
    BiaoHao: "0",
    ZhiBiaoHao: "0",
    CaiYangDian: "1",
    XianShiBaoJingLiang: "0",
    GuanBiBaoJingLiang: "0",
    GouMaiCiShu: "0",
    XianGouLiang: "0",
    GouMaiLiang: "0",
    // LeiJiGouLiang: "0",
    // LeiJiYongLiang: "0",
    // ShengYuLiang: "0",
    // GuoLingLiang: "0"
  }
    };
  },
  watch: {
    maxHeight() {
      this.tableShow = false;
      this.$nextTick(() => {
        this.tableShow = true;
      });
    }
  },
  beforeMount() {
    if (this.userInfoListPlaceholder.length === 0) {
      this.userInfoListPlaceholder = [this.userInfoListPlaceholderObj]; //为空时初始占位，操作左信息使用userInfoList
    }
     
  },
    created(){
      //设置ic按钮权限
        vauth.setAuthList(this.$store.state['/ICCardManagement']);
        // vauth.setAuthList(['openCard','buyWater','changeICWater','fillData','setting','fixICWater','clear','query','clearICCard']);
    },
  mounted() {
  this.getDictionary()
  },
  filters:{
    emptyString:function(val){
      if(val === ""){
        return "-";
      }
      return val;
    }
  },
  methods: {
    showHistoryDialog(idx){
    this.historyDialogVisible = true;
    this.historyData =  this.userInfoList[idx]?this.userInfoList[idx].historyList:[];
    },
        //   导出
    exportExcel(userNo) {
        let params = {
          "busicode": "ICHistoryRecordExport",
          "data": {userNo:userNo},
          token: sessionStorage.getItem('token'),
          sysType: '002'
        }
        window.open( this.common.getExportExcelIp() + '/project/exportExcel.api?json=' + encodeURI(JSON.stringify(params)))
    },
   // 获取数据字典数据
    getDictionary() {
      var params = {
        busicode: "DictionarySelect",
        data: "ICMMS,ICMMT,ICOPS" // 表状态、表类型、操作类型
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          this.dictionaryData = res;
        });
    },
    closeBuyWater(){
      this.buyWaterVisible = false;
    },
    substringSubMeterNo(subMeterNo){ //获取写卡子表号
      return (subMeterNo.toString()).split('.')[1];
    },
    //写查询卡提交
    querySubmit(formName) {
 
            this.$refs[formName].validate((valid) => {
          if (valid) {
          this.$confirm("请确认写查询卡？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
         
              this.writeCard([
                { ...this.icWriteTemplate,
                  KaLeiXin: 4,
                  QuYuHao: this.queryFormData.areaNo
                }
              ]).then(res => {
                this.$message({
                  message: "写查询卡成功！",
                  type: "success"
                });
                this.queryVisible = false;
                this.readICCard();
              });
            })
            .catch(() => {});
         } else {
            return false;
          }
        });
    },

    clearSubmit(formName) {
             this.$refs[formName].validate((valid) => {
          if (valid) {
           
                  this.writeCard([
        {
          ...this.icWriteTemplate,
          KaLeiXin: 5,
          QuYuHao: this.clearFormData.areaNo
        }
      ]).then(res => {
        this.$message({
          message: "清零成功！",
          type: "success"
        });
        this.clearVisible = false;
        this.readICCard();
      });
        
          } else {
            return false;
          }
        });

    },

    //维修提交
    repairSubmit() {
      let repairArr = [];
      let writeCardParams = [];
      for (let item in this.repairFormData.list) {
        var subMeterNo = this.substringSubMeterNo(this.repairFormData.list[item].subMeterNo); //获取勾选的子表号.x
    
        //存入参数
          let listIdx = this.subMeterNoMap[subMeterNo];
        if(this.repairFormData.list[item].opsType!==""){
        repairArr.push({
          userNo: this.userInfoList[listIdx].userNo,
          subMeterNo:this.repairFormData.list[item].subMeterNo,
          opsType: this.repairFormData.list[item].opsType,
         lastReadNum: this.repairFormData.list[item].lastReadNum,
           curReadNum:this.repairFormData.list[item].curReadNum,
          margin: this.repairFormData.list[item].margin,
           meterStatus: this.repairFormData.list[item].meterStatus,
           meterType: this.repairFormData.list[item].meterType,
        });
         let samplingPlace =  Number(this.userInfoList[listIdx].samplingPlace);//对应采样点
       
           writeCardParams.push({
          subMeterNo,
          fixWaterNum: Number(this.repairFormData.list[item].margin)/samplingPlace, //对应水量

            showAlarmValue:  this.userInfoList[listIdx].showAlarmValue/samplingPlace,
           closeAlarmValue:  this.userInfoList[listIdx].closeAlarmValue/samplingPlace,
           icCardNo:  this.userInfoList[listIdx].icCardNo,
           icAreaNo: this.userInfoList[listIdx].icAreaNo,
            samplingPlace:this.userInfoList[listIdx].samplingPlace,
           limitBuyNum: this.userInfoList[listIdx].limitBuyNum/samplingPlace,
            cardBuySum: this.userInfoList[listIdx].cardBuySum,
           useWaterSum: this.userInfoList[listIdx].useWaterSum,
        })
        }

      }
      if(repairArr.length == 0){
       this.$message({
            message: "请至少对一个子表进行操作",
            type: "error"
          });
          return;
      }
    
         this.$confirm("请确认维修", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=>{
      let params = {
        busicode: "FixICWater",
        data: repairArr
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          console.log(res);
          //写卡
        
          let baseInfo = null;
          let data = writeCardParams.map(item => {
            
               if(item.subMeterNo == "3"){
              baseInfo = {
               ...this.icWriteTemplate,
              KaLeiXin:1,
              QuYuHao:item.icAreaNo||"9999",
              BiaoHao:item.icCardNo,
              XianShiBaoJingLiang:item.showAlarmValue,
              GuanBiBaoJingLiang:item.closeAlarmValue,
              CaiYangDian:item.samplingPlace,
              XianGouLiang:item.limitBuyNum,
              GouMaiCiShu: 1,
              GouMaiLiang: item.fixWaterNum,
              ZhiBiaoHao:1,
              // LeiJiGouLiang:item.cardBuySum,
              // LeiJiYongLiang:item.useWaterSum,
              // ShengYuLiang:item.cardBuySum - item.useWaterSum
              }
            }
            return {
              ...this.icWriteTemplate,
              KaLeiXin:0,
              QuYuHao:item.icAreaNo||"9999",
              BiaoHao:item.icCardNo,
              XianShiBaoJingLiang:item.showAlarmValue,
              GuanBiBaoJingLiang:item.closeAlarmValue,
              CaiYangDian:item.samplingPlace,
              XianGouLiang:item.limitBuyNum,
              GouMaiCiShu: 1,
              GouMaiLiang: item.fixWaterNum,
              ZhiBiaoHao:item.subMeterNo,
              //  LeiJiGouLiang:item.cardBuySum,
              // LeiJiYongLiang:item.useWaterSum,
              // ShengYuLiang:item.cardBuySum - item.useWaterSum
            };
         
          });
          if(!baseInfo){
              let subMeter3 = this.userInfoList.filter(i=>this.substringSubMeterNo(i.subMeterNo) == "3")[0];
                 baseInfo = {
               ...this.icWriteTemplate,
              KaLeiXin:1,
              QuYuHao:subMeter3.icAreaNo||"9999",
              BiaoHao:subMeter3.icCardNo,
              XianShiBaoJingLiang:subMeter3.showAlarmValue,
              CaiYangDian:subMeter3.samplingPlace,
              GuanBiBaoJingLiang:subMeter3.closeAlarmValue,
              XianGouLiang:subMeter3.limitBuyNum,
              GouMaiCiShu: 1,
              GouMaiLiang: subMeter3.fixWaterNum,
              ZhiBiaoHao:1,
              // LeiJiGouLiang:item.cardBuySum,
              // LeiJiYongLiang:item.useWaterSum,
              // ShengYuLiang:item.cardBuySum - item.useWaterSum
              }
          }
          data.unshift(baseInfo);
          this.writeCard(data)
            .then(res => {
              this.$message({
                message: "维修成功！",
                type: "success"
              });
              this.search(false);
            })
            .catch(() => {
              //写卡失败。取消维修
              let cancelArr = repairArr.map(item => {
                return item.userNo;
              });
              let params = {
                busicode: "CancelFixICWater",
                data: cancelArr
              };
              this.$api
                .fetch({
                  params: params //参数
                })
                .then(res => {});
            });
        });
      this.repairVisible = false;
      }).catch(()=>{})
    },
    //设置提交
    settingSubmit(formName) {

   this.$refs[formName].validate((valid) => {
          if (valid) {
      this.writeCard([
        {
          ...this.icWriteTemplate,
          KaLeiXin: 3,
          ...this.settingFormData,
        XianShiBaoJingLiang: this.settingFormData.XianShiBaoJingLiang/this.settingFormData.CaiYangDian,
        GuanBiBaoJingLiang:  this.settingFormData.GuanBiBaoJingLiang/this.settingFormData.CaiYangDian,
        XianGouLiang:  this.settingFormData.XianGouLiang/this.settingFormData.CaiYangDian,
        GouMaiLiang:  this.settingFormData.GouMaiLiang/this.settingFormData.CaiYangDian
        }
      ]).then(res => {
        this.$message({
          message: "写卡成功！",
          type: "success"
        });
        this.readICCard();
        this.settingVisible = false;
      });
      }   else {
            return false;
          }
     
      });
    },
    advListRowClick(row) {
      this.fuzzyQuery = row.icCardNo;
      this.search();
      this.advVisible = false;
    },
    advSearch() {
      var params = {
        busicode: "AdvICUserInfoQuery",
        data: this.advTableQuery
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          console.log(res);
          this.loadingShow = false;
          this.advList = res;
        });
    },
    //左搜索
    search(isHideErrorTip = true) {
      return new Promise((resolve, rej) => {
        let fuzzyQuery = this.fuzzyQuery;

        let _this = this;
        this.ICCardAjax.ajax("read", { isHideErrorTip }, this) //查询时不提示ic卡错误
          .then(res => {
            this.subTableList = res;
            if (res.length && res[0].BiaoHao) {
              //BiaoHao就是卡号
              this.fuzzyQuery = res[0].BiaoHao;
            }
          })
          .finally(()=>{
                  if (this.fuzzyQuery == "") {
                  this.$message({
                    message: "请输入户号/IC卡号并点击查询",
                    type: "error"
                  });
                  return;
                  }
           this.loadingShow = true;
        var params = {
          busicode: "ICUserInfoQuery",
          data: { fuzzyQuery:this.fuzzyQuery }
        };
        this.$api
          .fetch({
            params: params //参数
          })
          .then(res => {
            this.loadingShow = false;
            this.userInfoList = res;
         this.subMeterNoMap = {};
            if (res.length) {
              this.icCardNo = res[0].icCardNo;
              for (let item in res) {
               
                res[item].icSubMeterNo = this.substringSubMeterNo(res[item].subMeterNo);
                this.subMeterNoMap[res[item].icSubMeterNo] = item;
                this.$set(this.repairFormData.list, res[item].icSubMeterNo, {opsType:"",lastReadNum:"",curReadNum:"",margin:"",meterStatus:"",meterType:"",subMeterNo:res[item].icSubMeterNo,userNo:res[item].userNo});
              }
            }
            //加入占位  因为进来要初始显示空信息
            if (this.userInfoList.length === 0) {
              this.userInfoListPlaceholder = [this.userInfoListPlaceholderObj];
            } else {
              this.userInfoListPlaceholder = res;
            }
            this.activeName = "tab0"
            //数据加载完成设置内容高度
            this.$nextTick(() => {
              var topHeight =
                $(".toolbar").outerHeight() +
                $(".bread-contain").outerHeight() +
                $(".el-tabs__header").outerHeight()+25;
              $(".ICCardManagement .subTables").css(
                "height",
                "calc(100% - " + topHeight + "px)"
              );
              
              this.common.changeTable(this, ".ICCardManagement", [
                ".ICCardManagement .toolbar",
                ".ICCardManagement .bread-contain",
                `#pane-${this.activeName} .icBaseInfo`,
                `#pane-${this.activeName} .el-tabs__header`,
                `#pane-${this.activeName} .el-tabs__header`,
              ]);
      
            });

                   resolve(res);
   
          });


          });

 
      });
    },
    //清空卡
    clearICCard() {
      this.readICCard().then(res => {
  
        if (res.length) {
          this.$confirm("确认清空本卡？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.ICCardAjax.ajax("clear",{})
                .then(res => {
                  this.$message({
                    type: "success",
                    message: "已清空!"
                  });
                  this.readICCard();
                })
                .catch((e) => {
                  console.log(e)
                  this.$message({
                    type: "error",
                    message: "清空失败!"
                  });
                });
            })
            .catch((e) => {
              console.log(e)
            });
        }
      });
    },

    //用户详情
    detail(userNo) {
      this.userNo = userNo;
      this.userInfoVisible = true;
    },
    //用户变更
    change(userNo) {
      this.userNo = userNo;
      this.userInfoChangeVisible = true;
    },
    //用户变更提交
    submitUserChangeForm(){
    console.log(this.$refs.userInfoChangeEdit.userInfoForm);
     var params = {
        busicode: "ICUserInfoChange",
        data: this.$refs.userInfoChangeEdit.userInfoForm
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          console.log(res);
          this.$message({
            message: "变更信息成功！",
            type: "success"
          });
          this.search()
          this.userInfoChangeVisible = false;
        });
    },
      //取消用户变更提交
    closeUserChangeDialog(){
     this.userInfoChangeVisible = false;
    },
    //读卡-查询
    readICCard() {
      var _this = this;
      return new Promise((resolve, rej) => {
        this.ICCardAjax.ajax("read", {}, this)
          .then(res => {
            resolve(res);


          //  var params = {
          //     busicode: "ICUserInfoQuery",
          //     data: { fuzzyQuery:res[0].BiaoHao}
          //   };
          //   this.$api
          //     .fetch({
          //       params: params //参数
          //     })
          //     .then(list => {
          //     for (let i in res){
          //                     console.log(res[i].ZhiBiaoHao )
          //                    if(i > 0){
          //                       res[i].CaiYangDian = list.filter(l=>this.substringSubMeterNo(l.subMeterNo) == res[i].ZhiBiaoHao )[0].samplingPlace;
          //                    }
                           
          //                 res[i].GouMaiLiang = Number(res[i].GouMaiLiang) * Number (res[i].CaiYangDian);
          //               }
          // });
              
            //读卡成功
                 this.subTableList = res;
            this.$nextTick(() => {
              var detailTopHeight = $(".top-btn").outerHeight();
              $(".ICCardManagement .subTableInfoContainer")
                .css("overflow", "auto")
                .css("height", "calc(100% - " + detailTopHeight + "px)");
            });
          })
          .catch(res => {
            rej(res);
            this.subTableList = [];
         //读卡失败
          });
      });
    },
    //取消开卡
    cancelCard(data) {
      var _this = this;
      var params = {
        busicode: "CancelCard",
        data: data
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          console.log(res);
          _this.$message({
            message: "取消开卡成功！",
            type: "success"
          });
        });
    },
    //写卡
    writeCard(data) {
      var _this = this;
      return new Promise((resolve, rej) => {
        this.ICCardAjax.ajax("writeCard", { param: data }, this)
          .then(res => {
            resolve(res);
            console.log("写卡成功");
          })
          .catch(res => {
            rej(res);
            _this.$message({
              message: "写卡失败",
              type: "error"
            });
          });
      });
    },
    //开卡
    openICCard() {
      this.readICCard().then(res => {
        // if (res.length !== 0 && (res[0].BiaoHao != this.icCardNo)) {
        //   //3、如果读取到的卡不是空卡，则要检查卡号与左边查询的IC卡号是否一致，如果不一致提示“本卡不是空卡，请更换空卡” 同一卡号可能存在新增水表的问题。故允许开卡
        //   this.$message({
        //     message: "本卡不是空卡，请更换空卡",
        //     type: "error"
        //   });
        //   return;
        // }
           if( this.icCardNo == ""){
           this.$message({
            message: "IC卡号不能为空",
            type: "error"
          });
          return;
      }
      var params = {
        busicode: "OpenCard",
        data: { icCardNo: this.icCardNo }
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          console.log(res);
          let isExistSubMeter = false;
          let subMeterNoArr = [];
          res.forEach(item => {
         let subMeterNo = String(item.subMeterNo);
            subMeterNoArr.push(subMeterNo);
            if (!isExistSubMeter) {
              isExistSubMeter = this.subTableList.some(
                i =>{
                return  String(i.ZhiBiaoHao) === this.substringSubMeterNo(subMeterNo);
                } 
              );
            }
          });
          if (isExistSubMeter) { //检查子表号在右边是否存在
            this.$message({
              message:
                "卡中子表" +
                subMeterNoArr.toString() +
                "已开卡与数据库信息不一致，请执行补数据，重置卡信息",
              type: "error"
            });
            this.cancelCard(subMeterNoArr);
            
          } else {
            let baseInfo = null;
                 let writeCardParams = this.userInfoList.map(i => {
                      let buyNum = Number(i.lastBuyNum)/Number(i.samplingPlace);
                      let showAlarmValue =  Number(i.showAlarmValue)/Number(i.samplingPlace);
                      let closeAlarmValue =  Number(i.closeAlarmValue)/Number(i.samplingPlace);
                      let limitBuyNum =  Number(i.limitBuyNum)/Number(i.samplingPlace);
                   if(subMeterNoArr.indexOf(i.subMeterNo)>-1){
                           if(this.substringSubMeterNo(i.subMeterNo) == "3"){
                             baseInfo = { //插入信息区
                           ...this.icWriteTemplate,
                          KaLeiXin: 0,
                          QuYuHao: i.icAreaNo||"9999",
                          BiaoHao:i.icCardNo,
                          ZhiBiaoHao: 1,
                          CaiYangDian:i.samplingPlace,
                          XianShiBaoJingLiang: showAlarmValue,
                          GuanBiBaoJingLiang:closeAlarmValue,
                          GouMaiCiShu: 1,
                          XianGouLiang: limitBuyNum,
                          GouMaiLiang: buyNum,
                          // LeiJiGouLiang:i.cardBuySum,
                          // LeiJiYongLiang:i.useWaterSum,
                          // ShengYuLiang:i.cardBuySum - i.useWaterSum
                      }
                    }

                         return {
                          ...this.icWriteTemplate,
                          KaLeiXin: 0,
                          QuYuHao: i.icAreaNo||"9999",
                          BiaoHao: i.icCardNo,
                          CaiYangDian:i.samplingPlace,
                          ZhiBiaoHao: this.substringSubMeterNo(i.subMeterNo),
                          XianShiBaoJingLiang: showAlarmValue,
                          GuanBiBaoJingLiang: closeAlarmValue,
                          GouMaiCiShu: 1,
                          XianGouLiang: limitBuyNum,
                          GouMaiLiang: buyNum,
                          // LeiJiGouLiang:i.cardBuySum,
                          // LeiJiYongLiang:i.useWaterSum,
                          // ShengYuLiang:i.cardBuySum - i.useWaterSum
                        };
                   
              
                  }
                  
          
          });
              if(baseInfo){
                writeCardParams.unshift(baseInfo);
              }
      
            //开卡写卡
            this.writeCard(
               writeCardParams
            )
              .then(res => {
                this.$message({
                  message: "开卡成功！",
                  type: "success"
                });
                this.readICCard();
              })
              .catch(res => {
                this.cancelCard(subMeterNoArr);
              });
          }
        });

      });

    },
    //校验ic卡表类型
    verifyMeterType(data) {
      console.log(data)

             let params = {
              busicode: "GetUserInfoTableType",
               data: [data.subMeterNo]
            };
            this.$api
              .fetch({
                params: params //参数
              })
              .then(res => {
                  if((res[0].meterType == '3') && (res[0].status == '2')){ //IC卡表正常
                  this.meterType = 0;
                  let subMeterNo = this.substringSubMeterNo(data.subMeterNo);
                  let ChaKaArr = [];
                  this.subTableList.forEach(i => {
                  if((i.ChaKa == "1")&&(subMeterNo === i.ZhiBiaoHao)){ //对应选择的子表插表表数据
                     ChaKaArr = [data.subMeterNo];
                  }
                  });
                     
             //ic不插表时不能购水否则可以
                if (ChaKaArr.length) {
                     
                     this.buyWaterVisible = true;
                     return;
                  }else{
                   this.$message({
                      message: "子表未插水表，不能购水",
                      type: "error"
                    });
                     this.buyWaterVisible = false;
                   
                  }

                  }else
                  if (
                    res[0].meterType == '1' ||
                    ((res[0].meterType == '3') && (res[0].status == '0'))
                  ) {
                        this.meterType =1;
                    //机械表或IC卡表已损坏（这两种场景允许购水）
                    this.buyWaterVisible = true;
               
                     
                  } else {   
                      this.$message({
                      message: "您的水表不支持购水，请到工作台进行缴费",
                      type: "error"
                    });
            
                     this.buyWaterVisible = false;
                  }
             
              });
         
     

    },
    //购水
    buyWater() {
      var _this = this;
        this.readICCard().then(res=>{
            if(res[0].BiaoHao === this.icCardNo){ //如果ic卡号吻合 直接可以购水
                     this.buyWaterVisible = true;
                     return;
            }else{
          this.search()
        .then(res => {
          if(res.length){
                 this.buyWaterVisible = true;
          }else{
        this.$message({
          message: "请输入户号/IC卡号并点击查询",
          type: "error"
        });
          }
  
          }).catch((res)=>{
          console.log(res)
           this.buyWaterVisible = false;
          })
            }
        }).catch((res)=>{
          //读卡失败
          console.log(res)
         this.search()
          .then(res => {
                 if(res.length){
             this.buyWaterVisible = true;
                 }else{
            this.$message({
              message: "请输入户号/IC卡号并点击查询",
              type: "error"
            });
                 }
            }).catch((res)=>{
             console.log(res)
           this.buyWaterVisible = false;
          })
          })
 
       
    },
    //购水成功写卡
    buyWaterSubmit(data) {
      console.log(data);
    if(this.meterType === 1){ //如果是坏表或机械表不执行写卡动作
       this.closeBuyWater();
        this.search();
      return;
    }

      let subMeter = (this.userInfoList.filter(
        i => i.subMeterNo === data.subMeterNo
      ))[0];
      let icSubMeterNo = this.substringSubMeterNo(data.subMeterNo);
           let showAlarmValue =  Number(subMeter.showAlarmValue)/Number(subMeter.samplingPlace);
          let closeAlarmValue =  Number(subMeter.closeAlarmValue)/Number(subMeter.samplingPlace);
          let limitBuyNum =  Number(subMeter.limitBuyNum)/Number(subMeter.samplingPlace);
       let buyNum = Number(data.waterNum)/Number(subMeter.samplingPlace);
      this.writeCard([
        { //插入信息区
          ...this.icWriteTemplate,
         KaLeiXin: 1,
         QuYuHao: subMeter.icAreaNo||"9999",
        BiaoHao:this.icCardNo,
        ZhiBiaoHao: 1,
        XianShiBaoJingLiang: showAlarmValue,
        GuanBiBaoJingLiang: closeAlarmValue,
        GouMaiCiShu: Number(subMeter.cardBuyCount)+1,
        XianGouLiang: limitBuyNum,
        CaiYangDian:subMeter.samplingPlace,
        GouMaiLiang: buyNum,
              //      LeiJiGouLiang:subMeter.cardBuySum,
              // LeiJiYongLiang:subMeter.useWaterSum,
              // ShengYuLiang:subMeter.cardBuySum - subMeter.useWaterSum
        
           },
        { ...this.icWriteTemplate,
          KaLeiXin: 1,
           BiaoHao:subMeter.icCardNo,
           QuYuHao: subMeter.icAreaNo||"9999",
          ZhiBiaoHao: icSubMeterNo,
           CaiYangDian:subMeter.samplingPlace,
          XianShiBaoJingLiang: showAlarmValue,
          GuanBiBaoJingLiang: closeAlarmValue,
          GouMaiCiShu:Number(subMeter.cardBuyCount) +1 ,
          XianGouLiang: limitBuyNum,
          GouMaiLiang: buyNum,
              //   LeiJiGouLiang:subMeter.cardBuySum,
              // LeiJiYongLiang:subMeter.useWaterSum,
              // ShengYuLiang:subMeter.cardBuySum - subMeter.useWaterSum
        }
      ])
        .then(res => {
          this.$message({
            message: "写卡成功！",
            type: "success"
          });
       
        })
        .catch(res => {
      
           this.$message({
            message: "写卡失败，请稍后进行补卡操作",
            type: "error"
          });
          
        }).finally(()=>{
          this.closeBuyWater();
               this.search();
        });
      
    },
    //补数据
    fillData() {
     
  
      this.readICCard().then(res => {
        if (res.length) {
          this.$message({
            message: "本卡不是空卡，请更换空卡，或先执行清卡操作",
            type: "error"
          });

          return;
        }
         if (this.userInfoList.length === 0) {
        this.$message({
          message: "请输入户号/IC卡号并点击查询",
          type: "error"
        });
        return;
      }
      this.$confirm("是否确认进行补数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
            let baseInfo = null;
       
          let writeCardParams = this.userInfoList.map(i => {
              let showAlarmValue =  Number(i.showAlarmValue)/Number(i.samplingPlace);
              let closeAlarmValue =  Number(i.closeAlarmValue)/Number(i.samplingPlace);
              let limitBuyNum =  Number(i.limitBuyNum)/Number(i.samplingPlace);
              let buyNum = Number(i.lastBuyNum)/Number(i.samplingPlace);
              let cardType =Number(i.cardBuyCount) == 1?0:1; //卡累计购次等于1则补开户卡0
            if(this.substringSubMeterNo(i.subMeterNo) == "3"){
              baseInfo = {
               ...this.icWriteTemplate,
              KaLeiXin:cardType,
              QuYuHao: i.icAreaNo||"9999",
              BiaoHao: i.icCardNo,
              ZhiBiaoHao: 1,
              CaiYangDian:i.samplingPlace,
              XianShiBaoJingLiang: showAlarmValue,
              GuanBiBaoJingLiang: closeAlarmValue,
              GouMaiCiShu: i.cardBuyCount,
              XianGouLiang: limitBuyNum,
              GouMaiLiang: buyNum,
              // LeiJiGouLiang:i.cardBuySum,
              // LeiJiYongLiang:i.useWaterSum,
              // ShengYuLiang:i.cardBuySum - i.useWaterSum
              }
            }
        
            return {
               ...this.icWriteTemplate,
              KaLeiXin: cardType,
              QuYuHao: i.icAreaNo||"9999",
              BiaoHao: i.icCardNo,
              CaiYangDian:i.samplingPlace,
              ZhiBiaoHao: this.substringSubMeterNo(i.subMeterNo) ,
              XianShiBaoJingLiang: showAlarmValue,
              GuanBiBaoJingLiang: closeAlarmValue,
              GouMaiCiShu: i.cardBuyCount,
              XianGouLiang: limitBuyNum,
              GouMaiLiang: buyNum,
              // LeiJiGouLiang:i.cardBuySum,
              // LeiJiYongLiang:i.useWaterSum,
              // ShengYuLiang:i.cardBuySum - i.useWaterSum
            };
          });
          baseInfo&&writeCardParams.unshift(baseInfo);
          this.writeCard(writeCardParams).then(res => {
            this.$message({
              message: "补数据成功！",
              type: "success"
            });
            this.readICCard();
          });
        })
        .catch((e) => {
          console.log(e)
        });

      });


    },
 

    //维修
    repair() {
        this.readICCard().then(res => {
        if (this.userInfoList.length === 0) {
          this.$message({
            message: "请输入户号/IC卡号并点击查询",
            type: "error"
          });
          return;
        }
        let arr = this.userInfoList.map(i=> i.subMeterNo);
          var params = {
        busicode: "GetUserInfoTableType",
        data: arr // 表状态、表类型
      };
      this.$api
        .fetch({
          params: params //参数
        })
        .then(res => {
          for (let i in res){
           this.repairFormData.list[this.substringSubMeterNo(res[i].subMeterNo)].subMeterNo = res[i].subMeterNo;
          this.repairFormData.list[this.substringSubMeterNo(res[i].subMeterNo)].meterStatus = res[i].status;
          this.repairFormData.list[this.substringSubMeterNo(res[i].subMeterNo)].meterType = res[i].meterType;
          }
        this.repairVisible = true;
      });
        });
 
    },
    //设置
    setting() {
       this.settingFormData.areaNo = "9999";
      this.readICCard().then(res => {
        if (res.length) {
          this.$message({
            message: "本卡不是空卡，请更换空卡，或先执行清卡操作",
            type: "error"
          });

          return;
        }
        this.settingVisible = true;
      });
    },
    //查询
    queryICCard() {
        this.queryFormData.areaNo = "9999";
      this.readICCard().then(res => {
        if (res.length) {
          this.$message({
            message: "本卡不是空卡，请更换空卡，或先执行清卡操作",
            type: "error"
          });

          return;
        }
        this.queryVisible = true;
      });
    },
    //清零
    clear() {
      this.clearFormData.areaNo = "9999";
      this.readICCard().then(res => {
        if (res.length) {
          this.$message({
            message: "本卡不是空卡，请更换空卡，或先执行清卡操作",
            type: "error"
          });

          return;
        } else {
          this.clearVisible = true;
        }
      });
    },
       handleSizeChange(val) { //显示多少数据一页
        this.advTableQuery.pageCount = val;
        this.advTableQuery.page = 1;
        this.advSearch();
      },
      handleCurrentChange(val) {  //页码点击
        this.advTableQuery.page = val;
        this.advSearch();
      },
       indexMethod(index) {
      //获取表格序号
      return index + 1;
    }
  }

};

</script>
<style lang="scss" scoped>
@import "../../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.ICCardManagement {
  height: 100%;
  .word3 /deep/ span{
    margin-left: 10px;
  }
  .subTables {
    margin: 0 10px;
   /deep/ .formBill .el-form-item .el-form-item__content {
    width: calc(100% - 86px)!important; 
}
  }
//   .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
//     margin-bottom: 8px ;
// }
.demo-form-inline  .el-form-item--mini.el-form-item{
    margin-bottom: 0 ;
}
.red{
  color:red;
}
.icBaseInfo /deep/ .el-form-item__label,.icBaseInfo /deep/ .el-form-item__content {
line-height: 20px;
 span{
   font-weight: bold;
   font-size: 13px;
 }
}
.subTables  /deep/ .el-tabs__header {
    margin: 0px 0 7px;
}
  .formBill .el-form-item {
    width: 31%;
    margin-bottom: 0px !important;
  }
  .fuzzyQueryAdv /deep/ .el-input__inner {
    width: 350px;
  }
  .subTableInfo > .item {
    width: 24%;
    float: left;
    border: 1px solid #dcdfe6;
    box-sizing: content-box;
    line-height: 30px;
    height: 30px;
    > div {
      float: left;
    }
    .label {
      min-width: 70px;
      border-right: 1px solid #dcdfe6;
      height: 30px;
      padding-left: 5px;
      color: #737171fa;
    }
    .value {
      width: 50px;
      height: 30px;
      overflow: hidden;
      text-align: center;
    }
  }
  
  .subTableInfo {

    &:after {
      @include _clearBoth();
    }
  }
  .subTableInfoBox {
    margin-top: 10px;
  }
    .subTableInfoBox:first-child {
    margin-top: 0;
  }
  &:after {
    @include _clearBoth();
  }
  .top-btn button {
    width: 100%;
    height: 70px;
  }
  .btn-title{
   font-weight: bold;
    line-height: 30px;
    font-size: 15px;
    text-align: left;
  }
  .icbox-container{
 
    padding: 10px;
    padding-top: 0px;
    overflow-y: auto;
  }
  .top-btn {
    .main-btn .el-button{
      width: 21%;
      height: 60px;
      color: #287acd;
          font-weight: bold;
    }
     .other-btn .el-button{
      width: 16%;
      padding-left: 44px;
      height: 70px;
      margin-right: -15px !important;
    }
    .el-button {

         border: none;
    }
  }
  .repairFormList{
    /deep/ .el-input__inner{
      width: inherit !important;
    }
      .el-col.form-lable{
        height:25px;
        width:60px;
        text-align:right;
      }
      line-height: 20px
    
  }
}
</style>
