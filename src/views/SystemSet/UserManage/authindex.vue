<template>
<div class="user-role-index">
  <el-table :data="formatData" :row-style="showRow" v-bind="$attrs">
    <el-table-column v-if="columns.length===0" width="150">
      <template slot-scope="scope">
        <span v-for="space in scope.row._level" class="ms-tree-space" :key="space"></span>
        <span class="tree-ctrl" v-if="iconShow(0,scope.row)" @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-plus"></i>
          <i v-else class="el-icon-minus"></i>
        </span>
        {{scope.$index}}
      </template>
    </el-table-column>
    <el-table-column v-else v-for="(column, index) in columns" :key="column.value" :label="column.text" :width="column.width">
      <template slot-scope="scope">
        <span v-if="index === 0" v-for="space in scope.row._level" class="ms-tree-space" :key="space"></span>
        
        <span class="tree-ctrl" v-if="iconShow(index,scope.row)" @click="toggleExpanded(scope.$index)">
          <i v-if="!scope.row._expanded" class="el-icon-plus"></i>
          <i v-else class="el-icon-minus"></i>
        </span>
        <!--加减后的选择框-->
        <el-checkbox  v-if ="scope.row[column.act] && scope.row.isLeaf === 3" :indeterminate="scope.row.indeterminate" v-model="scope.row.checkAll" @change="handleCheckAllChange3(scope.$index, scope.row,column.option)" ></el-checkbox>
				<el-checkbox  v-if ="scope.row[column.act] && scope.row.isLeaf !== 3" :indeterminate="scope.row.indeterminate" v-model="scope.row.checkAll" @change="handleCheckAllChange1(scope.$index, scope.row,column.option)" ></el-checkbox>
         <el-checkbox-group  v-if="Array.isArray(scope.row[column.value])" v-model="scope.row.selectchecked" @change="handleCheckedCitiesChange(scope.$index, scope.row,scope.row[column.option])">
          <!--功能权限checkbox名-->
          <el-checkbox v-for="(interset) in scope.row[column.value]" :label="interset.id" :key="interset.id">{{interset.operation}}</el-checkbox>
        </el-checkbox-group>
				<!--菜单列表名展开名称附带选择框-->
        <el-checkbox  style="margin-left: 10%;" v-else-if="scope.row.isLeaf===1"  :indeterminate="scope.row.indeterminate" v-model="scope.row.checkAll" @change="handleCheckAllChange(scope.$index, scope.row,scope.row[column.option])" >{{scope.row[column.value]}}</el-checkbox>
        <!--菜单列表名展开名称不附带选择框-->
        <span v-else>{{scope.row[column.value]}}</span>
        <!--<el-checkbox  v-if ="scope.row[column.act]"   :indeterminate="scope.row.Indeterminate" v-model="scope.row.checkAll" @change="handleCheckAllChange1(scope.$index, scope.row,column.option)" >{{scope.row[column.act]}}</el-checkbox>-->
      </template>
    </el-table-column>
    <slot></slot>
  </el-table>
</div>
</template>

<script>
import util from '@/assets/js/util.js'
export default {
  name: 'treeTable',
  props: {
    data: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      default: () => []
    },
    evalFunc: Function,
    evalArgs: Array,
    expandAll: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    // 格式化数据源
    formatData: function () {
      let tmp
      if (!Array.isArray(this.data)) {
        tmp = [this.data]
      } else {
        tmp = this.data
      }
      const func = this.evalFunc || util.treeToArray
      const args = this.evalArgs ? Array.concat([tmp, this.expandAll], this.evalArgs) : [tmp, this.expandAll]
      return func.apply(null, args)
    }
  },
  watch: {
    data: {
      handler: function () {
        // this.$emit('treeTableData', this.data)
     this.defaultSelcet()
      },
      deep: true
    }
  },
  created() {
    this.defaultSelcet()
  },
  mounted(){
  },
  methods: {
    showRow(row) {
      const show = (row.row.parent ? (row.row.parent._expanded && row.row.parent._show) : true)
      row.row._show = show
      return show ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s; text-align: left;' : 'display:none; text-align: left;'
    },
    // 切换下级是否展开
    toggleExpanded(trIndex) {
      const record = this.formatData[trIndex]
      record._expanded = !record._expanded
    },
    // 图标显示
    iconShow (index, record) {
      if (record.isLeaf !== 3) {
  			if(index === 0 && record.isLeaf === 0){
					return true
				} else {
					return false
				}
  		} else {
    		return (index === 0 && record.children && record.children.length > 0)
    	}
    },
    //整横全选
    handleCheckAllChange (index, row, opt) {
      this.cc()
      if (row.selectchecked.length && row.selectchecked.length !== opt.length) {
        let arr = []
        opt.forEach(element => {
          arr.push(element.id)
        })
        row.selectchecked = arr
        row.checkAll = true
        row.indeterminate = false
      } else if (!row.selectchecked.length) {
        let arr = []
        opt.forEach(element => {
          arr.push(element.id)
        })
        row.selectchecked = arr
        row.checkAll = true
        row.indeterminate = false
      } else {
        row.selectchecked = []
        row.checkAll = false
        row.indeterminate = false
      }
    },
    //功能权限点击 
    handleCheckedCitiesChange (index, row, opt) {
      row.checkAll = row.selectchecked.length === opt.length
      row.indeterminate = row.selectchecked.length > 0 && row.selectchecked.length < opt.length
      this.cc()
    },
    handleCheckAllChange1 (index, row, opt) {
    	//opt === sonData1
      if (row.children) {
        row.children.forEach(val => {
          let arr = []
          //判断是否全选
          if (row.checkAll) {
            val[opt].forEach(element => {
              arr.push(element.id)
            })
            val.selectchecked = arr
             //二级是否选中的状态
            val.checkAll = true
            val.indeterminate = false
          } else {
            val.selectchecked = []
            val.checkAll = false
            val.indeterminate = false
          }
        })
      }
      this.cc()
    },
    //三级菜单点击事件
    handleCheckAllChange3(index, row, opt){
    	let child = row.children
    	for(let i = 0; i<child.length; i++){
    		if(row.checkAll){
    			child[i].checkAll = true
    		} else {
    			child[i].checkAll = false
    		}
    		//判断是否有分级
    		if(child[i].children.length > 0) {
    			child[i].children.forEach(val => {
	          let arr = []
	          //判断是否全选
	          if (child[i].checkAll) {
	            val[opt].forEach(element => {
	              arr.push(element.id)
	            })
	            val.selectchecked = arr
	            //二级是否选中的状态
	            val.checkAll = true
	            val.indeterminate = false
	          } else {
	            val.selectchecked = []
	            val.checkAll = false
	            val.indeterminate = false
	          }
	        })
    		}else {
    			let arr = []
          if (row.checkAll) {
            child[i][opt].forEach(element => {
              arr.push(element.id)
            })
            child[i].selectchecked = arr
            child[i].checkAll = true
            child[i].indeterminate = false
          } else {
            child[i].selectchecked = []
            child[i].checkAll = false
            child[i].indeterminate = false
          }
    		}
    	}
    	this.cc()
    },
    defaultSelcet () {
      this.data.forEach(val => {
        if (val.children) {
          val.children.forEach(el => {
          	//判断是否有三级
          	if(el.children.length === 0){
          		if (el.selectchecked.length && el.selectchecked.length !== el[this.columns[0].option].length) {
	              el.indeterminate = true
	              el.checkAll = false
	            } else if (el.selectchecked.length && el.selectchecked.length === el[this.columns[0].option].length) {
	              el.indeterminate = false
	              el.checkAll = true
	            } else {
	              el.indeterminate = false
	              el.checkAll = false
	            }
          	}else {
          		let sum = 0
          		el.children.forEach(k => {
          			if (k.selectchecked.length && k.selectchecked.length !== k[this.columns[0].option].length) {
		              k.indeterminate = true
		              k.checkAll = false
		            } else if (k.selectchecked.length && k.selectchecked.length === k[this.columns[0].option].length) {
		              k.indeterminate = false
		              k.checkAll = true
		              //判断三级全选数
		              sum += 1
		            } else {
		              k.indeterminate = false
		              k.checkAll = false
		            }
          		})
          		if(sum !== 0){
          			el.indeterminate = true
	              el.checkAll = false
          		} else if (sum === el.children.length){
          			el.indeterminate = false
	              el.checkAll = true
          		}else {
          			el.indeterminate = false
	              el.checkAll = false
          		}
          	}
          })
          this.cc()
        }
      })
    },
    cc () {
      this.data.forEach(val => {
      	if(val.isLeaf === 3){
      		//收集三级菜单中二级的全选的状态
	          val.children.forEach(el => {
          	let checkAllArr = []
		        let IndeterminateArr = []
		        if (el.children.length > 0) {
		          el.children.forEach(i => {
		            checkAllArr.push(i.checkAll)
		            IndeterminateArr.push(i.indeterminate)
		          })
		          if (new Set(checkAllArr).size === 1) { // && new Set(IndeterminateArr).size !== 1
			          if (checkAllArr[0] && IndeterminateArr[0] === false) {
			            el.indeterminate = false
			            el.checkAll = true
			          } else if (checkAllArr[0] && new Set(IndeterminateArr).size !== 1) {
			            el.indeterminate = false
			            el.checkAll = true
			          } else if (!checkAllArr[0] && new Set(IndeterminateArr).size !== 1) {
			            el.indeterminate = true
			            el.checkAll = false
			          } else if (!checkAllArr[0] && new Set(IndeterminateArr).size === 1) {
			            if (!IndeterminateArr[0]) {
			              el.indeterminate = false
			              el.checkAll = false
			            } else {
			              el.indeterminate = true
			              el.checkAll = false
			            }
			          } else {
			            el.indeterminate = false
			            el.checkAll = false
			          }
			        } else {
			          el.indeterminate = true
			          el.checkAll = false
			        }
		        } else {
		        	//收集三级菜单中二级下没有分级的情况
		        	if(el.selectchecked.length === el.sonData.length) {
		        		el.indeterminate = false
	              el.checkAll = true
		        	} else if(el.selectchecked.length && el.selectchecked.length !== el.sonData.length) {
		        		el.indeterminate = true
	              el.checkAll = false
		        	} else {
		        		el.indeterminate = false
	              el.checkAll = false
		        	}
		        }
          })
          //收集三级菜单中二级的全选的状态 处理结束
      		
      		let checkAllArr = []
	        let IndeterminateArr = []
	        if (val.children) {
	        	//收集一级全选的状态
	          val.children.forEach(el => {
	            checkAllArr.push(el.checkAll)
	            IndeterminateArr.push(el.indeterminate)
	          })
	        }
	        if (new Set(checkAllArr).size === 1) {
	          	if(checkAllArr[0] && IndeterminateArr[0] === false) {
	          		val.indeterminate = false
	          		val.checkAll = true
	          	} else if(!checkAllArr[0] && IndeterminateArr[0] !== 1){
	          		val.indeterminate = true
	          		val.checkAll = false
	          	}else if (!checkAllArr[0] && new Set(IndeterminateArr).size !== 1) {
		            val.indeterminate = true
		            val.checkAll = false
		          } else if (!checkAllArr[0] && new Set(IndeterminateArr).size === 1) {
		            if (!IndeterminateArr[0]) {
		              val.indeterminate = false
		              val.checkAll = false
		            } else {
		              val.Indeterminate = true
		              val.checkAll = false
		            }
		          } else {
		            val.indeterminate = false
		            val.checkAll = false
		          } 
	          }else {
	          	val.indeterminate = true
	          	val.checkAll = false
	          }
      	}else {
      		let checkAllArr = []
	        let IndeterminateArr = []
	        if (val.children) {
	        	//收集一级全选的状态
	          val.children.forEach(el => {
	            checkAllArr.push(el.checkAll)
	            IndeterminateArr.push(el.indeterminate)
	          }) 
	        }
	        //new Set()es6去重, new Set().size实例的成员总数
	        //checkAllArr和Indeterminate只有false和true两种状态
	        //去重后，如果有两种状态，表明二级没有全选到，
	        if (new Set(checkAllArr).size === 1) { // && new Set(IndeterminateArr).size !== 1
	        	//
	          if (checkAllArr[0] && IndeterminateArr[0] === false) {
	            val.indeterminate = false
	            val.checkAll = true
	          } else if (checkAllArr[0] && new Set(IndeterminateArr).size !== 1) {
	            val.indeterminate = false
	            val.checkAll = true
	          } else if (!checkAllArr[0] && new Set(IndeterminateArr).size !== 1) {
	            val.indeterminate = true
	            val.checkAll = false
	          } else if (!checkAllArr[0] && new Set(IndeterminateArr).size === 1) {
	            if (!IndeterminateArr[0]) {
	              val.indeterminate = false
	              val.checkAll = false
	            } else {
	              val.indeterminate = true
	              val.checkAll = false
	            }
	          } else {
	            val.indeterminate = false
	            val.checkAll = false
	          }
	        } else {
	          val.indeterminate = true
	          val.checkAll = false
	        }
      	}
      })
    },
    treeToArray (data, expandAll, parentId = null, level = null){
			let arr = []
			Array.from(data).forEach(function (record) {
			if (record._expanded === undefined) {
				Vue.set(record, '_expanded', expandAll)
		    }
		    let _level = 1
		    if (level !== undefined && level !== null) {
		      _level = level + 1
		    }
		    Vue.set(record, '_level', _level)
		    // 如果有父元素
		    if (parentId) {
		      Vue.set(record, 'parentId', parentId)
		    }
		    arr.push(record)
		    if (record.children && record.children.length > 0) {
		      const children = util.treeToArray(record.children, expandAll, record, _level)
		      arr = arr.concat(children)
		    }
			})
		  	return arr
		}
  }
}
</script>
<!--<style scoped>
  @keyframes treeTableShow {
    from {opacity: 0;}
    to {opacity: 1;}
  }
  @-webkit-keyframes treeTableShow {
    from {opacity: 0;}
    to {opacity: 1;}
  }
  .el-table__body{
    text-align: left!important;
  }
</style>-->

<style lang="scss" scoped>
  /*footer{
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
  }*/
	.user-role-index{
		$color-blue: #2196F3;
	  $space-width: 18px;
	  .ms-tree-space {
	    position: relative;
	    top: 1px;
	    display: inline-block;
	    font-style: normal;
	    font-weight: 400;
	    line-height: 1;
	    width: $space-width;
	    height: 24px;
	    &::before {
	      content: ""
	    }
	  }
	  .processContainer{
	    width: 100%;
	    height: 100%;
	  }
	  table td {
	    line-height: 26px;
	    text-align: left;
	  }
	
	  .tree-ctrl{
	    position: relative;
	    cursor: pointer;
	    color: $color-blue;
	    margin-left: -$space-width;
	  }
	  /*.el-dialog__body .el-checkbox {
	  	width: $space-width
	  }
	  .el-dialog__body .el-checkbox+.el-checkbox{
	  	margin-left:30px;
	  }*/
	}
  
  /*.el-table__body{
      tr{
        td:nth-child(2){
          div{
            color:#3195f4;
            cursor: pointer;
          }
        }
      }
    }*/

</style>
