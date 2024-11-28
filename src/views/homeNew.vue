<template>
    <div class="tabs-home">
        <header>
            <first-Nav :firstNav="firstNav" @changeNav="changeNav">
                <div class="leftItem header-top-right clearfix">
                    <div class="menu-box left" v-if="isShowFirstNav">
                        <ul class="clearfix" >

                            <li class="menu_img left"  v-for="(item, index) in menuData" :key="index" @click="getSecondMenu(index)">
                                <svg :class="['icon',{'active':currentFirstMenu.indexOf(item.url)===0},{'orange':item.url==='/UserInfoSearchDetail'},'menu-icon']" aria-hidden="true">
                                    <use :xlink:href="item.icon"></use>
                                </svg>
                                <p  :class="['name',{'active':currentFirstMenu.indexOf(item.url)===0},{'orange':item.url==='/UserInfoSearchDetail'}]">{{item.opName}}</p>
                            </li>
                        </ul>
                    </div>

                    <div class="loginArea left">

                        <div class="user-company">
                            <el-select class="company-select" v-model="curWaterCode" placeholder="请选择" @change="switchCompany">
                                <el-option v-for="item in companyData" :key="item.companyNo" :label="item.shortName" :value="item.companyNo">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="user-info" @mouseover="changeStyle" @mouseout="restStyle">
                            <span class="userName">{{userData.userName}}</span>
                            <div class='infoPop' v-show="isShowInfoPop">
                                <div class="loginout" @click="loginout">[退出登录]</div>
                            </div>
                        </div>

                    </div>
                </div>
            </first-Nav>
        </header>
        <aside v-if="menuShow" class="primary-menu">
            <aside class="kl-aside">
                <!-- 左边菜单 -->
                <second-Nav :secondNav="secondNav"></second-Nav>
            </aside>
            <div class="collapse" @click="collapse">
                <i class="el-icon-arrow-left leftChange"></i>
            </div>
        </aside>
        <section class="kl-container  aside-show-css" :style="klContainerStyle">
            <div class="kl-main loadingHiden" style="margin-left: 0px;" id="main-home">
                <page-tabs :keep-alive-component-instance="keepAliveComponentInstance" @changeTabs="changeTbas" ref="pageTabs" v-if="isShowTabs"/>
                <div ref="keepAliveContainer" :class="{'keep-alive-container':true, 'keep-alive-container-show':!isShowTabs}">
                    <keep-alive>
                        <router-view :key="$route.fullPath" />
                    </keep-alive>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import firstNav from "@/components/firstNav/first_Nav"
import secondNav from "@/components/secondNav/second_Nav"
import pageTabs from "@/components/myTabs/pageTabs.vue";
import axios from "axios";
export default {
    name:"home-new",
    inject: ["pageReload"],
    components: {
        firstNav, secondNav, pageTabs
    },
    data() {
        return{
            firstNav: {
                //系统名称
                title: '工程报装系统',
                //logo路径
                logoSrc: require('../assets/images/logo.png'),
                //导航
                navData: {
                    navList: [

                    ],
                    //默认路径
                    activeChanel: '/',
                },
            },
            // 用户个人信息、水司切换、动态菜单数据
            userData: {},
            // 水司下拉框数据
            companyData: [],
            // 选中的下拉框水司code
            curWaterCode: '',
            // 动态菜单数据
            menuData: [

            ],
            editableTabsValue:"0",
            editableTabs:[ ],
            tabIndex: 1,
            activeTabIndex:"",
            isShowInfoPop:false,
            //左边菜单数据
            secondNav:{
                navList:[]
            },
            menuShow:false,   //是否显示左边菜单
            currentFirstMenu:"/WaterSideIndex",   //一级菜单的高亮
            klContainerStyle:{},
            keepAliveComponentInstance: null,
            // 只有一级菜单
            firstMenu:["/WaterSideIndex", "/HallBusiness", "/UserInfoSearchDetail","/DownloadPage"],
            // 有多级菜单
            multiLevelMenu:{
                "/BusinessManagement":["/ChargeManagement", "/CustomerManagement", "/CustomerNotificationCenter", "/EngineeringManagement", "/MeterManagement", "/MeterReading", "/ICCardManagement"],
                "/ReportCenter":["/ChargeReport", "/EngineeringReport", "/ReportCenter", "/OtherReport", "/WaterMeterReading", '/ReportUtil'],
                "/BasicConfiguration":["/NotificationManagement", "/OtherConfigurations", "/ProcessConfiguration", "/RegionalConfiguration", "/TemplateConfiguration", "/WaterMeterConfiguration"],
                "/SystemSet":["/SystemSet"]
            },
            isShowFirstNav:true,  //快捷查询的时候，不显示一级菜单
            isShowTabs:true,   //快捷查询的时候，不显示多页签
        }
    },
    mounted() {
        this.getAppSSOUrl()
        if (this.$refs.keepAliveContainer) {
            this.keepAliveComponentInstance = this.$refs.keepAliveContainer.childNodes[0].__vue__;
        }
        if(this.$route.fullPath === "/UserInfoSearchDetail") {
            this.isShowTabs = false;
        }
        this.getUserData();

    },
    methods:{
        filterMenuData(data ){ //过滤出不含按钮的菜单数据
            let _that = this;
            let menuData = (function deepCopy( source,pUrl ) {
                let target = [] //数组兼容
                for ( var k in source ) {
                    if (source.hasOwnProperty(k)) {
                        if ( typeof source[ k ] === 'object') {
                           if( Array.isArray(source)){ // 当前在cildren当中 递归深拷贝json
                               if(source[ k ].opFlag == 1){ //菜单 ，如果是菜单才进行下一步的深拷贝
                                   target[ k ] = deepCopy( source[ k ] ,source.url)
                               }else{//按钮
                                if(pUrl){
                                    _that.setBtnListStore(pUrl,source[k].url); //设置到vuex中
                                }
                               }
                           }else{
                                 target[ k ] = deepCopy( source[ k ],source.url )
                           }
                        } else {
                            target[ k ] = source[ k ]
                        }
                     }
                }
                return target
            })(data)
           return menuData;
        },
        // 一级菜单点击
        getSecondMenu(index, flag) {
            this.$store.commit('setCurrentNav',index);
            const menuData = this.menuData[index].children;
            let urlAddress;
            // 快捷查询另开窗口
            if(this.menuData[index].url === "/UserInfoSearchDetail") {
                var params = {
                    "busicode": "GetCompanyDomain",
                    "data":{
                        groupCode: localStorage.getItem('companyNo'),
                    } 
                }
                this.$api.fetch({
                    params: params,//参数
                }).then(res => {
                    urlAddress  = res;
                    if(urlAddress !== ''){
                        window.open(urlAddress+'#/UserInfoSearchDetail'+ "?ticket=" + sessionStorage.getItem('token'), '_blank');
                    }
                });
            }
            // 是否存在二级菜单
            if(menuData && menuData.length > 0) {
                if(index == 5){ //判断系统管理模块默认选当前首个模块
                this.noLeftMenu(this.menuData[index])
                this.klContainerStyle = ` height: calc(100% - 60px); width: 100%`;
                this.$set(this.firstNav.navData, "activeChanel", "");
                if (this.menuData[index].url != this.$route.fullPath) {

                    this.$router.push(this.menuData[index].children[0].url);
                    this.$nextTick(() => {
                       if(flag) {
                      const keepAliveComponentInstance = this.keepAliveComponentInstance
                      let cache = keepAliveComponentInstance.cache
                      let keys = keepAliveComponentInstance.keys
                      for(const key in cache) {
                        if(key !== '/WaterSideIndex' && key !== '/UserInfoSearchDetail') {
                          // cache[key].componentInstance.$destroy()
                          delete cache[key]
                          const index = keys.indexOf(key)
                          if (index > -1) {
                            keys.splice(index, 1)
                          }
                        }
                      }
                    }
                    })
                }
                }

                // 二级菜单高亮
                this.$set(this.firstNav.navData, "activeChanel", menuData[0].url);

                // 是否存在三级菜单
                if(menuData && menuData.length > 0 && menuData[0] && menuData[0].children.length > 0) {
                    this.handleLeftMenu (menuData[0])
                }else {
                    this.noLeftMenu(menuData[0])
                }
            }else {
                this.noLeftMenu(this.menuData[index])
                this.klContainerStyle = ` height: calc(100% - 60px); width: 100%`;
                this.$set(this.firstNav.navData, "activeChanel", "");
                if (this.menuData[index].url != this.$route.fullPath) {
                    // this.$router.push(this.menuData[index].url);
                    this.$nextTick(() => {
                       if(flag) {
                      const keepAliveComponentInstance = this.keepAliveComponentInstance
                      let cache = keepAliveComponentInstance.cache
                      let keys = keepAliveComponentInstance.keys
                      for(const key in cache) {
                        if(key !== '/WaterSideIndex' && key !== '/UserInfoSearchDetail') {
                          // cache[key].componentInstance.$destroy()
                          delete cache[key]
                          const index = keys.indexOf(key)
                          if (index > -1) {
                            keys.splice(index, 1)
                          }
                        }
                      }
                    }
                    })


                }

            }
            this.$set(this.firstNav.navData, "navList", menuData);

            this.currentFirstMenu = this.menuData[index].url;
        },
        setBtnListStore(url,auth){
                                   //以按钮所属父级模块的url为模块名设置到vuex中，要在vuex中事先定义对应模块
                 if(this.$store.state[url]){
                   this.$store.commit('setAuthList',{name:url,authList:auth});
                   }

        },
        // 二级菜单点击
        changeNav(item, index) {
            this.$set(this.firstNav.navData, "activeChanel", item.url);

            if(item.children && item.children.length > 0) {  //判断是否有左边菜单
                this.handleLeftMenu (item)
            }else {
                this.noLeftMenu(item, 'secondMenuClick')
            }
        },
        // 有左边菜单处理
        handleLeftMenu (data) {

            this.menuShow = true;
            this.klContainerStyle = ` height: calc(100% - 90px); width: calc(100% - 210px)`;
            // 左边菜单高亮
            this.$set(this.secondNav, "navList", data.children);
            let that = this;
            // 获取默认菜单高亮
            (function handleThirdMenu(item) {
                if(item.children && item.children.length > 0) {
                    handleThirdMenu(item.children[0])
                }else {
                    // if (item.url != that.$route.fullPath) {

                    //     that.$router.push(item.url);

                    // }
                }
            })(data.children[0])
        },
        // 没有三级菜单的操作
        noLeftMenu(item, type) {

            this.menuShow = false;
            this.klContainerStyle = ` height: calc(100% - 90px); width: 100%`;
            this.$set(this.secondNav, "navList", []);
            if (item.url != this.$route.fullPath && type === 'secondMenuClick') {

                this.$router.push(item.url);

            }

        },
        // 切换页签
        changeTbas(path) {
            let pathGroup = path.split("/"),parentPath = "",index = null;
            let firstMenuGroup = this.menuData.map(item => {
                return item.url;
            });


            // 判断是否只有一级菜单,没有二级菜单
            if(this.firstMenu.indexOf(path) !== -1) {

                index = firstMenuGroup.indexOf(path);
                this.getSecondMenu(index)
            }else {
                // 有二级菜单
                for(let key in this.multiLevelMenu) {

                    if(this.multiLevelMenu[key].indexOf(`/${pathGroup[1]}`) !== -1) {
                        parentPath = key;
                        break;
                    }
                }
                index = firstMenuGroup.indexOf(parentPath);
                let secondMenuGroup = this.menuData[index].children.map(item => {
                    return item.url;
                });
                let secondIndex = secondMenuGroup.indexOf(`/${pathGroup[1]}`);
                if(this.currentFirstMenu !== parentPath) {  //一级菜单不一样，加载二级菜单内容
                    // 二级菜单内容

                    this.$set(this.firstNav.navData, "navList", this.menuData[index].children);

                    // 一级菜单高亮
                    this.currentFirstMenu = parentPath;
                }

                // 是否有左边菜单
                if(this.firstNav.navData.navList[secondIndex] && this.firstNav.navData.navList[secondIndex].children && this.firstNav.navData.navList[secondIndex].children.filter(i=> i.opFlag == 1 ).length > 0) {

                  let children  = this.menuData[index].children[secondIndex].children;

              // 左边菜单内容
                    this.$set(this.secondNav, "navList", children);
                    this.menuShow = true;
                    this.klContainerStyle = ` height: calc(100% - 90px); width: calc(100% - 210px)`;
                    // 二级菜单高亮
                    this.$set(this.firstNav.navData, "activeChanel", `/${pathGroup[1]}`);
                }else {
                    this.menuShow = false;
                    this.klContainerStyle = ` height: calc(100% - 90px); width: 100%`;
                    this.$set(this.secondNav, "navList", []);
                     // 二级菜单高亮
                    this.$set(this.firstNav.navData, "activeChanel", path);
                }

                if(this.$route.path !== path) {
                    this.$router.push(path);

                }
            }
        },
        loginout() {
            this.$api.fetch({
                method: 'get',
                apiUrl: process.env.NODE_ENV == "development" ? 'loginout.api' : '/project/loginout.api',// 开发 ：打包
                params: {
                    ticket: sessionStorage.getItem('token')
                },
                headers : {
                "returntype" : "ajax/json"
                },
            }).then((res)=>{
                sessionStorage.removeItem('account');
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('userName');

                window.open(res, '_self')
            })
        },
        // 切换水司方法
        switchCompany() {
            var _this = this
            var params = {
                "busicode": "SwitchCompany",
                "data": _this.curWaterCode
            }
            this.$api.fetch({
                params: params,//参数
            }).then(res => {
                if(res.url !== null && res.url !== ''){
                    window.location.href = res.url;
                }else{
                    localStorage.setItem('companyNo', _this.curWaterCode);
                    _this.pageReload();
                    setTimeout(() => {
                        _this.setUserData(res.userAuthority);
                    }, 0);
                }
            });
        },
        // 获取用户数据
        getUserData() {
            let _this = this
            this.$api.fetch({
                method: 'get',
                apiUrl: 'loginCustomer.htm',// 开发 ：打包
                params: {
                    ticket: sessionStorage.getItem('token')
                },
                headers : {
                "returntype" : "ajax/json"
                },
            }).then(res => {
                let domain = window.location.hostname;
                if(res.domain !== null && res.domain !== '' && res.domain.indexOf(domain) === -1){
                    window.location.href = res.domain + "?ticket=" + sessionStorage.getItem('token');
                    return;
                }
                eventBus.$emit("initHomePage");
                _this.setUserData(res);
            })
        },
        setUserData(res){
            let _this = this;
            this.$store.commit('setAccount',res.account);
            this.$store.commit('setUserName',res.userName);
            _this.userData = res;
            _this.companyData = res.companys;
            // 获取当前选中的水司
            _this.curWaterCode = res.curWaterCode;
            localStorage.setItem('companyNo', _this.curWaterCode);
            sessionStorage.setItem('account', res.account);
            sessionStorage.setItem('userName', res.userName);
            //快捷查询的时候，不显示一级菜单
            if(this.$route.fullPath === '/UserInfoSearchDetail') {
                this.isShowFirstNav = false;
                return;
            }
            // 获取动态菜单数据
            if(res.operations && res.operations.length > 0 && res.operations[0].children) {
                _this.menuData =   this.filterMenuData(res.operations[0].children);
                _this.getSecondMenu(0, true);
            }else {
                _this.menuData = [];
            }
        },
        getAppSSOUrl() {  //获取后端配置文件单点登录地址
            axios({
                method: 'get',
                url: process.env.NODE_ENV == "development" ? 'apis/getAppSSOUrl.api' : '/project/getAppSSOUrl.api',// 开发 ：打包
                params: {
                },
                headers : {
                "returntype" : "ajax/json"
                },
            }).then((res)=>{
                localStorage.setItem('appSSOUrl',res.data.data)
            })

        },
        collapse() {
            this.util.menuShow('.primary-menu', '.kl-container', '.primary-menu .kl-aside', '.primary-menu .leftChange')
        },
        changeStyle() {
            this.isShowInfoPop = true;
        },
        restStyle() {
            this.isShowInfoPop = false;
        }
    }
}
</script>
<style lang="scss">
@import "../assets/styles/scss/base/fn";
$imgWidth: 200px;
$theme-color: #297acc;
.el-loading-spinner i {
    font-size: 50px;
}
.tabs-home{
    width: 100%;
    height: 100%;
    position: relative;
    background: #eaf4ff;
    zoom: 1;
    .header-top-right {
        height: 100%;

        .el-input__icon {
            line-height: 45px;
        }
        .menu-box{
            height: 100%;
            .menu_img{
                margin-right: 30px;
                cursor: pointer;
                &:last-child{
                    margin-right: 10px;
                }
                .menu-icon{
                    font-size: 23px;
                    color: #a8c9ea;
                    display: block;
                    margin: 8px auto;
                }

                .name{
                    font-size: 14px;
                    color: #a8c9ea;
                    margin-top: -14px;
                }
                .active{
                    color: #fff;
                }
                .orange{
                    color:#ddb688;
                }
            }
        }
        .loginArea {
            display: block;
            float: left;
            position: relative;
            line-height: 8px;
            padding: 0px 10px 0px 40px;
            font-size: 12px;
            text-align: center;
            .user-company {
                display: inline-block;
                float: left;
                margin-right: 25px;
                height: 58px;
                .user-name {
                    height: 50%;
                    line-height: 29px;
                    font-size: 14px;
                }
                .company-select {
                    position: relative;
                    top: 50%;
                    transform: translateY(-50%);
                }
            }
            .user-info{
                display: inline-block;
                float: left;
                .userName{
                    font-size: 24px;
                    font-weight: bold;
                    color:#fff;
                    line-height: 58px;
                }
                .infoPop {
                    position: absolute;
                    right: 3px;
                    top: 55px;
                    width: 100px;
                    font-size: 12px;
                    line-height: 22px;
                    border: 1px solid #e2e2e2;
                    background: #fff;
                    padding: 10px;
                    border-radius: 4px;
                    -webkit-box-shadow: 1px 2px 2px #e2e2e2;
                    box-shadow: 1px 2px 2px #e2e2e2;
                    text-align: left;
                    z-index: 2000;
                    &:after {
                        content: "";
                        display: block;
                        border-bottom: 10px solid #c5343400;
                        border-left: 10px solid #ffffff;
                        position: absolute;
                        right: 23px;
                        top: -3px;
                        z-index: 11;
                        background-color: transparent;
                        transform: rotate(45deg);
                    }
                    .nick {
                        width: 100%;
                        color: #4889f3;
                        margin: 0;
                        -o-text-overflow: ellipsis;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                    .line {
                        border-bottom: 1px dashed #e4e4e4;
                        height: 0;
                        font-size: 0;
                        overflow: hidden;
                        margin: 5px 0;
                    }
                    .loginout {
                        color: #5c5c5c;
                        cursor: pointer;
                        &:hover {
                            color: #bf5757;
                        }
                    }
                }
            }
            img {
                width: 45px;
                height: 45px;
                margin: 5px 0;
                border-radius: 50%;
            }


        }
        & > span {
            color: #fff;
            font-size: 14px;
            i {
                color: #fff;
                font-size: 14px;
                vertical-align: middle;
                height: 14px;
                width: 14px;
            }
        }
        .el-button--primary {
            border-color: #f78e1e;
            background-color: #f78e1e;
        }
        i {
            height: 40px;
            width: 40px;
            border-radius: 50%;
            overflow: hidden;
            margin-left: 10px;
            img {
                width: 40px;
                height: 40px;
                float: left;
            }
        }
        b {
            height: 36px;
            line-height: 36px;
            font-size: 14px;
            padding: 0 20px 0 10px;
            font-weight: 400;
        }
        & > div {
            margin-left: 10px;
            span {
                font-size: 14px;
                color: #f5f7f9;
            }
            u {
                position: absolute;
                padding: 5px;
                border-radius: 50%;
                top: 5px;
                right: 0;
                &.active {
                    background: red;
                }
            }
            .el-input.el-input--suffix {
                input {
                    border: 0;
                    color: #000;
                    width: 2.5rem;
                    padding-right: 0;
                    padding-left: 10px;
                    font-size: 12px;
                    width: 90px;
                    height: 26px;
                    line-height: 26px;
                }
                .el-input__suffix {
                    right: -10px;
                    top: -8px;
                    .el-input__suffix-inner {
                        .el-select__caret {
                        height: auto;
                        // margin-top: -4px;
                        }
                    }
                }
            }
        }
    }
    & > .primary-menu {
        float: left;
        width: 200px;
        height: calc(100% - 110px);
        position: relative;
        background: #fff;
        margin: 10px;
        margin-right: 0px;
        .kl-aside {
            position: absolute;
            left: 0px;
            // top: 10px;
            width: 200px;
            z-index: 1000;
            background: #fff;
            height: calc(100% - 18px);
            color: #000;
            border-radius: 3px;
            .el-menu {
                width: 100%;
                border: none;
                overflow: auto;
                background: transparent;
                background: #fff;
                height: 100%;
                .el-menu-item {
                    height: 38px;
                }
                .el-menu-item.is-active {
                    background: #328ed1;
                    color: #fff;
                }
                .el-menu-item {
                    width: 100%;
                    text-align: center;
                }
                .el-menu-item,
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
                        font-weight: 700;
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
                    min-width: 180px;
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
                color: #3195f4;
                cursor: pointer;
                font-size: 20px;
                font-weight: bold;
                height: 50px;
                line-height: 50px;
                padding: 0 20px;
                text-align: center;
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
        .collapse {
            z-index: 1122;
            position: absolute;
            right: 0;
            top: 50%;
            margin-bottom: 25px;
            cursor: pointer;
            background-color: #000;
            color: #f3f3f3;
            height: 32px;
            line-height: 32px;
            font-size: 12px;
            -webkit-border-top-left-radius: 3px;
            -webkit-border-bottom-left-radius: 3px;
            -moz-border-radius-topleft: 3px;
            -moz-border-radius-bottomleft: 3px;
            border-top-left-radius: 3px;
            border-bottom-left-radius: 3px;
            filter: alpha(opacity=25);
            -moz-opacity: 0.25;
            opacity: 0.25;
        }
    }
    & > .kl-container {
        height: calc(100% - 60px);
        position: relative;
        background: #eaf4ff;
        padding: 10px;
        float: left;
        width: 100%;
        // width: calc(100% - 20px);
        .kl-aside {
            position: absolute;
            left: 10px;
            // top: 10px;
            width: $imgWidth;
            z-index: 1000;
            background: #fff;
            height: calc(100% - 18px);
            color: #000;
            border-radius: 3px;
        }
        .kl-main {
            height: 100%;
            margin-left: 210px;
            border-radius: 3px;
            background: #fff;
            .keep-alive-container{
                width: 100%;
                height: calc(100% - 35px);
                position: relative;
                & > div {
                    height: 100%;
                    box-sizing: border-box;
                    .main-content {
                        height: 100%;
                        border: 2px solid #f3f5fb;
                        /*设置内容区域公共标题样式*/
                        .bread-bottom {
                            border-bottom: 1px solid #f3f5fb;
                        }
                    }
                }
            }
            .keep-alive-container-show {
                height: 100%;
            }
            .model-first-rank {
                padding: 0px;
            }
        }
    }
}
#main-home{
  &>.el-tabs{
    .el-tabs__content{
      height: calc( 100% - 56px);
      .el-tab-pane{
        height: 100%;
        &>div{
          height: 100%;
        }
      }
    }
  }
}
#app .animation {
  transition: all 0.4s;
//   -webkit-transform: translateX(0px);
//   -ms-transform: translateX(0px);
//   transform: translateX(0px);
}
</style>
