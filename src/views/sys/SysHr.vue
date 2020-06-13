<template>
    <div>
        <div class="searchHeader">
            <el-input size="small" style="width: 400px" prefix-icon="el-icon-search" placeholder="请输入用户名查询用户..." v-model="keywords"
            @keydown.enter.native="search"></el-input>
            <el-button size="small" icon="el-icon-search" type="primary" style="margin-left: 8px" @click="search">搜索</el-button>
        </div>
        <div class="hrContainer">
            <el-card class="box-card" v-for="(hr,index) in hrs" :key="index">
                <div slot="header" class="clearfix">
                    <span>{{hr.name}}</span>
                    <el-button  size="small" style="float: right; padding: 3px 0" type="danger" icon="el-icon-delete" @click="doDelete(hr)"></el-button>
                </div>
                <div>
                    <div class="img_container">
                        <img :src="hr.userface" :alt="hr.name" :title="hr.name" class="userface">
                    </div>
                    <div class="content_container">
                        <div>用户名：{{hr.name}}</div>
                        <div>手机号码：{{hr.telephone}}</div>
                        <div>电话号码：{{hr.phone}}</div>
                        <div>地址：{{hr.address}}</div>
                        <div>用户状态：
                            <el-switch
                                v-model="hr.enabled"
                                active-text="启用"
                                inactive-text="禁用"
                                @change="enabledChange(hr)"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                        </el-switch>
                            </div>
                        <div>用户角色：
                            <el-tag v-for="(role,index1) in hr.roles" :key="index1" type="success" size="small" style="margin-right: 4px">
                                {{role.nameZh}}
                            </el-tag>
                            <el-popover
                                    placement="right"
                                    title="角色列表"
                                    @show="showPopover(hr)"
                                    @hide="hidePopover(hr)"
                                    width="200"
                                    trigger="click">
                                <el-select v-model="selectedRoles" multiple placeholder="请选择" size="small">
                                    <el-option
                                            v-for="(role,indexj) in allRoles"
                                            :key="indexj"
                                            :label="role.nameZh"
                                            :value="role.id">
                                    </el-option>
                                </el-select>
                                <el-button slot="reference" size="mini" icon="el-icon-more" type="text"></el-button>
                            </el-popover>
                           </div>
                        <div>备注：{{hr.remark}}</div>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SysHr",
        data() {
            return {
                keywords: "",
                hrs: [],
                hr: [],
                allRoles: [],
                selectedRoles: []//存放的是已选择的角色id
            };
        },
        mounted() {
            this.showAllHrs();
        },
        methods:{
            doDelete(hr) {
                this.$confirm('此操作将永久删除操作员【'+hr.name+'】, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/hr/"+hr.id).then(resp=>{
                        if (resp) {
                            this.showAllHrs();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            search(){
                this.showAllHrs();
            },
            hidePopover(hr) {
                //角色有更新才执行更新操作，否则不执行
                let roles =[];
                Object.assign(roles,hr.roles);
                let flag = false;
                if (roles.length !== this.selectedRoles.length) {
                    flag = true;
                }else {
                    for (let i = 0; i < roles.length; i++) {
                        let role = roles[i];
                        for (let j = 0; j < this.selectedRoles.length; j++) {
                            let selectedRole = this.selectedRoles[j];
                            if (role.id === selectedRole) {
                                roles.splice(i, 1);
                                i--;
                                break;
                            }
                        }
                        }
                    if (roles.length !== 0) {
                        flag = true;
                    }
                }
                if (flag) {
                    let url = "/system/hr/updateRole?hrid=" + hr.id;
                    this.selectedRoles.forEach(rid => {
                        url += '&rids=' + rid;
                    });
                    this.putRequest(url).then(resp => {
                        if (resp) {
                            this.showAllHrs();
                        }
                    });
                }

            },
            showPopover(hr) {
                this.getAllRoles();
                let roles = hr.roles;
                this.selectedRoles = [];
                roles.forEach(role => {
                    this.selectedRoles.push(role.id);
                });
            },
            getAllRoles(){
                this.getRequest("/system/hr/roles").then(resp => {
                    if (resp) {
                        this.allRoles = resp;
                    }
                });
            },
            enabledChange(hr) {
                delete hr.roles;
                this.putRequest("/system/hr/",hr).then(resp=>{
                    if (resp) {
                        this.showAllHrs();
                    }
                })
                console.log(hr)
            },
            showAllHrs() {
                this.getRequest("/system/hr/?keywords="+this.keywords).then(resp=>{
                    if (resp)
                        this.hrs = resp;
                })
            }
        }
    }
</script>

<style scoped>
    .content_container{
        margin-top: 20px
    }
    .content_container div{
        font-size: 12px;
        color: #409eff;
    }
    .img_container{
        width: 100%;
        display: flex;
        justify-content: center;
    }
.searchHeader{
    display: flex;
    justify-content: center;
    margin-top: 15px;
}
    .box-card{
        width: 350px;
        margin-bottom: 20px;
    }
    .hrContainer{
        margin-top: 25px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around
    }

    .userface{
        width: 72px;
        height: 72px;
        border-radius: 72px;
    }
</style>