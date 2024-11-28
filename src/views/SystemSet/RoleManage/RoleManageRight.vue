
<template>
    <div class="common-bdiv">
        <div>
            <el-form  :inline="true" size="mini" :model="RoleManageRightForm"  label-width="150px" ref="ruleForm" :rules="rules">
                <el-tree
                    :data="RoleManageRightForm.treeData"
                    show-checkbox
                    node-key="id"
                    default-expand-all
                    highlight-current
                    :expand-on-click-node=false
                    :check-on-click-node=true
                    :check-strictly=true
                    :props="RoleManageRightForm.defaultProps">
                    <!-- TODO ***父级节点被点击取消时，要可以自动选择取消所有他的子节点，但是子节点被取消时不可以取消父节点*** -->
                    </el-tree>
            </el-form>
        </div>

    </div>
</template>
<script>
export default {
    name:"RoleManageRight",
    components:{
    },
    data(){
        return{
            RoleManageRightForm:{
                treeData: [{
                    id: 1,
                    label: '首页',
                    children: []
                    },
                    {
                    id: 1,
                    label: '工作台',
                    children: []
                    }, {
                    id: 2,
                    label: '流程审批',
                    children: [{
                            id: 5,
                            label: '待审'
                        }, {
                            id: 6,
                            label: '已审'
                        }, {
                            id: 6,
                            label: '所有'
                        }, {
                            id: 6,
                            label: '我的申请'
                        }
                    ]
                    }, {
                    id: 3,
                    label: '业务管理',
                    children: [{
                            id: 7,
                            label: '工程管理',
                            children: [{
                                    id: 7,
                                    label: '用户工程',
                                    children: [{
                                            id: 7,
                                            label: '用水咨询',
                                            children: [{
                                                    id: 7,
                                                    label: '添加',
                                                },{
                                                    id: 7,
                                                    label: '修改',
                                                }
                                            ]
                                        },{
                                            id: 7,
                                            label: '用水安装',
                                        }
                                    ]
                                }
                            ]
                        },
                    ]
                }],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }
            },
        }
    },
    mounted(){
        this.init();
    },
    methods:{
        init(){

        },
        submitUpload() {
            this.$refs.upload.submit();
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        

    }
}
</script>

