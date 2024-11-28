<template>
  <div id="firstNav">
    <div class="top">
      <div class="logo fl"><img :src="logoSrc" alt=""></div>
      <div class="logoLine fl">|</div>
      <div class="title fl vintage">{{title}}</div>
      <div class="setting fr">
        <slot></slot>
      </div>
    </div>
    <div id="nav" v-if="(navData.navList && navData.navList.length > 0)&&(currentNav!=0)">
      <div class="nav ">
        <ul class="navList">
          <li v-for="(item,index) in navData.navList" :key="index" @click="channelJump(item, index)"
              :class="{active: item.path == navData.activeChanel || item.opName == navData.activeChanel || item.url == navData.activeChanel}">
            <!-- <i v-if="item.icon && item.icon != ''" :class="item.icon" style="font-size: 16px"></i> -->
            <span>{{item.opName}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>

</template>

<script>
    export default {
        name: "first-Nav",
        props: ['firstNav'],
        data() {
            return {
                currentNav:'',
                //系统名称
                title: null,
                //logo路径
                logoSrc: '',
                //导航
                navData: null
            }
        },
        created() {
            this.init()
        },
        watch: {
            "$store.state.currentNav":{
              handler:function(newVal,oldVal){
                this.currentNav=this.$store.state.currentNav
                if((oldVal==0||oldVal==1)&&newVal==-1){
                  this.currentNav=0
                }
                console.log(this.currentNav);
              }
            },
            firstNav: {
                handler(val) {
                    if (val) {
                        this.init()
                    }
                },
                deep: true
            },
            // '$route.path': {
            //     handler(val) {
            //         let strurl = val.match(/^(\/[\w]+)\/?/)[1];
            //         this.$set(this.navData, 'activeChanel', strurl)
            //     },
            //     deep: true
            // },
        },
        methods: {
            //初始化
            init() {
                var data = this.firstNav

                //系统名称
                this.isError(data, 'title', '请传入系统名称').then(() => {
                    this.$set(this, 'title', data.title)
                }).catch(err => {
                    console.error(err)
                })

                //logo
                this.isError(data, 'logoSrc', '请传入logo').then(() => {
                    this.$set(this, 'logoSrc', data.logoSrc)
                }).catch(err => {
                    console.error(err)
                })

                //默认

                var DefaultnNavList = {
                    navList: [
                        {Navtitle: '显示不正确', icon: '', path: '/'},
                    ],
                    activeChanel: '/',
                }
                //菜单list
                this.$set(this, 'navData', data.navData ? data.navData : DefaultnNavList)

                //  if(this.navData.navList && this.navData.navList.length > 0) {
                //   this.common.refreshTableHeight()
                // }

            },
            //导航点击
            channelJump(data, index) {

                this.$emit('changeNav', data, index)

            },

            isError(data, prop, msg) {
                return new Promise((resolve, reject) => {
                    data.hasOwnProperty(prop) ? resolve() : reject(msg)
                })
            }

        },
    }
</script>

<style >
#firstNav {
  width: 100%;
  color: #fff;

}
#firstNav .top{
  width: 100%;
  height: 58px;
  padding: 0 20px;
  background: #297ACC;
  color: #fff;
  line-height: 38px;
}

#firstNav #nav{
  height: 30px;
  background: #fff;
}


#firstNav .logo {
  width: auto;
  height: 58px;
  margin-right: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

#firstNav .logo img {

  height: 42px;
}

#firstNav .title {
  line-height: 58px;
  font-size: 23px;
  font-family: "Microsoft YaHei";
  letter-spacing: 4px;
  padding: 0 20px;
  color: #fff;
    cursor: pointer;
    font-weight: bold;
}

#firstNav .title.vintage {

}

#firstNav .logoLine {
  line-height: 58px;
    margin-right: 0px;
    font-size: 1.5rem;
  color: rgba(255, 255, 255, .5);
}

#firstNav .nav {
  padding: 0 10px;

}

#firstNav .nav .navList {
  width: 100%;
  height:30px;
  padding: 3px 0;
}

#firstNav  .nav .navList > li {
  position: relative;
  float: left;
  height: 100%;
  line-height: 25px;
  text-align: center;
  padding: 0 8px;
  cursor: pointer;
  color:#3680CD;
  font-size: 14px;
  
}

#firstNav .nav .navList li i {
  position: relative;
  font-size: 12px;
  vertical-align: middle;
  z-index: 999;
}

#firstNav .nav .navList li span {
  position: relative;
  z-index: 999;
}

#firstNav .nav .navList > li.active {
  background: #328ED1;
  color: #fff;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
}
#firstNav .setting{
  height: 58px;
  margin-right: -5px;
}
#firstNav .fl {
  float: left;
}

#firstNav .fr {
  float: right;
}
</style>
