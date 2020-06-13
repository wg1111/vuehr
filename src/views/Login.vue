<template>
    <div>
        <el-form
                :rules="rules"
                :model="loginForm"
                ref="loginForm"
                v-loading="loading"
                element-loading-text="登录中..."
                element-loading-spinner="el-icon-loading"
                class="loginContainer">
            <h3 class="loginTitle">系统登录</h3>
            <el-form-item prop="username">
                <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-checkbox v-model="checked" class="loginRemember">记住密码</el-checkbox>
            <el-button type="primary" style="width: 100%" @click="login">登录</el-button>
        </el-form>
    </div>
</template>

<script>

    export default {
        name: "Login",
        data(){
            return {
                loginForm:{
                    username:"admin",
                    password:"123"
                },
                checked:true,
                loading: false,//加载图案
                rules:{
                    username:[{required:true,message:"请输入用户名",trigger:"blur"}],
                    password:[{required:true,message:"请输入密码",trigger:"blur"}]
                }
            }
        },
        methods:{
            login(){
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        this.postKeyValue('/doLogin',this.loginForm).then(resp=>{
                            this.loading = false;
                            if (resp){
                                // alert(JSON.stringify(resp))
                                window.sessionStorage.setItem("user",JSON.stringify(resp.obj))
                                let path = this.$route.query.redirect;
                                this.$router.replace((path == "/" || path == undefined) ? "/home" : path);
                            }
                        })
                    } else {
                        this.$message.error('请输入所有字段');;
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .loginContainer{
        border-radius: 15px;
        background-clip: padding-box;
        margin: 180px auto;
        width:350px;
        padding: 15px 35px 15px 35px;
        background: #ffffff;
        border:1px solid rgba(234, 234, 234, 0.45);
        box-shadow: 0 0 25px #cac6c6;
    }
    .loginTitle{
        margin: 15px auto 40px auto;
        text-align: center;
        color: #505458;
    }
    .loginRemember{
        text-align: left;
        margin: 0px 0px 15px 0px;
    }
</style>