<template>
    <div style="width: 500px">
        <el-input
                placeholder="输入部门名称进行搜索"
                prefix-icon="el-icon-search"
                v-model="filterText">
        </el-input>

        <el-tree
                :data="departments"
                :props="defaultProps"
                :filter-node-method="filterNode"
                :expand-on-click-node="false"
                size="small"
                ref="tree">
            <span class="custom-tree-node" slot-scope="{ node, data }" style="display: flex;justify-content: space-between;width: 100%">
        <span>{{ data.name }}</span>
        <span>
          <el-button
                  class="depBtn"
                  type="primary"
                  size="mini"
                  @click="() => showAddDepartment(data)">
            添加部门
          </el-button>
          <el-button
                  class="depBtn"
                  type="danger"
                  size="mini"
                  @click="() => deleteDepartment( data)">
            删除部门
          </el-button>
        </span>
      </span>
        </el-tree>
        <el-dialog
                title="添加部门"
                size="small"
                :visible.sync="dialogVisible"
                width="30%">
            <div>
                <div>
                    <el-tag style="margin-right: 8px" size="small">上级部门</el-tag>
                    <span>{{parentName}}</span>
                </div>
                <div>
                    <el-tag style="margin-right: 8px" size="small">部门名称</el-tag>
                    <el-input v-model="dep.name" placeholder="请输入部门名称..." size="small" style="width: 200px"></el-input>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addDepartment">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "DepManager",
        data(){
            return{
                filterText: '',
                departments: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                dialogVisible: false,
                dep:{
                    name: "",
                    parentId:-1
                },
                parentName:''
            }
        },
        mounted(){
            this.showDepartments();
        },
        methods: {
            addDep2Deps(deps, dep) {
                for (let i = 0; i < deps.length; i++) {
                    let d = deps[i];
                    if (d.id === dep.parentId) {
                        d.children = d.children.concat(dep);
                        if (d.children.length > 0) {
                            d.parent = true;
                        }
                        return;
                    } else {
                        this.addDep2Deps(d.children, dep);
                    }
                }
            },
            initDep(){
                this.dep = {
                    name: "",
                    parentId: -1
                };
                this.parentName = '';
            },
            addDepartment(dep) {
                this.postRequest("/system/basic/dep/",this.dep).then(resp=>{
                    if (resp) {
                        this.addDep2Deps(this.departments, resp.obj);
                        this.dialogVisible = false;
                        //变量初始化
                        this.initDep();
                    }
                })
            },
            showAddDepartment(data) {
                this.parentName = data.name;
                this.dep.parentId = data.id;
                this.dialogVisible = true;
            },
            removeDepFromDeps(parent, department, id) {
                for (let i = 0; i < department.length; i++) {
                    let d = department[i];
                    if (d.id == id) {
                        department.splice(i, 1);
                        if (department.length === 0) {
                            parent.parent=false;
                        }
                        return;
                    } else {
                        this.removeDepFromDeps(d, d.children, id);
                    }
                }
            },
            deleteDepartment(data) {
                if (data.isParent) {
                    this.$message.error("该部门下有子部门，删除失败！");
                } else {
                    this.$confirm('此操作将永久删除【'+data.name+'】部门, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.deleteRequest("/system/basic/dep/"+data.id).then(resp=>{
                            if (resp) {
                                this.removeDepFromDeps(null,this.departments,data.id);
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }
            },
            showDepartments() {
                this.getRequest("/system/basic/dep/").then(resp=>{
                    if (resp) {
                        this.departments = resp;
                    }
                })
            },

            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        }
    }
</script>

<style scoped>
    .depBtn{
        padding: 3px;
    }

</style>