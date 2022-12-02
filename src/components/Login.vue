<template>
  <div class="login-con">

    <div class="login-box">

      <div class="box">
        <el-form ref="loginformref"  label-width="0px" class="form-login" :model="loginform" :rules="rules">
          <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginform.username" ></el-input>
          </el-form-item>
       
          <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" v-model="loginform.password" type="password" prop="password"></el-input>
          </el-form-item>

          <el-form-item class="btns">
          <el-button type="primary" @click="loginbtn">登录</el-button>
          <el-button type="info" @click="resetform">重置</el-button>
        </el-form-item>

        </el-form>

      </div>
    </div>
  </div>
</template> 

<script>
export default {
  data(){
    return{
      loginform:{
        username:'admin',
        password:'123456'
      },
      rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
          ],
        }
    }
  },
  methods:{
    resetform(){
      this.$refs.loginformref.resetFields()
    },
    loginbtn(){
      this.$refs.loginformref.validate(async valid =>{
       if(!valid) return
       const {data:res} = await this.$http.post('login',this.loginform)
       if(res.meta.status!==200)return this.$message.error('用户名或密码错误')
       window.sessionStorage.setItem('token',res.data.token)
       this.$router.push('/home')
       this.$message.success(`登录成功,欢迎${this.loginform.username}`)
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login-con{
    background-color: aquamarine;
    height: 100%;
  }
  .login-box{
    width: 450px;
    height: 300px;
    background-color: white;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
  }
  .btns{
    display: flex;
    justify-content: flex-end;
  }
  .form-login{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
</style>
