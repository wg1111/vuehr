<template>
    <div>
        <el-tabs  v-model="activeName" type="card">
            <el-tab-pane label="部门管理" name="first"><DepManager></DepManager></el-tab-pane>
            <el-tab-pane label="职位管理" name="second"><PosManager></PosManager></el-tab-pane>
            <el-tab-pane label="职称管理" name="third"><JobManager></JobManager></el-tab-pane>
            <el-tab-pane label="奖惩规则" name="fourth"><BpManager></BpManager></el-tab-pane>
            <el-tab-pane label="权限组" name="fourt"><PermissManager></PermissManager></el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import DepManager from "../../components/sys/basic/DepManager";
    import PosManager from "../../components/sys/basic/PosManager";
    import JobManager from "../../components/sys/basic/JobManager";
    import BpManager from "../../components/sys/basic/BpManager";
    import PermissManager from "../../components/sys/basic/PermissManager";
    export default {
        name: "SysBasic",
        data(){
            return{
                activeName:"second"
            }
        },
        components:{
            DepManager,PosManager,JobManager,BpManager,PermissManager
        }
    }
</script>

<style scoped>

</style>