<template>
    <div>
        <div>
            <el-input size="small" prefix-icon="el-icon-plus" placeholder="添加职称" v-model="Job.name" class="jobInput"></el-input>
            <el-select v-model="Job.titleLevel" slot="prepend" placeholder="请选择职称等级" size="small" class="JobSelect">
                <el-option
                        v-for="item in titleLevels"
                        :key="item"
                        :label="item"
                        :value="item">
                </el-option>

            </el-select>
            <el-button size="small" type="primary" icon="el-icon-plus" @click="addJobs">添加</el-button>
        </div>
        <div style="margin-top: 10px">
            <el-table
                    :data="jobLevel"
                    border
                    stripe
                    size="small"
                    @selection-change="handleSelectionChange"
                    style="width: 60%">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="编号"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="职称名称"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="titleLevel"
                        label="职称等级"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="createDate"
                        label="创建时间"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="enabled"
                        width="100"
                        label="是否启用">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.enabled">已启用</el-tag>
                        <el-tag type="danger" v-else>未启用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作">
                    <template slot-scope="scope">
                       <el-button size="small"
                                  @click="ShowEditJob(scope.$index, scope.row)">编辑</el-button>
                       <el-button size="small" type="danger"
                                  @click="deleteJob(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="danger" size="small" :disabled="this.multipleSelection.length==0" @click="batchDeleteJob">批量删除</el-button>
        </div>
        <el-dialog
                title="职称修改"
                :visible.sync="dialogVisible"
                width="30%">
            <div>
                <div>
                <el-tag>职称名称</el-tag>
                <el-input style="width: 200px;margin-left: 8px" size="small" v-model="updateJob.name"></el-input>
                </div>
                <div style="margin-top: 10px">
                <el-tag>职称等级</el-tag>
                <el-select v-model="updateJob.titleLevel" size="small" style="width: 200px;margin-left: 8px">
                    <el-option
                            v-for="item in titleLevels"
                            :key="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
                </div>
                <div>
                    <el-tag>是否启用</el-tag>
                    <el-switch
                            style="margin-left: 8px"
                            v-model="updateJob.enabled"
                            active-text="启用"
                            inactive-text="禁用">
                    </el-switch>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="UpdateJobLevel">确 定</el-button>
  </span>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "JobManager",
        data(){
            return{
                Job:{
                    name:'',
                    titleLevel:''
                },
                updateJob: {
                    name: '',
                    titleLevel: '',
                    enabled:''
                },
                dialogVisible:false,
                titleLevels:[
                    "初级",
                    "中级",
                    "员级",
                    "副高级",
                    "正高级",
                ],
                jobLevel:[],
                multipleSelection: []
            }
        },
        mounted() {
            this.showJobs();
        },
        methods:{
            batchDeleteJob(){
                this.$confirm('此操作将永久删除这【'+this.multipleSelection.length+'】条数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids = "?";
                    this.multipleSelection.forEach(item=>{
                        console.log(item)
                        ids += 'ids=' + item.id + '&';
                    })
                    this.deleteRequest("/system/basic/job/"+ids).then(resp=>{
                        console.log(resp)
                        if (resp) {
                            this.showJobs();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            deleteJob(index,data){
                this.$confirm('此操作将永久删除职称【'+data.name+'】, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/job/"+data.id).then(resp=>{
                        console.log(resp)
                        if (resp) {
                            this.showJobs();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            ShowEditJob(index,data){
                // this.updateJob = data;
                Object.assign(this.updateJob, data);
                this.dialogVisible = true;
            },
            UpdateJobLevel() {
                this.putRequest("/system/basic/job/",this.updateJob).then(resp=>{
                    console.log(this.updateJob)
                    if (resp) {
                        this.showJobs();
                        this.updateJob.name = '';
                        this.updateJob.titleLevel = '';
                        this.dialogVisible = false;
                    }
                })
            },
            addJobs(){
                if (this.Job.name && this.Job.titleLevel) {
                    this.postRequest("/system/basic/job/",this.Job).then(resp=>{
                        if (resp) {
                            this.showJobs();
                            this.Job.name = '';
                            this.Job.titleLevel = '';
                        }

                    })
                }else {
                    this.$message.error("请先输入职称名称和职称等级...")
                }
            },
            showJobs(){
                this.getRequest("/system/basic/job/").then(resp=>{
                    if (resp) {
                        this.jobLevel = resp;
                    }
                })
            }
        },
    }
</script>

<style scoped>
    .jobInput{
        width: 250px;
        margin-right: 5px;
    }
    .JobSelect{
        width: 150px;
        margin-right: 10px;
    }

</style>