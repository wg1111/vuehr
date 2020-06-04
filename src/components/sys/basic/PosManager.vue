<template>
    <div>
        <div>
            <el-input
                    class="addPosition"
                size="small"
                placeholder="添加职位"
                prefix-icon="el-icon-plus"
                    @keydown.enter.native="addPosition"
                v-model="pos.name">
        </el-input>
            <el-button icon="el-icon-plus" size="mini" type="primary" @click="addPosition">添加</el-button>
        </div>
        <div class="PosTable">
            <el-table
                    :data="positions"
                    border
                    stripe
                    size="small"
                    @selection-change="handleSelectionChange"
                    style="width: 50%">
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
                        label="职位名称"
                        width="180">
                </el-table-column>
                <el-table-column
                    prop="createDate"
                    label="创建时间"
                    width="150">
            </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                @click="ShowEditPosition(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="danger" size="small" style="margin-top:8px" :disabled="multipleSelection.length==0" @click="batchDelete">批量删除</el-button>

        </div>
        <el-dialog
                title="职位修改"
                :visible.sync="dialogVisible"
                width="30%">
            <div>
                <el-tag>职位名称</el-tag>
                <el-input class="updatePosition" size="small" v-model="updatePos.name"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false" size="small">取 消</el-button>
    <el-button type="primary" size="small" @click="updatePosition" >确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "PosManager",
        data() {
            return {
                pos: {
                    name: ''
                },
                dialogVisible:false,
                updatePos:{
                    name:''
                },
                positions: [],
                multipleSelection: []
            };
        },
        mounted() {
            this.showPositions();
        },
        methods:{
            handleSelectionChange(val){
                this.multipleSelection = val
            },
            batchDelete(){
                this.$confirm('此操作将永久删除这【'+this.multipleSelection.length+'】条数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids = '?';
                    this.multipleSelection.forEach(item=>{
                        ids+='ids=' + item.id + '&'
                    })
                    this.deleteRequest("/system/basic/pos/"+ids).then(resp=>{
                        if (resp) {
                            this.showPositions();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            addPosition() {
                if (this.pos.name){
                    this.postRequest("/system/basic/pos/",this.pos).then(resp=>{
                        if (resp){
                            this.showPositions();
                            this.pos.name = '';
                        }
                    })
                }else {
                    this.$message.error('请输入职位名称...');
                }
            },

            ShowEditPosition(index, data) {
                // this.updatePos = data;
                Object.assign(this.updatePos,data)
                this.dialogVisible=true;
            },
            updatePosition(){
                this.putRequest("/system/basic/pos/",this.updatePos).then(resp=>{
                    if (resp) {
                        this.showPositions();
                        this.updatePos.name = '';
                        this.dialogVisible = false;
                    }
                })
            },
            handleDelete(index, data) {
                this.$confirm('此操作将永久删除职位['+data.name+'], 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/pos/"+data.id).then(resp=>{
                        if (resp) {
                            this.showPositions()
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },

            showPositions(){
                this.getRequest("/system/basic/pos/").then(resp =>{
                    if (resp) {
                        this.positions = resp
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .updatePosition {
        width: 200px;
        margin-left: 8px;

    }
    .addPosition{
        width: 250px;
        margin-right: 5px;
    }
    .PosTable{
        margin-top: 10px;
    }

</style>