<template>
    <div>
        <div class="inputClass">
            <el-input placeholder="请输入角色英文名" v-model="role.name" size="small" style="width: 300px;margin-right: 8px">
                <template slot="prepend">ROLE_</template>
            </el-input>
            <el-input placeholder="请输入角色中文名" v-model="role.nameZh" size="small" style="width: 300px;margin-right: 8px"
            @keydown.enter.native="addRole">
            </el-input>
            <el-button size="small" type="primary" icon="el-icon-plus" @click="addRole">添加角色</el-button>
        </div>
        <div style="width: 700px">
            <el-collapse v-model="activeName" accordion @change="change">
                <el-collapse-item :title="item.nameZh" :name="item.id" v-for="(item,index) in roles" :key="index">
                    <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>可访问资源</span>
                        <el-button style="float: right; padding: 3px 0;color:#ff0000"
                                   icon="el-icon-delete" type="text" @click="deleteRole(item)"></el-button>
                    </div>
                    <div>
                        <el-tree :data="allMenus" :props="defaultProps" show-checkbox
                                 node-key="id"
                                 ref="tree"
                                 :key="index"
                                 :default-checked-keys="checkedMenus"></el-tree>
                        <div style="display: flex;justify-content: flex-end">
                            <el-button size="small" @click="activeName=-1">取消修改</el-button>
                            <el-button type="primary" size="small" @click="updatePer(item.id,index)">确认修改</el-button>
                        </div>
                    </div>
                </el-card>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PermissManager",
        data(){
            return{
                role:{
                    name: '',
                    nameZh:''
                },
                activeName:-1,
                roles:[],
                allMenus:[],
                checkedMenus: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            }
        },
        mounted() {
            this.initRoles();
        },
        methods:{
            deleteRole(role) {
                this.$confirm('此操作将永久删除【'+role.nameZh+'】角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/per/role/"+role.id).then(resp=>{
                        if (resp) {
                            this.initRoles();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            addRole(){
                if (this.role.name && this.role.nameZh) {
                    this.postRequest("/system/basic/per/", this.role).then(resp => {
                        if (resp) {
                            this.initRoles();
                            this.role.name = '';
                            this.role.nameZh = '';
                        }
                    });
                } else {
                    this.$message.error("角色名称不能为空...")
                }
            },
            updatePer(rid,index) {
                let tree = this.$refs.tree[index];
                let selected = tree.getCheckedKeys(true); //返回选中的叶子结点
                let url = "/system/basic/per/?rid=" +rid;
                selected.forEach(key=>{
                    url += '&mids=' + key;
                })
                this.putRequest(url).then(resp=>{
                    if (resp) {
                        this.initRoles();
                        this.activeName = -1;
                    }
                })
            },
            change(id) {
                if (id) {
                    this.initAllMenus();
                    this.getCheckedByRid(id);
                }
            },
            getCheckedByRid(rid) {
                this.getRequest("/system/basic/per/checked/"+rid).then(resp=>{
                    if (resp) {
                        this.checkedMenus = resp;
                    }
                })
            },

            initRoles(){
                this.getRequest("/system/basic/per/").then(resp=>{
                    if (resp) {
                        this.roles = resp;
                    }
                })
            },
            initAllMenus(){
                this.getRequest("/system/basic/per/menus").then(resp=>{
                    if (resp) {
                        this.allMenus = resp;
                    }
                })
            }
        }
    }
</script>

<style scoped>
.inputClass{
    display: flex;
    justify-content: flex-start;
    margin-bottom: 10px;
}
</style>