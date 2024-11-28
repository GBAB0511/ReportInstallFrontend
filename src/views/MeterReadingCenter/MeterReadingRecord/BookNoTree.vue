<template>
  <div id="tree" v-loading="loading" style="overflow: auto;">
    <div class="search" v-if="inputProp.inputshow">
      <el-input oninput ="value=value.replace(/\ +/g,'').replace(/[\r\n]/g,'')"  v-model="filterText" :placeholder="inputProp.Inp_placeholder" suffix-icon="el-icon-search"></el-input>
    </div>

    <el-tree
      class="tree"
      v-if="show"
      :highlight-current="true"
      :data="treedata"
      :props="defaultProps"
      :node-key="nodeKey"
      accordion
      :indent="0"
      @node-click="handleNodeClick" 
      ref="tree2"
      :default-expanded-keys="expanded"
      :style="{height:inputProp.inputshow?'calc(100% - 80px)':'100%',paddingBottom:inputProp.inputshow?'50px':'0px'}"
      :expand-on-click-node="true"
      :filter-node-method="filterNode"
      :render-after-expand="false"
    >
    <div slot-scope="{node}" class="node-label" v-html="node.label">
    </div>
    </el-tree>
  </div>
</template>

<script>

    export default {
        name: "company-tree",
        props: ['treeData'],
        components: {},
        data() {
            return {
                treedata: [],
                defaultProps: {},
                sendTreeProp: [],
                filterText: '',
                loading: true,
                inputProp: {
                    Inp_placeholder: '',
                    inputshow: null,
                },
                nodeKey: 'id',
                expanded: null,
                checkedNode: null,
                show: true
            }
        },
        watch: {
            treeData: {
              immediate: true,
                handler(val) {
                    if (val) {
                        this.init()
                    }
                },
                deep: true
            },
            filterText(val) {
                this.$refs.tree2.filter(val)
            }
        },
        created() {
            // this.init()
        },
        mounted() {

        },
        methods: {
            //初始化
            init() {
                let data = this.treeData
                console.log(data);
                if (data) {
                    //是否有树的label选项
                    if(data.hasOwnProperty('defaultProps')){
                        let defaultProps = Object.keys(data.defaultProps)
                        if (defaultProps.length !== 0) {
                            this.$set(this, 'defaultProps', data.defaultProps)
                        } else {
                            this.$set(this, 'defaultProps', {children: '_child', label: 'name'})

                        }
                    }else {
                        this.$set(this, 'defaultProps', {children: '_child', label: 'name'})
                        return  console.error('请传入树的默认label和children配置')
                    }

                    //是否有树
                    if(data.hasOwnProperty('tree')){
                        if (data.tree) {
                            if (data.tree.constructor == Object) {
                                let tree = Object.keys(data.tree)
                                if (tree.length !== 0) {
                                    let treedata = this.gettree([data.tree])
                                    if (!treedata[0].hasOwnProperty('name')) {
                                        treedata[0].name = data.rootName ? data.rootName : '根节点'
                                    }
                                    this.$set(this, 'treedata', treedata)
                                    // 默认展开
                                    if(data.hasOwnProperty('defaultOpen')){
                                        if (Object.keys(data.defaultOpen).length!=0) {
                                            this.$set(this, 'nodeKey', data.defaultOpen.nodeKey ? data.defaultOpen.nodeKey : 'id')
                                            const expended = data.defaultOpen.nodeItem ? data.defaultOpen.nodeItem : (treedata[0][this.nodeKey] ? [treedata[0][this.nodeKey]] : [treedata[0][this.defaultProps.children][0][this.nodeKey]])
                                            this.$set(this, 'expanded', expended)
                                        } else {
                                            this.$set(this, 'expanded', [treedata[0][this.nodeKey]])
                                        }
                                    }else {
                                        this.$set(this, 'expanded', [treedata[0][this.nodeKey]])
                                    }
                                    setTimeout(() => {
                                        this.$refs.tree2.setCurrentKey(this.expanded[0])
                                    }, 0)

                                } else {
                                    this.$set(this, 'treedata', [])
                                }
                                this.$set(this, 'loading', false)
                            } else if (data.tree.constructor == Array) {
                                if (data.tree.length !== 0) {
                                    let treedata
                                    //是否有children
                                    if (data.tree[0].hasOwnProperty(data.defaultProps.children)) {
                                        treedata = data.tree
                                    } else {
                                        treedata = this.gettree(data.tree)
                                    }
                                    //名字
                                    if (!treedata[0].hasOwnProperty('name')) {
                                        treedata[0].name = data.rootName ? data.rootName : '根节点'
                                    }
                                    this.$set(this, 'treedata', treedata)
                                    //默认展开
                                    if(data.hasOwnProperty('defaultOpen')){
                                        if (Object.keys(data.defaultOpen).length!=0) {
                                            this.$set(this, 'nodeKey', data.defaultOpen.nodeKey ? data.defaultOpen.nodeKey : 'id')
                                            const expended = data.defaultOpen.nodeItem ? data.defaultOpen.nodeItem : (treedata[0][this.nodeKey] ? [treedata[0][this.nodeKey]] : [treedata[0][this.defaultProps.children][0][this.nodeKey]])
                                            this.$set(this, 'expanded', expended)
                                        } else {
                                            this.$set(this, 'expanded', [treedata[0][this.nodeKey]])
                                        }
                                    }else {
                                        this.$set(this, 'expanded', [treedata[0][this.nodeKey]])
                                    }
                                    setTimeout(() => {
                                        this.$refs.tree2.setCurrentKey(this.expanded[0])
                                    }, 0)
                                } else {
                                    this.$set(this, 'treedata', [])

                                }
                                this.$set(this, 'loading', false)
                            }

                        } else {
                            this.$set(this, 'treedata', [])
                        }
                    }else {
                        this.$set(this, 'treedata', [])
                    }

                    //是否有返回值的选项
                    if(data.hasOwnProperty('sendTreeProp')){
                        if (data.sendTreeProp.length !== 0) {
                            this.$set(this, 'sendTreeProp', data.sendTreeProp)
                        } else {
                            this.$set(this, 'sendTreeProp', [])
                        }
                    }else {
                        this.$set(this, 'sendTreeProp', [])
                    }


                    //input的一些选择
                    if(data.hasOwnProperty('inputProp')){
                        let inputProp = Object.keys(data.inputProp)
                        if (inputProp.length !== 0) {
                            this.$set(this.inputProp, 'inputshow', data.inputProp.showSearch !== '' ? data.inputProp.showSearch : true)
                            this.$set(this.inputProp, 'Inp_placeholder', data.inputProp.Inp_placeholder !== '' ? data.inputProp.Inp_placeholder : '请输入部门')
                        } else {
                            this.$set(this.inputProp, 'inputshow', true)
                            this.$set(this.inputProp, 'Inp_placeholder', '请输入')
                        }
                    }else {
                        this.$set(this.inputProp, 'inputshow', true)
                        this.$set(this.inputProp, 'Inp_placeholder', '请输入')
                    }


                }
            },
            // 点击node节点事件
            handleNodeClick(treeNode) {              
                let data = {};

                if (this.sendTreeProp.length !== 0) {

                    this.sendTreeProp.map(item => {
                        if (treeNode[item] !== null && treeNode.hasOwnProperty(item)) {
                            data[item] = treeNode[item]
                        } else {
                            data[item] = '暂无'
                        }
                    })

                } else {
                    data = {...treeNode}
                }
                this.$emit('sendTreeData', data)
                            
            },
            refreshChecked(nodeKey) {
              if(nodeKey) {
                this.expanded = [nodeKey]
                this.$nextTick(() => {
                  this.$refs.tree2.setCurrentKey(nodeKey)
                })
              }
            },
            //过滤
            filterNode(value, data) {
                if (!value) return true
                return data[this.defaultProps.label].indexOf(value) !== -1
            },
            //tree处理
            gettree(data) {
                var parentMask = new Array();
                var root = new Array();

                root.push(data[0]);
                parentMask.push(data[0]);
                data.forEach(function (item, index) {
                    if (index == 0) return;
                    maskCompare(item);
                });

                function maskCompare(item) {
                    if (item.parentMask > parentMask[parentMask.length - 1].parentMask) {//子节点
                        if (!parentMask[parentMask.length - 1]._child)
                            parentMask[parentMask.length - 1]._child = new Array();
                        parentMask[parentMask.length - 1]._child.push(item);
                        parentMask.push(item);
                    } else if (item.parentMask <= parentMask[parentMask.length - 1].parentMask) {
                        parentMask.pop();
                        maskCompare(item);
                    }
                }


                return root
            },

            handle(obj) {
                console.log(obj);
            }
        }

    }
</script>

<style scoped lang="scss">
/deep/ {
  .el-tree-node {
    .node-label {
    //   font-size: 12px;
      
      span:last-child{
        color: red;
      }
      span:first-child{
        color: blue;
      }
    }
  }
  .el-tree-node>.el-tree-node__children{
    overflow: inherit;
  }
}
</style>
